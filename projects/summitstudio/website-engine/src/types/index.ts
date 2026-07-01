import type { LucideIcon } from 'lucide-react';

export interface Service {
  /** URL-safe id, also used as the anchor target. */
  slug: string;
  /** Functional name — used in forms, footer links, and dropdowns. */
  title: string;
  /**
   * Outcome-focused card headline shown to visitors. If omitted, falls back
   * to `title`. Use this to lead with the customer benefit rather than the
   * service category name (e.g. "A Sharp, Healthy Lawn Year-Round" instead
   * of "Lawn Care & Maintenance").
   */
  displayTitle?: string;
  /** One-line promise shown on the card. */
  summary: string;
  /** Supporting detail / what's included. */
  details: string;
  /** Bullet list of specific included work. */
  includes: string[];
  image: string;
  icon: LucideIcon;
}

export interface Benefit {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Stat {
  /** The headline figure, e.g. "15+". */
  value: string;
  /** What the figure measures, e.g. "Years in business". */
  label: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  location: string;
  /** Whole-star rating, 1–5. */
  rating: number;
  service: string;
}

export interface BeforeAfterImage {
  src: string;
  alt: string;
}

export interface GalleryProject {
  slug: string;
  title: string;
  /** Optional one-line description shown beneath the slider caption. */
  description?: string;
  category: string;
  before: BeforeAfterImage;
  after: BeforeAfterImage;
}

export interface ServiceTown {
  name: string;
  /** Optional note, e.g. "and surrounding ZIPs". */
  note?: string;
}

// ─── Engine Intelligence ────────────────────────────────────────────────────

export interface CTAStyle {
  /** Primary hero + CTA section button. */
  primary: string;
  /** Secondary/ghost button in the hero. */
  secondary: string;
  /** Contact form submit button. */
  form: string;
  /** Micro-copy beneath the hero CTAs. */
  micro: string;
}

export interface ProofPoint {
  icon: LucideIcon;
  label: string;
  detail: string;
  /**
   * When set, ProofBar replaces the static label/detail with a computed value
   * derived from the live business object at render time. This prevents the
   * data from going stale (e.g. the years count never needs a manual update).
   * - 'years-in-business' → `${currentYear - foundedYear}+ Years`
   * - 'google-rating' → `${reviews.average}★ Rated` / `${reviews.count} verified reviews`
   */
  computed?: 'years-in-business' | 'google-rating';
}

export interface Objection {
  concern: string;
  response: string;
}

export interface BusinessStory {
  /** 1–2 sentences about how the business was founded. Used in WhyChooseUs. */
  founding: string;
  /** One-sentence mission statement. Used in the Footer pitch. */
  mission: string;
  /** One-sentence core differentiator. Used in WhyChooseUs intro. */
  differentiator: string;
  /** 1–2 sentences used as the hero subhead. Replaces hardcoded template copy. */
  heroSubhead: string;
}

export interface GuaranteeConfig {
  headline: string;
  description: string;
}

export interface FinancingConfig {
  description: string;
  provider?: string;
  /** Minimum project size (USD) to qualify. */
  minAmount?: number;
}

export interface EmergencyServiceConfig {
  description: string;
  /** Separate emergency line if different from main business phone. */
  phone?: string;
  responseTime?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ReviewHighlight {
  quote: string;
  author: string;
  platform: 'google' | 'yelp' | 'facebook' | 'other';
}

export interface SectionCopy {
  /** Short all-caps label above the heading. Optional — some sections derive it dynamically. */
  eyebrow?: string;
  heading: string;
  intro: string;
}

export interface BrandVoice {
  tone: string;
  avoids: string[];
}

export interface IdealCustomer {
  description: string;
  painPoints: string[];
  desires: string[];
}

// ─── Business schema ─────────────────────────────────────────────────────────
// The canonical shape of every business data file. Add `satisfies Business`
// after `as const` in each business file to get compile-time completeness
// checking without losing literal type inference.

export interface Business {
  name: string;
  shortName: string;
  legalName: string;
  tagline: string;
  description: string;
  foundedYear: number;
  logo: { primary: string; secondary: string };
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  address: {
    street: string;
    city: string;
    region: string;
    regionName: string;
    county: string;
    postalCode: string;
    country: string;
  };
  geo: { lat: number; lng: number };
  url: string;
  hours: ReadonlyArray<{ readonly day: string; readonly time: string }>;
  openingHours: ReadonlyArray<{
    readonly days: ReadonlyArray<string>;
    readonly opens: string;
    readonly closes: string;
  }>;
  emergencyNote: string;
  credentials: {
    licensed: boolean;
    insured: boolean;
    insuranceAmount: string;
    certification: string;
  };
  social: { facebook: string; instagram: string; google: string };
  reviews: { average: number; count: number };
  // Engine intelligence
  brandVoice: BrandVoice;
  idealCustomer: IdealCustomer;
  competitiveAdvantages: ReadonlyArray<string>;
  proofPoints: ReadonlyArray<ProofPoint>;
  objections: ReadonlyArray<Objection>;
  urgency: { message: string } | null;
  pricingStyle: 'transparent' | 'quote-based' | 'range' | 'custom';
  ctaStyle: CTAStyle;
  brandPersonality: { adjectives: ReadonlyArray<string>; not: ReadonlyArray<string> };
  businessStory: BusinessStory;
  servicePriorities: ReadonlyArray<string>;
  faq: ReadonlyArray<FAQItem>;
  guarantee: GuaranteeConfig | null;
  financing: FinancingConfig | null;
  emergencyService: EmergencyServiceConfig | null;
  reviewHighlights: ReadonlyArray<ReviewHighlight>;
  sectionCopy: {
    whyChooseUs: SectionCopy;
    services: SectionCopy;
    cta: SectionCopy;
    contact: SectionCopy;
  };
}
