import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedLinks } from '@/components/seo/RelatedLinks';
import { PageCTA } from '@/components/seo/PageCTA';
import { BUSINESS, SERVICES, SERVICE_TOWNS } from '@/data/business';
import {
  slugToCity,
  cityToSlug,
  cityBreadcrumbs,
  generateCityMetadata,
  generateCityJsonLd,
  generateFaqJsonLd,
  generateBreadcrumbJsonLd,
  getRelatedCities,
} from '@/lib/seo';

interface Props {
  params: { city: string };
}

/** One static route per service town — e.g. /locations/newark */
export function generateStaticParams() {
  return SERVICE_TOWNS.map((town) => ({ city: cityToSlug(town) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = slugToCity(params.city, SERVICE_TOWNS);
  if (!city) return {};
  return generateCityMetadata(city, BUSINESS);
}

export default function CityPage({ params }: Props) {
  const city = slugToCity(params.city, SERVICE_TOWNS);
  if (!city) notFound();

  const crumbs = cityBreadcrumbs(city);
  const relatedCities = getRelatedCities(city, SERVICE_TOWNS);
  const faq = [...BUSINESS.faq].slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateCityJsonLd(city, SERVICES, BUSINESS),
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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              {BUSINESS.shortName}
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-secondary sm:text-5xl">
              Landscaping services in {city.name}, {BUSINESS.address.region}
            </h1>
            <p className="mt-5 max-w-[60ch] text-[17px] leading-relaxed text-muted">
              {BUSINESS.shortName} has served {city.name} and all of{' '}
              {BUSINESS.address.county} since {BUSINESS.foundedYear} — lawn care,
              tree services, hardscaping, and more from the same licensed,
              insured crew.
              {city.note && ` ${city.note}`}
            </p>
          </div>
        </Container>
      </Section>

      {/* Services available in this city — link to service+city leaf pages */}
      <Section tone="sage">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-secondary">
            Services in {city.name}
          </h2>
          <p className="mt-3 max-w-[52ch] text-[15px] text-muted">
            Select a service for detailed information and a city-specific estimate.
          </p>

          <div className="mt-10 grid gap-0 border-t border-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <a
                key={service.slug}
                href={`/services/${service.slug}/${cityToSlug(city)}`}
                className="group flex items-start gap-4 border-b border-foreground/10 py-8 transition-colors hover:text-primary sm:px-4 lg:px-6"
              >
                <service.icon
                  className="mt-0.5 h-6 w-6 shrink-0 text-primary"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span>
                  <span className="block font-display text-lg font-semibold text-secondary group-hover:text-primary">
                    {service.title}
                  </span>
                  <span className="mt-1 block text-sm text-muted">{service.summary}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    Learn more
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </span>
              </a>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why us */}
      <Section tone="paper">
        <Container>
          <div className="max-w-[60ch]">
            <h2 className="font-display text-2xl font-semibold text-secondary">
              Why {city.name} chooses {BUSINESS.shortName}
            </h2>
            <ul className="mt-6 space-y-3">
              {BUSINESS.competitiveAdvantages.map((adv) => (
                <li key={adv} className="flex items-start gap-3 text-[15px] text-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  {adv}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted">
              {BUSINESS.businessStory.mission}
            </p>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      {faq.length > 0 && (
        <Section tone="sage">
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

      {/* Other cities */}
      <Section tone="paper">
        <Container>
          <RelatedLinks cities={relatedCities} />
        </Container>
      </Section>

      <PageCTA
        heading={`Get a free estimate in ${city.name}`}
        subhead={`${BUSINESS.shortName} · ${BUSINESS.address.county} · Licensed & insured · Response within 24 hours`}
      />
    </>
  );
}
