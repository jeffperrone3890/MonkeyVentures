/**
 * Local SEO engine — pure generator functions that turn structured Business
 * data into page metadata, JSON-LD, breadcrumbs, internal links, and content
 * copy. Nothing in here is business-specific; every function takes its
 * inputs as arguments so the engine works for any tenant in the registry.
 *
 * Consumers (page routes) call these functions; they never hard-code copy.
 */

import type { Metadata } from 'next';
import type { Business, FAQItem, GalleryProject, Service, ServiceTown } from '@/types';

// ─── Slug utilities ────────────────────────────────────────────────────────────

/** "Pike Creek" → "pike-creek" */
export function cityToSlug(city: ServiceTown): string {
  return city.name.toLowerCase().replace(/\s+/g, '-');
}

export function slugToCity(
  slug: string,
  towns: ReadonlyArray<ServiceTown>,
): ServiceTown | undefined {
  return towns.find((t) => cityToSlug(t) === slug);
}

export function slugToService(
  slug: string,
  services: ReadonlyArray<Service>,
): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function slugToProject(
  slug: string,
  gallery: ReadonlyArray<GalleryProject>,
): GalleryProject | undefined {
  return gallery.find((p) => p.slug === slug);
}

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export function serviceBreadcrumbs(service: Service): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: service.title, href: `/services/${service.slug}` },
  ];
}

export function cityBreadcrumbs(city: ServiceTown): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: 'Service Areas', href: '/#service-area' },
    { label: city.name, href: `/locations/${cityToSlug(city)}` },
  ];
}

export function serviceCityBreadcrumbs(
  service: Service,
  city: ServiceTown,
): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: service.title, href: `/services/${service.slug}` },
    { label: city.name, href: `/services/${service.slug}/${cityToSlug(city)}` },
  ];
}

export function projectBreadcrumbs(project: GalleryProject): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: 'Our Work', href: '/#gallery' },
    { label: project.title, href: `/projects/${project.slug}` },
  ];
}

export function faqBreadcrumbs(): BreadcrumbItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: 'FAQ', href: '/faq' },
  ];
}

// ─── Metadata generators ──────────────────────────────────────────────────────

export function generateServiceMetadata(
  service: Service,
  business: Business,
): Metadata {
  const title = `${service.title} in ${business.address.county}, ${business.address.region} | ${business.shortName}`;
  const description = `${service.summary} ${business.credentials.insuranceAmount}, licensed & insured in ${business.address.regionName}. Free written estimate within 24 hours.`;
  return {
    title,
    description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title, description, type: 'website' },
  };
}

export function generateCityMetadata(
  city: ServiceTown,
  business: Business,
): Metadata {
  const title = `Landscaping in ${city.name}, ${business.address.region} | ${business.shortName}`;
  const description = `${business.shortName} provides lawn care, landscaping, tree services, and more to ${city.name}. Family-owned since ${business.foundedYear}. Free estimate within 24 hours.`;
  return {
    title,
    description,
    alternates: { canonical: `/locations/${cityToSlug(city)}` },
    openGraph: { title, description, type: 'website' },
  };
}

export function generateServiceCityMetadata(
  service: Service,
  city: ServiceTown,
  business: Business,
): Metadata {
  const title = `${service.title} in ${city.name}, ${business.address.region} | ${business.shortName}`;
  const description = `${service.summary} Serving ${city.name} and ${business.address.county} since ${business.foundedYear}. Licensed, insured. Free estimate.`;
  return {
    title,
    description,
    alternates: { canonical: `/services/${service.slug}/${cityToSlug(city)}` },
    openGraph: { title, description, type: 'website' },
  };
}

export function generateProjectMetadata(
  project: GalleryProject,
  business: Business,
): Metadata {
  const title = `${project.title} | ${business.shortName}`;
  const description =
    project.description ??
    `See our ${project.category.toLowerCase()} work — before and after.`;
  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: project.after.src, alt: project.after.alt }],
    },
  };
}

export function generateFaqMetadata(business: Business): Metadata {
  const title = `Frequently Asked Questions | ${business.shortName}`;
  const description = `Common questions about ${business.name}: estimates, service area, crew, insurance, and emergency response.`;
  return {
    title,
    description,
    alternates: { canonical: '/faq' },
  };
}

// ─── JSON-LD generators ───────────────────────────────────────────────────────

export function generateBreadcrumbJsonLd(
  items: BreadcrumbItem[],
  baseUrl: string,
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: `${baseUrl}${item.href}`,
    })),
  };
}

export function generateServiceJsonLd(
  service: Service,
  business: Business,
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.summary,
    serviceType: service.title,
    provider: {
      '@type': 'LandscapingBusiness',
      '@id': `${business.url}/#business`,
      name: business.name,
      telephone: business.phone,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: `${business.address.county}, ${business.address.regionName}`,
    },
    offers: {
      '@type': 'Offer',
      description: 'Free written estimate within 24 hours, no obligation',
    },
  };
}

export function generateCityJsonLd(
  city: ServiceTown,
  services: ReadonlyArray<Service>,
  business: Business,
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'LandscapingBusiness',
    '@id': `${business.url}/#business`,
    name: business.name,
    telephone: business.phone,
    url: business.url,
    areaServed: [{ '@type': 'City', name: `${city.name}, ${business.address.regionName}` }],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Landscaping Services',
      itemListElement: [...services].map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title },
      })),
    },
  };
}

export function generateServiceCityJsonLd(
  service: Service,
  city: ServiceTown,
  business: Business,
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${service.title} in ${city.name}, ${business.address.region}`,
    description: service.summary,
    serviceType: service.title,
    provider: {
      '@type': 'LandscapingBusiness',
      '@id': `${business.url}/#business`,
      name: business.name,
      telephone: business.phone,
    },
    areaServed: {
      '@type': 'City',
      name: `${city.name}, ${business.address.regionName}`,
    },
  };
}

export function generateFaqJsonLd(faqs: ReadonlyArray<FAQItem>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [...faqs].map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function generateProjectJsonLd(
  project: GalleryProject,
  business: Business,
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description ?? project.title,
    author: { '@type': 'LandscapingBusiness', name: business.name },
    image: [project.before.src, project.after.src].map(
      (src) => `${business.url}${src}`,
    ),
    keywords: project.category,
  };
}

// ─── Internal linking ─────────────────────────────────────────────────────────

/** Up to 4 other services for the "You might also need" block. */
export function getRelatedServices(
  current: Service,
  allServices: ReadonlyArray<Service>,
): Service[] {
  return [...allServices].filter((s) => s.slug !== current.slug).slice(0, 4);
}

/** Up to 6 other service towns for the "We also serve" block. */
export function getRelatedCities(
  current: ServiceTown,
  allTowns: ReadonlyArray<ServiceTown>,
): ServiceTown[] {
  return [...allTowns].filter((t) => t.name !== current.name).slice(0, 6);
}

// ─── Content generators ───────────────────────────────────────────────────────

/**
 * Selects one of four intro paragraph templates for a service+city page.
 * Selection is deterministic — the same service+city combination always
 * produces the same template — but adjacent combinations get meaningfully
 * different copy, satisfying the "no duplicate content" requirement.
 */
export function generateServiceCityIntro(
  service: Service,
  city: ServiceTown,
  business: Business,
): string {
  const key = service.slug + city.name;
  const hash = key.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const years = new Date().getFullYear() - business.foundedYear;

  const templates: string[] = [
    `${business.shortName} provides ${service.title.toLowerCase()} to ${city.name} homeowners — the same licensed, insured crew that has been the trusted name in ${business.address.county} since ${business.foundedYear}.`,

    `${city.name} property owners choose ${business.shortName} for ${service.title.toLowerCase()} because consistency matters: the same crew that shows up knows your property and your schedule, every time.`,

    `Looking for reliable ${service.title.toLowerCase()} near ${city.name}? ${business.shortName} has served ${business.address.county} for over ${years} years with ${business.reviews.average}★-rated work and free written estimates.`,

    `From ${business.address.city} to ${city.name}, ${business.shortName} brings the same consistent ${service.title.toLowerCase()} team — licensed, insured, and backed by a satisfaction commitment — to every property in ${business.address.county}.`,
  ];

  return templates[hash % templates.length];
}

/**
 * Builds a service+city FAQ by merging up to 3 global FAQ items with a
 * page-specific question confirming service availability in that city.
 * Every leaf page gets at least one answer unique to that combination.
 */
export function generateServiceCityFAQ(
  service: Service,
  city: ServiceTown,
  business: Business,
  baseFaq: ReadonlyArray<FAQItem>,
): FAQItem[] {
  const pageSpecific: FAQItem = {
    question: `Do you offer ${service.title.toLowerCase()} in ${city.name}?`,
    answer: `Yes — ${business.shortName} serves ${city.name} and all of ${business.address.county}. Request a free estimate online or call ${business.phone} and we'll respond within 24 hours.`,
  };
  return [...baseFaq.slice(0, 3), pageSpecific];
}
