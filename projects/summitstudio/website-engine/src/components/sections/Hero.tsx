import Image from 'next/image';
import { Phone, ArrowRight, Star, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BUSINESS } from '@/data/business';

export function Hero() {
  return (
    <section
      id="top"
      className="flex min-h-[85svh] flex-col overflow-hidden bg-secondary lg:flex-row lg:min-h-[100svh]"
    >
      {/* Mobile: full-width image stacks above text */}
      <div className="relative h-[42svh] shrink-0 lg:hidden">
        <Image
          src="/images/hero.jpg"
          alt={`A professionally landscaped property in ${BUSINESS.address.county}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-secondary/20" />
      </div>

      {/* Text column */}
      <div className="flex flex-1 flex-col justify-center px-6 py-14 sm:px-10 lg:w-1/2 lg:px-16 lg:py-32 xl:px-20">
        {/* Inline trust line — no pill bubbles */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-surface-50/60">
          <span className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />
            {BUSINESS.reviews.average} · {BUSINESS.reviews.count} reviews
          </span>
          <span aria-hidden="true" className="text-surface-50/25">·</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-accent-soft" aria-hidden="true" />
            Licensed &amp; insured
          </span>
        </div>

        <h1 className="mt-6 font-display text-display font-semibold leading-tight text-surface-50">
          {BUSINESS.tagline}
        </h1>

        <p className="mt-5 max-w-lg text-lg leading-relaxed text-surface-50/80">
          {BUSINESS.businessStory.heroSubhead}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button href="#contact" size="lg">
            {BUSINESS.ctaStyle.primary}
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button href={BUSINESS.phoneHref} variant="outlineOnDark" size="md">
            <Phone className="h-5 w-5" />
            {BUSINESS.ctaStyle.secondary}
          </Button>
        </div>

        <p className="mt-4 text-sm text-surface-50/45">
          {BUSINESS.ctaStyle.micro}
        </p>
      </div>

      {/* Desktop: full-bleed image — right half, no border-radius */}
      <div className="relative hidden w-1/2 shrink-0 lg:block">
        <Image
          src="/images/hero.jpg"
          alt={`A professionally landscaped property in ${BUSINESS.address.county}, ${BUSINESS.address.regionName}`}
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        {/* Narrow gradient where text column meets image — softens the hard split slightly */}
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-secondary to-transparent" />
      </div>
    </section>
  );
}
