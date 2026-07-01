# Design System

Every visual decision in the Summit Studio website engine. Values come directly from the code — not aspirational, not approximate. A developer who reads this document should be able to contribute a new section without asking anyone a question.

---

## Color Tokens

Colors live in `src/data/businesses/<slug>/theme.ts`. Components reference semantic role names only — never hex values directly. This is enforced by routing everything through `tailwind.config.ts`.

### Semantic roles

| Token | Martinez value | Role |
|---|---|---|
| `primary` | `#1F4733` | Links, icon fills, active states, button fills, eyebrow text, focus rings |
| `secondary` | `#12241B` | Dark section backgrounds, footer, all heading text (`h1`–`h4`) |
| `accent` | `#C98A3C` | Primary button background, location pin, ping dot, highlight chip |
| `accent-soft` | `#E0B878` | Footer typography on dark, logo subtext on dark, star color |
| `highlight` | `#3C7A57` | Eyebrow text in `SectionHeading`, map pin icons, check icons, insurance badges |
| `tertiary` | `#5A6E40` | Reserved — not currently used in any component |
| `background` | `#FBFBF8` | Page background, `paper` section tone, form panels |
| `surface-50` | `#F2F5EE` | `sage` section tone, filter pill default, mobile nav item bg |
| `surface-100` | `#E7EDE3` | Hover state on light pill buttons |
| `foreground` | `#16241C` | Body text on light backgrounds |
| `muted` | `#5C6B60` | Secondary text, captions, timestamps, placeholder labels |

### Color usage rules

**One accent call-to-action per page.** `accent` (`#C98A3C`) is the hottest color on the page. It appears on the primary `Button` (variant `primary`) and nowhere else at full opacity. Any secondary use — rating stars, ping animations, the location pin — is acceptable because those elements are small and contextual.

**Never use `primary` and `accent` at equal visual weight next to each other.** In the hero, `primary` button is dark green and `accent` is the color of the copper primary button — they do not appear side by side.

**Dark sections use the `forest` tone.** The `bg-secondary` background flips the text stack: body text becomes `text-surface-50/80`, muted text becomes `text-surface/60`, headings become `text-surface-50`. Do not mix light-text colors onto dark sections ad-hoc; use the `forest` tone on `<Section>`.

**Opacity modifiers create tonal hierarchy.** Foreground at `/8` (`border-foreground/8`) is the standard hairline. `/5` is the micro-border on form fields and cards. `/15` and `/20` are mid-strength dividers. Never invent a new opacity step without checking whether an existing one fits.

### Tint surfaces — the most common card pattern

Light-mode cards, form panels, and badges use tint surfaces rather than borders as their primary container identity:

```
bg-primary/5    — very faint green tint (phone CTA hover bg)
bg-primary/10   — form field icon backgrounds, avatar initials
bg-primary/15   — phone CTA icon default bg
bg-accent/10    — financing badge, error alert
bg-highlight/5  — guarantee section tint
bg-highlight/15 — guarantee icon bg, success icon bg
bg-surface-50   — filter pills, mobile nav items
bg-surface-50/10 — dark-section overlay badges (backdrop-blur)
```

---

## Typography

### Font pairing (Martinez)

| Role | Family | Variable | Fallback |
|---|---|---|---|
| Display / headings | Fraunces | `--font-display` | Georgia, serif |
| Body / UI | Hanken Grotesk | `--font-sans` | system-ui, sans-serif |

Fraunces is an optical size serif — slightly loose at small sizes, very tight at display sizes. Its optical character (`opsz` axis) reads as handcrafted without being decorative.

Hanken Grotesk is a neutral grotesque — more personality than Inter, less quirk than Geist. It does not compete with Fraunces at display sizes.

Both load via `next/font/google` with `display: 'swap'`. The CSS variable names (`--font-display`, `--font-sans`) are wired in `src/app/layout.tsx` and consumed by `tailwind.config.ts`.

### Type scale

All headings default to `font-display` via the global CSS rule:
```css
h1, h2, h3, h4 { @apply font-display; text-wrap: balance; }
```

| Token | Size (fluid) | Line height | Letter spacing | Use |
|---|---|---|---|---|
| `text-display-lg` | clamp(2.75rem → 5rem) | 1.02 | −0.02em | Not currently used — reserved for hero variants |
| `text-display` | clamp(2.25rem → 3.75rem) | 1.05 | −0.02em | Hero `h1` |
| `text-heading` | clamp(1.75rem → 2.5rem) | 1.12 | −0.015em | `SectionHeading` h2 |
| `text-logo` | 1.0625rem (17px) | 1 | −0.01em | Logo wordmark primary |
| `text-logo-sub` | 0.625rem (10px) | 1 | +0.22em | Logo wordmark secondary |
| `text-2xl` | 1.5rem | — | — | Service card titles, sub-section headings |
| `text-xl` | 1.25rem | — | — | — |
| `text-lg` | 1.125rem | — | — | Benefit titles, gallery card titles, FAQ questions |
| `text-[17px]` | 17px | relaxed | — | Body lead text (hero subhead, section intro body copy) |
| `text-[15px]` | 15px | relaxed | — | Standard body text within sections |
| `text-base` | 1rem | — | — | Large button label |
| `text-sm` | 0.875rem | — | — | Secondary labels, footer links, proof bar |
| `text-xs` | 0.75rem | — | — | Badges, category pills, timestamps, legal text |

### Font weight conventions

| Weight | Token | Use |
|---|---|---|
| 400 | `font-normal` | Body text, relaxed prose |
| 500 | `font-medium` | Nav links, list items, filter pills |
| 600 | `font-semibold` | Section headings, card titles, buttons, proof bar labels |
| 700 | `font-bold` | Phone number in contact card only |

### Letter spacing

```
tracking-tight        — display headings via fluid size tokens
tracking-wider        — form fieldset legends, footer column headings, badge labels
tracking-[0.18em]     — ALL_CAPS eyebrow labels (SectionHeading, footer h3, proof bar)
tracking-[0.22em]     — logo subtext only
```

**Rule:** All-caps text always has wide tracking. Sentence-case display text always has tight tracking. Never mix.

### Prose width constraints

Long body copy uses `max-w-*` to keep line length comfortable:

| Token | Use |
|---|---|
| `max-w-[52ch]` | Standard body paragraph in sections |
| `max-w-[60ch]` | Wider body paragraphs (WhyChooseUs founding paragraph, service area prose) |
| `max-w-[40ch]` | Compact copy under benefit numerals |
| `max-w-[38ch]` | Service card detail text |
| `max-w-3xl` | `Container size="narrow"`, FAQ page intro, StatementSection blockquote |
| `max-w-lg` | Hero subhead |

---

## Spacing Scale

The base grid unit is **8px**. All spacing values should be multiples of 8px. Custom tokens were added for the two gaps in Tailwind's default scale:

| Custom token | Value | Notes |
|---|---|---|
| `4.5` | 1.125rem (18px) | Button arrow icons, gap between icon and text in service area |
| `5.5` | 1.375rem (22px) | Available, not currently used |
| `13` | 3.25rem (52px) | Large button height (`h-13`) |
| `18` | 4.5rem (72px) | Navbar height (`h-18`) |

**Standard gaps used in practice:**

| Gap | Usage |
|---|---|
| `gap-1.5` | Star icon gap, inline badge icon gap |
| `gap-2` | Proof bar icon-to-text gap, small inline icon gaps |
| `gap-2.5` | Footer nav items, filter pills row |
| `gap-3` | Body list items (benefits, service includes, city list) |
| `gap-4` | Phone CTA inner layout |
| `gap-6` | Card grids (testimonials), contact info card list |
| `gap-8` | Gallery grid, WhyChooseUs layout gap on mobile |
| `gap-10` | Contact section grid mobile |
| `gap-12` | Footer grid gap, WhyChooseUs about image gap |
| `gap-14` | Contact section grid desktop (`lg:gap-14`) |
| `gap-16` | Service area grid desktop (`lg:gap-16`) |

---

## Border Radius

Two custom brand radii extend Tailwind's default scale:

| Token | Value | Name | Use |
|---|---|---|---|
| `rounded-full` | 9999px | Pill | Buttons, filter pills, avatar initials, badges, proof bar indicators |
| `rounded-xl` | 0.75rem | Standard | Logo mark container, mobile nav items, upload icon box, mobile menu toggle, form field focus ring |
| `rounded-2xl` | 1rem | Medium | Form input fields, contact info cards (email, hours, address) |
| `rounded-3xl` | 1.5rem | Large | Gallery image wrapper, process step cards, photo upload area |
| `rounded-4xl` | **2rem** (custom) | Brand large | Testimonial cards, aggregate rating box |
| `rounded-5xl` | **2.75rem** (custom) | Brand xlarge | About image, service area county panel, contact form outer panel |

**Rule:** Radius increases with the visual weight and importance of the container. Small interactive elements use `rounded-xl` or `rounded-2xl`. Feature cards use `rounded-4xl`. Signature hero containers use `rounded-5xl`. Buttons always use `rounded-full` regardless of size.

---

## Elevation & Shadows

Three shadow levels. The design avoids hard drop shadows — all use the brand's deep green (`rgba(18, 36, 27, ...)`) for chromatic coherence.

| Token | Definition | State | Use |
|---|---|---|---|
| `shadow-soft` | `0 1px 2px .../0.04, 0 8px 24px -12px .../0.18` | Default | Cards at rest, buttons at rest, form panels |
| `shadow-lift` | `0 2px 4px .../0.05, 0 24px 48px -20px .../0.28` | Hover / prominent | Cards on hover, service area panel, phone CTA hover |
| `shadow-ring` | `0 0 0 1px rgba(18, 36, 27, 0.06)` | Subtle | Available but used sparingly — can layer with `shadow-soft` |

**Rule:** Never apply `shadow-lift` at rest — it's a hover reward. Cards always start at `shadow-soft` and graduate to `shadow-lift` on `hover`. The service area county panel is the one exception (it's always elevated because it's a hero visual element, not a clickable card).

---

## Containers & Layout

### `<Container>`

```tsx
// Default: max-w-content (1200px), px-5 sm:px-8
<Container>...</Container>

// Narrow: max-w-3xl (768px), px-5 sm:px-8
<Container size="narrow">...</Container>
```

The `max-w-content` token is 1200px — set in `tailwind.config.ts`. This is the single source of truth for the content column width. Never use `max-w-7xl` or similar Tailwind defaults that don't correspond to the design spec.

Horizontal gutters: `px-5` (20px) on mobile, `sm:px-8` (32px) on sm+. Nothing tighter. Nothing wider.

### Navbar height

`h-18` = 72px. Section anchors use `scroll-mt-24` (96px) for safe clearance above the navbar at all scroll positions.

---

## Section Component

```tsx
<Section tone="paper">   // bg-background text-foreground
<Section tone="sage">    // bg-surface-50 text-foreground
<Section tone="forest">  // bg-secondary text-surface-50
```

Every section wraps in `<Section>`. The only exception is `<Hero>` (which uses a custom full-viewport layout) and `<ProofBar>` (which has its own compact padding with a bottom hairline border, not a `<Section>`).

**Vertical padding:** `py-20 sm:py-28` (80px / 112px). This value is non-negotiable — it creates the breathing room that gives the design its editorial feel. Never reduce it inside a section for "balance."

**Scroll margin:** `scroll-mt-24` on every section. This ensures in-page anchor links land with the section heading visible above the navbar.

### Tone alternation — the rhythm rule

Adjacent sections alternate tones to create visual rhythm without relying on borders:

```
Hero      → (dark, no Section wrapper)
ProofBar  → paper (hairline border-b)
WhyChooseUs → paper
Services  → sage
StatementSection → paper (own wrapper)
Gallery   → paper
Testimonials → sage
ServiceArea  → paper
[HorizonDivider]
CTA       → forest
Guarantee → paper (conditionally)
Contact   → sage
FAQSection → sage (HairlineDivider above if contact is sage)
```

**The rule:** `paper` and `sage` alternate. `forest` appears once — at the CTA — as the page's strongest visual moment before the contact form. Never use `forest` twice.

---

## Buttons

Six variants, three sizes. Always rendered by `<Button>` — never style raw `<a>` or `<button>` elements to look like buttons.

### Variants

| Variant | Background | Text | Use case |
|---|---|---|---|
| `primary` | `accent` → `accent-soft` on hover | `secondary` | The single most important action on each section. Never more than one per visual block. |
| `dark` | `primary` → `secondary` on hover | `surface-50` | Secondary CTA on light backgrounds (Services section, ServiceArea section). |
| `outline` | Transparent | `primary` | Tertiary action on light backgrounds. |
| `ghost` | Transparent | `primary` | Low-emphasis action (no border). |
| `onDark` | `surface-50` → white on hover | `secondary` | Secondary CTA on `forest` sections (beside a `primary` button in the CTA). |
| `outlineOnDark` | Transparent | `surface-50` | Ghost-like secondary on dark backgrounds (hero phone button). |

### Sizes

| Size | Height | Padding | Text |
|---|---|---|---|
| `sm` | `h-9` (36px) | `px-4` | `text-sm` |
| `md` | `h-11` (44px) | `px-6` | `text-[15px]` |
| `lg` | `h-13` (52px) | `px-8` | `text-base` + `py-3.5` |

**Default size is `md`.** Use `lg` for the page's primary conversion CTA (hero, CTA section). Use `sm` in compact contexts (navbar, footer).

### Button radius

Controlled by `THEME.buttonStyle.radius`. Current value: `rounded-full`. To change the button shape for a new client, change this one token in `theme.ts`. Never override button radius with a `className` prop.

### Hover behavior

All buttons get:
```
transition-all duration-200 ease-out-expo
```

`primary` and `dark` variants lift on hover:
```
hover:-translate-y-0.5 hover:shadow-lift
```

`outline`, `ghost`, `onDark`, `outlineOnDark` do not lift — they change border or background opacity only.

---

## Cards

There is no `<Card>` component. Cards are context-specific implementations. The shared anatomy:

```
rounded-4xl                    ← brand radius
border border-foreground/5     ← micro-border for definition
bg-background                  ← always background (never surface) for contrast vs. section bg
p-6                            ← standard padding — 24px all sides
shadow-soft                    ← resting elevation
transition-all duration-300    ← smooth hover
hover:-translate-y-1           ← lift reward
hover:shadow-lift              ← shadow elevation on hover
```

### Testimonial card (canonical pattern)

```tsx
<figure className="flex h-full flex-col rounded-4xl border border-foreground/5 bg-background p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
```

`flex h-full flex-col` is critical — it ensures all cards in a grid row equalize to the tallest card's height, with the quote filling available space (`flex-1`) and the attribution always at the bottom.

### Contact info cards

```tsx
<li className="flex items-center gap-4 rounded-2xl border border-foreground/5 bg-background p-5 shadow-soft">
```

Use `rounded-2xl` (not `rounded-4xl`) and `p-5` (not `p-6`) for compact utility cards. The phone CTA is the exception — it uses `p-5` but `rounded-3xl` for a slightly more prominent feel.

### Service items — no card

Service items in the Services section are **not cards**. They have a `border-t border-foreground/10` hairline at the top and no other container. This is the editorial rule: services need no chrome because they're list items in a structured document, not promotional cards.

### Process step cards (CTA section)

```tsx
<div className="h-full rounded-3xl border border-surface-50/15 bg-surface-50/[0.05] p-6 backdrop-blur-sm">
```

Dark-background cards use `border-surface-50/15` (not `border-foreground/5`) and a translucent tinted background instead of `bg-background`. The `backdrop-blur-sm` softens the background image beneath.

---

## Forms

### Field anatomy

```tsx
const fieldBase = cn(
  'w-full rounded-2xl border border-foreground/10 bg-background',
  'px-5 py-4 text-[15px] text-foreground',
  'placeholder:text-muted/60',
  'transition-colors',
  'focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
);
```

All form inputs, selects, and textareas use this exact string. Never deviate from it.

**Key values:**
- `rounded-2xl` — form-specific radius (not `rounded-xl`, not `rounded-3xl`)
- `border-foreground/10` → `focus:border-primary` — the border changes color on focus (no glow, just color)
- `focus:ring-2 focus:ring-primary/20` — a soft halo that does not compete with the label

### Form grouping

Fields are grouped into `<fieldset>` elements with `<legend>`. The legend uses the all-caps eyebrow pattern:
```tsx
<legend className="text-xs font-semibold uppercase tracking-wider text-muted">
```

Groups are separated by `border-t border-foreground/5 pt-6`. Never use `<hr>` inside a form — use the border-t pattern.

### Submit button placement

The submit button lives in the final group, left-aligned in a flex row. The trust evidence (star rating, privacy note) sits to its right on desktop, below it on mobile:
```tsx
<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
  <Button type="submit">...</Button>
  <div>... trust text ...</div>
</div>
```

### Progressive disclosure

Optional fields are hidden behind a `<ChevronDown>` toggle. Use `AnimatePresence` + `motion.div` with `height: 0 → 'auto'` for the expand animation. The `useReducedMotion` hook disables the height transition for users who prefer it (opacity only).

### Error state

```tsx
<p className="rounded-2xl bg-accent/10 px-4 py-3 text-sm text-accent" role="alert">
  {error}
</p>
```

Errors appear above the submit button, inside the final group, after the `border-t`. Use `role="alert"` for screen readers.

---

## Icons

Lucide React exclusively. Never mix icon libraries.

### Size conventions

| Class | px | Use |
|---|---|---|
| `h-3.5 w-3.5` | 14px | Inline micro-icons (hero trust line star, button trailing arrow at nav scale) |
| `h-4 w-4` | 16px | Standard inline icons — nav phone, footer links, proof bar, form field icons |
| `h-4.5 w-4.5` | 18px | Slightly larger inline icons (Services button trailing arrow) |
| `h-5 w-5` | 20px | Button icons at `md`/`lg` size, form field indicator icons |
| `h-6 w-6` | 24px | Navbar hamburger/close, testimonial quote mark |
| `h-7 w-7` | 28px | Card feature icons (phone CTA, guarantee shield, service area pin) |
| `h-9 w-9` | 36px | Section display icons (service cards, service detail page headers) |

### Stroke width

| Value | Use |
|---|---|
| Default (2) | All icons unless listed below |
| `strokeWidth={1.5}` | Large display icons on service cards and service pages |
| `strokeWidth={1.75}` | Proof bar icons (medium weight between default and 1.5) |

**Rule:** Larger icons use lighter stroke weight. An `h-9` icon at strokeWidth 2 reads as clunky; 1.5 reads as deliberate.

### Color conventions

| Color | Use |
|---|---|
| `text-primary` | Action icons, section display icons |
| `text-highlight` | Supporting icons — footer list icons, service area pins, check marks, insurance badges |
| `text-accent` | Stars, the service area ping dot |
| `text-muted` | Low-emphasis icons (quote mark in testimonials) |
| `text-surface-50` | Icons on dark backgrounds |
| `text-accent-soft` | Icons on dark backgrounds where primary-level emphasis is needed |

Always add `aria-hidden="true"` to decorative icons. Add `aria-label` or a visible text alternative for functional icons (nav toggle, social links).

---

## Grid System

All grids use CSS Grid via Tailwind `grid` utilities. No masonry, no flexbox grids.

### Column patterns

| Grid | Classes | Used in |
|---|---|---|
| Stats strip | `grid-cols-2 lg:grid-cols-4` | WhyChooseUs stats |
| Feature 2-col | `lg:grid-cols-2` | WhyChooseUs (copy + image), ServiceArea (copy + map) |
| Feature 3-col | `sm:grid-cols-2 lg:grid-cols-3` | Services, Testimonials |
| Gallery | `md:grid-cols-2 xl:grid-cols-3` | Gallery — 1 col mobile, 2 col md, 3 col xl |
| Service towns | `grid-cols-2 sm:grid-cols-3` | ServiceArea town list |
| Contact layout | `lg:grid-cols-12` | Contact — 5 + 7 column split |
| Footer layout | `lg:grid-cols-12` | Footer — 4 + 2 + 3 + 3 column split |

### Gap conventions

| Gap | Use |
|---|---|
| `gap-6` | Card grids (testimonials, contact cards) |
| `gap-8` | Gallery grid, WhyChooseUs benefits list |
| `gap-x-8 gap-y-0` | Services grid (horizontal gap only — vertical rhythm comes from `pt-8 pb-12` per item) |
| `gap-10 lg:gap-14` | Contact section column gap |
| `gap-12 lg:gap-16` | Section two-column layout gaps |

**Rule:** Content grids use `gap-6` or `gap-8`. Layout grids (two-column section layouts) use `gap-12` or `gap-16`. The difference is intentional — layout gaps are the breathing room between columns; content gaps are the gutters between cards.

---

## SectionHeading Component

The standard heading block used by every section. Never recreate the eyebrow → h2 → intro pattern manually.

```tsx
<SectionHeading
  eyebrow="What we do"         // Required — all caps, wide tracking, accent mark
  title="..."                  // Required — h2, display font, heading size
  intro="..."                  // Optional — body lead text, text-lg
  align="left"                 // 'left' (default) | 'center'
  invert={false}               // true = light text for forest tone backgrounds
/>
```

The eyebrow always renders with a `<Sprig>` mark (the brand's signature small leaf SVG) prepended. Do not add additional eyebrow decoration.

**Heading is `max-w-2xl` by default.** The heading block never spans the full content width — it's constrained by the component. This prevents line-wrapping problems at large type sizes.

---

## Animation & Motion

### The `<Reveal>` component

The only approved mechanism for scroll-triggered animation.

```tsx
<Reveal delay={0}>           // delay in seconds (0, 0.05, 0.08, 0.1, 0.15)
<Reveal from="up">           // 'up' (default) | 'left' | 'right' | 'none'
<Reveal as="li">             // 'div' (default) | 'li' | 'span'
```

**Parameters:**
- Duration: `0.7s`
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` — a fast ease-out expo that feels physical
- Offset: 16px in the specified direction (`y: 16` for `from="up"`)
- Trigger: `whileInView` + `viewport={{ once: true, margin: '-80px' }}`
- `once: true` — the animation plays once and never replays on scroll-back

**Prefers reduced motion:** When the user has enabled `prefers-reduced-motion`, the transform is removed and only the opacity fade remains (0 → 1 in 0.7s).

### Where `<Reveal>` is used — and where it is not

**Used:** `SectionHeading`, testimonial cards, contact phone CTA, gallery cards, stats (via SectionHeading), guarantee, proof points.

**Not used:** Hero, WhyChooseUs section copy, service cards, Stats strip, StatementSection. The editorial sections intentionally have no entrance animation — they read like a print document, not a product demo.

### Stagger delays

When multiple items animate in sequence, increment delay by 0.05–0.08s per item:
```tsx
{items.map((item, i) => (
  <Reveal key={item.title} delay={i * 0.06}>
    ...
  </Reveal>
))}
```

Cap stagger at 3 items — never delay the 4th item more than ~0.2s. Beyond that, the animation feels slow.

### Hover interactions

Interactive elevation: `hover:-translate-y-0.5` (buttons) or `hover:-translate-y-1` (cards).
Shadow reward: `hover:shadow-lift`.
Duration: `duration-300` for cards, `duration-200` for buttons.
Easing: `ease-out-expo` (`transition-all duration-200 ease-out-expo`) on buttons.

### The `animate-ping` rule

`animate-ping` appears exactly once in the codebase — on the service area location dot. It signals "this is where we are" with a continuous pulse. Do not apply `animate-ping` to call-to-action elements or anything intended to draw repeated attention.

### Contact form expand

The progressive disclosure field group uses `AnimatePresence` + `motion.div`:
```tsx
initial: { opacity: 0, height: 0 }
animate: { opacity: 1, height: 'auto' }
exit:    { opacity: 0, height: 0 }
transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
```

Always pair height animation with `className="overflow-hidden"` on the motion element.

---

## Photography

### Required images

| File | Dimensions | Notes |
|---|---|---|
| `public/images/hero.jpg` | 1600×1200px min | Landscape or portrait OK — object-cover handles both |
| `public/images/about.jpg` | 800×1000px | Portrait strongly preferred — fills `aspect-[4/5]` |
| `public/images/cta.jpg` | 1600×900px | Shown at `opacity-20` under dark overlay — high contrast acceptable |
| `public/images/og.jpg` | 1200×630px | Open Graph image — appears when links are shared |

### Hero — hard split layout

**Mobile:** Full-width image stacks above text column. Image height: `h-[42svh]`. The image has a `bg-secondary/20` overlay to prevent the dark text column from feeling disconnected.

**Desktop:** Left half is the text column (`w-1/2`). Right half is the full-bleed image (`w-1/2`). A 12px gradient (`w-12 bg-gradient-to-r from-secondary to-transparent`) on the left edge of the image softens the hard split at the seam. No border-radius anywhere on the hero — hard edges are the intention.

```tsx
// Left-edge gradient on desktop image:
<div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-secondary to-transparent" />
```

### About image

```tsx
<div className="relative aspect-[4/5] overflow-hidden rounded-5xl">
  <Image src="/images/about.jpg" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
  <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent" />
</div>
```

The gradient overlay (`from-secondary/40`) grounds the image visually, especially if the bottom of the photo has a light sky or bright background. The `rounded-5xl` is the largest brand radius — used here because the about image is a signature visual element.

### Gallery images

**Aspect ratio:** `aspect-[4/3]` (4:3 landscape). All before/after images must share this ratio — the `BeforeAfterSlider` requires consistent dimensions.

**Radius:** `rounded-3xl` on the wrapper. No additional border.

**Caption layout:** Title and category pill sit outside the image on a plain background (no card). Title is `font-display text-lg font-semibold`, category uses the small all-caps pill.

### CTA background

```tsx
<Image
  src="/images/cta.jpg"
  fill
  aria-hidden="true"
  className="absolute inset-0 -z-10 object-cover opacity-20"
/>
```

The `opacity-20` ensures the photo reads as texture, not as a competing image. Combined with the `bg-secondary via-secondary/90` gradient, the result is a dark section with subtle visual depth.

### Topographic SVG

A decorative motif used in two places:
- Hero (not visible — removed in Sprint 7 editorial rewrite)
- ServiceArea county panel: `opacity-[0.07]`
- CTA section: `opacity-[0.04]`

**Rule:** 7% on dark containers, 4% on the CTA's dark overlay. Never use at higher opacity — the motif is signature texture, not a design element.

---

## Editorial Rules

The editorial design direction (Sprint 7) removed visual complexity from content sections. These rules define what "editorial" means in this system.

### No card chrome on service items

Services are structured as a document list, not a product catalog. Each item has:
- `border-t border-foreground/10` — a hairline separator above
- No border on left, right, or bottom
- No background
- No shadow
- No hover lift

```tsx
<article className="group flex flex-col border-t border-foreground/10 pb-12 pt-8">
```

### No icon backgrounds in ProofBar

Trust credentials in the ProofBar are typographic. No icon circles, no card borders, no backgrounds:
```tsx
<li className="flex items-center gap-2 text-sm">
  <Icon className="h-4 w-4 shrink-0 text-primary" />
  <span className="font-semibold text-secondary">{label}</span>
  <span className="text-muted">{detail}</span>
</li>
```

### Numbered list for benefits (no icon cards)

Benefits in WhyChooseUs use large decorative numerals (`font-display text-5xl font-semibold text-foreground/10`) rather than icon cards. The numeral is `aria-hidden="true"` — the heading carries the semantic meaning.

### Stats strip — no card boxes

Stats use a `divide-x divide-foreground/8 border-y border-foreground/8` strip with `py-8 text-center` per cell. No card backgrounds, no rounded corners:
```tsx
<div className="grid grid-cols-2 divide-x divide-foreground/8 border-y border-foreground/8 lg:grid-cols-4">
```

### StatementSection — one sentence

The StatementSection exists as an intentional pause. One sentence. Display serif italic. Centered. No eyebrow, no sub-copy, no button.

```tsx
<p className="font-display text-2xl italic leading-relaxed text-secondary/80 sm:text-3xl md:text-[2rem]">
  &ldquo;{statement}&rdquo;
</p>
```

The `text-secondary/80` (not full `text-secondary`) creates slight softness — it reads as a quote, not a headline.

---

## Section Spacing

### Vertical rhythm

The section padding token is `py-20 sm:py-28` — set in `<Section>` and not overridden. This is the single vertical rhythm value for the entire page.

**Within a section**, use `mt-*` to control spacing between the heading and the content, and between content items. Never add extra `pb-*` to a section's children — the section padding owns the bottom whitespace.

Common internal vertical spacings:

| Token | Use |
|---|---|
| `mt-4` | Intro paragraph after SectionHeading h2 |
| `mt-6` | Founding paragraph after SectionHeading |
| `mt-8` | Reveal items after heading (phone CTA, service town list) |
| `mt-9` | Small gaps (service area CTA group) |
| `mt-10` | Gallery filter pills, hero CTA buttons group |
| `mt-12` | Benefits numbered list |
| `mt-14` | Services grid |
| `mt-16` | CTA process steps |
| `mt-20` | WhyChooseUs inner grid |
| `space-y-3` | List items (service includes, benefits body, competitive advantages) |
| `space-y-10` | Numbered benefits list |

### HairlineDivider

`<HairlineDivider />` appears between sections that share the same background tone (both `sage` in the FAQ–Contact pair). It is a single `border-t border-foreground/8` rule. No margin is added — the adjacent section padding provides the gap.

### HorizonDivider

`<HorizonDivider fill={THEME.colors.secondary}>` appears between the light sections and the CTA. It's a diagonal SVG transition — the SVG fill color matches the destination section's background. This is the only section transition that is not handled by tone alternation alone.

---

## Composition

### Page section order — decision journey map

```
1. Hero            — Hook: who you are and what you do
2. ProofBar        — Instant credibility: five trust signals
3. WhyChooseUs     — Emotional case: why this crew, not any crew
4. Services        — Rational case: what's actually available
5. StatementSection — Editorial pause: the core belief in one sentence
6. Gallery         — Work quality proof: before/after evidence
7. Testimonials    — Social proof: other people made this decision
8. ServiceArea     — Friction removal: do you serve my area?
9. CTA             — Restate the offer — now they're ready
10. Guarantee      — Risk reversal — now they have no excuse not to
11. Contact        — The form — conversion goal
12. FAQSection     — Final objections — anything left?
```

This order reflects a sales conversation, not a random design choice. Moving sections breaks the logic. New sections should be inserted based on where they fit in the decision journey, not visual preference.

### Navbar

Fixed, transparent over the hero. Transitions to `bg-background/85 backdrop-blur-md border-b border-foreground/5` once the user scrolls 24px. The mobile menu covers the full viewport below the header.

Active section detection uses `IntersectionObserver` with a `rootMargin: '-10% 0px -60% 0px'` viewport window. This fires when the top 40% of the viewport contains a section's content — it matches expected active behavior during scroll.

### Footer

Four-column layout (4 + 2 + 3 + 3 on `lg`). Brand + pitch / Explore / Services / Contact. The footer is purely navigational — no marketing copy beyond the mission pitch. Legal bar is a single row: copyright left, social icons and attribution right.

### EmergencyBanner

Fixed to `bottom-0`, `z-40`, above the footer. Visible only when `BUSINESS.emergencyService` is not null. When visible, `<body>` receives `pb-14` to prevent the banner from overlapping the footer CTA.

---

## Interaction Principles

### Hierarchy of affordances

1. **Primary CTA** — one per viewport at any scroll position. The most important action available.
2. **Secondary CTA** — always less visually prominent than primary (different variant or size).
3. **Link** — inline text links use `text-primary underline-offset-4 hover:underline`. Never underline by default — the `hover:underline` is the affordance.
4. **Navigation links** — `font-medium` text, `hover:opacity-70`. No underline, no color shift on hover.

### Focus management

```css
:focus-visible {
  outline: 2px solid theme('colors.primary');
  outline-offset: 2px;
}
```

This applies globally. Component-level focus rings (buttons use `focus-visible:ring-2 focus-visible:ring-offset-2`) add a colored ring around the element. The global rule is a fallback and ensures every interactive element is keyboard-navigable.

Skip link (`class="skip-link"`) is positioned absolutely off-screen until focused, then translates into view. It targets `#main`.

### Hover feedback must be instant

`transition-all duration-200` (not 300ms) on buttons. The 200ms duration feels responsive — 300ms feels sluggish on a button.

Card hover transitions use `duration-300` because the lift + shadow animation benefits from slightly more time.

### Disabled states

```
disabled:cursor-not-allowed disabled:opacity-60
```

Applied via `base` string in `<Button>`. Never use a different disabled pattern.

### Links that look like links

Inline links within prose (footer legal text, ProofBar review link, gallery CTAs):
```tsx
className="font-medium text-primary underline-offset-4 hover:underline"
```

Links that navigate to other pages or sections but are styled as text (not buttons):
```tsx
className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-secondary"
```

The difference: inline links use `underline-offset`; standalone navigational links use a color change and/or a trailing arrow icon.

---

## Accessibility Rules

These are not aspirational — they are implemented and must stay implemented.

1. **`aria-hidden="true"`** on all decorative icons, SVGs, and the topographic motif.
2. **`aria-label`** on all icon-only buttons (navbar toggle, social links).
3. **`role="img"` + `aria-label`** on `<StarRating>`.
4. **`role="tablist"` + `role="tab"` + `aria-selected`** on gallery filter pills.
5. **`role="dialog"` + `aria-label`** on the mobile menu overlay.
6. **`role="alert"`** on the contact form error message.
7. **`role="status"`** on the contact form success message.
8. **`aria-expanded`** on the FAQ accordion buttons and form disclosure toggle.
9. **`aria-current="page"`** on the active breadcrumb item.
10. **`text-wrap: balance`** on headings (prevents orphaned single words on last line).
11. **`text-wrap: pretty`** on paragraphs (improves multi-line wrapping).
12. **`::selection`** styled to brand colors for visual coherence during text selection.
13. **`prefers-reduced-motion`** disables all CSS animations and disables Framer Motion transforms while keeping opacity transitions.

---

## Adding a New Section — Checklist

Before contributing a new section, verify:

- [ ] Wrapped in `<Section tone="...">` with the correct tone for the position in the page rhythm
- [ ] Content wrapped in `<Container>` (or `<Container size="narrow">` for text-heavy sections)
- [ ] Heading uses `<SectionHeading>` — not a raw `h2`
- [ ] Spacing follows `mt-*` conventions (not extra padding on the section itself)
- [ ] Cards (if any) use `rounded-4xl border border-foreground/5 bg-background p-6 shadow-soft`
- [ ] Icons use Lucide, sized correctly for their context, `aria-hidden="true"`
- [ ] Any scroll animation uses `<Reveal>` — no custom Framer Motion
- [ ] Content is data-driven from `BUSINESS.*` — no hardcoded strings
- [ ] Passes `npm run typecheck` and `npm run build` cleanly
