import Image from 'next/image';
import { Phone, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { BUSINESS, PROCESS } from '@/data/business';

export function CTA() {
  return (
    <section className="relative isolate overflow-hidden bg-forest py-24 text-sage-50 sm:py-28">
      {/* Faint background photography for texture */}
      <Image
        src="/images/cta.jpg"
        alt=""
        fill
        aria-hidden="true"
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover opacity-20"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest via-forest/90 to-forest" />

      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-soft">
              Free, no-pressure estimate
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-heading font-semibold text-sage-50">
              Ready for a yard you&rsquo;re proud of?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 text-lg leading-relaxed text-sage/80">
              Tell us what you need and we&rsquo;ll send a clear, written estimate within 24
              hours. No deposits, no pressure — just an honest quote from a crew you can count on.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="#contact" size="lg">
                Get my free estimate
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button href={BUSINESS.phoneHref} variant="onDark" size="lg">
                <Phone className="h-5 w-5" />
                Call {BUSINESS.phone}
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Process — a real sequence, so numbered markers are earned here */}
        <ol className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-3">
          {PROCESS.map((p, i) => (
            <Reveal key={p.step} delay={i * 0.08} as="li">
              <div className="h-full rounded-3xl border border-sage-50/10 bg-sage-50/[0.04] p-6 backdrop-blur-sm">
                <span className="font-display text-2xl font-semibold text-amber">{p.step}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-sage-50">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-sage/70">{p.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
