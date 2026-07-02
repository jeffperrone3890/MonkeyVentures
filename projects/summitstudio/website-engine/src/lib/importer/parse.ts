/**
 * HTML extraction functions — all pure: (html: string) → data.
 *
 * Priority chain for every field:
 *   1. Schema.org JSON-LD (most reliable — structured, machine-readable)
 *   2. Meta tags (og:title, og:description, etc.)
 *   3. HTML text pattern matching (regex fallbacks)
 *   4. null / []
 *
 * No HTML parser library is required. Schema.org extraction handles 70%+ of
 * local business sites well. Upgrade path: replace the HTML section functions
 * with a cheerio/playwright implementation — the function signatures stay stable.
 */

import type { Heading, AddressData, RawReview } from './types';

// ─── Schema.org helpers ───────────────────────────────────────────────────────

const BUSINESS_TYPES = new Set([
  'LocalBusiness',
  'HomeAndConstructionBusiness',
  'GeneralContractor',
  'LandscapeService',
  'Landscaper',
  'ProfessionalService',
  'Organization',
  'Corporation',
  'Plumber',
  'HVACBusiness',
  'RoofingContractor',
  'ElectricalContractor',
  'Pest Control',
  'CleaningService',
]);

function isObj(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function getVal(obj: unknown, key: string): unknown {
  if (!isObj(obj)) return undefined;
  return obj[key];
}

function getStr(obj: unknown, ...keys: string[]): string | null {
  let cur: unknown = obj;
  for (const key of keys) cur = getVal(cur, key);
  return typeof cur === 'string' ? cur.trim() || null : null;
}

function getNum(obj: unknown, ...keys: string[]): number | null {
  let cur: unknown = obj;
  for (const key of keys) cur = getVal(cur, key);
  if (typeof cur === 'number') return cur;
  if (typeof cur === 'string') {
    const n = parseFloat(cur);
    return Number.isNaN(n) ? null : n;
  }
  return null;
}

function asArray(val: unknown): unknown[] {
  if (Array.isArray(val)) return val;
  return val != null ? [val] : [];
}

function getEntityTypes(entity: unknown): string[] {
  return asArray(getVal(entity, '@type')).filter((t): t is string => typeof t === 'string');
}

/**
 * Parse all JSON-LD blocks from the page HTML into a flat entity array.
 * Handles single objects, top-level arrays, and `@graph` containers.
 */
export function extractSchemaOrg(html: string): unknown[] {
  const entities: unknown[] = [];
  const re = /<script\s[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;

  while ((m = re.exec(html)) !== null) {
    try {
      const parsed: unknown = JSON.parse(m[1].trim());
      if (Array.isArray(parsed)) {
        entities.push(...parsed);
      } else if (isObj(parsed)) {
        const graph = parsed['@graph'];
        if (Array.isArray(graph)) {
          entities.push(...graph);
        } else {
          entities.push(parsed);
        }
      }
    } catch {
      // Skip malformed JSON-LD blocks
    }
  }

  return entities;
}

/**
 * Find the primary business entity in a schema.org entity array.
 * Tries strong business types first, then falls back to any entity with
 * a telephone or address (common for businesses without explicit @type).
 */
function findBusinessEntity(entities: unknown[]): Record<string, unknown> | null {
  // First pass: match recognized business @type values
  for (const e of entities) {
    const types = getEntityTypes(e);
    if (types.some((t) => BUSINESS_TYPES.has(t))) {
      return e as Record<string, unknown>;
    }
  }

  // Second pass: any entity with telephone or address (heuristic)
  for (const e of entities) {
    if (!isObj(e)) continue;
    if (getStr(e, 'telephone') ?? getStr(e, 'email')) return e;
    if (isObj(e['address'])) return e;
  }

  return null;
}

// ─── Extraction functions ─────────────────────────────────────────────────────

/**
 * Page title — prefers the <title> tag, falls back to og:title.
 */
export function extractTitle(html: string): string | null {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch) return stripTags(titleMatch[1]);

  return extractMetaProperty(html, 'og:title') ?? extractMetaName(html, 'title');
}

/**
 * Meta description — prefers og:description, falls back to name="description".
 */
export function extractMetaDescription(html: string): string | null {
  return (
    extractMetaProperty(html, 'og:description') ??
    extractMetaName(html, 'description')
  );
}

/**
 * All h1–h3 headings on the page, in document order.
 * Inner HTML tags (spans, strong, em) are stripped.
 */
export function extractHeadings(html: string): Heading[] {
  const headings: Heading[] = [];
  const re = /<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m: RegExpExecArray | null;

  while ((m = re.exec(html)) !== null) {
    const text = stripTags(m[2]);
    if (text) {
      headings.push({ level: parseInt(m[1], 10) as 1 | 2 | 3, text });
    }
  }

  return headings;
}

/**
 * US phone number — checks schema.org `telephone` first, then text regex.
 * Returns the first match in display format as found on the page.
 */
export function extractPhone(html: string, entities: unknown[]): string | null {
  // Schema.org
  const biz = findBusinessEntity(entities);
  if (biz) {
    const tel = getStr(biz, 'telephone');
    if (tel) return normalizePhoneDisplay(tel);
  }

  // Text regex — US formats: (xxx) xxx-xxxx, xxx-xxx-xxxx, xxx.xxx.xxxx, +1-xxx...
  const text = stripTags(html);
  const re = /(?:^|[\s(])(\+?1?[-.\s]?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4})(?=[\s,.]|$)/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const candidate = m[1].trim();
    const digits = candidate.replace(/\D/g, '');
    // Must be 10 or 11 digits (11 = country code 1)
    if (digits.length === 10 || (digits.length === 11 && digits[0] === '1')) {
      return candidate;
    }
  }

  // tel: href
  const telHref = html.match(/href="tel:([^"]+)"/i);
  if (telHref) return normalizePhoneDisplay(telHref[1]);

  return null;
}

/**
 * Email address — checks schema.org `email` first, then text regex.
 * Filters out placeholder addresses (info@example.com, etc.).
 */
export function extractEmail(html: string, entities: unknown[]): string | null {
  // Schema.org
  const biz = findBusinessEntity(entities);
  if (biz) {
    const email = getStr(biz, 'email');
    if (email && !isPlaceholderEmail(email)) return email;
  }

  // mailto: href
  const mailtoHref = html.match(/href="mailto:([^"?]+)"/i);
  if (mailtoHref && !isPlaceholderEmail(mailtoHref[1])) return mailtoHref[1];

  // Text regex
  const text = stripTags(html);
  const re = /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (!isPlaceholderEmail(m[1])) return m[1];
  }

  return null;
}

/**
 * Business address — from schema.org `address` object.
 * HTML microdata extraction is not implemented (requires a proper parser).
 */
export function extractAddress(entities: unknown[]): AddressData | null {
  const biz = findBusinessEntity(entities);
  if (!biz) return null;

  const addr = getVal(biz, 'address');
  if (!isObj(addr)) return null;

  const result: AddressData = {};
  const street = getStr(addr, 'streetAddress');
  const city = getStr(addr, 'addressLocality');
  const region = getStr(addr, 'addressRegion');
  const postalCode = getStr(addr, 'postalCode');
  const country = getStr(addr, 'addressCountry');

  if (street) result.street = street;
  if (city) result.city = city;
  if (region) result.region = normalizeRegion(region);
  if (postalCode) result.postalCode = postalCode;
  if (country) result.country = normalizeRegion(country);

  return Object.keys(result).length > 0 ? result : null;
}

/**
 * Service names — priority:
 *   1. Schema.org hasOfferCatalog / makesOffer / offers
 *   2. Navigation link text (filtered heuristic)
 *   3. List items immediately following a "services" heading
 */
export function extractServices(html: string, entities: unknown[]): string[] {
  const services: string[] = [];

  // 1. Schema.org offer catalog
  const biz = findBusinessEntity(entities);
  if (biz) {
    const catalog = getVal(biz, 'hasOfferCatalog');
    if (isObj(catalog)) {
      for (const item of asArray(getVal(catalog, 'itemListElement'))) {
        const name = getStr(item, 'name');
        if (name) services.push(name);
      }
    }

    for (const key of ['makesOffer', 'offers', 'serviceOffered']) {
      for (const offer of asArray(getVal(biz, key))) {
        const name = getStr(offer, 'name') ?? (typeof offer === 'string' ? offer : null);
        if (name) services.push(name);
      }
    }
  }

  // 2. Navigation links (if schema didn't give us anything)
  if (services.length === 0) {
    services.push(...extractServicesFromNav(html));
  }

  // 3. List items after a "services" heading (additional heuristic)
  if (services.length < 3) {
    const sectionServices = extractServicesFromSection(html);
    for (const s of sectionServices) {
      if (!services.includes(s)) services.push(s);
    }
  }

  return dedupe(services.map((s) => s.trim()).filter((s) => s.length >= 3));
}

/**
 * Locations / service area cities — priority:
 *   1. Schema.org address.addressLocality (primary city)
 *   2. Schema.org areaServed / serviceArea
 *   3. "City, ST" patterns in page text
 */
export function extractLocations(html: string, entities: unknown[]): string[] {
  const locs: string[] = [];

  const biz = findBusinessEntity(entities);
  if (biz) {
    // Primary address city
    const city = getStr(biz, 'address', 'addressLocality');
    if (city) locs.push(city);

    // areaServed: string, string[], or array of Place objects
    for (const area of asArray(getVal(biz, 'areaServed'))) {
      if (typeof area === 'string') {
        locs.push(...area.split(/[,;]/).map((s) => s.trim()).filter(Boolean));
      } else {
        const name = getStr(area, 'name');
        if (name) locs.push(name);
      }
    }

    // serviceArea
    const serviceArea = getVal(biz, 'serviceArea');
    if (typeof serviceArea === 'string') {
      locs.push(...serviceArea.split(/[,;]/).map((s) => s.trim()).filter(Boolean));
    } else if (isObj(serviceArea)) {
      const name = getStr(serviceArea, 'name');
      if (name) locs.push(name);
    }
  }

  // City, ST text patterns (US only)
  if (locs.length < 3) {
    const text = stripTags(html);
    const re = /\b([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?),\s+([A-Z]{2})\b/g;
    let m: RegExpExecArray | null;
    let count = 0;

    while ((m = re.exec(text)) !== null && count < 20) {
      const [, city, state] = m;
      if (US_STATES.has(state) && city.length > 2) {
        locs.push(`${city}, ${state}`);
        count++;
      }
    }
  }

  return dedupe(locs.filter((s) => s.length > 2));
}

/**
 * Reviews from schema.org Review entities embedded in the page.
 * Does not scrape visible testimonials (no HTML parser).
 */
export function extractReviews(entities: unknown[]): RawReview[] {
  const reviews: RawReview[] = [];

  // Standalone Review entities
  const standalone = entities.filter((e) =>
    getEntityTypes(e).includes('Review'),
  );

  // Reviews embedded inside the business entity
  const biz = findBusinessEntity(entities);
  const embedded = biz ? asArray(getVal(biz, 'review')) : [];

  for (const r of [...standalone, ...embedded]) {
    if (!isObj(r)) continue;
    const text = getStr(r, 'reviewBody') ?? getStr(r, 'description');
    if (!text) continue;

    reviews.push({
      text,
      rating: getNum(r, 'reviewRating', 'ratingValue') ?? undefined,
      author: getStr(r, 'author', 'name') ?? undefined,
      date: getStr(r, 'datePublished') ?? undefined,
    });
  }

  return reviews;
}

/**
 * Opening hours — from schema.org `openingHours` (string or string[]).
 * Format: "Mo-Fr 08:00-17:00", "Sa 09:00-13:00", "Su Closed"
 */
export function extractOpeningHours(entities: unknown[]): string[] {
  const biz = findBusinessEntity(entities);
  if (!biz) return [];

  const hours = asArray(getVal(biz, 'openingHours'));
  return hours.filter((h): h is string => typeof h === 'string');
}

/**
 * Aggregate rating from schema.org AggregateRating.
 */
export function extractRating(
  entities: unknown[],
): { rating: number; reviewCount: number } | null {
  const biz = findBusinessEntity(entities);

  // Check business entity's aggregateRating
  const aggFromBiz = biz ? getVal(biz, 'aggregateRating') : null;

  // Check standalone AggregateRating entities
  const standaloneAgg = entities.find((e) =>
    getEntityTypes(e).includes('AggregateRating'),
  );

  const agg = aggFromBiz ?? standaloneAgg;
  if (!agg) return null;

  const rating = getNum(agg, 'ratingValue');
  const reviewCount =
    getNum(agg, 'reviewCount') ?? getNum(agg, 'ratingCount') ?? getNum(agg, 'userInteractionCount');

  if (rating == null) return null;
  return { rating, reviewCount: reviewCount ?? 0 };
}

/**
 * Year the business was founded — from schema.org `foundingDate`, then text heuristic.
 */
export function extractFoundedYear(html: string, entities: unknown[]): number | null {
  const biz = findBusinessEntity(entities);
  if (biz) {
    const founding = getStr(biz, 'foundingDate');
    if (founding) {
      const match = founding.match(/(\d{4})/);
      if (match) return validateYear(parseInt(match[1], 10));
    }
  }

  // Text heuristics: "founded in 2011", "since 2011", "established 2011"
  const text = stripTags(html);
  const re = /(?:founded|established|serving|since|started)\s+(?:in\s+)?(\d{4})/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const year = validateYear(parseInt(m[1], 10));
    if (year) return year;
  }

  return null;
}

/**
 * All @type values found across all JSON-LD blocks.
 */
export function extractSchemaTypes(entities: unknown[]): string[] {
  return dedupe(entities.flatMap(getEntityTypes));
}

// ─── Nav / section heuristics ─────────────────────────────────────────────────

const NAV_EXCLUSIONS = new Set([
  'home', 'about', 'about us', 'contact', 'contact us', 'blog', 'news', 'press',
  'gallery', 'photos', 'faq', 'frequently asked questions', 'portfolio', 'reviews',
  'testimonials', 'careers', 'jobs', 'privacy policy', 'terms', 'terms of service',
  'sitemap', 'login', 'sign in', 'register', 'our team', 'team', 'staff', 'meet the team',
  'resources', 'financing', 'services', 'what we do', 'menu', 'close', 'open menu',
  'get a quote', 'free quote', 'free estimate', 'request a quote', 'get started',
  'learn more', 'view all', 'see all', 'read more', 'back', 'next', 'previous',
]);

function extractServicesFromNav(html: string): string[] {
  const services: string[] = [];

  // Extract content of <nav> and <header> elements
  const navRe = /<(?:nav|header)\b[^>]*>([\s\S]*?)<\/(?:nav|header)>/gi;
  let navM: RegExpExecArray | null;

  while ((navM = navRe.exec(html)) !== null) {
    const navContent = navM[1];
    const linkRe = /<a\b[^>]*>([\s\S]*?)<\/a>/gi;
    let linkM: RegExpExecArray | null;

    while ((linkM = linkRe.exec(navContent)) !== null) {
      const text = stripTags(linkM[1]).trim();
      if (
        text.length >= 3 &&
        text.length <= 45 &&
        !NAV_EXCLUSIONS.has(text.toLowerCase()) &&
        text.split(/\s+/).length <= 5 &&
        !/^\d/.test(text) &&
        /[a-zA-Z]/.test(text)
      ) {
        services.push(text);
      }
    }
  }

  return services;
}

function extractServicesFromSection(html: string): string[] {
  const services: string[] = [];

  // Match headings containing service keywords, then grab what follows
  const sectionRe =
    /<h[2-4]\b[^>]*>(?:[^<]*(?:service|we offer|we do|what we do|speciali)[^<]*)<\/h[2-4]>([\s\S]{0,4000}?)(?=<h[1-3]|<section|<footer|$)/gi;
  let sectionM: RegExpExecArray | null;

  while ((sectionM = sectionRe.exec(html)) !== null) {
    const block = sectionM[1];

    // Extract list items
    const liRe = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
    let liM: RegExpExecArray | null;
    while ((liM = liRe.exec(block)) !== null) {
      const text = stripTags(liM[1]).trim();
      if (text.length >= 3 && text.length <= 80) {
        services.push(text);
      }
    }

    // Extract heading-like elements within the section (card titles, etc.)
    if (services.length === 0) {
      const cardTitleRe = /<h[3-6]\b[^>]*>([\s\S]*?)<\/h[3-6]>/gi;
      let cardM: RegExpExecArray | null;
      while ((cardM = cardTitleRe.exec(block)) !== null) {
        const text = stripTags(cardM[1]).trim();
        if (text.length >= 3 && text.length <= 60) {
          services.push(text);
        }
      }
    }

    if (services.length > 0) break;
  }

  return services;
}

// ─── Meta tag helpers ─────────────────────────────────────────────────────────

function extractMetaProperty(html: string, property: string): string | null {
  const re = new RegExp(
    `<meta\\s[^>]*property=["']${escapeRegex(property)}["'][^>]*content=["']([^"']+)["']`,
    'i',
  );
  const m = html.match(re) ?? html.match(
    new RegExp(
      `<meta\\s[^>]*content=["']([^"']+)["'][^>]*property=["']${escapeRegex(property)}["']`,
      'i',
    ),
  );
  return m ? m[1].trim() : null;
}

function extractMetaName(html: string, name: string): string | null {
  const re = new RegExp(
    `<meta\\s[^>]*name=["']${escapeRegex(name)}["'][^>]*content=["']([^"']+)["']`,
    'i',
  );
  const m = html.match(re) ?? html.match(
    new RegExp(
      `<meta\\s[^>]*content=["']([^"']+)["'][^>]*name=["']${escapeRegex(name)}["']`,
      'i',
    ),
  );
  return m ? m[1].trim() : null;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

export function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function dedupe<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isPlaceholderEmail(email: string): boolean {
  const lower = email.toLowerCase();
  return (
    lower.includes('example.com') ||
    lower.includes('yourdomain') ||
    lower.includes('yourcompany') ||
    lower.includes('yourname') ||
    lower.includes('test@') ||
    lower.includes('noreply') ||
    lower.includes('no-reply')
  );
}

function normalizePhoneDisplay(raw: string): string {
  // Convert +13025550100 → (302) 555-0100 for display
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 11 && digits[0] === '1') {
    const d = digits.slice(1);
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return raw.trim();
}

function normalizeRegion(region: string): string {
  // If it's a full state name like "Delaware", return as-is;
  // state abbreviation lookup would need a full table — keep the raw value.
  return region.trim();
}

function validateYear(year: number): number | null {
  const current = new Date().getFullYear();
  return year >= 1900 && year <= current ? year : null;
}

const US_STATES = new Set([
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
]);
