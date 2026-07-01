import { CreditCard } from 'lucide-react';
import { BUSINESS } from '@/data/business';

/**
 * Inline financing notice. Renders nothing when BUSINESS.financing is null.
 * Designed to sit near CTAs or in the contact info column.
 */
export function FinancingBadge() {
  const { financing } = BUSINESS;
  if (!financing) return null;

  return (
    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
      <CreditCard className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {financing.description}
    </span>
  );
}
