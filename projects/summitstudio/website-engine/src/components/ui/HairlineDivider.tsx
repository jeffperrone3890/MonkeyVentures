import { cn } from '@/lib/utils';

interface HairlineDividerProps {
  className?: string;
}

/**
 * A single-pixel horizontal rule. Use between adjacent sections that share
 * the same background color to provide visual separation without a tonal shift.
 */
export function HairlineDivider({ className }: HairlineDividerProps) {
  return (
    <hr
      className={cn('border-none border-t border-foreground/8', className)}
      role="separator"
      aria-hidden="true"
    />
  );
}
