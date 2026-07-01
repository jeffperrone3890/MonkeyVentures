/**
 * ─────────────────────────────────────────────────────────────────────────
 *  BUSINESS DATA — single source of truth for everything specific to this
 *  client (Martinez Landscaping). One of several businesses in the
 *  Summit Studio template registry — see src/data/businesses/registry.ts
 *  for how the active business is selected.
 * ─────────────────────────────────────────────────────────────────────────
 *  ⚠️  PLACEHOLDER DATA. Replace every value below with the client's real,
 *      verified business information before launch. The phone number uses
 *      the 555-01xx range, which is reserved for fictional use. Testimonials
 *      and gallery captions are REPRESENTATIVE PLACEHOLDERS written to
 *      demonstrate layout and tone — replace with real, attributable
 *      reviews and project photos before launch. Do not publish fabricated
 *      reviews.
 *
 *  Consistency of Name / Address / Phone (NAP) across the site, Google
 *  Business Profile, and directories is critical for local SEO — change it
 *  here once and it propagates everywhere.
 */

import {
  Sprout,
  TreeDeciduous,
  Scissors,
  Hammer,
  Leaf,
  Droplets,
  ShieldCheck,
  Users,
  Clock,
  BadgeCheck,
  CalendarCheck,
  Star,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react';
import type {
  Benefit,
  BrandVoice,
  Business,
  BusinessStory,
  CTAStyle,
  EmergencyServiceConfig,
  FAQItem,
  FinancingConfig,
  GalleryProject,
  GuaranteeConfig,
  IdealCustomer,
  Objection,
  ProofPoint,
  ReviewHighlight,
  Service,
  ServiceTown,
  Stat,
  Testimonial,
} from '@/types';

export const BUSINESS = {
  name: 'Martinez Landscaping & Tree Services',
  shortName: 'Martinez Landscaping',
  legalName: 'Martinez Landscaping & Tree Services, LLC',
  tagline: 'Landscapes worth coming home to.',
  description:
    'Full-service landscaping and ISA-certified tree care in New Castle County, Delaware. Lawn maintenance, landscape design, tree removal, hardscaping, and 24/7 storm response. Free estimates within 24 hours.',
  foundedYear: 2009,

  // Wordmark text for the Logo component — the literal lines of the
  // two-line wordmark, since a logo's exact text is business-specific and
  // doesn't reliably derive from `name` for every business.
  logo: {
    primary: 'Martinez',
    secondary: 'Landscaping & Tree',
  },

  // Contact
  phone: '(302) 555-0147',
  phoneHref: 'tel:+13025550147',
  email: 'estimates@martinezlandscaping.com',
  emailHref: 'mailto:estimates@martinezlandscaping.com',

  // Location (use a real, verifiable address at launch)
  address: {
    street: '2400 Greenbank Road',
    city: 'Wilmington',
    region: 'DE',
    regionName: 'Delaware',
    county: 'New Castle County',
    postalCode: '19808',
    country: 'US',
  },
  // Approximate geo for the service-area center (Wilmington, DE).
  geo: { lat: 39.7459, lng: -75.6633 },

  // Canonical URL — overridden by NEXT_PUBLIC_SITE_URL at build time.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.martinezlandscaping.com',

  hours: [
    { day: 'Monday – Friday', time: '7:00 AM – 6:00 PM' },
    { day: 'Saturday', time: '8:00 AM – 2:00 PM' },
    { day: 'Sunday', time: 'Emergencies only' },
  ],
  // Structured (24h) equivalent of `hours` above, for JSON-LD. Kept
  // separate from the human-readable strings since schema.org needs exact
  // day names and HH:MM times, not "Monday – Friday" / "7:00 AM – 6:00 PM".
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '18:00' },
    { days: ['Saturday'], opens: '08:00', closes: '14:00' },
  ],
  // Used in JSON-LD (24/7 emergency line noted separately in copy).
  emergencyNote: '24/7 emergency storm & tree response',

  credentials: {
    licensed: true,
    insured: true,
    insuranceAmount: '$2M general liability',
    certification: 'ISA Certified Arborist on staff',
  },

  social: {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    google: 'https://www.google.com/maps',
  },

  // Used for the rating shown in the hero trust strip + testimonials JSON-LD.
  reviews: {
    average: 4.9,
    count: 187,
  },

  // ─── Engine Intelligence ────────────────────────────────────────────────

  brandVoice: {
    tone: 'Warm, professional, and straightforward. Family-owned confidence without corporate stiffness. No jargon, no pressure.',
    avoids: ['cheap', 'affordable', 'discount', 'ASAP', 'we are the best', 'one-stop-shop'],
  } satisfies BrandVoice,

  idealCustomer: {
    description: 'New Castle County homeowner who values a consistent, professional crew they can trust without having to babysit.',
    painPoints: [
      'Unreliable crews who show up with a different face every week',
      'Getting surprise fees after the job is done',
      'Having to chase contractors to get a response',
      'Tree work done by someone who isn\'t actually certified',
    ],
    desires: [
      'A crew they recognize who knows their property',
      'Clear pricing with no surprises on the invoice',
      'Work done right the first time without asking twice',
    ],
  } satisfies IdealCustomer,

  competitiveAdvantages: [
    'ISA Certified Arborist on staff for every tree decision',
    'Same crew assigned to your property — no subcontractors, no rotation',
    'Written estimates within 24 hours, no obligation',
    '24/7 storm and emergency response',
    '$2M general liability coverage on every job',
  ],

  proofPoints: [
    { icon: ShieldCheck, label: 'Licensed & Insured', detail: '$2M general liability' },
    { icon: CalendarCheck, label: 'Years in Business', detail: 'Serving New Castle County', computed: 'years-in-business' },
    { icon: Star, label: 'Rated', detail: 'Verified Google reviews', computed: 'google-rating' },
    { icon: ClipboardList, label: 'Free Estimates', detail: 'Written quote in 24 hours' },
    { icon: Users, label: 'Same Crew Every Visit', detail: 'No rotating subcontractors' },
  ] satisfies ProofPoint[],

  objections: [
    {
      concern: 'How do I know the same crew will actually show up every time?',
      response: 'It\'s built into how we operate. We don\'t use subcontractors or day-labor pools. The team assigned to your property is the team that shows up — every visit, every season.',
    },
    {
      concern: 'What if I\'m not happy with the work?',
      response: 'We stand behind everything we do with a 100% satisfaction guarantee. If something isn\'t right, call us. We\'ll come back and make it right at no charge.',
    },
    {
      concern: 'Are you qualified to handle large trees near my house?',
      response: 'Yes — we have an ISA Certified Arborist on staff. Every tree decision is made by a certified professional, not a guesser with a chainsaw.',
    },
  ] satisfies Objection[],

  urgency: {
    message: 'Spring season is filling up fast — book now to secure your start date.',
  },

  pricingStyle: 'quote-based' as const,

  ctaStyle: {
    primary: 'Get My Free Estimate',
    secondary: 'Call Now',
    form: 'Send my estimate request',
    micro: 'Free estimate · No obligation · Response within 24 hours',
  } satisfies CTAStyle,

  brandPersonality: {
    adjectives: ['reliable', 'professional', 'attentive', 'down-to-earth', 'thorough'],
    not: ['corporate', 'pushy', 'impersonal', 'flashy', 'sales-y'],
  },

  businessStory: {
    founding: 'Martinez Landscaping & Tree Services was founded in 2009 by a crew that believed great property care starts with a face you recognize and a name you can call. We\'ve grown slowly and deliberately — never taking on more clients than we can serve well.',
    mission: 'Full-service landscaping and tree care in New Castle County, Delaware. Family-owned since 2009.',
    differentiator: 'The same trusted crew — every visit, every job. No rotating subcontractors, no surprises on the invoice.',
    heroSubhead: 'The same trusted crew — every visit, every job. Free written estimates within 24 hours, no pressure, and no surprises on the invoice.',
  } satisfies BusinessStory,

  servicePriorities: [
    'lawn-care',
    'tree-services',
    'hardscaping',
    'landscape-design',
    'seasonal-cleanups',
    'irrigation-drainage',
  ],

  faq: [
    {
      question: 'How do I get a free estimate?',
      answer: 'Fill out our estimate form or call us directly at (302) 555-0147. We respond within 24 hours with a clear, written quote — no pressure, no obligation.',
    },
    {
      question: 'Will I get the same crew every visit?',
      answer: 'Yes. We believe consistency produces better results and better relationships. The team assigned to your property is the team that shows up, every time.',
    },
    {
      question: 'What areas do you serve?',
      answer: 'We serve Wilmington, Newark, Middletown, Bear, Hockessin, Pike Creek, Greenville, New Castle, and surrounding communities throughout New Castle County.',
    },
    {
      question: 'Do you handle emergencies?',
      answer: 'Yes — storm damage and emergency tree situations are available 24/7. Call our main number any time and we\'ll respond.',
    },
    {
      question: 'Are you licensed and insured?',
      answer: 'Yes. We are fully licensed in Delaware and carry $2M in general liability insurance. We also have an ISA Certified Arborist on staff for all tree work.',
    },
  ] satisfies FAQItem[],

  guarantee: {
    headline: '100% Satisfaction Guarantee',
    description: 'If you\'re not completely satisfied with our work, we\'ll come back and make it right — at no charge. No questions, no hassle.',
  } satisfies GuaranteeConfig,

  financing: null satisfies FinancingConfig | null,

  emergencyService: {
    description: '24/7 emergency storm cleanup & tree response',
    phone: '(302) 555-0147',
    responseTime: '2 hours',
  } satisfies EmergencyServiceConfig,

  reviewHighlights: [
    { quote: 'Same two-person crew every week for three years. The lawn has never looked better.', author: 'Priya S.', platform: 'google' },
    { quote: 'A storm dropped a huge limb across our driveway overnight. I called at 6 AM and they had it cleared before I left for work.', author: 'Marcus T.', platform: 'google' },
    { quote: 'Our paver patio came out better than the design renderings. Two winters in and it has not shifted a millimeter.', author: 'Greg & Anita R.', platform: 'google' },
  ] satisfies ReviewHighlight[],
} as const satisfies Business;

/** SEO keyword targets — used in <head> metadata. Business- and location-specific. */
export const SEO_KEYWORDS = [
  `landscaping ${BUSINESS.address.county}`,
  `tree removal ${BUSINESS.address.city} ${BUSINESS.address.region}`,
  `lawn care ${BUSINESS.address.regionName}`,
  'landscape design Newark DE',
  'tree trimming',
  'hardscaping patios',
  `emergency tree service ${BUSINESS.address.regionName}`,
];

export const SERVICES: Service[] = [
  {
    slug: 'lawn-care',
    title: 'Lawn Care & Maintenance',
    displayTitle: 'A Sharp, Healthy Lawn Year-Round',
    summary: 'A sharp, healthy lawn on a schedule you never have to think about.',
    details:
      'Weekly or bi-weekly visits from the same crew, every time. We mow, edge, trim, and blow down, then handle the agronomy that keeps turf thick — fertilization, aeration, overseeding, and weed control timed to the season.',
    includes: ['Mowing, edging & trimming', 'Fertilization & weed control', 'Core aeration & overseeding', 'Spring & fall cleanups'],
    image: '/images/services/lawn.jpg',
    icon: Sprout,
  },
  {
    slug: 'landscape-design',
    title: 'Landscape Design & Installation',
    displayTitle: 'Plantings That Fill In Beautifully',
    summary: 'Plantings and beds designed for your light, soil, and how you live outside.',
    details:
      'We design with plants that thrive in Delaware conditions and look right in every season, then install them properly — amended soil, clean bed lines, and mulch that lasts. You get a yard that fills in beautifully instead of fighting to survive.',
    includes: ['Planting plans & plant selection', 'Bed design & edging', 'Soil prep & mulching', 'Sod & seed installation'],
    image: '/images/services/design.jpg',
    icon: Leaf,
  },
  {
    slug: 'tree-services',
    title: 'Tree Trimming & Removal',
    displayTitle: 'Expert Tree Work, Cleaned Up Like We Were Never There',
    summary: 'Skilled, careful tree work — with an ISA Certified Arborist on the crew.',
    details:
      'From structural pruning that keeps a tree healthy to full removals in tight spaces, we work to industry safety standards and clean up like we were never there. Stump grinding and storm-damage response included.',
    includes: ['Pruning & crown reduction', 'Hazardous & large-tree removal', 'Stump grinding', '24/7 storm & emergency response'],
    image: '/images/services/tree.jpg',
    icon: TreeDeciduous,
  },
  {
    slug: 'hardscaping',
    title: 'Patios & Hardscaping',
    displayTitle: 'Outdoor Spaces Built to Last Decades',
    summary: 'Paver patios, walkways, and walls built on a base that holds for decades.',
    details:
      'The difference between hardscaping that lasts and hardscaping that heaves is what you cannot see — the base. We excavate, compact, and build to spec, so your patio, walkway, or retaining wall stays level through Delaware winters.',
    includes: ['Paver patios & walkways', 'Retaining & seat walls', 'Fire pits & outdoor living', 'Drainage-aware grading'],
    image: '/images/services/hardscape.jpg',
    icon: Hammer,
  },
  {
    slug: 'seasonal-cleanups',
    title: 'Seasonal Cleanups',
    displayTitle: 'A Show-Ready Property at the Turn of Every Season',
    summary: 'Spring resets and fall leaf removal that get your property show-ready.',
    details:
      'We clear leaves and debris, cut back perennials, refresh bed edges and mulch, and haul everything away. One call resets the whole property at the turn of each season.',
    includes: ['Leaf removal & hauling', 'Bed cutbacks & refresh', 'Gutter-line clearing', 'Debris removal'],
    image: '/images/services/cleanup.jpg',
    icon: Scissors,
  },
  {
    slug: 'irrigation-drainage',
    title: 'Irrigation & Drainage',
    displayTitle: 'Dry Foundations, Thriving Lawns',
    summary: 'Get water where it helps — and away from where it does damage.',
    details:
      'Soggy low spots and dry patches are both water problems. We install and tune irrigation, then solve drainage with French drains, dry wells, and grading so your landscape — and your foundation — stay dry.',
    includes: ['Irrigation install & repair', 'French drains & dry wells', 'Downspout & surface drainage', 'Seasonal system startup & winterizing'],
    image: '/images/services/irrigation.jpg',
    icon: Droplets,
  },
];

export const BENEFITS: Benefit[] = [
  {
    title: 'Licensed & insured',
    description:
      'Fully licensed in Delaware and carrying $2M in general liability. Every job is covered — your property, your crew, your peace of mind.',
    icon: ShieldCheck,
  },
  {
    title: 'The same crew, every visit',
    description:
      'No rotating subcontractors, no surprises. The same team learns your property, your preferences, and your schedule — and shows up like clockwork.',
    icon: Users,
  },
  {
    title: 'Free estimates within 24 hours',
    description:
      'Send us your details and we respond fast with a clear, written estimate — no pressure, no hidden fees, no obligation. What you see is what you pay.',
    icon: Clock,
  },
  {
    title: 'ISA Certified Arborist on staff',
    description:
      'Every tree decision — removal, pruning, or hazard assessment — is made by a certified arborist. Not a guesser with a chainsaw. A professional with credentials.',
    icon: BadgeCheck,
  },
];

export const STATS: Stat[] = [
  { value: '15+', label: 'Years in New Castle County' },
  { value: '2,000+', label: 'Properties cared for' },
  { value: '4.9★', label: 'Average Google rating' },
  { value: '24/7', label: 'Emergency storm response' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'They redesigned our entire front yard and it transformed the house. Every plant they chose has thrived, and the crew treated our property like their own.',
    author: 'Karen D.',
    location: 'Hockessin, DE',
    rating: 5,
    service: 'Landscape Design',
  },
  {
    quote:
      'A storm dropped a huge limb across our driveway overnight. I called at 6 AM and they had it cleared safely before I left for work. Genuinely impressive.',
    author: 'Marcus T.',
    location: 'Newark, DE',
    rating: 5,
    service: 'Emergency Tree Removal',
  },
  {
    quote:
      'Same two-person crew every week for three years. The lawn has never looked better and the billing is exactly what they quoted. That kind of consistency is rare.',
    author: 'Priya S.',
    location: 'Middletown, DE',
    rating: 5,
    service: 'Lawn Maintenance',
  },
  {
    quote:
      'Our paver patio came out better than the design renderings. Two winters in and it has not shifted a millimeter. Worth every penny.',
    author: 'Greg & Anita R.',
    location: 'Wilmington, DE',
    rating: 5,
    service: 'Hardscaping',
  },
  {
    quote:
      'They diagnosed a drainage problem two other companies missed, fixed it, and finally ended the swamp in our backyard. Professional from the estimate on.',
    author: 'Dana W.',
    location: 'Bear, DE',
    rating: 5,
    service: 'Drainage',
  },
  {
    quote:
      'Honest, on time, and they clean up so well you would not know a crew had been there. We have recommended them to half the neighborhood.',
    author: 'Tom L.',
    location: 'Pike Creek, DE',
    rating: 5,
    service: 'Full Maintenance',
  },
];

/**
 * Before/after showcase projects. Each entry needs a real `before` and
 * `after` photo of the *same* property — until that photography exists,
 * these pair up two of the existing single gallery shots per project so the
 * slider has something real to compare. Replace `before`/`after` with the
 * client's actual paired photography when it's available; nothing else
 * about this data shape, or the component that renders it, needs to change.
 */
export const GALLERY: GalleryProject[] = [
  {
    slug: 'front-yard-design',
    title: 'Front yard renovation',
    description: 'Native plantings, fresh mulch beds, and custom bed edging — designed to look right year-round.',
    category: 'Design',
    before: { src: '/images/gallery/g4.jpg', alt: 'Front yard before the renovation — overgrown beds and uneven edging' },
    after: { src: '/images/gallery/g1.jpg', alt: 'Renovated front yard with fresh plantings, clean bed lines, and new mulch' },
  },
  {
    slug: 'paver-patio',
    title: 'Paver patio & fire pit',
    description: 'Excavated, compacted base, and professionally laid pavers built to stay level through Delaware winters.',
    category: 'Hardscaping',
    before: { src: '/images/gallery/g5.jpg', alt: 'Backyard before the patio — bare ground with no usable outdoor space' },
    after: { src: '/images/gallery/g2.jpg', alt: 'Finished paver patio with built-in fire pit and outdoor living space' },
  },
  {
    slug: 'oak-removal',
    title: 'Mature oak removal',
    description: 'Hazardous large-tree removal in a tight residential space — complete cleanup included, stump ground to grade.',
    category: 'Tree Work',
    before: { src: '/images/gallery/g3.jpg', alt: 'Mature oak with structural damage posing a hazard near the house' },
    after: { src: '/images/gallery/g7.jpg', alt: 'Cleared site after oak removal — stump ground, debris hauled, area ready to restore' },
  },
  {
    slug: 'lawn-renewal',
    title: 'Full property lawn renewal',
    description: 'Soil prep, grading, and fresh sod installation — a property that was patchy and thin, restored to a dense, even lawn.',
    category: 'Lawn Care',
    before: { src: '/images/gallery/g6.jpg', alt: 'Patchy, thin lawn with bare spots and uneven growth' },
    after: { src: '/images/gallery/g8.jpg', alt: 'Freshly installed sod — thick, even coverage across the full property' },
  },
];

export const SERVICE_TOWNS: ServiceTown[] = [
  { name: 'Wilmington' },
  { name: 'Newark' },
  { name: 'Middletown' },
  { name: 'Bear' },
  { name: 'Hockessin' },
  { name: 'Pike Creek' },
  { name: 'Greenville' },
  { name: 'New Castle' },
  { name: 'Glasgow' },
  { name: 'Christiana' },
  { name: 'Claymont' },
  { name: 'Townsend' },
];

/** Process steps for the "how it works" strip in the CTA / contact area. */
export const PROCESS: { step: string; title: string; description: string }[] = [
  { step: '01', title: 'Tell us about it', description: 'Send your details and a photo or two. Takes two minutes.' },
  { step: '02', title: 'Get a written estimate', description: 'A clear, itemized quote within 24 hours — no pressure, no surprises.' },
  { step: '03', title: 'We get to work', description: 'Your scheduled crew shows up on time and leaves the place spotless.' },
];

export type { LucideIcon };
