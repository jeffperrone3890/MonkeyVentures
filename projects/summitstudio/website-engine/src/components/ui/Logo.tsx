import { cn } from '@/lib/utils';
import { BUSINESS } from '@/data/business';
import { THEME } from '@/data/theme';

interface LogoProps {
  className?: string;
  /** Light text for dark backgrounds. */
  invert?: boolean;
}

/**
 * Wordmark + sprig mark. Swap the SVG for the client's real logo file once
 * supplied; keep the same overall footprint so the navbar layout holds.
 */
export function Logo({ className, invert = false }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'grid h-9 w-9 place-items-center rounded-xl',
          invert ? 'bg-surface-50/10' : 'bg-primary/10',
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path
            d="M12 22V6M12 12C9 12 6.5 9.5 6.5 6.5 9.5 6.5 12 9 12 12Zm0-2c2.6 0 4.8-2.2 4.8-4.8C14.2 5.2 12 7.4 12 10Z"
            stroke={invert ? THEME.colors.accent.soft : THEME.colors.primary}
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display text-logo font-semibold tracking-tight',
            invert ? 'text-surface-50' : 'text-secondary',
          )}
        >
          {BUSINESS.logo.primary}
        </span>
        <span
          className={cn(
            'text-logo-sub font-semibold uppercase',
            invert ? 'text-accent-soft' : 'text-highlight',
          )}
        >
          {BUSINESS.logo.secondary}
        </span>
      </span>
    </span>
  );
}
