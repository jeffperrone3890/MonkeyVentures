# Business Data Schema

Every field that drives the website lives in one file:
`src/data/businesses/<slug>/business.ts`

Change a value here → it propagates everywhere: the page, the footer, the contact form, the JSON-LD schema, every SEO page. You never touch a React component.

---

## Identity

| Field | Type | Example | Where it appears |
|---|---|---|---|
| `name` | string | `"Martinez Landscaping & Tree Services"` | Page title, JSON-LD, SEO pages |
| `shortName` | string | `"Martinez Landscaping"` | Footer, contact cards, prose references |
| `legalName` | string | `"Martinez Landscaping & Tree Services, LLC"` | Footer copyright line |
| `tagline` | string | `"Landscapes worth coming home to."` | Hero h1 |
| `description` | string | 1–2 sentence overview | Meta description fallback, JSON-LD |
| `foundedYear` | number | `2009` | JSON-LD, SEO pages, computed proof points |

---

## Contact

| Field | Type | Example | Where it appears |
|---|---|---|---|
| `phone` | string | `"(302) 555-0100"` | Hero, footer, contact section, emergency banner |
| `phoneHref` | string | `"tel:+13025550100"` | All phone anchor `href` attributes |
| `email` | string | `"info@martinez.com"` | Footer, contact section |
| `emailHref` | string | `"mailto:info@martinez.com"` | Email anchor `href` attributes |
| `address.street` | string | `"123 Main St"` | Footer, JSON-LD |
| `address.city` | string | `"Newark"` | Footer, JSON-LD |
| `address.region` | string | `"DE"` | Footer, JSON-LD, SEO pages |
| `address.regionName` | string | `"Delaware"` | Prose references, credentials line |
| `address.county` | string | `"New Castle County"` | SEO pages, service area section |
| `address.postalCode` | string | `"19702"` | Footer, JSON-LD |
| `address.country` | string | `"US"` | JSON-LD |
| `geo.lat` | number | `39.6837` | JSON-LD LocalBusiness |
| `geo.lng` | number | `-75.7497` | JSON-LD LocalBusiness |
| `url` | string | `"https://martinez.com"` | Canonical URLs, JSON-LD |

---

## Hours

```typescript
hours: [
  { day: 'Mon–Sat', time: '7 AM – 6 PM' },
  { day: 'Sunday', time: 'Emergency only' },
]
```

`hours[0]` is shown in the contact section as the primary hours line. The full array appears in JSON-LD.

```typescript
openingHours: [
  { days: ['Monday', 'Tuesday', ...], opens: '07:00', closes: '18:00' },
]
```

Machine-readable format consumed by the LocalBusiness JSON-LD schema.

`emergencyNote` — plain string shown in the footer hours row. Example: `"Emergency service available 24/7"`.

---

## Branding

| Field | Type | Where it appears |
|---|---|---|
| `logo.primary` | string | Large wordmark text, "Why [logo.primary]" eyebrow |
| `logo.secondary` | string | Smaller wordmark text beneath primary |
| `social.facebook` | URL string | Footer social icon link |
| `social.instagram` | URL string | Footer social icon link |
| `social.google` | URL string | (Available for use — not yet in footer) |
| `reviews.average` | number | Hero trust strip, contact form star rating |
| `reviews.count` | number | Hero trust strip, contact form |

---

## Credentials

```typescript
credentials: {
  licensed: true,
  insured: true,
  insuranceAmount: '$2M liability',
  certification: 'Delaware Licensed Contractor #XXXXX',
}
```

`insuranceAmount` appears in the contact section and SEO page footers. `certification` is available for use in proof points or the Guarantee section.

---

## Section Copy

Controls every heading, intro, and eyebrow across the main page sections. No component edits needed.

```typescript
sectionCopy: {
  whyChooseUs: {
    heading: "The crew you'll actually want to keep.",
    intro: "Anyone can send someone to mow your lawn...",
  },
  services: {
    eyebrow: 'What we do',
    heading: 'One team for the whole property.',
    intro: "From the weekly mow to a full redesign...",
  },
  cta: {
    eyebrow: 'Free, no-pressure estimate',
    heading: "Ready for a yard you're proud of?",
    intro: "Tell us what you need and we'll send...",
  },
  contact: {
    eyebrow: 'Free estimate',
    heading: "Let's talk about your property.",
    intro: "We make it simple — fill out the form...",
  },
}
```

---

## CTA Style

Controls all buttons and micro-copy across the site.

```typescript
ctaStyle: {
  primary: 'Request a Free Estimate',   // Hero + CTA + Services button + footer CTA
  secondary: 'Call Us',                  // Hero ghost button
  form: 'Send my estimate request',      // Contact form submit button
  micro: 'Free estimate · Licensed & insured · Quick response',  // Beneath hero buttons
}
```

---

## Business Story

Narrative copy that replaces template placeholder text across multiple sections.

```typescript
businessStory: {
  heroSubhead: '...',       // 1–2 sentences beneath the hero h1
  mission: '...',           // Footer brand pitch paragraph
  differentiator: '...',    // StatementSection pull quote between Gallery and Testimonials
  founding: '...',          // WhyChooseUs paragraph about how the business started
}
```

---

## Proof Points

The trust strip below the hero. Supply 3–5 points.

```typescript
proofPoints: [
  {
    icon: ShieldCheck,          // Any Lucide icon
    label: 'Licensed & Insured',
    detail: '$2M liability',
  },
  {
    icon: Star,
    label: '',                  // Leave blank when using computed
    detail: '',
    computed: 'google-rating',  // Auto-fills label + detail from reviews.average / reviews.count
  },
  {
    icon: Clock,
    label: '',
    detail: '',
    computed: 'years-in-business',  // Auto-fills "15+ Years" from current year − foundedYear
  },
]
```

`computed` sentinels: `'years-in-business'` and `'google-rating'` are resolved at render time so they never go stale.

---

## Services

Each entry drives a card in the Services section and generates a full `/services/[slug]` page plus `/services/[slug]/[city]` leaf pages.

```typescript
{
  slug: 'lawn-care',              // URL segment — keep lowercase-hyphenated
  title: 'Lawn Care & Maintenance',
  displayTitle: 'A Sharp, Healthy Lawn Year-Round',  // Optional: card headline (outcome-first)
  summary: 'One-line promise shown on card.',
  details: 'Paragraph used on the service detail page.',
  includes: ['Weekly mowing', 'Edging & trimming', ...],  // Checklist items
  image: '/images/lawn-care.jpg',
  icon: Sprout,                   // Lucide icon
}
```

---

## Benefits

Shown as a numbered editorial list in the WhyChooseUs section.

```typescript
// Exported as BENEFITS from business.ts
export const BENEFITS: Benefit[] = [
  {
    title: 'Same crew, every visit',
    description: 'Not a rotation of strangers. You get to know us.',
    icon: Users,  // Icon not displayed in editorial layout, kept for future use
  },
  ...
]
```

---

## Stats

Four-column stat strip in the WhyChooseUs section.

```typescript
// Exported as STATS from business.ts
export const STATS: Stat[] = [
  { value: '15+', label: 'Years in business' },
  { value: '4.9★', label: 'Google rating' },
  { value: '300+', label: 'Properties served' },
  { value: '24h', label: 'Estimate turnaround' },
]
```

---

## Testimonials

```typescript
// Exported as TESTIMONIALS from business.ts
export const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Full review text...',
    author: 'Jane D.',
    location: 'Newark, DE',
    rating: 5,
    service: 'Lawn Care',
  },
  ...
]
```

---

## Gallery (Before/After Projects)

```typescript
// Exported as GALLERY from business.ts
export const GALLERY: GalleryProject[] = [
  {
    slug: 'paver-patio',                    // URL: /projects/paver-patio
    title: 'Backyard Paver Patio',
    description: 'Optional caption.',
    category: 'Hardscaping',
    before: { src: '/images/before-patio.jpg', alt: 'Overgrown backyard' },
    after:  { src: '/images/after-patio.jpg',  alt: 'Finished paver patio' },
  },
  ...
]
```

---

## FAQ

Shown in the homepage accordion and on `/faq`. Also used in SEO page schemas.

```typescript
faq: [
  {
    question: 'Do you require contracts?',
    answer: 'No — all services are month-to-month...',
  },
  ...
]
```

---

## Guarantee

Rendered as a highlighted banner between the CTA and Contact sections. Set to `null` to hide it.

```typescript
guarantee: {
  headline: 'Our satisfaction guarantee',
  description: 'If you are not satisfied with any service...',
} | null
```

---

## Financing

Badge shown in the Contact section beneath the insurance line. Set to `null` to hide it.

```typescript
financing: {
  description: 'Flexible payment plans available for projects over $1,500',
  provider: 'GreenSky',   // Optional
  minAmount: 1500,        // Optional
} | null
```

---

## Emergency Service

Fixed banner pinned to the bottom of every page. Set to `null` to hide it.

```typescript
emergencyService: {
  description: 'Storm cleanup & emergency response available',
  phone: '(302) 555-0199',  // Optional — falls back to main phone
  responseTime: 'Within 4 hours',  // Optional
} | null
```

When `emergencyService` is not null, the `<body>` gets `pb-14` to prevent the banner from obscuring the footer CTA.

---

## Service Towns

Drives the `/locations/[city]` hub pages and the `/services/[slug]/[city]` leaf pages.

```typescript
// Exported as SERVICE_TOWNS from business.ts
export const SERVICE_TOWNS: ServiceTown[] = [
  { name: 'Newark' },
  { name: 'Wilmington', note: 'including the Trolley Square neighborhood' },
  ...
]
```

Number of leaf pages = `SERVICES.length × SERVICE_TOWNS.length`. For Martinez (6 services × 12 cities = 72 pages).

---

## Process Steps

The three-step "how it works" strip in the CTA section.

```typescript
// Exported as PROCESS from business.ts
export const PROCESS = [
  { step: '01', title: 'Tell us about it', description: 'Two-minute form or quick call.' },
  { step: '02', title: 'Get a written estimate', description: 'Clear quote within 24 hours.' },
  { step: '03', title: 'We get to work', description: 'Your crew shows up on time.' },
]
```

---

## Engine Intelligence (advanced)

These fields are used by AI-assisted content generation and are optional for human-authored sites. They do not appear directly on the page but inform tone and targeting.

| Field | Purpose |
|---|---|
| `brandVoice` | Tone and words to avoid |
| `idealCustomer` | Description, pain points, desires |
| `competitiveAdvantages` | Bullet points in SEO pages' "Why us" section |
| `objections` | Common concerns + responses (for future chatbot/FAQ use) |
| `urgency` | Seasonal urgency message (not yet rendered — reserved) |
| `pricingStyle` | `'transparent' \| 'quote-based' \| 'range' \| 'custom'` |
| `brandPersonality` | Adjectives + "we are not" list |
| `servicePriorities` | Ordered list of most-pushed services |
| `reviewHighlights` | Curated quotes (available for future homepage pull quotes) |
