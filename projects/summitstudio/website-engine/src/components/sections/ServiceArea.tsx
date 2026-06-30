import { MapPin, Navigation } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { BUSINESS, SERVICE_TOWNS } from '@/data/business';
import { THEME } from '@/data/theme';

export function ServiceArea() {
  return (
    <Section id="service-area" tone="paper">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy + towns */}
          <div>
            <SectionHeading
              eyebrow="Where we work"
              title={`Proudly serving ${BUSINESS.address.county}.`}
              intro={`Based in ${BUSINESS.address.city}, our crews cover the county and the towns around it. If you're nearby and don't see your town, just ask — chances are we're already in your neighborhood.`}
            />

            <Reveal delay={0.1}>
              <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                {SERVICE_TOWNS.map((town) => (
                  <li key={town.name} className="flex items-center gap-2 text-[15px] text-foreground">
                    <MapPin className="h-4 w-4 shrink-0 text-highlight" />
                    {town.name}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button href="#contact" variant="dark">
                  Check my address
                </Button>
                <p className="text-sm text-muted">
                  Free estimates · No travel fees within the county.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Stylized county panel */}
          <Reveal from="right">
            <div className="relative aspect-[4/3] overflow-hidden rounded-5xl bg-secondary shadow-lift">
              {/* Topographic contour background */}
              <svg className="absolute inset-0 h-full w-full opacity-[0.07]" viewBox="0 0 400 300" fill="none" aria-hidden="true">
                {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                  <path
                    key={n}
                    d={`M-20 ${60 + n * 34} C 80 ${30 + n * 34}, 160 ${100 + n * 34}, 240 ${60 + n * 34} S 380 ${20 + n * 34}, 440 ${70 + n * 34}`}
                    stroke={THEME.colors.accent.soft}
                    strokeWidth="1"
                    fill="none"
                  />
                ))}
              </svg>

              {/* Center pin */}
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent text-secondary shadow-lift">
                    <Navigation className="h-7 w-7" />
                    <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-accent/40" />
                  </span>
                  <p className="mt-5 font-display text-2xl font-semibold text-surface-50">
                    {BUSINESS.address.city}, {BUSINESS.address.region}
                  </p>
                  <p className="mt-1 text-sm text-surface/70">Headquarters &amp; dispatch</p>
                </div>
              </div>

              {/* Coverage badge */}
              <div className="absolute bottom-5 left-5 rounded-2xl bg-surface-50/10 px-4 py-2.5 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent-soft">Coverage radius</p>
                <p className="text-sm text-surface-50">All of {BUSINESS.address.county}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
