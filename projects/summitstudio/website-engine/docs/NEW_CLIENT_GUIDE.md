# New Client Setup Guide

From zero to a live, SEO-optimized website in about two hours. No React knowledge required for the business data step — just fill in the fields.

---

## Step 1 — Copy an existing client folder

```bash
cp -r src/data/businesses/martinez-landscaping src/data/businesses/your-client-slug
```

Use a lowercase, hyphenated slug that matches the client's domain name (e.g. `delaware-lawn-crew` for `delawarelawncrew.com`).

---

## Step 2 — Fill in the business data

Open `src/data/businesses/your-client-slug/business.ts`.

Work through each field top to bottom. The file is divided into clear sections:

1. **Identity** — name, shortName, legalName, tagline, description, foundedYear
2. **Contact** — phone, phoneHref, email, emailHref, address, geo, url
3. **Hours** — hours array + openingHours array + emergencyNote
4. **Branding** — logo.primary / logo.secondary, social links, reviews
5. **Credentials** — licensed, insured, insuranceAmount, certification
6. **Section Copy** — every heading and intro on the homepage (no component edits needed)
7. **CTA Style** — all button labels and micro-copy
8. **Business Story** — heroSubhead, mission, differentiator, founding
9. **Proof Points** — trust strip items (use `computed` sentinels for years + rating)
10. **Services** — one entry per service offered
11. **Benefits** — the numbered list in the WhyChooseUs section
12. **Stats** — four headline figures
13. **Testimonials** — real, attributed reviews (do not fabricate)
14. **Gallery** — before/after project photos
15. **FAQ** — questions the business gets asked most
16. **Guarantee** — set to `null` if not applicable
17. **Financing** — set to `null` if not applicable
18. **Emergency Service** — set to `null` if not applicable
19. **Service Towns** — every city the business serves
20. **Process Steps** — the three "how it works" steps in the CTA section

See `docs/SCHEMA.md` for the full field reference with descriptions and examples.

### Important rules

- **Phone number**: `phone` is the display string `"(302) 555-0100"`. `phoneHref` must be `"tel:+13025550100"` (E.164, no formatting).
- **Email**: `email` is the display string. `emailHref` must be `"mailto:..."`.
- **Testimonials**: Use real, attributable reviews only. Do not fabricate quotes or attribute words to real people.
- **Slug**: The service slug in each service object becomes the URL (`/services/lawn-care`). Keep it lowercase-hyphenated.
- **NAP consistency**: `name`, `address`, and `phone` must match exactly what appears on Google Business Profile and major directories.

---

## Step 3 — Register the client

Open `src/data/businesses/registry.ts` and add an entry:

```typescript
'your-client-slug': () => import('./businesses/your-client-slug/business'),
```

---

## Step 4 — Set the active business

In `.env.local` (create it if it doesn't exist):

```
NEXT_PUBLIC_ACTIVE_BUSINESS=your-client-slug
```

For production (Vercel): add `NEXT_PUBLIC_ACTIVE_BUSINESS` in the project's Environment Variables settings.

---

## Step 5 — Add images

Place images in `public/images/`. The engine expects these filenames by default:

| File | Used in |
|---|---|
| `hero.jpg` | Hero section (above-fold, full bleed) |
| `about.jpg` | WhyChooseUs section (right column) |
| `cta.jpg` | CTA section (faint background texture) |
| `gallery/` | Before/after slider images (paths set in GALLERY data) |

Recommended dimensions:
- `hero.jpg` — 1600×1200px minimum, 16:9 or taller
- `about.jpg` — 800×1000px, portrait orientation
- `cta.jpg` — 1600×900px, landscape (will be shown at 20% opacity)

---

## Step 6 — Add a theme (optional)

Open `src/data/theme.ts`. Colors, fonts, and border radii are defined here. The theme is shared across all clients on the current build — per-client theming requires extracting theme into each client's data folder (not yet implemented).

---

## Step 7 — Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000` and walk through the site:

- [ ] Hero: correct name, tagline, phone, hero subhead
- [ ] ProofBar: proof points render correctly (computed values resolve)
- [ ] WhyChooseUs: heading and intro match sectionCopy, founding paragraph populated
- [ ] Services: correct service cards and CTA button label
- [ ] CTA: correct heading, intro, process steps, buttons
- [ ] Contact: correct heading, form submit label, phone/email/hours
- [ ] Footer: correct mission pitch, services list, phone, email, CTA button
- [ ] Emergency banner (if enabled): visible at bottom, correct phone
- [ ] Guarantee (if enabled): appears between CTA and Contact
- [ ] Financing badge (if enabled): visible in Contact info column
- [ ] FAQ: all questions present
- [ ] Gallery: before/after sliders load

---

## Step 8 — Check SEO pages

The engine auto-generates these pages from your data:

| Route | Count | Example |
|---|---|---|
| `/locations/[city]` | 1 per service town | `/locations/newark` |
| `/services/[slug]` | 1 per service | `/services/lawn-care` |
| `/services/[slug]/[city]` | services × towns | `/services/lawn-care/newark` |
| `/faq` | 1 | `/faq` |
| `/projects/[slug]` | 1 per gallery project | `/projects/paver-patio` |

Check a few leaf pages to confirm they render correctly with real business data:

```
http://localhost:3000/locations/newark
http://localhost:3000/services/lawn-care
http://localhost:3000/services/lawn-care/newark
```

---

## Step 9 — TypeScript check

```bash
npm run typecheck
```

Zero errors = all required fields are present and typed correctly. If a required field is missing, TypeScript will tell you exactly which one.

---

## Step 10 — Production build

```bash
npm run build
```

This generates all static pages. The output tells you exactly how many pages were built.

---

## Deployment (Vercel)

1. Push to a new GitHub repo (or add a branch to the existing engine repo)
2. Import the project in Vercel
3. Set `NEXT_PUBLIC_ACTIVE_BUSINESS=your-client-slug` in Environment Variables
4. Deploy

The build runs `generateStaticParams` for all route combinations and outputs flat HTML files — no server required. All SEO pages are pre-rendered at build time.

---

## Common questions

**Can I add a new service?**
Yes — add an entry to the `SERVICES` array in the business data. A new card appears in the Services section, a new `/services/[slug]` page is generated, and a new column of `/services/[slug]/[city]` pages is generated for every service town. No component edits needed.

**Can I add a new city?**
Yes — add an entry to `SERVICE_TOWNS`. A new `/locations/[city]` hub page and a new row of `/services/[slug]/[city]` pages are generated automatically.

**Can I change colors?**
Yes — edit `src/data/theme.ts`. Colors reference CSS custom properties defined in `src/app/globals.css`. Per-client theming (different colors per business) requires moving the theme into each client's data folder — not yet implemented.

**Can I remove the emergency banner?**
Yes — set `emergencyService: null` in the business data. The banner disappears and `pb-14` is removed from `<body>`.

**Can I remove the guarantee section?**
Yes — set `guarantee: null`. The section renders nothing.

**Can I remove the financing badge?**
Yes — set `financing: null`. The badge in the Contact section disappears.

**How do I update the phone number?**
Change `phone` and `phoneHref` in the business data. It updates everywhere automatically: hero, contact, footer, emergency banner, SEO pages, and JSON-LD.

**How do I update hours?**
Change `hours` and `openingHours` in the business data. The contact section and JSON-LD update automatically.
