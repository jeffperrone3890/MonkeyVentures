import type { MetadataRoute } from 'next';
import { BUSINESS } from '@/data/business';

/**
 * Sitemap for search engines. This is a single-page site, so the sitemap
 * contains the home URL. The in-page sections are reachable via hash anchors
 * (#services, #gallery, etc.), which crawlers resolve from the page itself —
 * hash fragments are intentionally not listed as separate sitemap entries.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BUSINESS.url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
