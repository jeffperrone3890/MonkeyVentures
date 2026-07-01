import { Quote } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { StarRating } from '@/components/ui/StarRating';
import { BUSINESS, TESTIMONIALS } from '@/data/business';
import { cn } from '@/lib/utils';

export function Testimonials() {
  return (
    <Section id="reviews" tone="sage">
      <Container>
        {/* Header row: heading left, prominent aggregate rating right */}
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <SectionHeading
            eyebrow="Client reviews"
            title="Trusted by homeowners across the county."
            intro="Real feedback from real clients — earned one property at a time."
          />

          {/* Aggregate rating — made visually prominent to build instant credibility */}
          <Reveal delay={0.1}>
            <div className="flex shrink-0 flex-col items-center gap-2 rounded-4xl border border-foreground/5 bg-background px-8 py-6 shadow-soft ring-1 ring-primary/10">
              <div className="font-display text-5xl font-semibold leading-none text-primary">
                {BUSINESS.reviews.average}
              </div>
              <StarRating rating={BUSINESS.reviews.average} size={20} />
              <p className="text-sm font-medium text-foreground">
                {BUSINESS.reviews.count} verified reviews
              </p>
              <p className="text-xs text-muted">Google Rating</p>
            </div>
          </Reveal>
        </div>

        {/* Testimonial cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={`${t.author}-${t.location}-${i}`} delay={(i % 3) * 0.06}>
              <figure className={cn(
                'flex h-full flex-col rounded-4xl border border-foreground/5 bg-background p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift',
                i % 2 === 0 ? 'hover:border-primary/20' : 'hover:border-highlight/15',
              )}>
                {/* Rating + quote icon */}
                <div className="flex items-center justify-between">
                  <StarRating rating={t.rating} />
                  <Quote className="h-6 w-6 text-primary/15" aria-hidden="true" />
                </div>

                {/* Quote — fills available space so cards equalize height within each row */}
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Attribution */}
                <figcaption className="mt-5 flex items-center gap-3 border-t border-foreground/5 pt-5">
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-sm font-semibold text-primary"
                    aria-hidden="true"
                  >
                    {t.author.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-secondary">{t.author}</span>
                    <span className="block text-xs text-muted">
                      {t.location} · {t.service}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Bottom trust note */}
        <Reveal delay={0.15}>
          <p className="mt-8 text-center text-sm text-muted">
            {BUSINESS.reviews.count}+ reviews across Google and other platforms ·{' '}
            <a
              href={BUSINESS.social.google}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              See our Google listing
            </a>
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
