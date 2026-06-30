import Image from 'next/image';
import { Check, ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { SERVICES } from '@/data/business';

export function Services() {
  return (
    <Section id="services" tone="sage">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="What we do"
            title="One team for the whole property."
            intro="From the weekly mow to a full redesign, it&rsquo;s the same trusted crew for everything your property needs — start to finish."
          />
          <Reveal delay={0.1}>
            <Button href="#contact" variant="dark" className="shrink-0">
              Get a free estimate
              <ArrowRight className="h-4.5 w-4.5" />
            </Button>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal key={service.slug} delay={(i % 3) * 0.08} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-4xl border border-foreground/5 bg-background shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/15 hover:shadow-lift">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.displayTitle ?? service.title}
                    fill
                    loading={i < 3 ? 'eager' : 'lazy'}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-105"
                  />
                  {/* Icon badge */}
                  <span className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-2xl bg-background/95 text-primary shadow-soft backdrop-blur transition-colors duration-300 group-hover:bg-primary group-hover:text-surface-50">
                    <service.icon className="h-5.5 w-5.5" />
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  {/* Outcome-focused headline (displayTitle) with functional title as fallback */}
                  <h3 className="font-display text-xl font-semibold leading-snug text-secondary">
                    {service.displayTitle ?? service.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{service.details}</p>

                  <ul className="mt-5 grid gap-2" aria-label={`What's included in ${service.title}`}>
                    {service.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-highlight" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-primary transition-colors hover:text-secondary"
                    aria-label={`Get a quote for ${service.title}`}
                  >
                    Get a quote
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
