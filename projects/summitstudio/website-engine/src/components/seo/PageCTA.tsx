import { ArrowRight, Phone } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BUSINESS } from '@/data/business';

interface PageCTAProps {
  heading: string;
  subhead?: string;
}

/**
 * Lightweight CTA block for SEO landing pages. Sends visitors to the main
 * contact form on the homepage so form logic stays in one place.
 */
export function PageCTA({ heading, subhead }: PageCTAProps) {
  return (
    <Section tone="forest">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-surface-50">{heading}</h2>
          {subhead && (
            <p className="mt-4 text-lg leading-relaxed text-surface-50/70">{subhead}</p>
          )}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button href="/#contact" size="lg">
              {BUSINESS.ctaStyle.primary}
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href={BUSINESS.phoneHref} variant="onDark" size="lg">
              <Phone className="h-5 w-5" />
              {BUSINESS.phone}
            </Button>
          </div>
          <p className="mt-4 text-sm text-surface-50/45">{BUSINESS.ctaStyle.micro}</p>
        </div>
      </Container>
    </Section>
  );
}
