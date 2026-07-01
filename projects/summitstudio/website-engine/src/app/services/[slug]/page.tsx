import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Check, ArrowRight, Phone } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedLinks } from '@/components/seo/RelatedLinks';
import { PageCTA } from '@/components/seo/PageCTA';
import { BUSINESS, SERVICES, SERVICE_TOWNS } from '@/data/business';
import {
  slugToService,
  serviceBreadcrumbs,
  generateServiceMetadata,
  generateServiceJsonLd,
  generateFaqJsonLd,
  generateBreadcrumbJsonLd,
  getRelatedServices,
  cityToSlug,
} from '@/lib/seo';

interface Props {
  params: { slug: string };
}

/** One static route per service slug — e.g. /services/lawn-care */
export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = slugToService(params.slug, SERVICES);
  if (!service) return {};
  return generateServiceMetadata(service, BUSINESS);
}

export default function ServicePage({ params }: Props) {
  const service = slugToService(params.slug, SERVICES);
  if (!service) notFound();

  const crumbs = serviceBreadcrumbs(service);
  const relatedServices = getRelatedServices(service, SERVICES);
  const serviceCities = [...SERVICE_TOWNS].slice(0, 8);
  const faq = [...BUSINESS.faq].slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateServiceJsonLd(service, BUSINESS),
            generateBreadcrumbJsonLd(crumbs, BUSINESS.url),
            ...(faq.length > 0 ? [generateFaqJsonLd(faq)] : []),
          ]),
        }}
      />

      {/* Page header */}
      <Section tone="paper">
        <Container>
          <Breadcrumbs items={crumbs} />

          <div className="mt-8 max-w-3xl">
            <service.icon
              className="h-9 w-9 text-primary"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-secondary sm:text-5xl">
              {service.title}
            </h1>
            <p className="mt-2 text-lg text-muted">
              {BUSINESS.address.county}, {BUSINESS.address.regionName}
            </p>
            <p className="mt-5 max-w-[60ch] text-[17px] leading-relaxed text-muted">
              {service.details}
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="/#contact" size="lg">
              {BUSINESS.ctaStyle.primary}
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href={BUSINESS.phoneHref} variant="outline" size="md">
              <Phone className="h-4 w-4" />
              {BUSINESS.phone}
            </Button>
          </div>
        </Container>
      </Section>

      {/* What's included */}
      <Section tone="sage">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-secondary">
            What&rsquo;s included
          </h2>
          <ul className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
            {service.includes.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check
                  className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span className="text-[15px] text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Why us */}
      <Section tone="paper">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-secondary">
            Why {BUSINESS.address.county} homeowners choose {BUSINESS.shortName}
          </h2>
          <ul className="mt-8 max-w-2xl space-y-3">
            {BUSINESS.competitiveAdvantages.map((adv) => (
              <li key={adv} className="flex items-start gap-3 text-[15px] text-foreground">
                <Check
                  className="mt-0.5 h-5 w-5 shrink-0 text-highlight"
                  aria-hidden="true"
                />
                {adv}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Service areas — link to service+city leaf pages */}
      <Section tone="sage">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-secondary">
            {service.title} — all service areas
          </h2>
          <p className="mt-3 max-w-[52ch] text-[15px] text-muted">
            We serve all of {BUSINESS.address.county}. Select your area for details specific to your town.
          </p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {SERVICE_TOWNS.map((town) => (
              <li key={town.name}>
                <a
                  href={`/services/${service.slug}/${cityToSlug(town)}`}
                  className="rounded-full border border-foreground/10 bg-background px-4 py-2 text-sm font-medium text-secondary transition-colors hover:border-primary/30 hover:text-primary"
                >
                  {town.name}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* FAQ */}
      {faq.length > 0 && (
        <Section tone="paper">
          <Container>
            <h2 className="font-display text-2xl font-semibold text-secondary">
              Common questions
            </h2>
            <dl className="mt-8 max-w-2xl divide-y divide-foreground/8">
              {faq.map((item) => (
                <div key={item.question} className="py-5">
                  <dt className="font-display text-[17px] font-semibold text-secondary">
                    {item.question}
                  </dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-muted">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </Section>
      )}

      {/* Related services */}
      <Section tone="sage">
        <Container>
          <RelatedLinks services={relatedServices} cities={serviceCities} currentServiceSlug={service.slug} />
        </Container>
      </Section>

      <PageCTA
        heading={`Ready to get started? Free estimate within 24 hours.`}
        subhead={`${BUSINESS.credentials.insuranceAmount} · Licensed & insured · ${BUSINESS.shortName}`}
      />
    </>
  );
}
