import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedLinks } from '@/components/seo/RelatedLinks';
import { PageCTA } from '@/components/seo/PageCTA';
import { BUSINESS, SERVICES, SERVICE_TOWNS } from '@/data/business';
import {
  slugToService,
  slugToCity,
  cityToSlug,
  serviceCityBreadcrumbs,
  generateServiceCityMetadata,
  generateServiceCityJsonLd,
  generateFaqJsonLd,
  generateBreadcrumbJsonLd,
  getRelatedServices,
  getRelatedCities,
  generateServiceCityIntro,
  generateServiceCityFAQ,
} from '@/lib/seo';

interface Props {
  params: { slug: string; city: string };
}

/**
 * Generates one static route per service × city combination.
 * 6 services × 12 cities = 72 leaf pages built at compile time.
 */
export function generateStaticParams() {
  return SERVICES.flatMap((service) =>
    SERVICE_TOWNS.map((town) => ({
      slug: service.slug,
      city: cityToSlug(town),
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = slugToService(params.slug, SERVICES);
  const city = slugToCity(params.city, SERVICE_TOWNS);
  if (!service || !city) return {};
  return generateServiceCityMetadata(service, city, BUSINESS);
}

export default function ServiceCityPage({ params }: Props) {
  const service = slugToService(params.slug, SERVICES);
  const city = slugToCity(params.city, SERVICE_TOWNS);
  if (!service || !city) notFound();

  const crumbs = serviceCityBreadcrumbs(service, city);
  const relatedServices = getRelatedServices(service, SERVICES);
  const relatedCities = getRelatedCities(city, SERVICE_TOWNS);
  const intro = generateServiceCityIntro(service, city, BUSINESS);
  const faq = generateServiceCityFAQ(service, city, BUSINESS, BUSINESS.faq);
  const currentCitySlug = cityToSlug(city);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateServiceCityJsonLd(service, city, BUSINESS),
            generateBreadcrumbJsonLd(crumbs, BUSINESS.url),
            generateFaqJsonLd(faq),
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
              <span className="mt-1 block text-2xl font-normal text-muted">
                in {city.name}, {BUSINESS.address.region}
              </span>
            </h1>
            <p className="mt-5 max-w-[60ch] text-[17px] leading-relaxed text-muted">
              {intro}
            </p>
          </div>
        </Container>
      </Section>

      {/* Service details */}
      <Section tone="sage">
        <Container>
          <div className="grid max-w-4xl gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-semibold text-secondary">
                What&rsquo;s included
              </h2>
              <ul className="mt-6 space-y-3">
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
            </div>

            <div>
              <h2 className="font-display text-2xl font-semibold text-secondary">
                Why choose {BUSINESS.shortName}
              </h2>
              <ul className="mt-6 space-y-3">
                {BUSINESS.competitiveAdvantages.map((adv) => (
                  <li key={adv} className="flex items-start gap-3">
                    <Check
                      className="mt-0.5 h-5 w-5 shrink-0 text-highlight"
                      aria-hidden="true"
                    />
                    <span className="text-[15px] text-foreground">{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* About */}
      <Section tone="paper">
        <Container>
          <div className="max-w-[60ch]">
            <h2 className="font-display text-2xl font-semibold text-secondary">
              About {service.title.toLowerCase()} from {BUSINESS.shortName}
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-muted">{service.details}</p>
            <p className="mt-4 text-sm text-muted">
              {BUSINESS.credentials.insuranceAmount} · Licensed &amp; insured in{' '}
              {BUSINESS.address.regionName} · {BUSINESS.foundedYear}–present
            </p>
          </div>
        </Container>
      </Section>

      {/* FAQ — service+city specific */}
      <Section tone="sage">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-secondary">
            Common questions about {service.title.toLowerCase()} in {city.name}
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

      {/* Internal links */}
      <Section tone="paper">
        <Container>
          <RelatedLinks
            services={relatedServices}
            cities={relatedCities}
            currentServiceSlug={service.slug}
            currentCitySlug={currentCitySlug}
          />
        </Container>
      </Section>

      <PageCTA
        heading={`Get a free estimate for ${service.title.toLowerCase()} in ${city.name}`}
        subhead={`${BUSINESS.shortName} · ${BUSINESS.address.county} · Response within 24 hours`}
      />
    </>
  );
}
