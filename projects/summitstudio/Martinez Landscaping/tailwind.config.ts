import type { Config } from 'tailwindcss';

/**
 * Design tokens for Martinez Landscaping & Tree Services.
 * Palette runs from deep evergreen to a warm golden-hour amber.
 * Every color used in the UI is defined here — do not hardcode hex values
 * in components.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Greens (primary brand range)
        forest: '#12241B', // deepest — dark sections, footer, headings
        pine: '#1F4733', // primary green — buttons, links, key accents
        fern: '#3C7A57', // brighter green — icons, small highlights
        moss: '#5A6E40', // muted olive — supporting accent
        // Light / neutral
        paper: '#FBFBF8', // page background
        sage: {
          DEFAULT: '#E7EDE3',
          50: '#F2F5EE', // soft section background
          100: '#E7EDE3',
        },
        // Warm accent — "golden hour" light
        amber: {
          DEFAULT: '#C98A3C',
          soft: '#E0B878',
        },
        ink: '#16241C', // body text on light surfaces
        mute: '#5C6B60', // secondary text
      },
      fontFamily: {
        // Wired to next/font CSS variables in src/app/layout.tsx
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Fluid display sizes
        'display-lg': ['clamp(2.75rem, 6vw, 5rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display': ['clamp(2.25rem, 4.5vw, 3.75rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'heading': ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.12', letterSpacing: '-0.015em' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(18, 36, 27, 0.04), 0 8px 24px -12px rgba(18, 36, 27, 0.18)',
        lift: '0 2px 4px rgba(18, 36, 27, 0.05), 0 24px 48px -20px rgba(18, 36, 27, 0.28)',
        ring: '0 0 0 1px rgba(18, 36, 27, 0.06)',
      },
      maxWidth: {
        content: '1200px',
      },
      spacing: {
        13: '3.25rem',
        18: '4.5rem',
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
