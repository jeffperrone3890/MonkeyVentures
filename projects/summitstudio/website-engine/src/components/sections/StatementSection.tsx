import { Container } from '@/components/ui/Container';

interface StatementSectionProps {
  /** A single powerful sentence displayed as a centered editorial pull quote. */
  statement: string;
}

/**
 * Full-width editorial statement. One sentence, centered, display serif italic.
 * Generous vertical whitespace signals a deliberate pause in the reading flow.
 */
export function StatementSection({ statement }: StatementSectionProps) {
  return (
    <section aria-label="Our commitment" className="bg-background py-20 sm:py-28">
      <Container>
        <blockquote className="mx-auto max-w-3xl text-center">
          <p className="font-display text-2xl italic leading-relaxed text-secondary/80 sm:text-3xl md:text-[2rem]">
            &ldquo;{statement}&rdquo;
          </p>
        </blockquote>
      </Container>
    </section>
  );
}
