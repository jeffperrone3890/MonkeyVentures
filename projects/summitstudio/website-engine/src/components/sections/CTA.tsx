import Image from 'next/image';
import { Phone, ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { BUSINESS, PROCESS } from '@/data/business';

export function CTA() {
  return (
    <Section id="cta" tone="forest" className="relative isolate overflow-hidden">
      {/* Faint background photography for texture */}
      <Image
        src="/images/cta.jpg"
        alt=""
        fill
        aria-hidden="true"
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover opacity-20"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary via-secondary/90 to-secondary" />
      {/* Topographic contour — matches Hero's signature motif at very low opacity */}
      <svg className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-[0.04]" viewBox="0 0 400 300" fill="none" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5, 6].map((n) => (
          <path
            key={n}
            d={`M-20 ${60 + n * 34} C 80 ${30 + n * 34}, 160 ${100 + n * 34}, 240 ${60 + n * 34} S 380 ${20 + n * 34}, 440 ${70 + n * 34}`}
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        ))}
      </svg>
      {/* Radial spotlight — subtle depth behind the heading */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_40%_at_50%_20%,rgba(255,255,255,0.06),transparent)]" aria-hidden="true" />

      <Container>
        <SectionHeading
          eyebrow="Free, no-pressure estimate"
          title="Ready for a yard you're proud of?"
          intro="Tell us what you need and we'll send a clear, written estimate within 24 hours. No deposits, no pressure — just an honest quote from a crew you can count on."
          invert
          align="center"
        />

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="#contact" size="lg">
              {BUSINESS.ctaStyle.primary}
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href={BUSINESS.phoneHref} variant="onDark" size="lg">
              <Phone className="h-5 w-5" />
              Call {BUSINESS.phone}
            </Button>
          </div>
        </Reveal>

        {/* Process — a real sequence, so numbered markers are earned here */}
        <ol className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3">
          {PROCESS.map((p, i) => (
            <Reveal key={p.step} delay={i * 0.08} as="li">
              <div className="h-full rounded-3xl border border-surface-50/15 bg-surface-50/[0.05] p-6 backdrop-blur-sm">
                <span className="font-display text-2xl font-semibold text-accent">{p.step}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-surface-50">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-surface/70">{p.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
