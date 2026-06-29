import { cn } from '@/lib/utils';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  align?: 'left' | 'center';
  /** Use light colors over the dark forest background. */
  invert?: boolean;
  className?: string;
}

/**
 * The page's recurring heading block. The eyebrow carries a small sprig mark —
 * the brand's signature motif — so structure stays consistent across sections.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  invert = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      <Reveal>
        <span
          className={cn(
            'inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em]',
            invert ? 'text-amber-soft' : 'text-fern',
          )}
        >
          <Sprig className="h-4 w-4" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2
          className={cn(
            'mt-4 font-display text-heading font-semibold',
            invert ? 'text-sage-50' : 'text-forest',
          )}
        >
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              'mt-4 text-lg leading-relaxed',
              invert ? 'text-sage/80' : 'text-mute',
            )}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/** Minimal sprig mark used as the eyebrow accent. */
function Sprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 21V7M12 11c-2.2 0-4-1.8-4-4 2.2 0 4 1.8 4 4Zm0-1c2 0 3.6-1.6 3.6-3.6C13.6 6.4 12 8 12 10Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
