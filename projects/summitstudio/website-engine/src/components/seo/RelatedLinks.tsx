import { ArrowRight } from 'lucide-react';
import type { Service, ServiceTown } from '@/types';
import { cityToSlug } from '@/lib/seo';
import { BUSINESS } from '@/data/business';

interface RelatedLinksProps {
  /** Other services to link to. */
  services?: Service[];
  /** Other service towns to link to. */
  cities?: ServiceTown[];
  /**
   * When provided, city links resolve to `/services/{currentServiceSlug}/{city-slug}`
   * (building the service+city grid). Without it, cities link to `/locations/{city-slug}`.
   */
  currentServiceSlug?: string;
  /**
   * When provided, service links resolve to `/services/{service-slug}/{currentCitySlug}`
   * (the reverse direction of the internal link graph). Without it, services link to
   * `/services/{service-slug}`.
   */
  currentCitySlug?: string;
}

/**
 * Internal link grid for SEO pages. Builds the hub-and-spoke link graph:
 * service pages → service+city leaf pages, city pages → service+city leaf pages.
 */
export function RelatedLinks({
  services = [],
  cities = [],
  currentServiceSlug,
  currentCitySlug,
}: RelatedLinksProps) {
  if (services.length === 0 && cities.length === 0) return null;

  return (
    <div className="grid gap-10 sm:grid-cols-2">
      {services.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Related services
          </h3>
          <ul className="mt-4 space-y-2.5">
            {services.map((service) => {
              const href = currentCitySlug
                ? `/services/${service.slug}/${currentCitySlug}`
                : `/services/${service.slug}`;
              return (
                <li key={service.slug}>
                  <a
                    href={href}
                    className="group inline-flex items-center gap-1.5 text-sm text-primary transition-colors hover:text-secondary"
                  >
                    {service.title}
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {cities.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Other areas we serve
          </h3>
          <ul className="mt-4 space-y-2.5">
            {cities.map((city) => {
              const slug = cityToSlug(city);
              const href = currentServiceSlug
                ? `/services/${currentServiceSlug}/${slug}`
                : `/locations/${slug}`;
              return (
                <li key={city.name}>
                  <a
                    href={href}
                    className="group inline-flex items-center gap-1.5 text-sm text-primary transition-colors hover:text-secondary"
                  >
                    {city.name}, {BUSINESS.address.region}
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
