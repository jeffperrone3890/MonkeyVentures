import { Quote } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { StarRating } from '@/components/ui/StarRating';
import { BUSINESS, TESTIMONIALS } from '@/data/business';

export function Testimonials() {
  return (
    <Section id="reviews" tone="sage">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Reviews"
            title="Neighbors who'd hire us again."
            intro="We've earned most of our work the hard way — one well-kept property and one honest invoice at a time."
          />
          <Reveal delay={0.1}>
            <div className="flex items-center gap-4 rounded-3xl border border-foreground/5 bg-background px-6 py-4 shadow-soft">
              <div className="font-display text-4xl font-semibold text-primary">{BUSINESS.reviews.average}</div>
              <div>
                <StarRating rating={BUSINESS.reviews.average} />
                <p className="mt-1 text-sm text-muted">
                  {BUSINESS.reviews.count} verified reviews
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Grid of cards — CSS Grid equalises row heights within each row, which reads more polished than the old CSS masonry approach */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={`${t.author}-${t.location}-${i}`} delay={(i % 3) * 0.06}>
              <figure className="rounded-4xl border border-foreground/5 bg-background p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <StarRating rating={t.rating} />
                  <Quote className="h-7 w-7 text-surface-100" aria-hidden="true" />
                </div>
                <blockquote className="mt-4 text-[15px] leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-foreground/5 pt-5">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 font-display text-sm font-semibold text-primary">
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
      </Container>
    </Section>
  );
}
