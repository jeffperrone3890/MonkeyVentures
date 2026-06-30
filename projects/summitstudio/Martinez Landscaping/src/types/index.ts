import type { LucideIcon } from 'lucide-react';

export interface Service {
  /** URL-safe id, also used as the anchor target. */
  slug: string;
  title: string;
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
  category: string;
  before: BeforeAfterImage;
  after: BeforeAfterImage;
}

export interface ServiceTown {
  name: string;
  /** Optional note, e.g. "and surrounding ZIPs". */
  note?: string;
}
