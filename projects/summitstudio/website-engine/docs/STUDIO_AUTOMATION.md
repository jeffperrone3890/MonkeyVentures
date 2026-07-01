# Sprint 10 — Studio Automation
## Architecture Design

> Goal: Take five inputs from a new client and produce a 95%-complete `business.ts` file, a design brief, and a photo brief in under 10 minutes — with a confidence score on every generated field so the agency knows exactly what to review.

---

## The Agency Problem

**Current workflow (manual):**
| Phase | Time |
|---|---|
| Client intake call | 45 min |
| Research (their site, GBP, competitors) | 60 min |
| Content writing | 3 hr |
| Building the site | 3 hr |
| Review + revisions | 1.5 hr |
| **Total** | **~9 hours / client** |

**Target workflow (automated):**
| Phase | Time |
|---|---|
| Input five sources | 5 min |
| System extracts + generates | 10 min |
| Agency reviews confidence report | 20 min |
| Fix flagged fields | 20 min |
| Client approval call | 30 min |
| **Total** | **~1.5 hours / client** |

This is the 6× leverage that makes the studio scalable.

---

## The Five Inputs

| Input | Type | What it provides |
|---|---|---|
| **Business website** | URL | Services, about text, existing copy, pricing style, tone |
| **Google Business Profile** | URL or Place ID | Name, address, phone, hours, categories, reviews, photos, attributes |
| **Facebook page** | URL | Posting tone, before/after photos, seasonal patterns, customer interaction style |
| **Service area** | Text or map | City/county names, geographic scope, drive-time radius |
| **Logo** | Image file | Brand colors, typography personality, visual register |

---

## Pipeline Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│  INPUT LAYER                                                          │
│  Website URL · GBP URL · Facebook URL · Service Area · Logo file     │
└──────────────────┬───────────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│  EXTRACTION LAYER  (runs in parallel per source)                      │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │ Web Scraper │  │  GBP Client │  │  FB Client  │  │Logo Analyst│  │
│  │ (Firecrawl/ │  │ (Places API │  │ (Graph API/ │  │(color extr │  │
│  │  Playwright)│  │  or scrape) │  │  or scrape) │  │ + classify)│  │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────┬──────┘  │
└─────────┼────────────────┼────────────────┼───────────────┼──────────┘
          │                │                │               │
          └────────────────┼────────────────┘               │
                           ▼                                │
┌──────────────────────────────────────────────────────────┼───────────┐
│  NORMALIZER                                              │           │
│  Merge all extracted data into a unified RawBusinessData │           │
│  struct. Resolve conflicts (GBP phone wins over website) │           │
│  Tag every field with its source and a raw confidence    │           │
└──────────────────────────────────────────────────────────┼───────────┘
                           │                                │
                           ▼                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│  AI GENERATION LAYER                                                  │
│                                                                       │
│  Receives: RawBusinessData + logo colors + service area              │
│  Produces: generated content for every field not directly extracted  │
│                                                                       │
│  ┌───────────────────────┐   ┌──────────────────────────────────┐    │
│  │  CONTENT GENERATOR    │   │  DESIGN GENERATOR                │    │
│  │  · Tagline            │   │  · Color palette (4 tokens)      │    │
│  │  · Hero subhead       │   │  · Typography pairing            │    │
│  │  · Section copy       │   │  · Border radius personality     │    │
│  │  · Service descriptions│  │  · Photo placement brief         │    │
│  │  · FAQ generation     │   └──────────────────────────────────┘    │
│  │  · CTA variants       │                                            │
│  │  · Competitive advantages│                                         │
│  │  · Brand voice + personality│                                      │
│  └───────────────────────┘                                            │
└──────────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│  CONFIDENCE SCORER                                                    │
│  Every field receives a score 0.0–1.0 and a source tag               │
│  Fields below 0.70 are flagged for human review                      │
└──────────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│  OUTPUT LAYER                                                         │
│                                                                       │
│  business.ts          ← pre-filled schema, ready to typecheck        │
│  _confidence.json     ← score + source for every field               │
│  _design_brief.md     ← colors, fonts, visual direction              │
│  _photo_brief.md      ← what shots to take / request                 │
│  _review_queue.md     ← human-readable list of flagged fields only   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Extraction Layer — Source by Source

### Google Business Profile
GBP is the highest-confidence source for all factual data. Use the Places API (or structured scraping as fallback).

| Field extracted | Mapped to | Confidence |
|---|---|---|
| Name | `name`, `shortName`, `legalName` | 0.95 |
| Phone | `phone`, `phoneHref` | 0.97 |
| Address | `address.*` | 0.97 |
| Coordinates | `geo.lat`, `geo.lng` | 0.97 |
| Website | `url` | 0.95 |
| Hours | `hours`, `openingHours` | 0.93 |
| Founded (if listed) | `foundedYear` | 0.80 |
| Category | service type signals | 0.85 |
| Rating | `reviews.average` | 0.98 |
| Review count | `reviews.count` | 0.98 |
| Description | raw source for AI | — |
| Attributes (licensed, insured, etc.) | `credentials.*` | 0.75 |
| Photos | placement suggestions | 0.80 |
| Reviews text | FAQ mining, testimonial themes, tone | — |

**Review mining** is the most valuable extraction here. Parse the 20 most recent GBP reviews to:
- Extract recurring topics → FAQ questions
- Extract recurring praise → competitive advantages, proof points
- Extract brand personality signals (words customers use to describe them)
- Flag any service mentions not yet in the services list

### Business Website
Use a headless scraper (Firecrawl or Playwright). Extract full text per page.

| Extracted | Used for | Confidence |
|---|---|---|
| Services page text | Service titles, descriptions, includes | 0.70 |
| About page text | `businessStory.founding`, `businessStory.mission` | 0.65 |
| FAQ page (if exists) | `faq[]` | 0.85 |
| Testimonials page | `testimonials[]` | 0.80 |
| Pricing mentions | `pricingStyle` signal | 0.60 |
| Contact page | hours fallback, emergency note | 0.70 |
| Existing tagline | input for AI tagline generation | — |

Note: many client websites are outdated, inaccurate, or thin. Weight this source lower than GBP for factual data. Use it primarily as tone and service-scope input.

### Facebook Page
Scrape the page's About section and recent posts (30 days).

| Extracted | Used for | Confidence |
|---|---|---|
| About text | tone signal, service area signal | 0.60 |
| Post cadence | urgency patterns (seasonal services) | 0.55 |
| Photos tagged as before/after | gallery placement suggestion | 0.70 |
| Post tone / vocabulary | `brandVoice` signals | 0.65 |
| Customer comment themes | FAQ topics | 0.55 |
| Follower count | social proof signal | — |

### Logo Analysis
Pass the logo file to a color extraction model.

| Extracted | Used for | Confidence |
|---|---|---|
| Dominant color | `primary` CSS token candidate | 0.85 |
| Secondary color | `secondary` / `accent` candidate | 0.75 |
| Background color | `background` / `surface` candidate | 0.80 |
| Typography personality | serif vs. sans signal for font pairing | 0.65 |
| Visual register | formal / friendly / rugged / clean | 0.60 |

### Service Area
Parse the text input ("New Castle County, Delaware" or a zip code radius).

| Extracted | Used for | Confidence |
|---|---|---|
| County name | `address.county`, SEO pages | 0.95 |
| State | `address.regionName`, `address.region` | 0.95 |
| City list | `SERVICE_TOWNS[]` | 0.75 |
| Radius | informs city list completeness check | — |

---

## Normalizer — Conflict Resolution Rules

When the same field appears in multiple sources, apply priority:

```
GBP API > GBP scrape > Business website > Facebook > AI-inferred
```

Special cases:
- If GBP phone ≠ website phone, flag both for human review (NAP consistency critical for SEO)
- If services on website don't match GBP categories, merge and flag extras for confirmation
- `foundedYear`: GBP wins if present; otherwise extract from "Founded in XXXX" patterns in about text; otherwise leave for AI estimation with low confidence

---

## AI Generation Layer

### Prompting Philosophy

Every AI call receives a **Business Context Block** as its system context:

```
Business name: {name}
Location: {address.county}, {address.regionName}
Services: {comma-separated service titles}
Founded: {foundedYear}
Reviews: {reviews.average}★ across {reviews.count} reviews
Tone signals: {brandVoice.tone} — avoids: {brandVoice.avoids.join(', ')}
Customer vocabulary: {top 10 words from review mining}
Competitor context: {optional — what the category typically promises}
```

This block is injected into every generation call so outputs are coherent across fields.

### Content Generation — Field by Field

**Tagline** (`BUSINESS.tagline`)
- Input: business name, location, services, review phrases, existing tagline (as "avoid this" if generic)
- Prompt: generate 5 tagline candidates, 4–8 words, outcome-focused, no rhymes, no clichés ("quality you can trust")
- Select top candidate by scoring: specificity, memorability, local signal
- Confidence: 0.45 — always flag for human selection from candidates

**Hero Subhead** (`businessStory.heroSubhead`)
- Input: tagline, foundedYear, county, credentials, ctaStyle.micro signals
- Prompt: 1–2 sentences that expand the tagline promise with a concrete proof point (years, speed, licensed status)
- Confidence: 0.50

**Section Copy** (`sectionCopy.*`)
- Input: brand voice, services, competitive advantages, review themes
- Generate heading + intro for each of the four sections
- `whyChooseUs`: lead with the emotional truth from review mining ("same crew" appears in 40% of reviews → lead with consistency)
- `services`: lead with scope + breadth
- `cta`: lead with friction-reducer (free estimate, 24-hour response)
- `contact`: lead with simplicity + speed
- Confidence: 0.55

**Service Descriptions** (each `Service.details`, `Service.summary`, `Service.includes[]`)
- Input: service title, GBP category, existing website copy, review mentions of this service
- Per-service prompt with the Business Context Block + "Write for a homeowner who has never hired this service before"
- `includes[]`: extract from existing copy if available; otherwise generate from category knowledge
- Confidence: 0.60 (details), 0.55 (includes)

**FAQs** (`BUSINESS.faq[]`)
- Source 1: mine GBP reviews for questions (actual questions customers asked in reviews)
- Source 2: scrape existing FAQ page if present (confidence 0.85)
- Source 3: generate from category — "What questions do {category} customers typically ask before hiring?"
- Target: 6–10 questions. Aim for mix of: pricing, contracts, licensing, timeline, crew, service area
- Confidence: 0.85 (scraped), 0.60 (mined from reviews), 0.40 (generated)

**CTA Copy** (`ctaStyle.*`)
- Primary button: A/B test two variants — action + object ("Request a Free Estimate") vs. outcome ("Get Your Yard Back")
- Default to action + object for clarity; offer outcome variant as alternative
- Confidence: 0.50 — flag for human choice

**Competitive Advantages** (`competitiveAdvantages[]`)
- Mine GBP reviews for praise patterns: what do customers say they couldn't find elsewhere?
- Convert to first-person statements: "Same crew every visit, no rotating strangers"
- Confidence: 0.65

**Brand Voice** (`brandVoice.*`)
- `tone`: classify from review vocabulary + Facebook posts: formal / conversational / friendly / direct
- `avoids`: extract negative patterns ("We're not a big corporate company") → "corporate language, vague promises"
- Confidence: 0.55

**Business Story** (`businessStory.founding`, `.mission`, `.differentiator`)
- `founding`: if about page has a founding story, extract and rewrite. Otherwise, generate from foundedYear + location + service category
- `mission`: one sentence. Input: name, county, services, foundedYear
- `differentiator`: input: competitive advantages list → distill to the single most distinctive claim
- Confidence: 0.50 (generated) to 0.75 (extracted from about page)

**Proof Points** (`proofPoints[]`)
- Use `computed` sentinels for `years-in-business` and `google-rating` — these never need generation
- Remaining 2–3 points: generate from credentials, review count, response time, insurance
- Confidence: 0.95 (computed), 0.70 (extracted credentials), 0.50 (generated)

**Process Steps** (`PROCESS[]`)
- Generate 3 steps matching the client's pricing style and response commitment
- If `pricingStyle === 'quote-based'`: "Send details → Get a written quote → We show up"
- If `pricingStyle === 'transparent'`: "Pick your service → Schedule online → Done"
- Confidence: 0.55

**Urgency** (`urgency`)
- If GBP category includes snow removal or storm services → generate a seasonal urgency message
- Otherwise → `null`
- Confidence: 0.65

---

## Design Generator

### Color Palette

Input: logo dominant color, logo secondary color, visual register classification

Pipeline:
1. Extract hex values from logo
2. Check contrast ratios against white and dark for accessibility (WCAG AA minimum)
3. Generate a 4-token palette:
   - `primary` — the call-to-action color (usually logo's most saturated color, adjusted for WCAG AA)
   - `secondary` — the dark background (deep navy, near-black charcoal, forest green — depends on visual register)
   - `accent` — warm contrast (amber, copper, or gold — for urgency highlights)
   - `highlight` — muted success tone (sage, olive, or teal)
4. Output as CSS custom property values + Tailwind config additions

Confidence: 0.65 — flag for human sign-off before implementation

### Typography Pairing

Input: logo typography personality (serif / sans-serif / slab / script), visual register (formal / friendly / rugged / modern)

Map to curated pairings:

| Signal | Display font | Body font | Character |
|---|---|---|---|
| Formal + serif logo | Cormorant Garamond | Inter | Premium, editorial |
| Friendly + rounded logo | Nunito | Open Sans | Approachable, local |
| Rugged + slab logo | Bitter | Lato | Dependable, blue-collar |
| Modern + geometric logo | Geist | Geist | Clean, tech-forward |
| Traditional + serif logo | Merriweather | Inter | Trusted, established |

Output: `font-display` and `font-sans` values for `tailwind.config.ts`, plus Google Fonts import URLs.

Confidence: 0.60

### Photo Placement Brief

Analyze GBP photo count + categories. Generate a brief listing:

```
NEEDED — 5 priority shots:
1. HERO: Before/after — best transformation project. Shoot horizontal.
   Framing: wide shot of full property, natural light, late afternoon.
2. ABOUT: Crew photo, 2–3 people, branded truck visible in background.
   Framing: candid work pose, not stiff headshots.
3. CTA BACKGROUND: Aerial or wide-angle of finished commercial property.
   Will be shown at 20% opacity behind dark overlay — high contrast OK.
4. [Service 1]: Tight detail shot — mowing pattern, edged border, etc.
5. [Service 2]: Before and after pair — same angle, same time of day.

AVAILABLE from GBP (7 photos):
- 3 appear suitable for services
- 1 possible hero candidate (flagged: low resolution, review needed)
- 3 team/truck shots usable for about section
```

---

## Confidence Scoring Model

### Score bands

| Score | Meaning | Action |
|---|---|---|
| 0.90–1.00 | Direct API field, verified | Auto-accept |
| 0.75–0.89 | Extracted from authoritative source | Auto-accept, spot-check |
| 0.60–0.74 | Extracted from lower-confidence source or lightly edited | Flag in report, quick confirm |
| 0.40–0.59 | AI-generated with good source context | Flag for review |
| 0.00–0.39 | AI-generated from minimal context | Must be rewritten |

### Source weights

```
GBP Places API field    → base 0.95
GBP scraped field       → base 0.85
Website extracted       → base 0.70
Facebook extracted      → base 0.60
AI-generated            → base 0.40 + context bonus
  + business name used  → +0.05
  + location used       → +0.05
  + review text used    → +0.08
  + existing copy used  → +0.06
  max AI score          → 0.65
```

---

## Output Artifacts

### `business.ts`
A fully valid, typechecked file using the `as const satisfies Business` pattern. Every generated value is present. Fields with confidence < 0.70 have a comment: `// REVIEW: confidence 0.52 — verify this`.

### `_confidence.json`
Machine-readable map of every field to its score and source:
```json
{
  "name":       { "value": "Martinez Landscaping", "score": 0.97, "source": "gbp-api" },
  "tagline":    { "value": "Landscapes worth coming home to.", "score": 0.45, "source": "ai-generated", "alternatives": ["...","..."] },
  "sectionCopy.cta.heading": { "value": "Ready for a yard you're proud of?", "score": 0.50, "source": "ai-generated" }
}
```

### `_review_queue.md`
A human-readable list of only the fields that need attention, sorted by confidence ascending:

```markdown
## Fields to review (15 fields below 0.70 confidence)

### Must rewrite (below 0.40)
- [ ] tagline — 3 AI candidates below

### Should verify (0.40–0.59)
- [ ] sectionCopy.whyChooseUs.heading
- [ ] businessStory.founding
- [ ] ...

### Quick confirm (0.60–0.69)
- [ ] services[1].includes[2]
- [ ] faq[4].answer
- [ ] ...
```

### `_design_brief.md`
Color palette, typography recommendation, and rationale. Written for a non-technical client to approve.

### `_photo_brief.md`
Shot list with framing notes. Can be handed directly to a photographer or sent to the client.

---

## AI Connection Points

The pipeline is designed so the AI calls are isolated behind a single interface:

```typescript
interface AIProvider {
  generate(prompt: string, context: BusinessContext): Promise<string>;
  classify(text: string, labels: string[]): Promise<string>;
  extractColors(imageBuffer: Buffer): Promise<ColorPalette>;
}
```

On day one this can be backed by a single `anthropic.messages.create()` call. Later:
- Swap to Claude for content generation (best prose quality)
- Swap to a vision model for logo color extraction
- Add a cheap model for low-stakes classifications (tone, visual register)
- Add caching to avoid re-generating fields when only one input changed

The pipeline itself never imports a specific AI SDK — it only calls `AIProvider`. This keeps the automation architecture stable as models improve.

---

## Data Flow Summary

```
Website URL      →  WebScraper      → RawWebData
GBP URL          →  GBPClient       → RawGBPData     ─┐
Facebook URL     →  FBClient        → RawFBData       ├→ Normalizer → UnifiedBusinessData
Service area     →  GeoParser       → RawGeoData      │
Logo file        →  LogoAnalyst     → LogoData       ─┘
                                                             │
                                                             ▼
                                                     ContentGenerator (AI)
                                                     DesignGenerator  (AI)
                                                             │
                                                             ▼
                                                     ConfidenceScorer
                                                             │
                                           ┌─────────────────────────────┐
                                           │  business.ts                │
                                           │  _confidence.json           │
                                           │  _review_queue.md           │
                                           │  _design_brief.md           │
                                           │  _photo_brief.md            │
                                           └─────────────────────────────┘
```

---

## Implementation Sequence (when ready to build)

1. **GBP Extractor** — highest ROI. GBP data alone fills 40% of `business.ts` at 0.90+ confidence.
2. **Confidence Scorer + Output Writer** — needed before anything else is useful. Even with only GBP data, the system can output a partially-complete file with clear review flags.
3. **Content Generator** — wire up Claude. Generate tagline, section copy, FAQs, competitive advantages.
4. **Web Scraper** — adds service descriptions and about text. Significantly improves AI generation quality.
5. **Logo Analyst** — add color extraction. Generates the design brief.
6. **Facebook Client** — lowest ROI per effort. Adds tone signals but content generator already handles tone from reviews.
7. **Review Interface** — a simple web form or CLI for the agency to confirm flagged fields.

---

## What the Agency Owner Needs to Touch

After the pipeline runs, the agency's job is:

1. Open `_review_queue.md` — typically 10–20 fields
2. For each field: accept, edit in place, or rewrite
3. Choose a tagline from the 5 candidates
4. Approve or adjust the color palette
5. Approve or adjust the typography pairing
6. Send `_photo_brief.md` to client (or schedule a shoot)
7. Run `npm run typecheck` — confirms the file is valid
8. Start `npm run dev` — walk the site

**Target: 25 minutes of agency review time per client.**
