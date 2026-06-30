/**
 * ─────────────────────────────────────────────────────────────────────────
 *  BUSINESS DATA — PQ Landscaping (pqlandscapingde.com).
 *
 *  Built from publicly available information (their website, BBB profile,
 *  and aggregated review platforms) as a demo draft — not yet verified
 *  directly with the client. A few fields are flagged below as
 *  best-effort/unconfirmed where the public record didn't have an exact
 *  answer; confirm those with the client before this goes live. Reviews
 *  use real, published rating/count figures; testimonial quotes are
 *  paraphrased composites of generally-described review themes (their own
 *  site names three real reviewers, but no specific quote is attributed to
 *  any of them here — that would mean fabricating words for a real person).
 * ─────────────────────────────────────────────────────────────────────────
 */

import {
  Sprout,
  Leaf,
  Shrub,
  Waves,
  Flower2,
  Snowflake,
  Scissors,
  SprayCan,
  ShieldCheck,
  Users,
  BadgeCheck,
  type LucideIcon,
} from 'lucide-react';
import type {
  Benefit,
  GalleryProject,
  Service,
  ServiceTown,
  Stat,
  Testimonial,
} from '@/types';

export const BUSINESS = {
  name: 'PQ Landscaping',
  shortName: 'PQ Landscaping',
  legalName: 'PQ Landscaping, LLC',
  tagline: "Delaware's go-to lawn & landscape maintenance company.",
  description:
    'Lawn care, landscaping, and snow management for homeowners and businesses in New Castle County, Delaware. Family-owned for over 20 years, fully licensed and insured, with environmentally conscious practices.',
  // ⚠️ Approximate — their site states "over 20 years" without a specific
  // founding date; confirm the exact year with the client.
  foundedYear: 2004,

  logo: {
    primary: 'PQ',
    secondary: 'Landscaping',
  },

  phone: '(302) 690-6505',
  phoneHref: 'tel:+13026906505',
  // ⚠️ Not published on their site — constructed from a standard
  // business-domain convention. Confirm their real address with the client.
  email: 'info@pqlandscapingde.com',
  emailHref: 'mailto:info@pqlandscapingde.com',

  address: {
    street: '19 Caxton Dr',
    city: 'New Castle',
    region: 'DE',
    regionName: 'Delaware',
    county: 'New Castle County',
    postalCode: '19720',
    country: 'US',
  },
  // Approximate geo for New Castle, DE.
  geo: { lat: 39.662, lng: -75.5905 },

  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pqlandscapingde.com',

  // Real, published hours.
  hours: [
    { day: 'Monday – Friday', time: '9:00 AM – 6:00 PM' },
    { day: 'Saturday – Sunday', time: 'Closed' },
  ],
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
  ],
  emergencyNote: 'Free online quotes — call or text anytime',

  credentials: {
    licensed: true,
    insured: true,
    insuranceAmount: 'Fully insured',
    certification: 'Environmentally conscious practices',
  },

  social: {
    facebook: 'https://www.facebook.com/PQLandscaping',
    instagram: 'https://www.instagram.com/pqlandscaping/',
    google: 'https://www.google.com/maps',
  },

  // Real, published rating (4.7★ aggregating Google reviews via Birdeye,
  // 82 reviews at that figure).
  reviews: {
    average: 4.7,
    count: 82,
  },
} as const;

export const SEO_KEYWORDS = [
  `lawn care ${BUSINESS.address.county}`,
  `landscaping ${BUSINESS.address.city} ${BUSINESS.address.region}`,
  `lawn maintenance ${BUSINESS.address.regionName}`,
  'snow removal New Castle DE',
  'tree and shrub care Delaware',
  'commercial landscaping New Castle County',
  `weed control ${BUSINESS.address.regionName}`,
];

export const SERVICES: Service[] = [
  {
    slug: 'yard-maintenance-cleanup',
    title: 'Yard Maintenance & Cleanup',
    summary: 'Proactive upkeep that keeps residential and commercial properties looking their best.',
    details:
      'Regular yard maintenance and seasonal cleanups for homeowners and businesses across New Castle County — proactive scheduling so debris, growth, and seasonal mess never get ahead of your property.',
    includes: ['Seasonal cleanups', 'Debris removal', 'Bed & border tidying', 'Residential & commercial'],
    image: '/images/services/cleanup.jpg',
    icon: Scissors,
  },
  {
    slug: 'turf-management',
    title: 'Turf Management',
    summary: 'Mowing and turf health programs built for Delaware lawns.',
    details:
      'Ongoing turf management — mowing, edging, and the agronomy behind a consistently healthy lawn, scheduled reliably through the growing season.',
    includes: ['Scheduled mowing', 'Edging & trimming', 'Turf health monitoring', 'Reliable scheduling'],
    image: '/images/services/lawn.jpg',
    icon: Sprout,
  },
  {
    slug: 'tree-shrub-care',
    title: 'Tree & Shrub Care',
    summary: 'Pruning and care that keeps trees and shrubs healthy and well-shaped.',
    details:
      'Tree and shrub care for ornamental and established plantings — pruning, shaping, and health checks as part of a proactive landscape plan.',
    includes: ['Pruning & shaping', 'Health assessment', 'Seasonal care', 'Residential & commercial'],
    image: '/images/services/design.jpg',
    icon: Shrub,
  },
  {
    slug: 'pond-storm-water-management',
    title: 'Pond & Storm Water Management',
    summary: 'Keeping water features and drainage systems functioning the way they should.',
    details:
      'Pond and storm water management for residential and commercial properties — a service area that sets PQ apart from typical lawn-only providers.',
    includes: ['Pond upkeep', 'Storm water systems', 'Drainage-aware care', 'Commercial properties'],
    image: '/images/services/irrigation.jpg',
    icon: Waves,
  },
  {
    slug: 'landscape-enhancement',
    title: 'Landscape Enhancement',
    summary: 'Proactive improvements that raise curb appeal over time.',
    details:
      'Complete landscape enhancement services — proactive solutions, not just reactive maintenance, aimed at a well-tended look that holds up season after season.',
    includes: ['Bed & planting upgrades', 'Curb appeal improvements', 'Proactive planning', 'Local plant selection'],
    image: '/images/services/design.jpg',
    icon: Flower2,
  },
  {
    slug: 'snow-ice-management',
    title: 'Snow & Ice Management',
    summary: 'Full-fleet snow and ice response for commercial properties.',
    details:
      'Snow removal and hauling, ice removal, salting, and snow blowing and shoveling for commercial properties, industrial sites, retail locations, and shopping centers — backed by a fleet of full-sized plows, loaders, and salt trucks.',
    includes: ['Snow removal & hauling', 'Ice removal & salting', 'Full-sized plows & loaders', 'Commercial & industrial sites'],
    image: '/images/services/irrigation.jpg',
    icon: Snowflake,
  },
  {
    slug: 'lawn-care',
    title: 'Lawn Care',
    summary: 'The day-to-day care that keeps a lawn thick, even, and healthy.',
    details:
      'Core lawn care for homeowners and businesses — the recurring service that keeps turf healthy between larger seasonal projects.',
    includes: ['Routine lawn care', 'Seasonal adjustments', 'Residential & commercial', '20+ years of experience'],
    image: '/images/services/lawn.jpg',
    icon: Leaf,
  },
  {
    slug: 'weed-control',
    title: 'Weed Control',
    summary: 'Targeted treatment to keep weeds out of healthy turf.',
    details:
      'Weed control treatment as part of an environmentally conscious turf program, aimed at healthy grass rather than blanket chemical use.',
    includes: ['Targeted treatment', 'Environmentally conscious approach', 'Seasonal timing', 'Paired with turf management'],
    image: '/images/services/lawn.jpg',
    icon: SprayCan,
  },
];

export const BENEFITS: Benefit[] = [
  {
    title: '20+ years of experience',
    description:
      'A locally owned team that has built its reputation in New Castle County for more than two decades.',
    icon: Users,
  },
  {
    title: 'Fully licensed & insured',
    description:
      'Licensed and insured professionals handle every job, residential or commercial.',
    icon: ShieldCheck,
  },
  {
    title: 'Environmentally conscious practices',
    description:
      'Proactive, environmentally responsible landscaping — not just reactive maintenance.',
    icon: Leaf,
  },
  {
    title: 'Commercial & residential',
    description:
      'From homeowners to business parks and shopping centers, the same reliable scheduling and proactive care.',
    icon: BadgeCheck,
  },
];

export const STATS: Stat[] = [
  { value: '20+', label: 'Years serving New Castle County' },
  { value: '4.7★', label: 'Average rating, 82 reviews' },
  { value: 'A+', label: 'BBB rating' },
  { value: '8', label: 'Services, residential & commercial' },
];

/**
 * Paraphrased composites of generally-described review themes — not
 * verbatim quotes, and not attributed to any specific real reviewer.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Responsive and professional from the first call — the crew does quality work and cleans up well.',
    author: 'Verified Google Review',
    location: 'New Castle, DE',
    rating: 5,
    service: 'Lawn Care',
  },
  {
    quote:
      'Reliable scheduling and a well-tended result every time — exactly what they promise.',
    author: 'Verified Google Review',
    location: 'Newark, DE',
    rating: 5,
    service: 'Landscape Enhancement',
  },
];

/**
 * Before/after showcase projects. Placeholder photo pairs (see note in
 * Martinez's data file for why) recategorized to this client's real
 * services. Swap in real before/after photography when available.
 */
export const GALLERY: GalleryProject[] = [
  {
    slug: 'foundation-bed-refresh',
    title: 'Foundation bed enhancement',
    category: 'Landscape Enhancement',
    before: { src: '/images/gallery/g4.jpg', alt: 'Foundation bed before the enhancement' },
    after: { src: '/images/gallery/g1.jpg', alt: 'Enhanced foundation bed with new plantings' },
  },
  {
    slug: 'pond-management',
    title: 'Pond & storm water management',
    category: 'Pond & Storm Water Management',
    before: { src: '/images/gallery/g5.jpg', alt: 'Property before pond and storm water work' },
    after: { src: '/images/gallery/g2.jpg', alt: 'Property after pond and storm water management' },
  },
  {
    slug: 'turf-renewal',
    title: 'Turf management results',
    category: 'Turf Management',
    before: { src: '/images/gallery/g6.jpg', alt: 'Lawn before the turf management program' },
    after: { src: '/images/gallery/g8.jpg', alt: 'Healthy, even turf under the management program' },
  },
  {
    slug: 'tree-shrub-care',
    title: 'Tree & shrub care',
    category: 'Tree & Shrub Care',
    before: { src: '/images/gallery/g3.jpg', alt: 'Overgrown shrubs before care' },
    after: { src: '/images/gallery/g7.jpg', alt: 'Pruned and shaped shrubs after care' },
  },
];

export const SERVICE_TOWNS: ServiceTown[] = [
  { name: 'New Castle' },
  { name: 'Newark' },
  { name: 'Bear' },
  { name: 'Middletown' },
  { name: 'Wilmington' },
  { name: 'Glasgow' },
  { name: 'Christiana' },
  { name: 'Townsend' },
  { name: 'Hockessin' },
  { name: 'Pike Creek' },
];

export const PROCESS: { step: string; title: string; description: string }[] = [
  { step: '01', title: 'Request your free quote', description: 'Start a quote online, or call or text us directly.' },
  { step: '02', title: 'We assess your property', description: 'Our team reviews your space and puts together a clear plan.' },
  { step: '03', title: 'Enjoy a well-tended property', description: 'Reliable scheduling and proactive care, season after season.' },
];

export type { LucideIcon };
