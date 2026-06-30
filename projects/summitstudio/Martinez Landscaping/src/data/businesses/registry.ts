/**
 * ─────────────────────────────────────────────────────────────────────────
 *  BUSINESS REGISTRY — the template system's tenant list.
 *
 *  Every client this codebase has ever been pointed at lives here as one
 *  entry: a slug, plus that business's `business.ts` (content/facts) and
 *  `theme.ts` (brand identity). src/data/business.ts and src/data/theme.ts
 *  read NEXT_PUBLIC_ACTIVE_BUSINESS and re-export whichever entry matches —
 *  that's the only place "which business is live" is decided, and it's the
 *  only reason this file exists.
 *
 *  To add a new business:
 *    1. Copy an existing folder under src/data/businesses/<new-slug>/
 *       (business.ts + theme.ts) and edit the values.
 *    2. Import it below and add one line to BUSINESS_REGISTRY.
 *    3. Set NEXT_PUBLIC_ACTIVE_BUSINESS=<new-slug> to preview it.
 *  Nothing else in the app changes — every component reads from
 *  '@/data/business' and '@/data/theme', never from a specific business
 *  folder directly.
 * ─────────────────────────────────────────────────────────────────────────
 */

import * as martinezLandscapingBusiness from './martinez-landscaping/business';
import * as martinezLandscapingTheme from './martinez-landscaping/theme';
import * as delawareLawnCrewBusiness from './delaware-lawn-crew/business';
import * as delawareLawnCrewTheme from './delaware-lawn-crew/theme';
import * as pqLandscapingBusiness from './pq-landscaping/business';
import * as pqLandscapingTheme from './pq-landscaping/theme';

export const BUSINESS_REGISTRY = {
  'martinez-landscaping': { business: martinezLandscapingBusiness, theme: martinezLandscapingTheme },
  'delaware-lawn-crew': { business: delawareLawnCrewBusiness, theme: delawareLawnCrewTheme },
  'pq-landscaping': { business: pqLandscapingBusiness, theme: pqLandscapingTheme },
} as const;

export type BusinessSlug = keyof typeof BUSINESS_REGISTRY;

export const DEFAULT_BUSINESS_SLUG: BusinessSlug = 'martinez-landscaping';

/** Reads NEXT_PUBLIC_ACTIVE_BUSINESS, falling back to the default tenant if unset or unrecognized. */
export function getActiveBusinessSlug(): BusinessSlug {
  const raw = process.env.NEXT_PUBLIC_ACTIVE_BUSINESS;
  if (raw && raw in BUSINESS_REGISTRY) return raw as BusinessSlug;
  return DEFAULT_BUSINESS_SLUG;
}
