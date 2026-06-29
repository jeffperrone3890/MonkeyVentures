import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  /** 1–5 */
  rating: number;
  className?: string;
  size?: number;
}

/** Renders filled stars with an accessible label. */
export function StarRating({ rating, className, size = 16 }: StarRatingProps) {
  const rounded = Math.round(rating);
  return (
    <span
      className={cn('inline-flex items-center gap-0.5 text-amber', className)}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={i < rounded ? 'fill-current' : 'fill-none opacity-30'}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
