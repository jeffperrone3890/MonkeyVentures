# Martinez Landscaping &amp; Tree Services — Marketing Website

A production-grade, single-page marketing site built to do one job well: **turn visitors into estimate requests.** Built by Summit Studio.

> **Built with** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Lucide icons

---

## Table of contents

1. [Quick start](#quick-start)
2. [What you must replace before launch](#what-you-must-replace-before-launch)
3. [Project structure](#project-structure)
4. [Design system](#design-system)
5. [Editing content](#editing-content)
6. [The estimate form](#the-estimate-form)
7. [SEO &amp; metadata](#seo--metadata)
8. [Accessibility](#accessibility)
9. [Performance](#performance)
10. [Deployment](#deployment)

---

## Quick start

Requires **Node.js 18.17+** (Node 20 LTS recommended).

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint (next/core-web-vitals)
```

---

## What you must replace before launch

This site ships with **clearly-labeled placeholder content** so it runs and looks complete out of the box. Before going live, replace:

| Item | Where | Notes |
| --- | --- | --- |
| Business name, phone, email, address, hours | `src/lib/site.ts` | Single source of truth (NAP). The placeholder phone uses the fictional `555-01xx` range. |
| Review average &amp; count | `src/lib/site.ts` → `reviews` | Used in Hero, Testimonials, and SEO structured data. Must reflect real, verifiable numbers before publishing. |
| Services &amp; descriptions | `src/lib/data.ts` → `SERVICES` | |
| Testimonials | `src/lib/data.ts` → `TESTIMONIALS` | **Placeholders.** Do not publish as real reviews — swap with genuine, permissioned customer quotes. |
| Service towns | `src/lib/data.ts` → `SERVICE_TOWNS` | Currently New Castle County, DE. |
| Photography | `public/images/**` | All images are generated brand placeholders. Replace with the client's real photos at the same paths/aspect ratios. |
| Form delivery | `src/app/api/estimate/route.ts` | Wire to email/CRM (see below). Currently logs to the server console. |
| `NEXT_PUBLIC_SITE_URL` | `.env` | Used for canonical URLs, sitemap, and Open Graph. |

> ⚠️ **Legal/trust note:** testimonials, review counts, license numbers, and insurance figures are representative placeholders. Publishing unverified claims as fact is misleading and may be unlawful. Confirm every trust claim with the client before launch.

---

## Project structure

```
martinez-landscaping/
├─ public/
│  ├─ images/                  # hero, about, cta, og + services/ and gallery/
│  ├─ favicon.ico              # branded sprig mark
│  ├─ icon.png / apple-touch-icon.png
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx            # fonts, global metadata, JSON-LD, Navbar/Footer shell
│  │  ├─ page.tsx              # assembles the section components in order
│  │  ├─ globals.css           # Tailwind layers + base styles + reduced-motion
│  │  ├─ sitemap.ts            # generated /sitemap.xml
│  │  ├─ robots.ts             # generated /robots.txt
│  │  ├─ not-found.tsx         # branded 404
│  │  └─ api/estimate/route.ts # POST handler for the estimate form
│  ├─ components/
│  │  ├─ layout/               # Navbar, Footer
│  │  ├─ sections/             # Hero, WhyChooseUs, Services, Gallery,
│  │  │                        #   Testimonials, ServiceArea, CTA, Contact
│  │  └─ ui/                   # reusable primitives (see below)
│  ├─ lib/
│  │  ├─ site.ts               # business facts / NAP — single source of truth
│  │  ├─ data.ts               # services, benefits, stats, testimonials, gallery…
│  │  └─ utils.ts              # cn() classname helper
│  └─ types/
│     └─ index.ts              # shared TypeScript interfaces
├─ tailwind.config.ts          # design tokens (colors, type scale, spacing…)
├─ next.config.mjs
└─ tsconfig.json               # `@/*` path alias → src/*
```

### UI primitives (`src/components/ui/`)

Small, composable building blocks so sections stay consistent and a future developer never re-implements the same thing twice:

- **Container** — max-width + responsive gutters (`size="narrow"` for prose).
- **Section** — vertical rhythm + background tone (`paper` / `sage` / `forest`) + scroll-margin for anchored nav.
- **SectionHeading** — eyebrow + title + intro, with an `invert` option for dark sections.
- **Button** — polymorphic (`<a>` if `href` is passed, else `<button>`); variants `primary` (amber), `dark` (pine), `outline`, `ghost`, `onDark`.
- **Reveal** — scroll-into-view fade/slide; respects `prefers-reduced-motion`.
- **Logo**, **StarRating**, **HorizonDivider** (the signature landscape-contour divider).

---

## Design system

The look is deliberately **not** a generic "bright-green lawn-care" template. Martinez does living, crafted work, so the site leans **photography-forward** with a restrained, natural palette.

**Color** (defined in `tailwind.config.ts`):

- `forest #12241B`, `pine #1F4733`, `fern #3C7A57`, `moss #5A6E40` — the evergreen base
- `paper #FBFBF8`, `sage` tints — calm backgrounds
- `amber #C98A3C` / `amber-soft #E0B878` — the **single boldest accent**, reserved almost entirely for the "Get a free estimate" call to action so it always pulls the eye

**Type:** `Fraunces` (display serif — handcrafted, premium) paired with `Hanken Grotesk` (body — clean, legible, not Inter). Loaded via `next/font` for zero layout shift.

**Signature element:** the `HorizonDivider` — a soft landscape-contour SVG curve used sparingly to transition between sections.

Tokens (radius `4xl/5xl`, shadows `soft/lift/ring`, fluid type sizes, custom spacing) live in the config so the whole site re-themes from one place.

---

## Editing content

Almost all copy and data is data-driven — you rarely touch JSX to update content:

- **Business facts / NAP / hours / social** → `src/lib/site.ts`
- **Services, benefits, stats, testimonials, gallery, service towns, process steps** → `src/lib/data.ts`
- **Navigation links** → `NAV_LINKS` in `src/lib/site.ts`

Add a service, for example, by appending an object to `SERVICES` in `data.ts` (pick a Lucide `icon`, add an image at `public/images/services/<slug>.jpg`). The Services section and the contact form's service dropdown both update automatically.

---

## The estimate form

`src/components/sections/Contact.tsx` posts JSON to `src/app/api/estimate/route.ts`. The handler includes a honeypot spam trap, server-side validation, and—by default—logs submissions to the console.

**To deliver leads,** uncomment the example block in the route and wire your provider. The included example uses [Resend](https://resend.com):

```bash
npm install resend
```

```env
# .env
RESEND_API_KEY=...
ESTIMATE_INBOX=estimates@martinezlandscaping.com
```

The same pattern works for SendGrid, Postmark, a CRM webhook, or a database insert — the route is the single integration point.

---

## SEO &amp; metadata

- Full `Metadata` (title template, description, canonical, Open Graph + Twitter cards using `public/images/og.jpg`) in `src/app/layout.tsx`.
- **LocalBusiness JSON-LD** (`LandscapingBusiness`) with NAP, geo, `areaServed`, opening hours, and aggregate rating — the single most valuable structured data for a local services business.
- Generated `sitemap.xml` and `robots.txt`.
- Set `NEXT_PUBLIC_SITE_URL` so canonical/OG URLs are absolute.

---

## Accessibility

- Semantic landmarks, a skip-to-content link, and visible `:focus-visible` rings.
- Keyboard-operable mobile menu and gallery lightbox (Esc / arrow keys), with body-scroll lock.
- Decorative SVGs are `aria-hidden`; the star rating exposes an accessible label.
- All motion is disabled under `prefers-reduced-motion`.
- Color pairings target WCAG AA contrast.

---

## Performance

- `next/image` for responsive, lazy-loaded images (the hero is `priority`).
- `next/font` self-hosts fonts (no render-blocking, no layout shift).
- Mostly Server Components; `'use client'` only where interactivity needs it (Navbar, Hero, Gallery, Contact).
- Animations are transform/opacity only.

> Replace placeholder JPGs with optimized real photos (ideally `.webp`/`.avif`) at the same aspect ratios for best Core Web Vitals.

---

## Deployment

Optimized for **[Vercel](https://vercel.com)**:

1. Push to a Git repo and import it in Vercel (framework auto-detected).
2. Add environment variables (`NEXT_PUBLIC_SITE_URL`, plus any email keys).
3. Deploy. Any Node host supporting Next.js 14 also works via `npm run build && npm run start`.

---

© Martinez Landscaping &amp; Tree Services. Site by **Summit Studio**.
