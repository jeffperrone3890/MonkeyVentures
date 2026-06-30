/**
 * ─────────────────────────────────────────────────────────────────────────
 *  THEME — Delaware Lawn Crew. Colors sampled from their real site: a deep,
 *  near-black green base, a lime-yellow-green accent (their actual CTA
 *  color), and the navy from their crew/oar logo mark used as a sparing
 *  highlight. See src/data/theme.ts for how the active business's theme is
 *  selected.
 *
 *  Font pair is intentionally unchanged from the template default for this
 *  draft — their real site pairs a bold sans headline with an italic serif
 *  accent word, but swapping the font pair requires editing the
 *  next/font imports in src/app/layout.tsx (a Next.js constraint, see
 *  THEME.fonts below), which is out of scope for this demo pass.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const THEME = {
  colors: {
    primary: '#1B3A23',
    secondary: '#0D1A12',
    accent: {
      DEFAULT: '#C9E265',
      soft: '#DCEB9C',
    },
    // The navy from their oar/crew logo mark — used sparingly as a detail
    // color, not a dominant one.
    highlight: '#1B2A6B',
    tertiary: '#5C6B3F',

    background: '#F7F8F5',
    surface: {
      DEFAULT: '#E5E9E1',
      50: '#EFF2EA',
      100: '#E5E9E1',
    },
    foreground: '#15201A',
    muted: '#5B6860',
  },

  radius: {
    large: '2rem',
    xlarge: '2.75rem',
  },

  // Their real site uses pill-shaped buttons throughout — matches the
  // template default.
  buttonStyle: {
    radius: 'rounded-full',
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
