import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { PageCTA } from '@/components/seo/PageCTA';
import { FAQSection } from '@/components/sections/FAQSection';
import { BUSINESS } from '@/data/business';
import {
  faqBreadcrumbs,
  generateFaqMetadata,
  generateFaqJsonLd,
  generateBreadcrumbJsonLd,
} from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateFaqMetadata(BUSINESS);
}

export default function FaqPage() {
  const crumbs = faqBreadcrumbs();
  const faq = BUSINESS.faq;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateFaqJsonLd(faq),
            generateBreadcrumbJsonLd(crumbs, BUSINESS.url),
          ]),
        }}
      />

      <Section tone="paper">
        <Container>
          <Breadcrumbs items={crumbs} />
          <div className="mt-8 max-w-2xl">
            <h1 className="font-display text-4xl font-semibold text-secondary sm:text-5xl">
              Frequently asked questions
            </h1>
            <p className="mt-4 max-w-[52ch] text-[17px] leading-relaxed text-muted">
              Quick answers about estimates, scheduling, crew, service area, and insurance.
              Still have a question?{' '}
              <a href={BUSINESS.phoneHref} className="text-primary underline-offset-2 hover:underline">
                Call us at {BUSINESS.phone}
              </a>
              .
            </p>
          </div>
        </Container>
      </Section>

      {/* Reuses the interactive accordion from the homepage */}
      <FAQSection />

      <PageCTA
        heading="Still have a question? We're easy to reach."
        subhead={`${BUSINESS.phone} · ${BUSINESS.email}`}
      />
    </>
  );
}
