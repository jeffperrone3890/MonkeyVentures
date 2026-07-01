import { ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { BUSINESS } from '@/data/business';

/**
 * Full-width guarantee banner. Renders nothing when BUSINESS.guarantee is null,
 * so dropping it in the page tree costs zero markup for businesses without one.
 */
export function Guarantee() {
  const { guarantee } = BUSINESS;
  if (!guarantee) return null;

  return (
    <section aria-label="Satisfaction guarantee" className="border-y border-highlight/15 bg-highlight/5 py-8">
      <Container>
        <Reveal>
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:gap-6 sm:text-left">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-highlight/15 text-highlight">
              <ShieldCheck className="h-7 w-7" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-secondary">{guarantee.headline}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted">{guarantee.description}</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
