import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

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
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
