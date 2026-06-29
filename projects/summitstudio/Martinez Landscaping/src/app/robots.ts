import type { MetadataRoute } from 'next';
import { BUSINESS } from '@/data/business';

/**
 * Robots policy: allow all crawlers across the whole site and point them to
 * the sitemap. The API route is disallowed since it has no crawlable content.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${BUSINESS.url}/sitemap.xml`,
    host: BUSINESS.url,
  };
}
