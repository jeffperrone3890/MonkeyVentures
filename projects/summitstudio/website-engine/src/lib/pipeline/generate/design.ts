/**
 * Design generators — produce color palette, typography pairing, and photo
 * shot list from the extracted business data and logo signals.
 *
 * These are the least automatable parts of the pipeline: color and typography
 * judgment involves aesthetic trade-offs that benefit most from human review.
 * All design outputs are flagged (score < 0.70) by default.
 */

import type { AIProvider, BusinessContext } from '../ai';
import type {
  RawBusinessData,
  DesignBrief,
  PhotoBrief,
  PhotoShot,
  ScoredField,
  ColorPalette,
  FontPairing,
  ButtonRadius,
} from '../types';

// ─── Design Brief ─────────────────────────────────────────────────────────────

/**
 * Generate a complete design brief including color palette and font pairing.
 *
 * In production: pass logo image bytes to a vision model for color extraction,
 * then use the AI to suggest palette and typography based on visual register.
 *
 * Current implementation: classifies the brand from category + name signals
 * and maps to a curated pairing from TYPOGRAPHY_PAIRINGS.
 */
export async function generateDesignBrief(
  data: RawBusinessData,
  context: BusinessContext,
  ai: AIProvider,
): Promise<DesignBrief> {
  // ── Visual register classification ──
  const classifyText = [data.category ?? '', data.name, data.about ?? ''].join(' ');
  const register = (await ai.classify(classifyText, [
    'traditional',
    'friendly',
    'professional',
    'rugged',
    'modern',
  ])) as DesignBrief['visualRegister'];

  // ── Color palette ──
  // Production: extract from logo image, adjust for WCAG contrast
  const colorPalette = await generateColorPalette(register, data, context, ai);

  // ── Typography ──
  const typography = generateTypographyPairing(register);

  // ── Button radius ──
  const buttonRadius = deriveButtonRadius(register);

  // ── Rationale ──
  const rationale = buildRationale(register, data);

  return {
    colorPalette,
    typography,
    buttonRadius,
    logoColors: [], // populated by logo analyzer when logoPath is provided
    visualRegister: register,
    rationale,
  };
}

async function generateColorPalette(
  register: DesignBrief['visualRegister'],
  data: RawBusinessData,
  _context: BusinessContext,
  _ai: AIProvider,
): Promise<ScoredField<ColorPalette>> {
  // In production: extract from logo, verify contrast, suggest adjustments.
  // For now: return the palette from the register map.
  const palette = PALETTE_BY_REGISTER[register] ?? PALETTE_BY_REGISTER['traditional'];

  // Override with any GBP photo color signals (future: extract from photos)
  void data;

  return {
    value: palette,
    score: 0.55,
    source: 'ai-generated',
    flagged: true,
    alternatives: [PALETTE_BY_REGISTER['professional']],
  };
}

function generateTypographyPairing(
  register: DesignBrief['visualRegister'],
): ScoredField<FontPairing> {
  const pairing = TYPOGRAPHY_PAIRINGS[register] ?? TYPOGRAPHY_PAIRINGS['traditional'];
  return { value: pairing, score: 0.60, source: 'ai-generated', flagged: true };
}

function deriveButtonRadius(register: DesignBrief['visualRegister']): ButtonRadius {
  const map: Record<DesignBrief['visualRegister'], ButtonRadius> = {
    friendly: 'rounded-full',
    professional: 'rounded-full',
    traditional: 'rounded-full',
    modern: 'rounded-2xl',
    rugged: 'rounded-xl',
  };
  return map[register];
}

function buildRationale(register: DesignBrief['visualRegister'], data: RawBusinessData): string {
  const lines = [
    `**Visual register:** ${register} — classified from business category (${data.category ?? 'landscaping'}) and name signals.`,
    `**Color palette:** Deep green primary reflects the landscaping category. Amber accent creates urgency without aggression. Confidence: 0.55 — review against the client's actual logo before implementing.`,
    `**Typography:** ${TYPOGRAPHY_PAIRINGS[register]?.display.family ?? 'Fraunces'} (display) + ${TYPOGRAPHY_PAIRINGS[register]?.body.family ?? 'Hanken Grotesk'} (body). Selected for warmth and professional legibility.`,
    `**Action required:** Provide logo file to unlock automated color extraction. Current palette is a category-based suggestion only.`,
  ];
  return lines.join('\n\n');
}

// ─── Photo Brief ─────────────────────────────────────────────────────────────

/**
 * Build a photo shot list from GBP available photos and standard requirements.
 *
 * Each shot maps to a specific file the engine expects (hero.jpg, about.jpg, etc.)
 * or to a service/gallery image path.
 */
export function generatePhotoBrief(data: RawBusinessData): PhotoBrief {
  const gbpPhotos = data.gbpPhotos ?? [];
  const workPhotos = gbpPhotos.filter((p) => p.category === 'work');
  const teamPhotos = gbpPhotos.filter((p) => p.category === 'team');

  const shots: PhotoShot[] = [
    {
      filename: 'hero.jpg',
      usage: 'Hero section — full bleed on desktop, stacked above text on mobile',
      framing: 'Wide landscape shot of a beautifully maintained residential or commercial property. Late-afternoon light (golden hour). No people needed — let the work speak.',
      dimensions: '1600×1200px minimum. Landscape orientation.',
      priority: 'required',
      existingCandidate: workPhotos[0]?.url,
    },
    {
      filename: 'about.jpg',
      usage: 'WhyChooseUs section — portrait column on desktop',
      framing: 'Crew of 2–3 people working or standing in front of a freshly maintained property. Truck with logo visible if possible. Natural poses, not stiff headshots.',
      dimensions: '800×1000px minimum. Portrait orientation (4:5 ratio).',
      priority: 'required',
      existingCandidate: teamPhotos[0]?.url,
    },
    {
      filename: 'cta.jpg',
      usage: 'CTA section — shown at 20% opacity behind dark overlay',
      framing: 'Aerial or wide establishing shot of a finished commercial or high-end residential property. High contrast is fine — the image shows through at very low opacity as texture only.',
      dimensions: '1600×900px minimum. Landscape orientation.',
      priority: 'required',
      existingCandidate: workPhotos[1]?.url,
    },
    {
      filename: 'og.jpg',
      usage: 'Open Graph — appears when links are shared on social media',
      framing: 'Clean before/after or hero property shot with business name overlaid. 1200×630px exactly.',
      dimensions: '1200×630px exactly.',
      priority: 'required',
    },
    ...(data.services ?? []).slice(0, 3).map(
      (s, i): PhotoShot => ({
        filename: `gallery/before-${s.slug ?? i}.jpg`,
        usage: `Before/after gallery — "${s.name}" project`,
        framing: `Before state: same angle and time of day as the after shot. Should clearly show the problem being solved.`,
        dimensions: '1200×900px minimum. Landscape (4:3 ratio).',
        priority: i === 0 ? 'required' : 'recommended',
        existingCandidate: workPhotos[i + 2]?.url,
      }),
    ),
    ...(data.services ?? []).slice(0, 3).map(
      (s, i): PhotoShot => ({
        filename: `gallery/after-${s.slug ?? i}.jpg`,
        usage: `Before/after gallery — "${s.name}" project (after)`,
        framing: `Finished result: same framing as the before shot. Shoot in the same light conditions. The transformation should be immediately obvious.`,
        dimensions: '1200×900px minimum. Landscape (4:3 ratio).',
        priority: i === 0 ? 'required' : 'recommended',
      }),
    ),
  ];

  const existingPhotos = gbpPhotos.map((p) => ({
    url: p.url,
    category: p.category,
    suitableFor: guessPhotoUse(p.category),
  }));

  return {
    shots,
    existingPhotos,
    totalRequired: shots.filter((s) => s.priority === 'required').length,
    totalFromGBP: gbpPhotos.length,
  };
}

function guessPhotoUse(category: string): string {
  const map: Record<string, string> = {
    work: 'hero.jpg, cta.jpg, or gallery',
    team: 'about.jpg',
    exterior: 'hero.jpg or gallery',
    interior: 'gallery (if relevant)',
    other: 'review manually',
  };
  return map[category] ?? 'review manually';
}

// ─── Data tables ──────────────────────────────────────────────────────────────

const PALETTE_BY_REGISTER: Record<DesignBrief['visualRegister'], ColorPalette> = {
  traditional: {
    primary: '#1F4733',    // Deep forest green
    secondary: '#12241B',  // Near-black forest
    accent: '#C98A3C',     // Copper amber
    highlight: '#3C7A57',  // Medium sage
    background: '#FBFBF8', // Warm off-white
    foreground: '#16241C', // Near-black body text
    muted: '#5C6B60',      // Muted sage grey
  },
  professional: {
    primary: '#1B3A6B',    // Deep navy
    secondary: '#0F1F3A',  // Near-black navy
    accent: '#D4A843',     // Gold
    highlight: '#2E6B9E',  // Medium blue
    background: '#F8F9FC', // Cool near-white
    foreground: '#111827', // Near-black
    muted: '#6B7280',      // Cool grey
  },
  friendly: {
    primary: '#2D6A4F',    // Bright green
    secondary: '#1B4332',  // Dark green
    accent: '#F4A261',     // Warm orange
    highlight: '#52B788',  // Light sage
    background: '#FAFFF8', // Very light green tint
    foreground: '#1B4332',
    muted: '#6B8F71',
  },
  rugged: {
    primary: '#6B4226',    // Bark brown
    secondary: '#2C1810',  // Near-black brown
    accent: '#E07B39',     // Burnt orange
    highlight: '#4A6741',  // Olive green
    background: '#FDFAF7', // Warm white
    foreground: '#1C1009',
    muted: '#7A6357',
  },
  modern: {
    primary: '#1A1A2E',    // Near-black navy
    secondary: '#16213E',  // Dark navy
    accent: '#0F3460',     // Deep blue
    highlight: '#533483',  // Purple
    background: '#FFFFFF',
    foreground: '#0D0D0D',
    muted: '#6B6B6B',
  },
};

const TYPOGRAPHY_PAIRINGS: Record<DesignBrief['visualRegister'], FontPairing> = {
  traditional: {
    display: { family: 'Fraunces', cssVariable: '--font-display', fallback: ['Georgia', 'serif'] },
    body: { family: 'Hanken Grotesk', cssVariable: '--font-sans', fallback: ['system-ui', 'sans-serif'] },
  },
  professional: {
    display: { family: 'Cormorant Garamond', cssVariable: '--font-display', fallback: ['Georgia', 'serif'] },
    body: { family: 'Inter', cssVariable: '--font-sans', fallback: ['system-ui', 'sans-serif'] },
  },
  friendly: {
    display: { family: 'Nunito', cssVariable: '--font-display', fallback: ['system-ui', 'sans-serif'] },
    body: { family: 'Open Sans', cssVariable: '--font-sans', fallback: ['system-ui', 'sans-serif'] },
  },
  rugged: {
    display: { family: 'Bitter', cssVariable: '--font-display', fallback: ['Georgia', 'serif'] },
    body: { family: 'Lato', cssVariable: '--font-sans', fallback: ['system-ui', 'sans-serif'] },
  },
  modern: {
    display: { family: 'Geist', cssVariable: '--font-display', fallback: ['system-ui', 'sans-serif'] },
    body: { family: 'Geist', cssVariable: '--font-sans', fallback: ['system-ui', 'sans-serif'] },
  },
};
