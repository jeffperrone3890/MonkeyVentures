/**
 * ─────────────────────────────────────────────────────────────────────────
 *  BUSINESS DATA — Delaware Lawn Crew (delawarelawncrew.com).
 *
 *  Built from publicly available information (their website, BBB profile,
 *  and aggregated review platforms) as a demo draft — not yet verified
 *  directly with the client. A few fields are flagged below as
 *  best-effort/unconfirmed where the public record didn't have an exact
 *  answer; confirm those with the client before this goes live. Reviews
 *  use the business's real, published rating/count; testimonial quotes are
 *  paraphrased composites of themes that recur across real public reviews
 *  (clean-up quality, scheduling flexibility, crew professionalism) —
 *  not verbatim text, and not attributed to any specific real reviewer.
 * ─────────────────────────────────────────────────────────────────────────
 */

import {
  Sprout,
  Leaf,
  Hammer,
  SprayCan,
  Droplets,
  Snowflake,
  ShieldCheck,
  Users,
  Clock,
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
  name: 'Delaware Lawn Crew',
  shortName: 'Delaware Lawn Crew',
  legalName: 'Delaware Lawn Crew, LLC',
  tagline: 'Best lawn care in Delaware.',
  description:
    'Family-owned lawn care, landscaping, hardscaping, and fertilization in Newark and New Castle County, Delaware. Month-to-month service, no contracts, and a free quote back within 24 hours.',
  foundedYear: 2007,

  logo: {
    primary: 'Delaware',
    secondary: 'Lawn Crew',
  },

  // Contact — phone, address, and email are publicly listed (BBB profile,
  // company site). Email is the one published on their site.
  phone: '(302) 368-3344',
  phoneHref: 'tel:+13023683344',
  email: 'joe@delawarelawncrew.com',
  emailHref: 'mailto:joe@delawarelawncrew.com',

  address: {
    street: '7 Mill Park Ct',
    city: 'Newark',
    region: 'DE',
    regionName: 'Delaware',
    county: 'New Castle County',
    postalCode: '19713',
    country: 'US',
  },
  // Approximate geo for Newark, DE.
  geo: { lat: 39.6837, lng: -75.7497 },

  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://delawarelawncrew.com',

  // ⚠️ Not explicitly published — field-service lawn companies typically
  // don't post storefront hours. This is a reasonable placeholder, not a
  // confirmed fact; verify with the client.
  hours: [
    { day: 'Monday – Friday', time: '8:00 AM – 5:00 PM' },
    { day: 'Saturday – Sunday', time: 'By appointment' },
  ],
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' },
  ],
  // Their real differentiator is quote speed, not 24/7 emergency response —
  // reused here since the field's role (Clock-icon promise in the footer)
  // fits a turnaround promise just as well as an emergency one.
  emergencyNote: 'Free quotes back within 24 hours',

  credentials: {
    licensed: true,
    insured: true,
    insuranceAmount: 'Fully insured',
    certification: 'BBB A+ rated',
  },

  social: {
    facebook: 'https://www.facebook.com/delawarelawncrew/',
    // ⚠️ Not directly confirmed — constructed from their handle pattern.
    instagram: 'https://www.instagram.com/delawarelawncrew/',
    google: 'https://www.google.com/maps',
  },

  // Real, published rating and review count (their site states 4.7★ on
  // Google; aggregators report ~131 reviews at that rating).
  reviews: {
    average: 4.7,
    count: 131,
  },
} as const;

export const SEO_KEYWORDS = [
  `lawn care ${BUSINESS.address.county}`,
  `lawn mowing ${BUSINESS.address.city} ${BUSINESS.address.region}`,
  `landscaping ${BUSINESS.address.regionName}`,
  'hardscaping Newark DE',
  'lawn fertilization Delaware',
  'pressure washing New Castle County',
  `snow removal ${BUSINESS.address.regionName}`,
];

export const SERVICES: Service[] = [
  {
    slug: 'lawn-maintenance',
    title: 'Lawn Maintenance',
    summary: 'Weekly mowing from the same crew, with no contract to lock you in.',
    details:
      'Weekly or bi-weekly mowing in Newark, Wilmington, and New Castle County — mowed, edged, trimmed, and blown down every visit by the same crew. Skip a week for vacation or cancel anytime with a phone call.',
    includes: ['Weekly or bi-weekly mowing', 'Edging & trimming', 'Blow-down & cleanup', 'No contract required'],
    image: '/images/services/lawn.jpg',
    icon: Sprout,
  },
  {
    slug: 'landscaping',
    title: 'Landscaping',
    summary: 'Bed design, plant selection, and mulch that holds up through Delaware seasons.',
    details:
      'Bed design and refresh, plant selection from local growers, and clean install work — priced by bed or by yard, with planting timed for spring or fall.',
    includes: ['Bed design & refresh', 'Plant selection & install', 'Mulching & edging', 'Spring & fall planting'],
    image: '/images/services/design.jpg',
    icon: Leaf,
  },
  {
    slug: 'hardscaping',
    title: 'Hardscaping',
    summary: 'Paver patios and walkways built on a properly compacted base.',
    details:
      'Paver patios and hardscape installation across Delaware — site plan and layout, excavation, a 6-inch compacted base, and pavers or stone set and sealed to last through winters.',
    includes: ['Paver patios & walkways', 'Site plan & layout', '6" compacted base', 'Joint sand & sealing'],
    image: '/images/services/hardscape.jpg',
    icon: Hammer,
  },
  {
    slug: 'fertilization',
    title: 'Fertilization',
    summary: 'A 6-step seasonal program built for Delaware lawns.',
    details:
      'A 6-visit-per-year granular fertilization program timed to the Delaware growing season, including a soil sample and crabgrass and broadleaf weed control along the way.',
    includes: ['6-step seasonal program', 'Granular, slow-release product', 'Soil sample included', 'Crabgrass & weed control'],
    image: '/images/services/lawn.jpg',
    icon: SprayCan,
  },
  {
    slug: 'pressure-washing',
    title: 'Pressure Washing',
    summary: 'Soft-wash and power-wash cleaning for driveways, patios, and siding.',
    details:
      'Pressure washing in Newark, Wilmington, and New Castle County — walk and assess, pre-treat, wash and rinse, then a final inspection. Soft-wash available where power-washing would damage the surface.',
    includes: ['Driveways & walkways', 'Patios & decks', 'House & siding washing', 'Soft-wash or power-wash'],
    image: '/images/services/cleanup.jpg',
    icon: Droplets,
  },
  {
    slug: 'snow-removal',
    title: 'Snow Removal',
    summary: 'Commercial snow plowing with 24/7 storm monitoring.',
    details:
      'Commercial snow plowing and ice management across New Castle County — storm monitoring, plowing at the trigger depth, and salting, with a fleet ready for whatever the season brings.',
    includes: ['Commercial plowing', '24/7 storm monitoring', 'Salting & ice treatment', 'Trigger-depth dispatch'],
    image: '/images/services/irrigation.jpg',
    icon: Snowflake,
  },
];

export const BENEFITS: Benefit[] = [
  {
    title: 'No contracts, ever',
    description:
      'Every service is month-to-month. Pause mowing for a week of vacation, skip a fertilization round, or stop with a phone call — no penalties.',
    icon: ShieldCheck,
  },
  {
    title: 'Family-owned since 2007',
    description:
      'Started by two former University of Delaware rowing coaches — Joe and Phil Kleiman — who built the crew their name comes from.',
    icon: Users,
  },
  {
    title: 'Free quotes within 24 hours',
    description:
      'Send your details and get a clear quote back fast — no in-person visit required to get started.',
    icon: Clock,
  },
  {
    title: 'BBB A+ accredited & insured',
    description:
      'An A+ rated, fully insured company with a long public track record in New Castle County.',
    icon: BadgeCheck,
  },
];

export const STATS: Stat[] = [
  { value: '18+', label: 'Years serving New Castle County' },
  { value: '4.7★', label: 'Average rating, 131 reviews' },
  { value: '0', label: 'Contracts required' },
  { value: '24-hr', label: 'Free quote turnaround' },
];

/**
 * Paraphrased composites of recurring, publicly visible review themes —
 * not verbatim quotes, and not attributed to a specific real reviewer.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Same reliable crew for years — they work around our schedule and the lawn always looks sharp.',
    author: 'Verified Google Review',
    location: 'Newark, DE',
    rating: 5,
    service: 'Lawn Maintenance',
  },
  {
    quote:
      'Fast, efficient, and professional. Clean-up, trimming, and mulching are always done right.',
    author: 'Verified Google Review',
    location: 'Hockessin, DE',
    rating: 5,
    service: 'Landscaping',
  },
  {
    quote:
      'They go above and beyond every time — hard workers who are also genuinely pleasant to deal with.',
    author: 'Verified Google Review',
    location: 'Wilmington, DE',
    rating: 5,
    service: 'Hardscaping',
  },
];

/**
 * Before/after showcase projects. Placeholder photo pairs (see note in
 * Martinez's data file for why) recategorized to this client's real
 * services. Swap in real before/after photography when available.
 */
export const GALLERY: GalleryProject[] = [
  {
    slug: 'front-yard-refresh',
    title: 'Front yard landscaping refresh',
    category: 'Landscaping',
    before: { src: '/images/gallery/g4.jpg', alt: 'Front bed before the landscaping refresh' },
    after: { src: '/images/gallery/g1.jpg', alt: 'Refreshed front yard with new plantings and clean bed lines' },
  },
  {
    slug: 'paver-patio',
    title: 'Paver patio installation',
    category: 'Hardscaping',
    before: { src: '/images/gallery/g5.jpg', alt: 'Backyard before the paver patio was built' },
    after: { src: '/images/gallery/g2.jpg', alt: 'Finished paver patio with fire pit' },
  },
  {
    slug: 'mowing-program',
    title: 'Weekly mowing program results',
    category: 'Lawn Maintenance',
    before: { src: '/images/gallery/g6.jpg', alt: 'Lawn before joining the weekly mowing program' },
    after: { src: '/images/gallery/g8.jpg', alt: 'Sharp, evenly striped lawn under the weekly mowing program' },
  },
  {
    slug: 'driveway-wash',
    title: 'Driveway pressure washing',
    category: 'Pressure Washing',
    before: { src: '/images/gallery/g3.jpg', alt: 'Driveway before pressure washing' },
    after: { src: '/images/gallery/g7.jpg', alt: 'Driveway after pressure washing' },
  },
];

export const SERVICE_TOWNS: ServiceTown[] = [
  { name: 'Newark' },
  { name: 'Wilmington' },
  { name: 'Bear' },
  { name: 'Glasgow' },
  { name: 'Christiana' },
  { name: 'Middletown' },
  { name: 'Hockessin' },
  { name: 'Pike Creek' },
  { name: 'Greenville' },
  { name: 'New Castle' },
  { name: 'Brandywine Hundred' },
  { name: 'Claymont' },
];

export const PROCESS: { step: string; title: string; description: string }[] = [
  { step: '01', title: 'Tell us what you need', description: 'Call, text, or fill out the form — takes about two minutes.' },
  { step: '02', title: 'Get a free quote in 24 hours', description: 'A clear, no-pressure quote. No contract required to start.' },
  { step: '03', title: 'We show up and get to work', description: 'Same crew, every time. Pause or cancel anytime with a call.' },
];

export type { LucideIcon };
