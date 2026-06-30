import type { Config } from 'tailwindcss';
import { THEME } from './src/data/theme';

/**
 * Design tokens. Colors, fonts, and the two custom radius steps are sourced
 * from src/data/theme.ts — the single source of truth for this client's
 * brand identity. Do not hardcode hex values in components; reference the
 * semantic color names defined here instead.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: THEME.colors.primary,
        secondary: THEME.colors.secondary,
        accent: THEME.colors.accent,
        highlight: THEME.colors.highlight,
        tertiary: THEME.colors.tertiary,
        background: THEME.colors.background,
        surface: THEME.colors.surface,
        foreground: THEME.colors.foreground,
        muted: THEME.colors.muted,
      },
      fontFamily: {
        // Wired to next/font CSS variables in src/app/layout.tsx
        display: [`var(${THEME.fonts.display.cssVariable})`, ...THEME.fonts.display.fallback],
        sans: [`var(${THEME.fonts.body.cssVariable})`, ...THEME.fonts.body.fallback],
      },
      fontSize: {
        // Fluid display sizes
        'display-lg': ['clamp(2.75rem, 6vw, 5rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display': ['clamp(2.25rem, 4.5vw, 3.75rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'heading': ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.12', letterSpacing: '-0.015em' }],
        // Named tokens for the Logo wordmark — replaces arbitrary text-[17px]/text-[10px]
        // so future clients can adjust the wordmark size from one place.
        'logo': ['1.0625rem', { lineHeight: '1', letterSpacing: '-0.01em' }],
        'logo-sub': ['0.625rem', { lineHeight: '1', letterSpacing: '0.22em' }],
      },
      borderRadius: {
        '4xl': THEME.radius.large,
        '5xl': THEME.radius.xlarge,
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
