'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { BUSINESS } from '@/data/business';
import { cn } from '@/lib/utils';
import type { FAQItem } from '@/types';

/**
 * Accordion FAQ section. Renders nothing when BUSINESS.faq is empty,
 * so it disappears cleanly for businesses that haven't provided FAQ data.
 */
export function FAQSection() {
  const { faq } = BUSINESS;
  if (faq.length === 0) return null;

  return (
    <Section id="faq" tone="sage">
      <Container>
        <SectionHeading
          eyebrow="Common questions"
          title="Everything you need to know"
          intro="Quick answers to the questions we hear most often."
        />
        <FAQAccordion items={faq} />
      </Container>
    </Section>
  );
}

function FAQAccordion({ items }: { items: ReadonlyArray<FAQItem> }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Reveal delay={0.1}>
      <dl className="mx-auto mt-10 max-w-3xl divide-y divide-foreground/5">
        {items.map((item, i) => (
          <div key={i} className="py-5">
            <dt>
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span className="font-display text-[17px] font-semibold text-secondary">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 text-muted transition-transform duration-200',
                    open === i && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </button>
            </dt>
            {open === i && (
              <dd className="mt-3 pr-9 text-[15px] leading-relaxed text-muted">
                {item.answer}
              </dd>
            )}
          </div>
        ))}
      </dl>
    </Reveal>
  );
}
