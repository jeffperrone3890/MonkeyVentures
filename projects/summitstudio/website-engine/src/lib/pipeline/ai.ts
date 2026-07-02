/**
 * AIProvider — the single interface the pipeline uses for all generation.
 *
 * The concrete implementation is injected at runtime, so the pipeline itself
 * never imports a specific AI SDK. To use Claude:
 *
 *   import Anthropic from '@anthropic-ai/sdk';
 *   class ClaudeProvider implements AIProvider { ... }
 *
 * During development, inject MockAIProvider. The mock returns deterministic,
 * realistic responses so the pipeline compiles and the output structure can
 * be validated before any API keys are needed.
 */

import type { RawBusinessData } from './types';

// ─── Context object ───────────────────────────────────────────────────────────

/**
 * Injected into every AI call so generators never have to pass business name,
 * location, and tone signals as individual arguments.
 */
export interface BusinessContext {
  name: string;
  /** "New Castle County, DE" */
  location: string;
  services: string[];
  foundedYear?: number;
  rating?: number;
  reviewCount?: number;
  /** Top themes extracted from GBP reviews — inform tone and FAQ. */
  reviewThemes?: string[];
  /** Brand voice signal: 'conversational' | 'professional' | 'friendly' | 'direct' */
  tone?: string;
  /** Existing about/history text — improves founding story accuracy. */
  existingCopy?: string;
  /** The client's current tagline, if any (used as "avoid this if generic"). */
  existingTagline?: string;
}

// ─── Options ─────────────────────────────────────────────────────────────────

export interface GenerateOptions {
  /** Soft character cap on the response. */
  maxLength?: number;
  /** Creativity level: 'low' for factual copy, 'high' for taglines. */
  temperature?: 'low' | 'medium' | 'high';
}

// ─── Provider interface ───────────────────────────────────────────────────────

export interface AIProvider {
  /**
   * Generate text for a single content field.
   * The prompt describes what to write; context supplies the business data.
   */
  generate(
    prompt: string,
    context: BusinessContext,
    options?: GenerateOptions,
  ): Promise<string>;

  /**
   * Generate N alternatives for human selection.
   * Used for taglines, headings, and CTAs where multiple options add value.
   */
  generateAlternatives(
    prompt: string,
    context: BusinessContext,
    count: number,
  ): Promise<string[]>;

  /**
   * Classify text into one of the provided labels.
   * Returns the best-matching label string.
   * Used for tone detection, visual register classification, pricing style.
   */
  classify(text: string, labels: readonly string[]): Promise<string>;

  /**
   * Extract structured data from unstructured text.
   * The schema string describes the expected output shape (natural language or JSON Schema).
   */
  extract<T>(text: string, schema: string, context?: BusinessContext): Promise<T>;
}

// ─── Context builder ─────────────────────────────────────────────────────────

/**
 * Builds a BusinessContext from normalized pipeline data.
 * Call this once and pass the result into all generation calls.
 */
export function buildContext(data: RawBusinessData): BusinessContext {
  const county = data.county ?? data.address?.city ?? 'the area';
  const region = data.address?.region ?? '';
  const location = region ? `${county}, ${region}` : county;

  const reviewThemes = extractThemes(data.gbpReviews ?? []);

  return {
    name: data.name,
    location,
    services: (data.services ?? []).map((s) => s.name),
    foundedYear: data.foundedYear,
    rating: data.rating,
    reviewCount: data.reviewCount,
    reviewThemes,
    existingCopy: data.about,
    existingTagline: data.existingTagline,
    tone: 'conversational', // refined later by classify()
  };
}

/** Pull recurring single words / short phrases from review text. */
function extractThemes(reviews: Array<{ text: string; rating: number; date: string }>): string[] {
  if (reviews.length === 0) return [];
  const allText = reviews.map((r) => r.text.toLowerCase()).join(' ');
  const candidates = [
    'same crew', 'reliable', 'professional', 'on time', 'consistent',
    'clean', 'responsive', 'friendly', 'quality', 'recommend',
    'licensed', 'insured', 'fair price', 'no contracts', 'quick',
  ];
  return candidates.filter((phrase) => allText.includes(phrase));
}

// ─── Mock implementation ──────────────────────────────────────────────────────

/**
 * Deterministic mock that returns realistic placeholder responses.
 *
 * Every method inspects the prompt for keywords and returns content that
 * reflects the real business context. This lets the entire pipeline run,
 * produce valid TypeScript output, and be reviewed without any API calls.
 */
export class MockAIProvider implements AIProvider {
  async generate(
    prompt: string,
    context: BusinessContext,
    _options?: GenerateOptions,
  ): Promise<string> {
    const p = prompt.toLowerCase();
    const { name, location, foundedYear } = context;
    const since = foundedYear ? `since ${foundedYear}` : 'for years';

    if (p.includes('tagline')) {
      return `${name} — The property care you'll actually stick with.`;
    }
    if (p.includes('hero') || p.includes('subhead')) {
      return `Serving ${location} ${since} — licensed, insured, and the same trusted crew every visit. Free written estimates within 24 hours.`;
    }
    if (p.includes('mission')) {
      return `Full-service property care for ${location} homeowners and businesses. Family-owned ${since}.`;
    }
    if (p.includes('founding') || p.includes('story')) {
      return `${name} was founded ${since} with a simple belief: great property care starts with a crew you actually recognize. We've grown slowly and deliberately — never taking on more clients than we can serve well.`;
    }
    if (p.includes('differentiator')) {
      return `The same licensed, insured crew — every visit, every job. No rotating subcontractors, no surprises.`;
    }
    if (p.includes('whychooseus') || p.includes('why choose')) {
      return `The crew you'll actually want to keep.`;
    }
    if (p.includes('services heading')) {
      return `One team for the whole property.`;
    }
    if (p.includes('services intro')) {
      return `From the weekly mow to a full redesign, it's the same trusted crew for everything your property needs.`;
    }
    if (p.includes('cta heading')) {
      return `Ready for a property you're proud of?`;
    }
    if (p.includes('cta intro')) {
      return `Tell us what you need and we'll send a clear, written estimate within 24 hours. No deposits, no pressure.`;
    }
    if (p.includes('contact heading')) {
      return `Let's talk about your property.`;
    }
    if (p.includes('contact intro')) {
      return `Fill out the form or call us directly. A clear, written estimate is back with you within 24 hours.`;
    }
    if (p.includes('primary button') || p.includes('cta primary')) {
      return `Request a Free Estimate`;
    }
    if (p.includes('micro')) {
      return `Free estimate · Licensed & insured · Same crew every visit`;
    }
    if (p.includes('urgency')) {
      return `Storm cleanup & emergency response available — call now.`;
    }
    if (p.includes('service') && p.includes('description')) {
      return `Professional ${context.services[0] ?? 'property'} care for ${location} homeowners — consistent results from a licensed, insured team.`;
    }

    return `[MOCK] ${name}: ${prompt.slice(0, 80)}`;
  }

  async generateAlternatives(
    prompt: string,
    context: BusinessContext,
    count: number,
  ): Promise<string[]> {
    const { name } = context;
    const base = await this.generate(prompt, context);
    return [
      base,
      `${name} — Consistent care. Consistent crew.`,
      `Professional property services, delivered with integrity.`,
      `The crew your neighbors already trust.`,
      `${name}: licensed, insured, and always on time.`,
    ].slice(0, count);
  }

  async classify(text: string, labels: readonly string[]): Promise<string> {
    // Return first label — real implementation scores each label's fit.
    return labels[0] ?? '';
  }

  async extract<T>(_text: string, _schema: string, _context?: BusinessContext): Promise<T> {
    return {} as T;
  }
}
