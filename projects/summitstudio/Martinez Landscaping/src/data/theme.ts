/**
 * ─────────────────────────────────────────────────────────────────────────
 *  THEME — single source of truth for this client's visual brand identity:
 *  colors, fonts, border radius, and button style. Swap this file (and the
 *  `next/font` imports in src/app/layout.tsx, if the font pair changes) to
 *  retarget the entire site's look at a different brand — components never
 *  hardcode hex values or palette-literal Tailwind colors; they reference
 *  the semantic role names defined here (primary, secondary, accent,
 *  background, surface, foreground, muted...) via tailwind.config.ts.
 *
 *  This is a build-time theme: tailwind.config.ts imports these values
 *  directly, so a new brand requires editing this file and rebuilding —
 *  not a live, no-rebuild theme switch. That fits a fork-per-client deploy
 *  workflow. (A CSS-variable-driven version of this file would be the
 *  natural upgrade path if a live color-picker/generator UI is ever built.)
 * ─────────────────────────────────────────────────────────────────────────
 */

export const THEME = {
  colors: {
    // Primary brand color — buttons, links, key accents.
    primary: '#1F4733',
    // Deepest brand color — dark sections, footer.
    secondary: '#12241B',
    // Bold accent — the single boldest call-to-action color (e.g. primary button).
    accent: {
      DEFAULT: '#C98A3C',
      soft: '#E0B878',
    },
    // Supporting accent — icons, small highlights, secondary detail color.
    highlight: '#3C7A57',
    // Additional supporting tone, available but not currently used by any component.
    tertiary: '#5A6E40',

    background: '#FBFBF8', // page background
    surface: {
      DEFAULT: '#E7EDE3',
      // Soft section background; also reused at low opacity as a
      // near-white text/tint color on dark sections.
      50: '#F2F5EE',
      100: '#E7EDE3',
    },
    foreground: '#16241C', // body text on light surfaces
    muted: '#5C6B60', // secondary / de-emphasized text
  },

  // Custom "signature" radii beyond Tailwind's default scale — used for
  // hero imagery, large cards, and the estimate form panel. Standard steps
  // (rounded-full/xl/2xl/3xl) are layout sizing, not brand identity, and
  // stay as plain Tailwind utilities.
  radius: {
    large: '2rem', // tailwind `4xl`
    xlarge: '2.75rem', // tailwind `5xl`
  },

  // Shape of buttons across the site. Defaults to a full pill to match the
  // current look; a future brand can switch to e.g. 'rounded-xl' for a
  // softer corner or 'rounded-md' for a sharper, more corporate feel.
  buttonStyle: {
    radius: 'rounded-full',
  },

  // Font pairing. `next/font/google` requires statically-imported font
  // names, so the actual font choice can't be fully runtime-dynamic — a new
  // brand with a different font pair still needs the import in
  // src/app/layout.tsx updated to match. What's centralized here is the
  // metadata every other config and component should reference: the CSS
  // variable names (wired to next/font in layout.tsx) and fallback stacks.
  fonts: {
    display: {
      family: 'Fraunces',
      cssVariable: '--font-display',
      fallback: ['Georgia', 'serif'],
    },
    body: {
      family: 'Hanken Grotesk',
      cssVariable: '--font-sans',
      fallback: ['system-ui', 'sans-serif'],
    },
  },
} as const;
