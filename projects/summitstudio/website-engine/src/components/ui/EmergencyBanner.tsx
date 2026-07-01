import { Zap, Phone } from 'lucide-react';
import { BUSINESS } from '@/data/business';

/**
 * Fixed bottom strip advertising 24/7 emergency service.
 * Renders nothing when BUSINESS.emergencyService is null.
 * When rendered, layout.tsx adds `pb-14` to <body> so the footer
 * is never obscured by the banner.
 */
export function EmergencyBanner() {
  const { emergencyService } = BUSINESS;
  if (!emergencyService) return null;

  // `as const` on business files narrows optional fields out of the type when
  // absent; cast to the interface to access the optional phone property safely.
  const es = emergencyService as { description: string; phone?: string; responseTime?: string };
  const phone = es.phone ?? BUSINESS.phone;
  const digits = phone.replace(/\D/g, '');
  const phoneHref = `tel:+1${digits}`;

  return (
    <div
      role="complementary"
      aria-label="Emergency service"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-accent/20 bg-secondary/96 py-3 backdrop-blur-sm"
    >
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 text-sm text-surface-50/90">
          <Zap className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <span className="truncate">{emergencyService.description}</span>
          {emergencyService.responseTime && (
            <span className="hidden shrink-0 text-surface-50/50 sm:inline">
              · {emergencyService.responseTime}
            </span>
          )}
        </div>
        <a
          href={phoneHref}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-sm font-semibold text-secondary transition-opacity hover:opacity-90"
        >
          <Phone className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Call · </span>
          {phone}
        </a>
      </div>
    </div>
  );
}
