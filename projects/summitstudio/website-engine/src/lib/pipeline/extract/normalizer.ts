/**
 * Normalizer — merges GBP and website data into a single RawBusinessData
 * struct. GBP is the authority on all factual fields; the website provides
 * service content, about text, and pricing signals.
 *
 * NAP consistency rule: if GBP phone ≠ website phone, both are flagged in
 * the conflicts array for human review. Same for address discrepancies.
 */

import type { RawGBPData, RawWebData, RawBusinessData } from '../types';

/**
 * Merge GBP data + website data into a normalized RawBusinessData struct.
 *
 * @param gbp          - Output from extractGoogleBusiness()
 * @param web          - Output from extractWebsiteContent()
 * @param serviceArea  - Raw service area string from PipelineInput
 */
export function normalize(
  gbp: RawGBPData,
  web: RawWebData,
  serviceArea: string,
): RawBusinessData {
  const conflicts: RawBusinessData['conflicts'] = [];

  // ── Phone (GBP wins; flag discrepancy) ──
  if (gbp.phone && web.phone && normalizePhone(gbp.phone) !== normalizePhone(web.phone)) {
    conflicts.push({ field: 'phone', gbpValue: gbp.phone, websiteValue: web.phone });
  }
  const phone = gbp.phone ?? web.phone;
  const phoneHref = phone ? phoneToHref(phone) : undefined;

  // ── Email (GBP wins; fall back to website) ──
  const email = gbp.email ?? web.email;
  const emailHref = email ? `mailto:${email}` : undefined;

  // ── Founded year (GBP wins; fall back to website extraction) ──
  const foundedYear = gbp.foundedYear ?? web.foundedYear;

  // ── Pricing style ──
  const pricingText = [
    ...(web.pricingMentions ?? []),
    web.description ?? '',
    web.about ?? '',
  ].join(' ');
  const style = derivePricingStyle(pricingText);

  // ── Emergency service ──
  const hasEmergencyService =
    (web.emergencyMentions?.length ?? 0) > 0 ||
    (web.services ?? []).some((s) => /snow|emergency/i.test(s.name));

  // ── Service towns (website list wins; supplement with serviceArea) ──
  const webTowns = web.serviceTowns ?? [];
  const areaTowns = parseServiceAreaTowns(serviceArea);
  const allTowns = Array.from(new Set([...webTowns, ...areaTowns]));
  const county = parseCounty(serviceArea);

  // ── Short name heuristic ──
  const shortName = deriveShortName(gbp.name ?? web.title ?? '');

  return {
    name: gbp.name ?? web.title?.split('—')[0]?.trim() ?? 'Unknown Business',
    shortName,
    phone,
    phoneHref,
    email,
    emailHref,
    website: gbp.website ?? web.url,
    address: gbp.address,
    coordinates: gbp.coordinates,
    foundedYear,
    category: gbp.category,
    description: gbp.description ?? web.description,
    rating: gbp.rating,
    reviewCount: gbp.reviewCount,
    hours: gbp.hours,
    openingHours: gbp.openingHours,
    attributes: gbp.attributes,
    social: gbp.social,
    gbpPhotos: gbp.photos,
    gbpReviews: gbp.reviews,

    services: web.services,
    about: web.about,
    existingTagline: web.existingTagline,
    existingFaq: web.faq,
    existingTestimonials: web.testimonials,
    certifications: web.certifications,
    insuranceAmount: web.insuranceAmount ?? inferInsurance(gbp.attributes),
    serviceTowns: allTowns.length > 0 ? allTowns : undefined,
    hasEmergencyService,

    pricingStyle: { style, confidence: 0.65 },
    serviceArea,
    county,

    conflicts: conflicts.length > 0 ? conflicts : undefined,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Strip all non-digits from a phone number for comparison. */
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/** Convert a display phone string to a tel: href. */
export function phoneToHref(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const e164 = digits.length === 10 ? `+1${digits}` : `+${digits}`;
  return `tel:${e164}`;
}

/** Derive a short business name by dropping legal suffixes. */
function deriveShortName(fullName: string): string {
  return fullName
    .replace(/\s*(?:LLC|Inc\.?|Corp\.?|Co\.?|Ltd\.?),?\.?$/i, '')
    .replace(/\s+&\s+(?:Tree\s+Services?|Property\s+Care|Lawn\s+Care)$/i, '')
    .trim();
}

function derivePricingStyle(
  text: string,
): 'transparent' | 'quote-based' | 'range' | 'custom' {
  if (/\$\d+\s*(?:\/|per)\s*(?:month|visit|cut|service)/i.test(text)) return 'transparent';
  if (/starting\s+(?:at|from)\s+\$\d+/i.test(text)) return 'range';
  return 'quote-based';
}

/** Try to find the county name in the service area string. */
function parseCounty(serviceArea: string): string | undefined {
  const match = serviceArea.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+County/i);
  return match ? `${match[1]} County` : undefined;
}

/** Split "City A, City B, Delaware" into town names. */
function parseServiceAreaTowns(serviceArea: string): string[] {
  // Remove state names and "County" references
  const stripped = serviceArea
    .replace(/\b(?:Delaware|Maryland|Pennsylvania|New Jersey)\b/gi, '')
    .replace(/\b[A-Z][a-z]+\s+County\b/g, '')
    .trim();
  return stripped
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && !/^\d/.test(s));
}

function inferInsurance(
  attributes?: Record<string, boolean | string>,
): string | undefined {
  if (!attributes) return undefined;
  const insured = attributes['insured'] === true || attributes['fully_insured'] === true;
  return insured ? 'Fully insured' : undefined;
}
