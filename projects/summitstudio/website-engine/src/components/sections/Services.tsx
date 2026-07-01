import { Check, ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { BUSINESS, SERVICES } from '@/data/business';

export function Services() {
  return (
    <Section id="services" tone="sage">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow={BUSINESS.sectionCopy.services.eyebrow ?? 'What we do'}
            title={BUSINESS.sectionCopy.services.heading}
            intro={BUSINESS.sectionCopy.services.intro}
          />
          <Button href="#contact" variant="dark" className="shrink-0">
            {BUSINESS.ctaStyle.primary}
            <ArrowRight className="h-4.5 w-4.5" />
          </Button>
        </div>

        {/* Editorial service grid — hairline top border per item, no card shells */}
        <div className="mt-14 grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.slug}
              className="group flex flex-col border-t border-foreground/10 pb-12 pt-8"
            >
              {/* Large icon — no circle background */}
              <service.icon
                className="h-9 w-9 text-primary"
                strokeWidth={1.5}
                aria-hidden="true"
              />

              {/* Display serif title */}
              <h3 className="mt-6 font-display text-2xl font-semibold leading-snug text-secondary">
                {service.displayTitle ?? service.title}
              </h3>

              <p className="mt-3 max-w-[38ch] text-[15px] leading-relaxed text-muted">
                {service.details}
              </p>

              <ul className="mt-6 space-y-2" aria-label={`What's included in ${service.title}`}>
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary/60"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-semibold text-primary transition-colors hover:text-secondary"
                aria-label={`Get a quote for ${service.title}`}
              >
                Get a quote
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
