import type { BusinessContext } from '@/lib/pipeline/ai';

export interface ImportInput {
  businessName: string;
  websiteUrl: string;
}

export interface Heading {
  level: 1 | 2 | 3;
  text: string;
}

export interface AddressData {
  street?: string;
  city?: string;
  region?: string;      // state abbreviation, e.g. 'DE'
  postalCode?: string;
  country?: string;
}

export interface RawReview {
  text: string;
  rating?: number;
  author?: string;
  date?: string;
}

export interface RawPageData {
  /** The URL that was requested. */
  url: string;
  /** Final URL after redirects. */
  resolvedUrl: string;

  title: string | null;
  description: string | null;
  headings: Heading[];

  phone: string | null;
  email: string | null;
  address: AddressData | null;

  services: string[];
  locations: string[];
  reviews: RawReview[];
  openingHours: string[];

  rating: number | null;
  reviewCount: number | null;
  foundedYear: number | null;

  /** @type values found across all JSON-LD blocks. Useful for debugging. */
  schemaTypes: string[];
}

export interface ImportResult {
  input: ImportInput;
  raw: RawPageData;
  context: BusinessContext;
  extractedAt: string;
}
