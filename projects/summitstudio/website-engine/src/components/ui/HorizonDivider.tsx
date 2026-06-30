import { cn } from '@/lib/utils';
import { THEME } from '@/data/theme';

interface HorizonDividerProps {
  /** Fill color of the curve — should match the section it leads into. */
  fill?: string;
  /** Flip vertically so the curve crests downward. */
  flip?: boolean;
  className?: string;
}

/**
 * Signature element: a soft horizon curve — a landscape contour — used to
 * transition between sections. Decorative, so hidden from assistive tech.
 * Used sparingly (one or two per page) so it stays memorable.
 */
export function HorizonDivider({ fill = THEME.colors.secondary, flip = false, className }: HorizonDividerProps) {
  return (
    <div className={cn('pointer-events-none -mb-px w-full overflow-hidden leading-none', className)} aria-hidden="true">
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={cn('h-[60px] w-full sm:h-[90px]', flip && 'rotate-180')}
      >
        <path d="M0,64 C240,128 480,0 720,40 C960,80 1200,128 1440,72 L1440,120 L0,120 Z" fill={fill} />
      </svg>
    </div>
  );
}
