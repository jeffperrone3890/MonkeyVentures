/**
 * Content generators — five pure async functions that take RawBusinessData
 * and an AIProvider and return ScoredField<T> results.
 *
 * Each function is responsible for:
 *   1. Deciding which data is already available (high-confidence extraction)
 *   2. Calling the AI for fields that need generation
 *   3. Attaching the correct confidence score and source tag
 *
 * No side effects. No file I/O. No imports from React or Lucide.
 */

import type { AIProvider, BusinessContext } from '../ai';
import type {
  RawBusinessData,
  ScoredField,
  PipelineBusinessStory,
  PipelineSectionCopy,
  PipelineCTAStyle,
  PipelineProofPoint,
  PipelineFAQItem,
  PipelineServiceEntry,
  PipelineBenefit,
  PipelineStat,
  GeneratedContent,
} from '../types';

// ─── Business Story ───────────────────────────────────────────────────────────

/**
 * Generate the four businessStory fields that drive hero, footer, statement
 * section, and WhyChooseUs copy.
 *
 * Confidence breakdown:
 *   - founding: 0.70 if about page has a story, else 0.45 (AI-generated)
 *   - mission, differentiator, heroSubhead: 0.50 (AI-generated with good context)
 */
export async function generateBusinessStory(
  data: RawBusinessData,
  context: BusinessContext,
  ai: AIProvider,
): Promise<ScoredField<PipelineBusinessStory>> {
  const hasAboutPage = Boolean(data.about && data.about.length > 100);

  const [founding, mission, differentiator, heroSubhead] = await Promise.all([
    ai.generate(
      hasAboutPage
        ? `Rewrite this founding story in 2 sentences, first person plural, no clichés: "${data.about?.slice(0, 400)}"`
        : `Write a 2-sentence founding story for ${data.name}, a ${data.category ?? 'landscaping'} business founded in ${data.foundedYear ?? 'the past decade'} serving ${context.location}. Emphasize consistency and local roots.`,
      context,
      { maxLength: 180 },
    ),
    ai.generate(
      `Write a one-sentence mission statement for ${data.name}. Include: service type, location (${context.location}), and founding year if known. Under 20 words.`,
      context,
      { maxLength: 100 },
    ),
    ai.generate(
      `Write a single sentence that captures ${data.name}'s core differentiator. Choose the strongest competitive angle: same crew, no contracts, licensed/insured, years in business, or response speed. Under 20 words.`,
      context,
      { maxLength: 120 },
    ),
    ai.generate(
      `Write a 1–2 sentence hero subhead for ${data.name}. It should expand on the tagline with one concrete proof point (years in business, licensing, response time, or crew consistency). No adjectives like "exceptional" or "top-rated". Under 30 words.`,
      context,
      { maxLength: 200 },
    ),
  ]);

  const score = hasAboutPage ? 0.65 : 0.48;

  return {
    value: { founding, mission, differentiator, heroSubhead },
    score,
    source: 'ai-generated',
    flagged: score < 0.70,
  };
}

// ─── Section Copy ─────────────────────────────────────────────────────────────

/**
 * Generate the heading + intro + eyebrow for each of the four homepage
 * sections that were previously hardcoded.
 */
export async function generateSectionCopy(
  data: RawBusinessData,
  context: BusinessContext,
  ai: AIProvider,
): Promise<ScoredField<GeneratedContent['sectionCopy']['value']>> {
  const serviceList = (data.services ?? []).map((s) => s.name).join(', ') || 'property care';

  const [
    wycHeading, wycIntro,
    svcEyebrow, svcHeading, svcIntro,
    ctaEyebrow, ctaHeading, ctaIntro,
    contactEyebrow, contactHeading, contactIntro,
  ] = await Promise.all([
    ai.generate(`Write a 6–8 word heading for a "Why choose us" section for ${data.name}. Lead with what makes them reliable, not a generic claim. No questions.`, context, { maxLength: 60 }),
    ai.generate(`Write 2 sentences introducing why a homeowner should choose ${data.name} over any other landscaping company. Emphasize consistency and trust. Under 35 words.`, context, { maxLength: 220 }),
    ai.generate(`Write a 2–3 word all-caps eyebrow label for a services section. Examples: "What we do", "Our services", "What we offer". Match the brand tone.`, context, { maxLength: 25 }),
    ai.generate(`Write a 5–7 word heading for a services section for ${data.name}. Services include: ${serviceList}. Lead with scope or reliability.`, context, { maxLength: 60 }),
    ai.generate(`Write one sentence introducing the services section for ${data.name}. Emphasize that it's one consistent team handling everything. Under 25 words.`, context, { maxLength: 160 }),
    ai.generate(`Write a 3–5 word all-caps eyebrow label for a CTA / estimate section. Examples: "Free, no-pressure estimate", "No-contract service". Should reduce friction.`, context, { maxLength: 30 }),
    ai.generate(`Write a 6–9 word CTA heading for ${data.name}. It should invite the visitor to take the next step. Start with "Ready" or a strong verb. No questions.`, context, { maxLength: 70 }),
    ai.generate(`Write 2 sentences for the CTA section body of ${data.name}. Mention: free estimate, 24-hour response, no pressure. Under 35 words.`, context, { maxLength: 230 }),
    ai.generate(`Write a 2–4 word all-caps eyebrow label for the contact / estimate form section. Examples: "Free estimate", "Get your quote", "Request an estimate".`, context, { maxLength: 25 }),
    ai.generate(`Write a 5–8 word heading for the contact section of ${data.name}. Should feel like an open invitation. Start with "Let's" or similar.`, context, { maxLength: 60 }),
    ai.generate(`Write 2 sentences introducing the contact form for ${data.name}. Mention ease of process and 24-hour response. Under 30 words.`, context, { maxLength: 200 }),
  ]);

  const value = {
    whyChooseUs: { heading: wycHeading, intro: wycIntro } satisfies PipelineSectionCopy,
    services: { eyebrow: svcEyebrow, heading: svcHeading, intro: svcIntro } satisfies PipelineSectionCopy,
    cta: { eyebrow: ctaEyebrow, heading: ctaHeading, intro: ctaIntro } satisfies PipelineSectionCopy,
    contact: { eyebrow: contactEyebrow, heading: contactHeading, intro: contactIntro } satisfies PipelineSectionCopy,
  };

  return { value, score: 0.52, source: 'ai-generated', flagged: true };
}

// ─── Proof Points ─────────────────────────────────────────────────────────────

/**
 * Generate the ProofBar trust credentials.
 *
 * Strategy:
 * - Use `computed` sentinels for years-in-business and Google rating — these
 *   never go stale and don't need AI.
 * - Derive licensing/insurance from GBP attributes + website data.
 * - Generate 1–2 additional points from review themes.
 */
export async function generateProofPoints(
  data: RawBusinessData,
  context: BusinessContext,
  ai: AIProvider,
): Promise<ScoredField<PipelineProofPoint[]>> {
  const points: PipelineProofPoint[] = [];

  // ── Computed sentinels (confidence 0.97) ──
  if (data.foundedYear) {
    points.push({
      iconName: 'Clock',
      label: '',
      detail: '',
      computed: 'years-in-business',
    });
  }

  if (data.rating && data.reviewCount) {
    points.push({
      iconName: 'Star',
      label: '',
      detail: '',
      computed: 'google-rating',
    });
  }

  // ── Licensing / insurance (confidence 0.85) ──
  const licensed = data.attributes?.['licensed'] === true;
  const insured = data.attributes?.['insured'] === true;
  if (licensed && insured) {
    points.push({
      iconName: 'ShieldCheck',
      label: 'Licensed & Insured',
      detail: data.insuranceAmount ?? 'Fully insured',
    });
  }

  // ── AI-generated additional point from review themes ──
  const themes = context.reviewThemes ?? [];
  if (themes.length > 0) {
    const pointText = await ai.generate(
      `Generate one short proof point (label: 3–5 words, detail: 3–6 words) for ${data.name} based on these recurring customer themes: ${themes.join(', ')}. Format: "label | detail".`,
      context,
      { maxLength: 60 },
    );
    const [label, detail] = pointText.split('|').map((s) => s.trim());
    if (label && detail) {
      points.push({ iconName: 'BadgeCheck', label, detail });
    }
  }

  // ── Response time / CTA point ──
  points.push({
    iconName: 'CalendarCheck',
    label: 'Free Estimates',
    detail: 'Written quote in 24h',
  });

  // Cap at 5 points — ProofBar looks best with 3–5 items
  const capped = points.slice(0, 5);
  const hasComputed = capped.some((p) => p.computed);
  const score = hasComputed ? 0.85 : 0.65;

  return { value: capped, score, source: hasComputed ? 'computed' : 'ai-generated' };
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

/**
 * Generate FAQ items.
 *
 * Priority:
 *   1. Existing FAQ scraped from website (confidence 0.85)
 *   2. Questions mined from GBP review text (confidence 0.60)
 *   3. AI-generated from industry category (confidence 0.42)
 *
 * Target: 6–10 items covering pricing, contracts, licensing, timeline,
 * crew consistency, service area, and an emergency/seasonal topic.
 */
export async function generateFAQ(
  data: RawBusinessData,
  context: BusinessContext,
  ai: AIProvider,
): Promise<ScoredField<PipelineFAQItem[]>> {
  const existing = data.existingFaq ?? [];

  if (existing.length >= 6) {
    return { value: existing, score: 0.85, source: 'website' };
  }

  // Mine questions from GBP reviews
  const reviewQuestions = mineReviewQuestions(data.gbpReviews ?? []);

  // Generate additional questions to reach 8 items
  const needed = Math.max(0, 8 - existing.length - reviewQuestions.length);
  const aiItems: PipelineFAQItem[] = [];

  if (needed > 0) {
    const aiResponse = await ai.generate(
      `Generate ${needed} FAQ question-and-answer pairs for ${data.name}, a ${data.category ?? 'landscaping'} company in ${context.location}. Topics to cover that aren't already addressed: contracts, crew consistency, response time, service area. Format each as: Q: ... | A: ...`,
      context,
      { maxLength: 800 },
    );

    aiItems.push(...parseQAPairs(aiResponse));
  }

  const combined = [...existing, ...reviewQuestions, ...aiItems].slice(0, 10);

  const score =
    existing.length >= 4 ? 0.80
    : existing.length > 0 ? 0.68
    : 0.44;

  return {
    value: combined,
    score,
    source: existing.length > 0 ? 'website' : 'ai-generated',
    flagged: score < 0.70,
  };
}

// ─── Competitive Advantages ───────────────────────────────────────────────────

/**
 * Generate 4–6 competitive advantage bullet points.
 *
 * These appear in SEO city/service pages ("Why choose X"). Mined from
 * review themes when available; otherwise AI-generated from category.
 */
export async function generateCompetitiveAdvantages(
  data: RawBusinessData,
  context: BusinessContext,
  ai: AIProvider,
): Promise<ScoredField<string[]>> {
  const themes = context.reviewThemes ?? [];
  const hasThemes = themes.length >= 3;

  const raw = await ai.generate(
    hasThemes
      ? `Convert these review themes into 5 competitive advantage bullet points for ${data.name}. Write in first person plural, action-oriented, 8–12 words each. Themes: ${themes.join(', ')}.`
      : `Generate 5 competitive advantage bullet points for ${data.name}, a ${data.category ?? 'landscaping'} company founded in ${data.foundedYear ?? 'recent years'}. Emphasize: consistency, licensing, response time, local knowledge, crew.`,
    context,
    { maxLength: 400 },
  );

  const advantages = raw
    .split('\n')
    .map((line) => line.replace(/^[\d\-•*]+\.?\s*/, '').trim())
    .filter((line) => line.length > 10)
    .slice(0, 6);

  const score = hasThemes ? 0.65 : 0.48;
  return { value: advantages, score, source: 'ai-generated', flagged: score < 0.70 };
}

// ─── Services ─────────────────────────────────────────────────────────────────

/**
 * Build service entries for the website.
 *
 * Uses website-scraped services as the base. Fills in missing details with
 * AI-generated content. Returns a ScoredField for the whole array.
 */
export async function generateServices(
  data: RawBusinessData,
  context: BusinessContext,
  ai: AIProvider,
): Promise<ScoredField<PipelineServiceEntry[]>> {
  const scraped = data.services ?? [];

  if (scraped.length === 0) {
    const fallback = await generateServicesFromCategory(data.category ?? 'Landscaper', context, ai);
    return { value: fallback, score: 0.40, source: 'ai-generated', flagged: true };
  }

  const entries: PipelineServiceEntry[] = await Promise.all(
    scraped.map(async (s, i): Promise<PipelineServiceEntry> => {
      const slug = s.slug ?? slugify(s.name);
      const iconName = SERVICE_ICON_MAP[s.name.toLowerCase()] ?? 'Sprout';

      const details =
        s.description && s.description.length > 60
          ? s.description
          : await ai.generate(
              `Write a 2-sentence service description for "${s.name}" by ${data.name} in ${context.location}. Focus on outcomes and reliability. Under 40 words.`,
              context,
              { maxLength: 260 },
            );

      const includes =
        s.includes && s.includes.length >= 3
          ? s.includes
          : await generateIncludes(s.name, context, ai);

      return {
        slug,
        title: s.name,
        summary: details.split('.')[0] + '.' ,
        details,
        includes,
        iconName,
        ...(i % 2 === 0 && { displayTitle: s.name }),
      };
    }),
  );

  return { value: entries, score: 0.72, source: 'website' };
}

async function generateServicesFromCategory(
  category: string,
  context: BusinessContext,
  ai: AIProvider,
): Promise<PipelineServiceEntry[]> {
  const names = await ai.generate(
    `List 5 services offered by a typical ${category} company. One per line, title case, no descriptions.`,
    context,
    { maxLength: 150 },
  );

  return names
    .split('\n')
    .map((n) => n.replace(/^[\d\-•*]+\.?\s*/, '').trim())
    .filter((n) => n.length > 3)
    .slice(0, 6)
    .map((name) => ({
      slug: slugify(name),
      title: name,
      summary: `Professional ${name.toLowerCase()} in ${context.location}.`,
      details: `[REVIEW] AI-generated placeholder for ${name}. Replace with accurate service description.`,
      includes: ['[REVIEW] Replace with actual service inclusions'],
      iconName: SERVICE_ICON_MAP[name.toLowerCase()] ?? 'Sprout',
    }));
}

async function generateIncludes(
  serviceName: string,
  context: BusinessContext,
  ai: AIProvider,
): Promise<string[]> {
  const raw = await ai.generate(
    `List 4 specific inclusions for "${serviceName}" as a bullet list. Each item 3–7 words. No intro text.`,
    context,
    { maxLength: 200 },
  );
  return raw
    .split('\n')
    .map((line) => line.replace(/^[\-•*]+\s*/, '').trim())
    .filter((line) => line.length > 5)
    .slice(0, 5);
}

// ─── Benefits ────────────────────────────────────────────────────────────────

/**
 * Generate 3–4 benefit entries for the WhyChooseUs numbered list.
 * Derives from competitive advantages when available.
 */
export async function generateBenefits(
  competitiveAdvantages: string[],
  context: BusinessContext,
  ai: AIProvider,
): Promise<ScoredField<PipelineBenefit[]>> {
  const source = competitiveAdvantages.length >= 3 ? competitiveAdvantages.slice(0, 4) : null;

  const raw = await ai.generate(
    source
      ? `Convert these competitive advantages into 4 benefit entries (title: 3–5 words, description: 15–20 words each) for the "why choose us" section. Format: TITLE | DESCRIPTION\n${source.join('\n')}`
      : `Generate 4 benefits for ${context.name}'s "why choose us" section. Format: TITLE | DESCRIPTION`,
    context,
    { maxLength: 400 },
  );

  const iconNames = ['Users', 'ShieldCheck', 'Clock', 'BadgeCheck'];
  const benefits: PipelineBenefit[] = raw
    .split('\n')
    .map((line) => line.replace(/^[\d\-•*]+\.?\s*/, '').trim())
    .filter((line) => line.includes('|'))
    .slice(0, 4)
    .map((line, i) => {
      const [title, description] = line.split('|').map((s) => s.trim());
      return {
        iconName: iconNames[i] ?? 'Star',
        title: title ?? `Benefit ${i + 1}`,
        description: description ?? '[REVIEW]',
      };
    });

  return { value: benefits, score: 0.50, source: 'ai-generated', flagged: true };
}

// ─── Stats ────────────────────────────────────────────────────────────────────

/**
 * Derive the four stats strip values from hard data where possible.
 * Falls back to reasonable defaults where data is missing.
 */
export function generateStats(data: RawBusinessData): ScoredField<PipelineStat[]> {
  const currentYear = new Date().getFullYear();
  const years = data.foundedYear ? currentYear - data.foundedYear : null;

  const stats: PipelineStat[] = [
    {
      value: years ? `${years}+` : '10+',
      label: 'Years in business',
    },
    {
      value: data.rating ? `${data.rating}★` : '4.8★',
      label: 'Google rating',
    },
    {
      value: data.reviewCount ? `${data.reviewCount}+` : '100+',
      label: 'Verified reviews',
    },
    {
      value: '24h',
      label: 'Estimate turnaround',
    },
  ];

  const hasRealData = Boolean(years && data.rating && data.reviewCount);
  return {
    value: stats,
    score: hasRealData ? 0.90 : 0.60,
    source: hasRealData ? 'gbp-api' : 'ai-generated',
    flagged: !hasRealData,
  };
}

// ─── CTA Style ───────────────────────────────────────────────────────────────

export async function generateCTAStyle(
  data: RawBusinessData,
  context: BusinessContext,
  ai: AIProvider,
): Promise<ScoredField<PipelineCTAStyle>> {
  const [primary, secondary, form, micro] = await Promise.all([
    ai.generate('Write a 4–6 word primary CTA button label. Start with an action verb. Include "Free" if possible. No exclamation marks.', context, { maxLength: 40 }),
    ai.generate('Write a 2–3 word secondary CTA for a phone call. Example: "Call Us", "Speak to us".', context, { maxLength: 20 }),
    ai.generate('Write a 4–6 word contact form submit button label. Should feel personal, not generic.', context, { maxLength: 40 }),
    ai.generate(`Write a 6–10 word micro-trust line beneath the hero CTA buttons for ${data.name}. Include: free estimate, licensed, and one more proof point. Separator: ·`, context, { maxLength: 80 }),
  ]);

  return {
    value: { primary, secondary, form, micro },
    score: 0.50,
    source: 'ai-generated',
    flagged: true,
    alternatives: [
      { primary: 'Request a Free Estimate', secondary: 'Call Us', form: 'Send my request', micro: `Free estimate · Licensed & insured · 24h response` },
    ],
  };
}

// ─── Urgency ──────────────────────────────────────────────────────────────────

export async function generateUrgency(
  data: RawBusinessData,
  context: BusinessContext,
  ai: AIProvider,
): Promise<ScoredField<string | null>> {
  const hasSnow = (data.services ?? []).some((s) => /snow/i.test(s.name));
  const hasEmergency = data.hasEmergencyService ?? false;

  if (!hasSnow && !hasEmergency) {
    return { value: null, score: 0.80, source: 'computed' };
  }

  const message = await ai.generate(
    `Write a one-line urgency message for ${data.name} that mentions ${hasSnow ? 'snow removal' : 'emergency service'}. Under 12 words.`,
    context,
    { maxLength: 80 },
  );

  return { value: message, score: 0.60, source: 'ai-generated', flagged: true };
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function mineReviewQuestions(reviews: Array<{ text: string }>): PipelineFAQItem[] {
  const questionPatterns = [
    { pattern: /contract/i, q: 'Do you require a contract?', a: 'No — our services are month-to-month. You can pause or cancel anytime.' },
    { pattern: /insur/i, q: 'Are you licensed and insured?', a: 'Yes — we carry full liability insurance and are a licensed contractor.' },
    { pattern: /estimate|quote/i, q: 'How do I get an estimate?', a: 'Fill out the form or call us directly. We send a written estimate within 24 hours.' },
    { pattern: /same crew|who comes/i, q: 'Will I have the same crew every visit?', a: 'Yes — we assign a dedicated crew to your property so they know your preferences.' },
  ];

  const allText = reviews.map((r) => r.text).join(' ');
  return questionPatterns
    .filter(({ pattern }) => pattern.test(allText))
    .map(({ q, a }) => ({ question: q, answer: a }));
}

function parseQAPairs(text: string): PipelineFAQItem[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('Q:') || line.includes('|'))
    .map((line) => {
      if (line.includes('|')) {
        const [q, a] = line.split('|').map((s) => s.replace(/^[QA]:\s*/, '').trim());
        return { question: q ?? '', answer: a ?? '' };
      }
      return null;
    })
    .filter((item): item is PipelineFAQItem => item !== null && item.question.length > 5);
}

/** Best-guess icon for common landscaping service names. */
const SERVICE_ICON_MAP: Record<string, string> = {
  'lawn care': 'Sprout',
  'lawn care & maintenance': 'Sprout',
  'tree & shrub care': 'TreeDeciduous',
  'tree care': 'TreeDeciduous',
  'hardscaping': 'Hammer',
  'seasonal cleanup': 'Leaf',
  'fertilization': 'Droplets',
  'fertilization & weed control': 'Droplets',
  'snow removal': 'Snowflake',
  'irrigation': 'Droplets',
  'mulching': 'Leaf',
  'shrub trimming': 'Scissors',
  'landscaping design': 'ClipboardList',
};
