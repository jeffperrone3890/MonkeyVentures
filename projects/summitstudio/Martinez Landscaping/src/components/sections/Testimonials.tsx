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
            <div className="flex items-center gap-4 rounded-3xl border border-ink/5 bg-paper px-6 py-4 shadow-soft">
              <div className="font-display text-4xl font-semibold text-pine">{BUSINESS.reviews.average}</div>
              <div>
                <StarRating rating={BUSINESS.reviews.average} />
                <p className="mt-1 text-sm text-mute">
                  {BUSINESS.reviews.count} verified reviews
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Masonry of cards */}
        <div className="mt-12 columns-1 gap-6 md:columns-2 lg:columns-3 [&>*]:mb-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.author} delay={(i % 3) * 0.06}>
              <figure className="break-inside-avoid rounded-4xl border border-ink/5 bg-paper p-7 shadow-soft">
                <div className="flex items-center justify-between">
                  <StarRating rating={t.rating} />
                  <Quote className="h-7 w-7 text-sage-100" aria-hidden="true" />
                </div>
                <blockquote className="mt-4 text-[15px] leading-relaxed text-ink">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-ink/5 pt-5">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-pine/10 font-display text-sm font-semibold text-pine">
                    {t.author.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-forest">{t.author}</span>
                    <span className="block text-xs text-mute">
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
