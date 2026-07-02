/**
 * Pipeline type definitions.
 *
 * Intentionally independent of @/types — the pipeline runs in Node.js and
 * must not import React or Lucide. The generated business.ts output file
 * references Lucide icons by string name; the template function interpolates
 * them into the final TypeScript source.
 */

// ─── Source reliability ───────────────────────────────────────────────────────

export type DataSource =
  | 'gbp-api'      // Google Places API field      → 0.95
  | 'gbp-scrape'   // GBP scraped field            → 0.85
  | 'website'      // Business website extraction  → 0.70
  | 'facebook'     // Facebook page extraction     → 0.60
  | 'ai-generated' // Claude-generated content     → 0.40–0.65
  | 'computed'     // Derived (phone href, etc.)   → 0.95
  | 'manual';      // Agency-entered value         → 1.00

// ─── Scored field ─────────────────────────────────────────────────────────────

/**
 * Wraps any value with its confidence score and origin. Every field the
 * pipeline produces — factual or generated — is wrapped in this shape so
 * downstream consumers can decide how much to trust it.
 */
export interface ScoredField<T> {
  value: T;
  /** 0.0–1.0. Fields below 0.70 are flagged for human review. */
  score: number;
  source: DataSource;
  /** AI-generated fields supply alternatives for human selection. */
  alternatives?: T[];
  /** Set automatically by scoreConfidence() when score < 0.70. */
  flagged?: boolean;
}

// ─── Raw extraction types ─────────────────────────────────────────────────────

export interface RawGBPData {
  name?: string;
  phone?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    region?: string;     // 'DE'
    regionName?: string; // 'Delaware'
    postalCode?: string;
    country?: string;
  };
  coordinates?: { lat: number; lng: number };
  category?: string;    // e.g. 'Landscaper', 'Tree service'
  description?: string;
  foundedYear?: number;
  rating?: number;
  reviewCount?: number;
  /** Raw review texts — mined for FAQ topics and tone signals */
  reviews?: Array<{ text: string; rating: number; date: string }>;
  hours?: Array<{ day: string; time: string }>;
  openingHours?: Array<{ days: string[]; opens: string; closes: string }>;
  photos?: Array<{ url: string; category: 'exterior' | 'work' | 'team' | 'interior' | 'other' }>;
  attributes?: Record<string, boolean | string>; // licensed, veteran-owned, etc.
  social?: { facebook?: string; instagram?: string };
  email?: string;
  url?: string; // canonical GBP website URL
}

export interface RawWebData {
  url: string;
  title?: string;
  description?: string;
  services?: Array<{
    name: string;
    slug?: string;
    description?: string;
    includes?: string[];
  }>;
  about?: string;            // About / story page text
  existingTagline?: string;
  faq?: Array<{ question: string; answer: string }>;
  testimonials?: Array<{
    quote: string;
    author?: string;
    location?: string;
    rating?: number;
    service?: string;
  }>;
  phone?: string;
  email?: string;
  foundedYear?: number;
  pricingMentions?: string[];     // Text fragments mentioning prices
  emergencyMentions?: string[];   // Text about 24/7 or emergency service
  certifications?: string[];
  insuranceAmount?: string;
  serviceTowns?: string[];        // Town names mentioned in service areas
}

// ─── Normalized / merged data ─────────────────────────────────────────────────

export interface NAP {
  name: string;
  phone?: string;
  address?: RawGBPData['address'];
}

export interface PricingStyle {
  style: 'transparent' | 'quote-based' | 'range' | 'custom';
  confidence: number;
}

/**
 * The merged, conflict-resolved business data fed into all generators.
 * GBP is the authority on factual fields; website provides content signals.
 */
export interface RawBusinessData {
  // ── Factual (GBP wins on conflict) ──
  name: string;
  shortName?: string;
  phone?: string;
  phoneHref?: string;
  email?: string;
  emailHref?: string;
  website?: string;
  address?: RawGBPData['address'];
  coordinates?: RawGBPData['coordinates'];
  foundedYear?: number;
  category?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  hours?: RawGBPData['hours'];
  openingHours?: RawGBPData['openingHours'];
  attributes?: Record<string, boolean | string>;
  social?: { facebook?: string; instagram?: string };
  gbpPhotos?: RawGBPData['photos'];
  gbpReviews?: RawGBPData['reviews'];

  // ── Enriched from website ──
  services?: RawWebData['services'];
  about?: string;
  existingTagline?: string;
  existingFaq?: Array<{ question: string; answer: string }>;
  existingTestimonials?: RawWebData['testimonials'];
  certifications?: string[];
  insuranceAmount?: string;
  serviceTowns?: string[];
  hasEmergencyService?: boolean;

  // ── Derived ──
  pricingStyle?: PricingStyle;
  serviceArea?: string; // raw input string, e.g. "New Castle County, Delaware"
  county?: string;      // parsed from serviceArea

  // ── Conflict tracking (flagged for human review) ──
  conflicts?: Array<{ field: string; gbpValue: unknown; websiteValue: unknown }>;
}

// ─── Pipeline-specific content types (no Lucide imports) ─────────────────────

export interface PipelineFAQItem {
  question: string;
  answer: string;
}

export interface PipelineSectionCopy {
  eyebrow?: string;
  heading: string;
  intro: string;
}

export interface PipelineBusinessStory {
  heroSubhead: string;
  mission: string;
  differentiator: string;
  founding: string;
}

/** Proof point with icon stored as a string name — resolved to the Lucide
 *  component when the business.ts template is rendered. */
export interface PipelineProofPoint {
  /** Lucide icon name, e.g. 'ShieldCheck'. */
  iconName: string;
  label: string;
  detail: string;
  computed?: 'years-in-business' | 'google-rating';
}

export interface PipelineCTAStyle {
  primary: string;
  secondary: string;
  form: string;
  micro: string;
}

export interface PipelineBenefit {
  iconName: string;
  title: string;
  description: string;
}

export interface PipelineStat {
  value: string;
  label: string;
}

export interface PipelineServiceEntry {
  slug: string;
  title: string;
  displayTitle?: string;
  summary: string;
  details: string;
  includes: string[];
  iconName: string;
}

// ─── Generated content ────────────────────────────────────────────────────────

export interface GeneratedContent {
  tagline: ScoredField<string>;
  businessStory: ScoredField<PipelineBusinessStory>;
  sectionCopy: ScoredField<{
    whyChooseUs: PipelineSectionCopy;
    services: PipelineSectionCopy;
    cta: PipelineSectionCopy;
    contact: PipelineSectionCopy;
  }>;
  ctaStyle: ScoredField<PipelineCTAStyle>;
  proofPoints: ScoredField<PipelineProofPoint[]>;
  faq: ScoredField<PipelineFAQItem[]>;
  competitiveAdvantages: ScoredField<string[]>;
  urgency: ScoredField<string | null>;
  services: ScoredField<PipelineServiceEntry[]>;
  benefits: ScoredField<PipelineBenefit[]>;
  stats: ScoredField<PipelineStat[]>;
}

// ─── Design brief ─────────────────────────────────────────────────────────────

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  highlight: string;
  background: string;
  foreground: string;
  muted: string;
}

export interface FontPairing {
  display: { family: string; cssVariable: '--font-display'; fallback: string[] };
  body: { family: string; cssVariable: '--font-sans'; fallback: string[] };
}

export type ButtonRadius = 'rounded-full' | 'rounded-2xl' | 'rounded-xl' | 'rounded-md';

export interface DesignBrief {
  colorPalette: ScoredField<ColorPalette>;
  typography: ScoredField<FontPairing>;
  buttonRadius: ButtonRadius;
  logoColors: string[];  // Extracted hex values from logo file (if provided)
  visualRegister: 'professional' | 'friendly' | 'rugged' | 'modern' | 'traditional';
  rationale: string;
}

// ─── Photo brief ──────────────────────────────────────────────────────────────

export type PhotoPriority = 'required' | 'recommended' | 'optional';

export interface PhotoShot {
  filename: string;       // e.g. 'hero.jpg'
  usage: string;          // e.g. 'Hero section — above the fold'
  framing: string;        // Composition guidance for the photographer
  dimensions: string;     // e.g. '1600×1200px minimum'
  priority: PhotoPriority;
  existingCandidate?: string; // GBP photo URL that might work
}

export interface PhotoBrief {
  shots: PhotoShot[];
  existingPhotos: Array<{
    url: string;
    category: string;
    suitableFor?: string;
  }>;
  totalRequired: number;
  totalFromGBP: number;
}

// ─── Confidence scoring ───────────────────────────────────────────────────────

export interface ConfidenceEntry {
  value: unknown;
  score: number;
  source: DataSource;
  flagged: boolean;
  alternatives?: unknown[];
}

/** Flat map of dot-notation field paths to their confidence entries.
 *  e.g. 'sectionCopy.cta.heading' → { value, score, source, flagged } */
export type ConfidenceReport = Record<string, ConfidenceEntry>;

export type ReviewSeverity = 'must-rewrite' | 'should-verify' | 'quick-confirm';

export interface ReviewQueueItem {
  /** Dot-notation path, e.g. 'businessStory.founding' */
  field: string;
  currentValue: unknown;
  score: number;
  source: DataSource;
  /** must-rewrite: <0.40 | should-verify: 0.40–0.59 | quick-confirm: 0.60–0.69 */
  severity: ReviewSeverity;
  alternatives?: unknown[];
  hint?: string;
}

// ─── Pipeline I/O ─────────────────────────────────────────────────────────────

export interface PipelineInput {
  /** The client's existing website URL. */
  websiteUrl: string;
  /** Google Business Profile URL or Place ID. */
  gbpUrl?: string;
  gbpPlaceId?: string;
  /** Service area description: "New Castle County, Delaware" or "Newark, DE +15 miles" */
  serviceArea: string;
  /** Path to logo file for color extraction. */
  logoPath?: string;
  /** Facebook page URL. */
  facebookUrl?: string;
}

/** The complete result of a pipeline run. */
export interface PipelineResult {
  input: PipelineInput;
  rawData: RawBusinessData;
  generated: GeneratedContent;
  designBrief: DesignBrief;
  photoBrief: PhotoBrief;
  confidenceReport: ConfidenceReport;
  reviewQueue: ReviewQueueItem[];
}

/** The five output artifacts, each as a string ready to write to disk. */
export interface OutputFiles {
  'business.ts': string;
  '_confidence.json': string;
  '_review_queue.md': string;
  '_design_brief.md': string;
  '_photo_brief.md': string;
}
