# Summit Studio — Engine Roadmap

> **Living document.** Update this after every sprint. When a decision gets made, write the *why* here while it's fresh — six months from now that context is otherwise gone.

Last updated: 2026-07-01

---

## Completed

### Sprint 1 — Foundation _(2026-06-28)_
- Initial repo setup and project brief
- Folder structure established: `src/app/`, `src/components/`, `src/data/`
- Session log and decision log started

### Sprint 2–3 — Template Build _(2026-06-28 – 2026-06-29)_
- Built first full landscaping website template (Martinez Landscaping)
- All components: Hero, Services, WhyChooseUs, Testimonials, Gallery, CTA, Contact, Footer, Navbar
- Business data centralized in `business.ts` — components pull from one source of truth
- Theme system: CSS variables for color tokens, Fraunces + Hanken Grotesk fonts

### Sprint 4 — Multi-Tenant Architecture _(2026-06-29 – 2026-06-30)_
- `NEXT_PUBLIC_ACTIVE_BUSINESS` env var selects active client — zero code change to switch
- Three demo businesses: `martinez-landscaping`, `delaware-lawn-crew`, `pq-landscaping`
- Business registry (`src/data/business.ts`) maps slugs to data files
- `as const satisfies Business` pattern — compile-time type safety without losing inference
- Connected contact form to Resend email delivery

### Sprint 5 — Visual Polish _(2026-06-30 – 2026-07-01)_
- Full mobile redesign pass
- Hero, Gallery (before/after slider), TrustStrip, ProofBar refinements
- 9-point visual fix list after first live preview
- Deployed to Vercel under `website-engine` project name

### Sprint 6 — Engine Intelligence _(2026-07-01)_
- SEO architecture: dynamic `sitemap.ts`, `robots.ts`, `generateMetadata()`
- Location pages: `/locations/[city]` — auto-generated from `serviceTowns[]`
- Service pages: `/services/[slug]` and `/services/[slug]/[city]`
- Related links, breadcrumbs, page CTAs for internal link depth

### Sprint 7 — Deliverables _(2026-07-01)_
- _(Details in session log — update here)_

### Sprint 8 — Deliverables _(2026-07-01)_
- _(Details in session log — update here)_

### Sprint 9 — Simple CMS _(2026-07-01)_
- **Goal:** Every editable field lives in `business.ts`. Zero hardcoded strings in components.
- Added `SectionCopy` interface: `{ eyebrow?, heading, intro }` — drives WhyChooseUs, Services, CTA, Contact sections
- Added `sectionCopy` block to all three demo businesses
- Replaced all hardcoded section headings with `BUSINESS.sectionCopy.*`
- Footer CTA button now uses `BUSINESS.ctaStyle.primary`
- **Docs:** `docs/SCHEMA.md` (full field reference), `docs/NEW_CLIENT_GUIDE.md` (10-step onboarding)

### Sprint 10 — Business Generation Pipeline _(2026-07-01)_
**Design phase:**
- Designed full agency automation architecture — `docs/STUDIO_AUTOMATION.md`
- Designed complete design system — `docs/DESIGN_SYSTEM.md`

**Implementation:**
- `src/lib/pipeline/` — pure TypeScript, no React, no side effects except final file write
- `ScoredField<T>` — every value carries `{ value, score, source, alternatives?, flagged? }`
- `AIProvider` interface — isolates pipeline from any specific AI SDK
- `MockAIProvider` — deterministic keyword-based responses; full pipeline runs without API keys
- `BusinessContext` — single context object injected into all AI calls
- Extraction layer: `RawGBPData`, `RawWebData`, `RawBusinessData` — with NAP conflict tracking
- 10 generator functions: `generateBusinessStory`, `generateSectionCopy`, `generateProofPoints`, `generateFAQ`, `generateCompetitiveAdvantages`, `generateServices`, `generateBenefits`, `generateStats`, `generateCTAStyle`, `generateUrgency`
- Design generators: `generateDesignBrief` (visual register classification), `generatePhotoBrief` (shot list)
- Confidence scorer + review queue with three severity bands
- Output writer: `buildOutputs()` produces 5 artifact strings; `writeOutputs()` is the only I/O function
- Orchestrator: `runPipeline(input, ai)` — full run in one call

### Sprint 11 — Web Importer _(2026-07-01)_
- `src/lib/importer/` — real HTTP fetch, no mocks, no new npm dependencies
- `fetchPage(url)` — 12s timeout, browser UA, redirect-following, HTML content-type validation
- Extraction priority chain: Schema.org JSON-LD → meta tags → regex fallbacks
- Extracts: title, description, headings (h1–h3), phone, email, address, services, locations, reviews, opening hours, rating, review count, founded year, schema.org types
- Service extraction: schema.org `hasOfferCatalog` → nav link heuristic → "services" section list items
- Location extraction: schema.org `areaServed` → city+state regex (all 50 US states)
- `POST /api/importer` — curl-callable, outputs JSON
- **Key limitation:** Sprint 11 importer and Sprint 10 pipeline are not yet wired together (see Technical Debt)

### Sprint 12 — Studio Pipeline Playground _(2026-07-01)_
- `GET /studio` — internal developer tool, no auth required
- Left sidebar: business name, website URL, optional Google Maps URL, Generate button
- SSE streaming: each pipeline stage reports `running` → `done` with ms timing as it completes
- 6 stages in order: Fetch → Extract → Normalize → Generate → Score → Artifacts
- After completion: 5-tab output panel (business.ts, Review Queue, Confidence JSON, Design Brief, Photo Brief)
- Copy-to-clipboard button on each tab
- Inline error display per stage
- `runner.ts` bridges Sprint 11 real importer into Sprint 10 generators
- `POST /api/studio/run` — SSE stream, `text/event-stream`

---

## Current Sprint

No active sprint. Last completed: **Sprint 12** (Studio Pipeline Playground).

**Suggested Sprint 13 candidates** (pick one focus):
- Wire real `AnthropicProvider` into the pipeline — replace `MockAIProvider` with real Claude calls
- Multi-page scraper — fetch `/about`, `/services`, `/faq` pages in addition to homepage
- Review interface — `/studio/review` page to walk through the review queue item by item
- Client intake form — public-facing form that populates `StudioInput` and triggers the pipeline

---

## Technical Debt

| Priority | Item | Context |
|---|---|---|
| High | **Sprint 11 importer not wired into `runPipeline()`** | `runPipeline()` still calls `extractWebsiteContent()` which returns mock data. Sprint 12's `runner.ts` uses real extraction, but the main `runPipeline()` does not. Fix: replace the internal `extractWebsiteContent()` call with `runImport()` and adapt the shapes. |
| High | **`extractGoogleBusiness()` returns mock data** | `src/lib/pipeline/extract/gbp.ts` has the real API call commented out. Wire to Google Places API when a key is available. |
| High | **`MockAIProvider` throughout** | All content generation produces deterministic placeholder text. Every `runPipeline()` call in production needs a real `AIProvider` implementation. |
| Medium | **Logo color extraction stubbed** | `generateDesignBrief()` always returns `logoColors: []`. The real implementation should accept a logo file path and extract dominant colors via a vision model. |
| Medium | **Confidence scores are directionally correct, not calibrated** | Scores like `0.50` for AI-generated content are educated guesses. Calibrate against a labeled dataset once real AI is integrated. |
| Medium | **`normalizeRegion()` doesn't convert full state names** | If schema.org returns `"addressRegion": "Delaware"` instead of `"DE"`, the region passes through as the full name. Add a state-name-to-abbreviation lookup table. |
| Low | **`/studio` has no rate limiting** | The endpoint makes outbound HTTP requests to arbitrary URLs. Fine for localhost; add rate limiting and an allowlist before any non-local deploy. |
| Low | **Sprint 7 and 8 details not in roadmap** | Update the Completed section above from the session log. |

---

## Known Limitations

**Importer (Sprint 11)**
- **Homepage only.** `/about`, `/services`, `/faq` pages are not fetched. Service descriptions, founding story, and FAQ answers come primarily from the homepage or meta tags, which are often sparse.
- **No JavaScript rendering.** The importer uses `fetch()`, which downloads static HTML. Sites built as SPAs (React, Vue, Angular) that render content client-side will return near-empty HTML. Playwright would be needed for those.
- **Schema.org coverage varies.** Schema.org extraction is excellent for sites generated by WordPress/Yoast, Wix, and Squarespace. Custom-built sites may have none.
- **Service extraction heuristic has false positives.** The nav-link heuristic can pick up non-service links ("Projects", "Before & After"). The schema.org path is always preferred.

**Pipeline (Sprint 10)**
- **All AI content is mock.** Until `AnthropicProvider` replaces `MockAIProvider`, generated content is template-based, not written for the specific business.
- **`generateDesignBrief()` uses visual register heuristic only.** Color palette is derived from category classification, not actual logo analysis. Confidence is 0.55 — always flagged for human review.
- **Photo brief is based on homepage data.** Existing photo candidates come from GBP mock data (which is static). Real candidates require live GBP photos.

**Engine (general)**
- **Single-page type.** The engine currently builds one homepage layout. Different business categories (HVAC, plumbing, electrical) would need layout variants.
- **No image pipeline.** Images are placed manually in `public/images/`. No optimization, resizing, or CDN upload is automated.
- **No client-facing dashboard.** Business owners cannot edit their `business.ts` through a UI — they need a developer.

---

## Future Features

Ordered roughly by impact-to-effort ratio.

### Near-term (high value, well-defined)

**Real AI integration**
- Implement `AnthropicProvider implements AIProvider` using `@anthropic-ai/sdk`
- Inject via env var: `AI_PROVIDER=anthropic` → real; `AI_PROVIDER=mock` → deterministic
- All generator prompts are already written and tested with the mock

**Multi-page scraper**
- After fetching homepage, detect and fetch `/about`, `/services`, `/faq`, `/contact`
- `RawWebData` already has slots for `about`, `faq`, `testimonials`
- Real about text dramatically improves `generateBusinessStory()` accuracy
- Use Firecrawl API or Playwright; swap path is in the extractor

**Google Places API**
- `extractGoogleBusiness()` already structured for this — just needs an API key
- Real GBP gives: rating, review count, review text, hours, photos, attributes
- Review text feeds `extractThemes()` which improves all tone-sensitive generators

**Review interface (`/studio/review`)**
- Walk through `ReviewQueueItem[]` one field at a time
- Approve / edit / skip each item
- Write approved values back to the draft `business.ts`

### Medium-term

**Client intake form**
- Public-facing form at `/intake` or separate domain
- Collects: business name, website URL, GBP URL, service area, logo upload
- Triggers pipeline on submission, emails draft artifacts via Resend
- Eliminates the manual curl/studio step

**`/studio/clients` admin view**
- List all generated client folders
- Per-client: pipeline run status, confidence summary, last updated
- One-click re-run with updated inputs

**Facebook Graph API**
- Review text from Facebook often differs from Google — different customer segments
- Adds `reviewThemes` signals and can surface testimonials
- Lower priority than GBP since coverage is more variable

**Logo vision analysis**
- Accept logo file path in `PipelineInput.logoPath`
- Send to Claude with vision: extract dominant colors, classify visual register
- Populate `designBrief.logoColors` and improve palette accuracy from 0.55 → ~0.80

### Longer-term

**Layout variants**
- Second homepage layout for service businesses with higher-ticket projects (HVAC, roofing)
- Template selection based on `designBrief.visualRegister`

**One-click Vercel deploy**
- After review sign-off, push generated `business.ts` to a client repo and trigger deploy
- Uses Vercel API + GitHub API

**Schema.org validator**
- After generating `business.ts`, verify the rendered site emits correct `LocalBusiness` JSON-LD
- Catch schema errors before client handoff

---

## Ideas Parking Lot

_Unvetted. Capture now, evaluate later._

- **Automated competitor gap analysis** — scrape top 3 local competitors and summarize what they say vs. what the client says
- **SMS quote follow-up** — Twilio integration for the estimate form; text leads within 5 minutes
- **Social preview card generator** — auto-generate `og.jpg` from business data using Satori/Canvas
- **Business card scanner input** — photo of a business card → pre-fill intake form fields
- **Google Search Console auto-submission** — submit new sitemap immediately after deploy
- **Before/after photo matching** — use vision model to verify before and after shots are the same location
- **"Voice of the customer" tagline generator** — extract the most-repeated phrases from reviews and use them verbatim in headings
- **Seasonal campaign generator** — generate seasonal service promotions (spring cleanup, snow season) triggered by date

---

## Architecture Decisions

Decisions that aren't obvious from the code. Read before refactoring.

**`as const satisfies Business`**
Every business data file ends with `as const satisfies Business`. `as const` prevents TypeScript from widening string literals (e.g. `"Newark"` stays `"Newark"`, not `string`). `satisfies Business` runs the type check without widening. Without both, you lose either the literal types or the safety check. Do not change this pattern.

**`AIProvider` interface (not direct SDK import)**
The pipeline never imports `@anthropic-ai/sdk` directly. Every AI call goes through `AIProvider`. This means: (a) the mock runs the full pipeline offline, (b) swapping providers is one class, (c) the pipeline compiles and tests without any API keys. Keep all AI SDKs behind this interface.

**`ScoredField<T>` on every generated value**
Every value the pipeline produces is wrapped as `{ value, score, source, flagged? }`. This was a deliberate choice over "just return the string." The reason: we need to know at review time where a value came from and how much to trust it. A phone number from GBP (`score: 0.95`) and a tagline from AI (`score: 0.50`) need different review treatment. The wrapper makes that possible without separate metadata maps.

**Pipeline produces strings, not React**
`buildOutputs()` returns TypeScript source code as strings — not React components, not database records. The reason: the output of the pipeline needs to be reviewable (you read the `.ts` file before publishing it), version-controlled (committed to the client repo), and independent of the runtime (a script can write it, an API can return it, a human can edit it). Keeping it as text keeps all those doors open.

**Importer separate from pipeline**
`src/lib/importer/` and `src/lib/pipeline/` are deliberately separate modules. The importer is focused on "get real data from a URL." The pipeline is focused on "generate content from structured data." Keeping them separate lets each evolve independently — you can improve the importer without touching generators, and vice versa. The bridge (`runner.ts`) is intentionally thin.

**SSE over WebSockets for Studio**
The Studio pipeline is one-way: server pushes stage events to client. SSE (`text/event-stream` via `ReadableStream`) is simpler than WebSockets for this — no persistent connection, no client-to-server messages needed, works through standard HTTP, trivially restartable. Use WebSockets if Studio ever needs bidirectional interaction (e.g. interactive review).

**Multi-tenant via env var, not database**
`NEXT_PUBLIC_ACTIVE_BUSINESS` selects the active client at build time. No database. No auth. This works perfectly for the agency use case: each client gets their own Vercel deployment, and the "database" is the `business.ts` file in the repo. It's also why the pipeline outputs TypeScript source — the output is the deployment artifact, not a database record.

---

## Active Businesses

| Slug | Business | Status |
|---|---|---|
| `martinez-landscaping` | Martinez Landscaping & Tree Services | Demo / primary dev target |
| `delaware-lawn-crew` | Delaware Lawn Crew | Demo |
| `pq-landscaping` | PQ Landscaping | Demo |
