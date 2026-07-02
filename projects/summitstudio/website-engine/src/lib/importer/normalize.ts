import type { BusinessContext } from '@/lib/pipeline/ai';
import type { RawPageData } from './types';

/**
 * Build a BusinessContext from extracted page data.
 *
 * The provided `businessName` (from user input) is always used as the
 * canonical name — it's more reliable than anything extracted from the page.
 *
 * Fields that require AI or multi-page scraping (reviewThemes, tone,
 * existingTagline) are left undefined here. They're populated in later
 * pipeline stages.
 */
export function normalizeToContext(businessName: string, raw: RawPageData): BusinessContext {
  const location = deriveLocation(raw);

  return {
    name: businessName,
    location,
    services: raw.services,
    foundedYear: raw.foundedYear ?? undefined,
    rating: raw.rating ?? undefined,
    reviewCount: raw.reviewCount ?? undefined,
    reviewThemes: [],   // populated later by AI or review analysis
    tone: 'conversational',
    existingCopy: raw.description ?? undefined,
    existingTagline: undefined,
  };
}

function deriveLocation(raw: RawPageData): string {
  const city = raw.address?.city;
  const region = raw.address?.region;

  if (city && region) return `${city}, ${region}`;
  if (city) return city;
  if (region) return region;

  // Fall back to first extracted location
  const first = raw.locations[0];
  if (first) return first;

  return 'the area';
}
