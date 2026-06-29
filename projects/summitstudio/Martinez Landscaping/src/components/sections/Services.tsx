import Image from 'next/image';
import { Check, ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { SERVICES } from '@/lib/data';

export function Services() {
  return (
    <Section id="services" tone="sage">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="What we do"
            title="One team for the whole property."
            intro="From the weekly mow to a full redesign — or an emergency tree on the roof at midnight — it's the same trusted crew, start to finish."
          />
          <Reveal delay={0.1}>
            <Button href="#contact" variant="dark" className="shrink-0">
              Request a service
              <ArrowRight className="h-4.5 w-4.5" />
            </Button>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal key={service.slug} delay={(i % 3) * 0.08} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-4xl border border-ink/5 bg-paper shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-2xl bg-paper/95 text-pine shadow-soft backdrop-blur">
                    <service.icon className="h-5.5 w-5.5" />
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-semibold text-forest">{service.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-mute">{service.details}</p>

                  <ul className="mt-5 grid gap-2">
                    {service.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-ink">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-fern" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact"
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-pine transition-colors hover:text-fern"
                  >
                    Get a quote for {service.title.split(' ')[0].toLowerCase()}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
