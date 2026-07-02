/**
 * Business website content extractor.
 *
 * Production implementation: use Firecrawl or Playwright to fetch and parse
 * the site. Key pages to scrape: home, about, services, FAQ, testimonials.
 *
 * Current implementation: returns realistic mock content shaped like a typical
 * small landscaping site so downstream generators have realistic input.
 *
 * Swap path: implement `scrapeWithFirecrawl(url)` or `scrapeWithPlaywright(url)`
 * and call it instead of returning the mock. The mock defines the exact shape
 * the real scraper must produce.
 */

import type { RawWebData } from '../types';

/**
 * Extract content from a business website.
 *
 * @param url - The business website URL
 */
export async function extractWebsiteContent(url: string): Promise<RawWebData> {
  void url; // used by the real scraper

  // ── Real implementation (commented until scraper is configured) ──
  // return scrapeWithFirecrawl(url);

  return { ...MOCK_WEB_DATA, url };
}

// ─── Real scraper (to be implemented) ────────────────────────────────────────

// async function scrapeWithFirecrawl(url: string): Promise<RawWebData> {
//   const apiKey = process.env.FIRECRAWL_API_KEY;
//   if (!apiKey) throw new Error('FIRECRAWL_API_KEY is not set');
//
//   const client = new FirecrawlApp({ apiKey });
//   const result = await client.scrapeUrl(url, {
//     formats: ['markdown', 'links'],
//   });
//
//   return parseScrapedContent(result.markdown ?? '', url);
// }

// ─── Content parsers (used by real scraper) ───────────────────────────────────

// These functions are the logic that a real implementation would call.
// Keeping them here makes them testable with any content string.

/**
 * Extract the probable founded year from about-page text.
 * Looks for patterns like "founded in 2011", "since 2011", "established 2011".
 */
export function extractFoundedYear(text: string): number | undefined {
  const match = text.match(/(?:founded|established|since|started)\s+(?:in\s+)?(\d{4})/i);
  const year = match ? parseInt(match[1], 10) : undefined;
  if (!year) return undefined;
  const current = new Date().getFullYear();
  return year >= 1970 && year <= current ? year : undefined;
}

/**
 * Extract phone numbers from page text.
 * Returns the first match in US format.
 */
export function extractPhone(text: string): string | undefined {
  const match = text.match(/\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/);
  return match ? match[0].trim() : undefined;
}

/**
 * Extract pricing style signal from page text.
 * Returns 'transparent' if prices are mentioned, 'quote-based' otherwise.
 */
export function detectPricingStyle(
  text: string,
): 'transparent' | 'quote-based' | 'range' | 'custom' {
  const lower = text.toLowerCase();
  if (/\$\d+\s*(?:\/|per)\s*(?:month|visit|cut|service)/i.test(text)) return 'transparent';
  if (/starting\s+(?:at|from)\s+\$\d+/i.test(text)) return 'range';
  if (/free\s+(?:quote|estimate)/i.test(lower)) return 'quote-based';
  return 'quote-based';
}

/**
 * Detect whether the site mentions emergency or 24/7 services.
 */
export function detectEmergencyService(text: string): boolean {
  return /emergency|24[\s/-]?7|storm\s+(?:cleanup|damage|response)/i.test(text);
}

/**
 * Parse service area towns from text.
 * Looks for comma-separated lists of city/town names following keywords.
 */
export function extractServiceTowns(text: string): string[] {
  const match = text.match(
    /(?:serve|service\s+area|serving)[^.]{0,30}?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?(?:,\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)*)/,
  );
  if (!match) return [];
  return match[1].split(',').map((t) => t.trim()).filter(Boolean);
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_WEB_DATA: Omit<RawWebData, 'url'> = {
  title: 'Acme Landscaping — Professional Lawn & Property Care in New Castle County',
  description:
    'Family-owned landscaping, tree care, and hardscaping in Newark, Delaware. Free estimates. No contracts.',
  existingTagline: 'Your lawn, our passion.',
  about:
    "Acme Landscaping was founded in 2011 by Mike and Sarah Acme with a simple goal: deliver professional property care without the corporate runaround. We started with two crews and a handful of clients in Newark. Today we serve over 200 properties across New Castle County — but we still show up like it's your first season with us. Licensed and insured since day one.",
  foundedYear: 2011,
  phone: '(302) 555-0100',
  email: 'info@acmelandscaping.com',
  certifications: ['Delaware Licensed Contractor #DL-4892', 'ISA Certified Arborist'],
  insuranceAmount: '$2M liability',
  services: [
    {
      name: 'Lawn Care & Maintenance',
      slug: 'lawn-care',
      description: 'Weekly mowing, edging, and cleanup to keep your lawn looking sharp all season.',
      includes: ['Weekly or bi-weekly mowing', 'Edging along beds and walks', 'Grass clipping cleanup', 'Seasonal schedule adjustment'],
    },
    {
      name: 'Tree & Shrub Care',
      slug: 'tree-shrub-care',
      description: 'Expert pruning, removal, and health treatments from our ISA-certified arborists.',
      includes: ['Crown pruning and shaping', 'Dead wood removal', 'Hazardous tree removal', 'Stump grinding'],
    },
    {
      name: 'Hardscaping',
      slug: 'hardscaping',
      description: 'Patios, walkways, retaining walls, and outdoor living spaces built to last.',
      includes: ['Paver patios and walkways', 'Retaining walls', 'Fire pit areas', 'Natural stone installation'],
    },
    {
      name: 'Fertilization & Weed Control',
      slug: 'fertilization',
      description: 'Customized treatment programs that feed your lawn and crowd out weeds.',
      includes: ['Soil testing', 'Seasonal fertilizer applications', 'Pre- and post-emergent weed control', 'Grub prevention'],
    },
    {
      name: 'Seasonal Cleanup',
      slug: 'seasonal-cleanup',
      description: 'Spring and fall cleanups that set your property up for the season ahead.',
      includes: ['Leaf removal and hauling', 'Bed cleanup and edging', 'Debris removal', 'Mulching'],
    },
    {
      name: 'Snow Removal',
      slug: 'snow-removal',
      description: 'Residential and commercial snow plowing and salting — including emergency response.',
      includes: ['Driveway and walk plowing', 'Salt / de-ice application', 'Commercial lot clearing', '24-hour emergency response'],
    },
  ],
  faq: [
    { question: 'Do you require contracts?', answer: 'No — all services are month-to-month. You can pause or cancel with one call.' },
    { question: 'How quickly can I get an estimate?', answer: 'We send a written estimate within 24 hours of your request.' },
    { question: 'Are you licensed and insured?', answer: 'Yes — Delaware licensed contractor, fully insured with $2M liability coverage.' },
    { question: 'What areas do you serve?', answer: 'We serve all of New Castle County including Newark, Wilmington, Bear, Middletown, and surrounding towns.' },
  ],
  testimonials: [
    {
      quote: "Same crew every week, they know exactly what my lawn needs. Haven't had to think about it in two years.",
      author: 'Karen B.',
      location: 'Newark, DE',
      rating: 5,
      service: 'Lawn Care',
    },
    {
      quote: 'Showed up on time for the estimate, stuck to the quote, and the patio came out exactly how we wanted.',
      author: 'Tom H.',
      location: 'Middletown, DE',
      rating: 5,
      service: 'Hardscaping',
    },
    {
      quote: 'The tree removal was fast, professional, and they cleaned up every branch. No mess left behind.',
      author: 'Sandra M.',
      location: 'Bear, DE',
      rating: 5,
      service: 'Tree Care',
    },
  ],
  pricingMentions: ['free estimates', 'no contracts', 'written quote'],
  emergencyMentions: ['emergency response', '24-hour emergency', 'storm cleanup'],
  serviceTowns: [
    'Newark', 'Wilmington', 'Bear', 'Middletown', 'Hockessin',
    'Pike Creek', 'Greenville', 'New Castle', 'Glasgow', 'Christiana',
  ],
};
