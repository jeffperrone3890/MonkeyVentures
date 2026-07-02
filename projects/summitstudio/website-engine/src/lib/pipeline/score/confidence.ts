/**
 * Confidence scoring — flattens a GeneratedContent object into a dot-notation
 * map of field paths → ConfidenceEntry, then derives a review queue.
 *
 * Confidence bands:
 *   0.90+   → auto-approved: GBP factual data (name, phone, rating)
 *   0.75–0.89 → approved with note: scraped content or computed values
 *   0.60–0.74 → quick-confirm: website-extracted copy
 *   0.40–0.59 → should-verify: AI-generated content
 *   0.00–0.39 → must-rewrite: low-signal AI guesses
 */

import type {
  GeneratedContent,
  ConfidenceReport,
  ConfidenceEntry,
  ReviewQueueItem,
  ReviewSeverity,
  ScoredField,
} from '../types';

// ─── Score confidence ─────────────────────────────────────────────────────────

/**
 * Flatten all ScoredField values in GeneratedContent into a ConfidenceReport.
 *
 * Leaf ScoredField<T> values are extracted with their score/source/flagged
 * metadata. Nested objects within a single ScoredField are not further
 * decomposed — the parent field path carries the score for all its children.
 *
 * e.g. 'sectionCopy' → score 0.55, source 'ai-generated', flagged true
 *      'businessStory' → score 0.48, source 'ai-generated', flagged true
 *      'stats' → score 0.92, source 'computed', flagged false
 */
export function scoreConfidence(generated: GeneratedContent): ConfidenceReport {
  const report: ConfidenceReport = {};

  const FIELDS: Array<[keyof GeneratedContent, string]> = [
    ['tagline', 'tagline'],
    ['businessStory', 'businessStory'],
    ['sectionCopy', 'sectionCopy'],
    ['ctaStyle', 'ctaStyle'],
    ['proofPoints', 'proofPoints'],
    ['faq', 'faq'],
    ['competitiveAdvantages', 'competitiveAdvantages'],
    ['urgency', 'urgency'],
    ['services', 'services'],
    ['benefits', 'benefits'],
    ['stats', 'stats'],
  ];

  for (const [key, path] of FIELDS) {
    const field = generated[key] as ScoredField<unknown>;
    report[path] = toEntry(field);
  }

  // Expand sectionCopy sub-fields for granular review targeting
  if (generated.sectionCopy) {
    const sc = generated.sectionCopy;
    const sections = ['whyChooseUs', 'services', 'cta', 'contact'] as const;
    for (const section of sections) {
      const sub = (sc.value as Record<string, unknown>)[section];
      if (sub && typeof sub === 'object') {
        const subObj = sub as Record<string, string>;
        for (const key of Object.keys(subObj)) {
          report[`sectionCopy.${section}.${key}`] = {
            value: subObj[key],
            score: sc.score,
            source: sc.source,
            flagged: sc.score < 0.70,
          };
        }
      }
    }
  }

  // Expand businessStory sub-fields
  if (generated.businessStory) {
    const bs = generated.businessStory;
    const storyFields = ['heroSubhead', 'mission', 'differentiator', 'founding'] as const;
    for (const storyField of storyFields) {
      report[`businessStory.${storyField}`] = {
        value: (bs.value as unknown as Record<string, string>)[storyField],
        score: bs.score,
        source: bs.source,
        flagged: bs.score < 0.70,
      };
    }
  }

  return report;
}

function toEntry(field: ScoredField<unknown>): ConfidenceEntry {
  return {
    value: field.value,
    score: field.score,
    source: field.source,
    flagged: field.score < 0.70,
    alternatives: field.alternatives,
  };
}

// ─── Review queue ─────────────────────────────────────────────────────────────

/**
 * Build a prioritized review queue from a ConfidenceReport.
 *
 * Items are sorted by severity (must-rewrite first), then by score ascending
 * within each severity band.
 *
 * Sub-field entries from sectionCopy and businessStory are deduplicated —
 * only the first sub-field per parent is included (the human reviewer sees
 * the whole object, not one entry per field).
 */
export function createReviewQueue(report: ConfidenceReport): ReviewQueueItem[] {
  const seen = new Set<string>();
  const queue: ReviewQueueItem[] = [];

  // Collect only flagged items (score < 0.70)
  for (const [path, entry] of Object.entries(report)) {
    if (!entry.flagged) continue;

    // Deduplicate sub-fields: if 'sectionCopy.cta.heading' is in the report,
    // skip it if 'sectionCopy' was already added.
    const parentPath = path.includes('.') ? path.split('.')[0] : null;
    if (parentPath && seen.has(parentPath)) continue;

    // Don't double-add the parent if sub-fields are also present
    if (!path.includes('.')) seen.add(path);

    const severity = deriveSeverity(entry.score);
    const hint = buildHint(path, entry.score, entry.source);

    queue.push({
      field: path,
      currentValue: entry.value,
      score: entry.score,
      source: entry.source,
      severity,
      alternatives: entry.alternatives,
      hint,
    });
  }

  // Sort: must-rewrite → should-verify → quick-confirm, then score ascending
  const SEVERITY_ORDER: Record<ReviewSeverity, number> = {
    'must-rewrite': 0,
    'should-verify': 1,
    'quick-confirm': 2,
  };

  return queue.sort((a, b) => {
    const so = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    return so !== 0 ? so : a.score - b.score;
  });
}

function deriveSeverity(score: number): ReviewSeverity {
  if (score < 0.40) return 'must-rewrite';
  if (score < 0.60) return 'should-verify';
  return 'quick-confirm';
}

function buildHint(path: string, score: number, source: string): string {
  const hints: Record<string, string> = {
    tagline: 'Read it aloud. Does it sound like something the owner would actually say?',
    'businessStory.heroSubhead': 'This appears below the business name in the hero. Should feel conversational, not salesy.',
    'businessStory.founding': 'Pull from the About page or ask the owner: When did you start? What made you do it?',
    'businessStory.mission': "Ask the owner: What do you care about that most competitors don't?",
    'businessStory.differentiator': 'What is the one thing past clients mention most in reviews?',
    'sectionCopy': 'Read in context with the full section. Heading + intro should flow into the content below.',
    'sectionCopy.whyChooseUs': 'This is the trust section. Copy should feel earned, not generic.',
    'sectionCopy.cta': 'CTA heading drives the conversion. Test variations against each other.',
    proofPoints: 'Verify each fact is accurate. No fabricated statistics.',
    faq: 'Ask the owner: What do customers ask before signing up?',
    competitiveAdvantages: 'Derived from review themes — verify these actually reflect what customers value.',
    services: 'Confirm service list matches what the business actively offers today.',
    benefits: 'Should feel specific to this business, not generic landscaping copy.',
    urgency: 'Only include if it accurately describes a real service (snow removal, storm cleanup).',
  };

  // Check for prefix matches
  for (const [key, hint] of Object.entries(hints)) {
    if (path === key || path.startsWith(`${key}.`)) return hint;
  }

  return `Score ${(score * 100).toFixed(0)}% from ${source}. Review before publishing.`;
}
