/**
 * Engine helpers — pure functions that derive display-ready values from a
 * Business object. No component should manually compute messaging anymore;
 * it calls the appropriate helper and renders what it receives.
 *
 * All functions accept a business object so they work with any tenant in the
 * registry, not just the currently-active one.
 */

import type {
  Business,
  CTAStyle,
  FAQItem,
  Objection,
  ProofPoint,
  ReviewHighlight,
  Service,
} from '@/types';

// ─── Time ────────────────────────────────────────────────────────────────────

export function getYearsInBusiness(business: Pick<Business, 'foundedYear'>): number {
  return new Date().getFullYear() - business.foundedYear;
}

// ─── Proof points ────────────────────────────────────────────────────────────

/**
 * Resolves the proof points array, replacing `computed` sentinels with live
 * values so ProofBar never renders stale copy.
 */
export function resolveProofPoints(
  business: Pick<Business, 'foundedYear' | 'reviews' | 'proofPoints'>,
): Array<Omit<ProofPoint, 'computed'>> {
  const years = getYearsInBusiness(business);
  return [...business.proofPoints].map((pp) => {
    const { computed, ...rest } = pp;
    if (computed === 'years-in-business') {
      return { ...rest, label: `${years}+ Years` };
    }
    if (computed === 'google-rating') {
      return {
        ...rest,
        label: `${business.reviews.average}★ Rated`,
        detail: `${business.reviews.count} verified reviews`,
      };
    }
    return rest;
  });
}

// ─── CTAs ────────────────────────────────────────────────────────────────────

export function getPrimaryCTA(business: Pick<Business, 'ctaStyle'>): CTAStyle {
  return business.ctaStyle;
}

// ─── Messaging ───────────────────────────────────────────────────────────────

export function getHeroSubhead(business: Pick<Business, 'businessStory'>): string {
  return business.businessStory.heroSubhead;
}

export function getFooterMission(business: Pick<Business, 'businessStory'>): string {
  return business.businessStory.mission;
}

// ─── Services ────────────────────────────────────────────────────────────────

/**
 * Returns the service list sorted by `servicePriorities`. Services not in the
 * priority list appear after the ordered ones, in their original order.
 */
export function getPriorityServices(
  business: Pick<Business, 'servicePriorities'>,
  services: Service[],
): Service[] {
  const { servicePriorities } = business;
  if (!servicePriorities.length) return services;
  const prioritized = [...servicePriorities]
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is Service => s !== undefined);
  const rest = services.filter((s) => !servicePriorities.includes(s.slug));
  return [...prioritized, ...rest];
}

// ─── Objections ──────────────────────────────────────────────────────────────

export function getObjectionHandling(
  business: Pick<Business, 'objections'>,
): ReadonlyArray<Objection> {
  return business.objections;
}

// ─── Optional features ───────────────────────────────────────────────────────

export function hasFAQ(business: Pick<Business, 'faq'>): boolean {
  return business.faq.length > 0;
}

export function getFAQ(business: Pick<Business, 'faq'>): ReadonlyArray<FAQItem> {
  return business.faq;
}

export function hasGuarantee(
  business: Pick<Business, 'guarantee'>,
): business is Pick<Business, 'guarantee'> & { guarantee: NonNullable<Business['guarantee']> } {
  return business.guarantee !== null;
}

export function hasFinancing(
  business: Pick<Business, 'financing'>,
): business is Pick<Business, 'financing'> & { financing: NonNullable<Business['financing']> } {
  return business.financing !== null;
}

export function hasEmergencyService(
  business: Pick<Business, 'emergencyService'>,
): business is Pick<Business, 'emergencyService'> & {
  emergencyService: NonNullable<Business['emergencyService']>;
} {
  return business.emergencyService !== null;
}

export function getReviewHighlights(
  business: Pick<Business, 'reviewHighlights'>,
): ReadonlyArray<ReviewHighlight> {
  return business.reviewHighlights;
}
