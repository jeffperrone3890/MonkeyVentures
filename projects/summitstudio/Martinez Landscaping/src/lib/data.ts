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
  type LucideIcon,
} from 'lucide-react';
import type {
  Benefit,
  GalleryItem,
  Service,
  ServiceTown,
  Stat,
  Testimonial,
} from '@/types';

/**
 * ⚠️  Testimonials and gallery captions below are REPRESENTATIVE PLACEHOLDERS
 *     written to demonstrate layout and tone. Replace with the client's real,
 *     attributable reviews and project photos before launch. Do not publish
 *     fabricated reviews.
 */

export const SERVICES: Service[] = [
  {
    slug: 'lawn-care',
    title: 'Lawn Care & Maintenance',
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
      'Fully licensed in Delaware and carrying $2M in general liability. The work — and your property — are covered.',
    icon: ShieldCheck,
  },
  {
    title: 'The same crew, every visit',
    description:
      'No rotating subcontractors. You get a consistent team that learns your property and shows up when we say we will.',
    icon: Users,
  },
  {
    title: 'Estimates within 24 hours',
    description:
      'Send us your details and we respond fast with a clear, written, no-pressure estimate. No surprises on the invoice.',
    icon: Clock,
  },
  {
    title: 'Certified arborist on staff',
    description:
      'Tree work is judgment work. An ISA Certified Arborist guides every removal and prune for the health of the tree and the safety of your home.',
    icon: BadgeCheck,
  },
];

export const STATS: Stat[] = [
  { value: '15+', label: 'Years serving New Castle County' },
  { value: '2,000+', label: 'Properties cared for' },
  { value: '4.9★', label: 'Average rating, 187 reviews' },
  { value: '24/7', label: 'Storm & emergency response' },
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

export const GALLERY: GalleryItem[] = [
  { src: '/images/gallery/g1.jpg', alt: 'Renovated front yard with fresh plantings and clean bed lines', caption: 'Front yard renovation', category: 'Design', tall: true },
  { src: '/images/gallery/g2.jpg', alt: 'Paver patio with built-in fire pit', caption: 'Paver patio & fire pit', category: 'Hardscaping' },
  { src: '/images/gallery/g3.jpg', alt: 'Crew safely removing a mature oak near a house', caption: 'Mature oak removal', category: 'Tree Work' },
  { src: '/images/gallery/g4.jpg', alt: 'Redesigned garden bed with layered perennials', caption: 'Garden bed redesign', category: 'Design', tall: true },
  { src: '/images/gallery/g5.jpg', alt: 'Stone retaining wall holding a graded slope', caption: 'Retaining wall build', category: 'Hardscaping' },
  { src: '/images/gallery/g6.jpg', alt: 'Manicured full property at golden hour', caption: 'Full property maintenance', category: 'Maintenance', tall: true },
  { src: '/images/gallery/g7.jpg', alt: 'Stump grinder removing a tree stump', caption: 'Stump grinding', category: 'Tree Work' },
  { src: '/images/gallery/g8.jpg', alt: 'Freshly installed sod lawn', caption: 'New sod installation', category: 'Lawn Care' },
];

export const GALLERY_CATEGORIES = ['All', 'Design', 'Hardscaping', 'Tree Work', 'Maintenance', 'Lawn Care'] as const;

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
