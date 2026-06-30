/**
 * ─────────────────────────────────────────────────────────────────────────
 *  THEME — PQ Landscaping. Colors sampled from their real site: a vivid
 *  lime/grass green as the dominant brand color, a deep near-black green
 *  for contrast sections, and orange as their actual CTA-banner accent.
 *  See src/data/theme.ts for how the active business's theme is selected.
 *
 *  Their real buttons are noticeably more squared-off than the other two
 *  businesses' pill shapes ("LEARN MORE" / "START A QUOTE" read as
 *  rectangular with a slight corner radius) — buttonStyle.radius reflects
 *  that instead of defaulting to the template's pill shape.
 *
 *  Font pair is intentionally unchanged from the template default for this
 *  draft (see src/app/layout.tsx for why swapping fonts needs a code
 *  change, not just a data change) — out of scope for this demo pass.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const THEME = {
  colors: {
    primary: '#6FAE2D',
    secondary: '#14241B',
    accent: {
      DEFAULT: '#F2941F',
      soft: '#F7B65C',
    },
    highlight: '#3F7D2C',
    tertiary: '#6B7B3F',

    background: '#F8FAF5',
    surface: {
      DEFAULT: '#E8EFE0',
      50: '#F1F6EA',
      100: '#E8EFE0',
    },
    foreground: '#152018',
    muted: '#5A6B58',
  },

  radius: {
    large: '2rem',
    xlarge: '2.75rem',
  },

  // Their real CTAs are rectangular with a slight corner radius, not pills.
  buttonStyle: {
    radius: 'rounded-md',
  },

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
