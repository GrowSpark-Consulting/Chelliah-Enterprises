import type { MetadataRoute } from 'next';
import { servicePages } from '@/data/services';
import { site } from '@/data/site';

/*
 * No lastModified: there is no per-page content date to draw on, and stamping
 * every URL with the build time tells crawlers everything changed on every
 * deploy, which teaches them to ignore the field.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: '', priority: 1 },
    { path: '/services', priority: 0.9 },
    { path: '/projects', priority: 0.8 },
    { path: '/about', priority: 0.7 },
    { path: '/contact', priority: 0.8 },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${site.url}${route.path}`,
      changeFrequency: 'monthly' as const,
      priority: route.priority,
    })),
    ...servicePages.map((service) => ({
      url: `${site.url}/services/${service.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
