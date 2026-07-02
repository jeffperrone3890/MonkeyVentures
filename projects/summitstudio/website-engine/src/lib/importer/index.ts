import { fetchPage } from './fetch';
import {
  extractSchemaOrg,
  extractTitle,
  extractMetaDescription,
  extractHeadings,
  extractPhone,
  extractEmail,
  extractAddress,
  extractServices,
  extractLocations,
  extractReviews,
  extractOpeningHours,
  extractRating,
  extractFoundedYear,
  extractSchemaTypes,
} from './parse';
import { normalizeToContext } from './normalize';
import type { ImportInput, ImportResult, RawPageData } from './types';

export type { ImportInput, ImportResult, RawPageData } from './types';

/**
 * Run the full import pipeline for a single business homepage.
 *
 * Steps:
 *   1. Fetch the URL (real HTTP — no mocks)
 *   2. Extract all signals from the HTML (schema.org → meta → regex)
 *   3. Normalize into a BusinessContext
 *
 * Throws on network errors or non-HTML responses.
 * Returns raw extraction data alongside the normalized context so
 * the caller can inspect confidence and fill gaps.
 */
export async function runImport(input: ImportInput): Promise<ImportResult> {
  const { businessName, websiteUrl } = input;

  // ── Step 1: Fetch ────────────────────────────────────────────────────────
  const { html, resolvedUrl } = await fetchPage(websiteUrl);

  // ── Step 2: Extract ──────────────────────────────────────────────────────
  const entities = extractSchemaOrg(html);
  const ratingData = extractRating(entities);

  const raw: RawPageData = {
    url: websiteUrl,
    resolvedUrl,
    title: extractTitle(html),
    description: extractMetaDescription(html),
    headings: extractHeadings(html),
    phone: extractPhone(html, entities),
    email: extractEmail(html, entities),
    address: extractAddress(entities),
    services: extractServices(html, entities),
    locations: extractLocations(html, entities),
    reviews: extractReviews(entities),
    openingHours: extractOpeningHours(entities),
    rating: ratingData?.rating ?? null,
    reviewCount: ratingData?.reviewCount ?? null,
    foundedYear: extractFoundedYear(html, entities),
    schemaTypes: extractSchemaTypes(entities),
  };

  // ── Step 3: Normalize ────────────────────────────────────────────────────
  const context = normalizeToContext(businessName, raw);

  return {
    input,
    raw,
    context,
    extractedAt: new Date().toISOString(),
  };
}
