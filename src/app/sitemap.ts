import type { MetadataRoute } from 'next';

import { getProjectSummaries } from '../lib/content/projects';
import { getNavigationItems, getSiteMetadata } from '../lib/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteMetadata = getSiteMetadata();
  const staticRoutes = ['', ...getNavigationItems().map((item) => item.href)];
  const projectRoutes = getProjectSummaries().map((project) => `/projects/${project.slug}`);

  return [...staticRoutes, ...projectRoutes].map((route) => ({
    url: `${siteMetadata.siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
