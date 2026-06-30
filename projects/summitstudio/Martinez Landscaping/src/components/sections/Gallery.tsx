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

  // Derived from the data itself, not a parallel hardcoded list — so the
  // filter pills can never drift out of sync with whatever projects
  // actually exist once real before/after pairs replace these placeholders.
  const categories = useMemo(() => ['All', ...Array.from(new Set(GALLERY.map((p) => p.category)))], []);

  const projects = filter === 'All' ? GALLERY : GALLERY.filter((p) => p.category === filter);

  return (
    <Section id="gallery" tone="paper">
      <Container>
        <SectionHeading
          eyebrow="Our work"
          title={`Real ${BUSINESS.address.regionName} properties, transformed.`}
          intro="Drag the slider on any photo to see the transformation — design installs, hardscaping, tree work, and the lawns we keep sharp all season."
        />

        {/* Filters */}
        <div className="mt-8 flex flex-wrap gap-2.5" role="tablist" aria-label="Filter projects by category">
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

        {/* Before/after grid */}
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 2) * 0.08}>
              <BeforeAfterSlider
                before={project.before}
                after={project.after}
                className="aspect-[4/3]"
              />
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-secondary">{project.title}</h3>
                <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted">{project.category}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
