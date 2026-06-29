/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION — single source of truth for business details (NAP).
 * ─────────────────────────────────────────────────────────────────────────
 *  ⚠️  PLACEHOLDER DATA. Replace every value below with the client's real,
 *      verified business information before launch. The phone number uses the
 *      555-01xx range, which is reserved for fictional use.
 *
 *  Consistency of Name / Address / Phone (NAP) across the site, Google
 *  Business Profile, and directories is critical for local SEO — change it
 *  here once and it propagates everywhere.
 */

export const SITE = {
  name: 'Martinez Landscaping & Tree Services',
  shortName: 'Martinez Landscaping',
  legalName: 'Martinez Landscaping & Tree Services, LLC',
  tagline: 'Landscapes worth coming home to.',
  description:
    'Full-service landscaping and ISA-certified tree care in New Castle County, Delaware. Lawn maintenance, landscape design, tree removal, hardscaping, and 24/7 storm response. Free estimates within 24 hours.',
  foundedYear: 2009,

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
} as const;

export const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Why us', href: '#why-us' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Service area', href: '#service-area' },
] as const;
