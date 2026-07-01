import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { BUSINESS } from '@/data/business';
import { resolveProofPoints } from '@/lib/engine';

/**
 * Data-driven trust indicator strip. Proof points come entirely from
 * BUSINESS.proofPoints — no hardcoded copy. Computed sentinels
 * (years-in-business, google-rating) are resolved to live values here
 * so the strip never shows stale numbers.
 */
export function ProofBar() {
  const items = resolveProofPoints(BUSINESS);

  return (
    <section aria-label="Why choose us at a glance" className="border-b border-foreground/5 bg-background py-10">
      <Container>
        <Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {items.map(({ icon: Icon, label, detail }) => (
              <div
                key={label}
                className="group flex flex-col items-center gap-2.5 rounded-2xl border border-foreground/5 bg-background px-4 py-5 text-center shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lift"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface-50">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block text-[15px] font-bold text-secondary">{label}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-muted">{detail}</span>
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
