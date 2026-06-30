'use client';

import { useMemo, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider';
import { BUSINESS, GALLERY } from '@/data/business';
import { cn } from '@/lib/utils';

export function Gallery() {
  const [filter, setFilter] = useState<string>('All');

  // Categories derived from data — filter pills never drift out of sync
  // with whatever projects exist once real photography replaces placeholders.
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(GALLERY.map((p) => p.category)))],
    [],
  );

  const projects = filter === 'All' ? GALLERY : GALLERY.filter((p) => p.category === filter);

  return (
    <Section id="gallery" tone="paper">
      <Container>
        <SectionHeading
          eyebrow="Before & after"
          title={`Real ${BUSINESS.address.regionName} properties, transformed.`}
          intro={`Drag the slider on any project to see the difference. These are real results — the same quality of work we bring to every property in ${BUSINESS.address.county}.`}
        />

        {/* Category filter pills */}
        <div
          className="mt-8 flex flex-wrap gap-2.5"
          role="tablist"
          aria-label="Filter projects by category"
        >
          {categories.map((cat) => {
            const selected = filter === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={selected}
                onClick={() => setFilter(cat)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  selected
                    ? 'bg-primary text-surface-50 shadow-soft'
                    : 'bg-surface-50 text-foreground hover:bg-surface-100',
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Before/after grid — architected for real photography.
            To replace placeholder images: update `before.src` and `after.src`
            in src/data/businesses/<slug>/business.ts. The component layout,
            slider interaction, and captions do not need to change. */}
        <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 2) * 0.08}>
              <div className="group">
                <BeforeAfterSlider
                  before={project.before}
                  after={project.after}
                  className="aspect-[4/3]"
                />
                {/* Caption row */}
                <div className="mt-3.5 px-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg font-semibold text-secondary">
                      {project.title}
                    </h3>
                    <span className="shrink-0 rounded-full bg-surface-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-muted">
                      {project.category}
                    </span>
                  </div>
                  {/* Optional project description — populated per-project in business data */}
                  {project.description && (
                    <p className="mt-1 max-w-[48ch] text-[14px] leading-relaxed text-muted">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA nudge at bottom of gallery */}
        <Reveal delay={0.1}>
          <p className="mt-10 text-center text-sm text-muted">
            Like what you see?{' '}
            <a
              href="#contact"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Get a free estimate for your property →
            </a>
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
