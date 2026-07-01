import { Container } from '@/components/ui/Container';
import { BUSINESS } from '@/data/business';
import { resolveProofPoints } from '@/lib/engine';

/**
 * Trust credentials strip. Pure typography — no card borders, no icon circles,
 * no backgrounds. Data-driven from BUSINESS.proofPoints; computed sentinels
 * (years-in-business, google-rating) resolve to live values at render time.
 */
export function ProofBar() {
  const items = resolveProofPoints(BUSINESS);

  return (
    <section
      aria-label="Trust credentials"
      className="border-b border-foreground/8 bg-background py-5"
    >
      <Container>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {items.map(({ icon: Icon, label, detail }) => (
            <li key={label} className="flex items-center gap-2 text-sm">
              <Icon
                className="h-4 w-4 shrink-0 text-primary"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="font-semibold text-secondary">{label}</span>
              <span className="text-muted">{detail}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
