import type { MetadataRoute } from 'next';

import { getSiteMetadata } from '../lib/content/site';

export default function robots(): MetadataRoute.Robots {
  const siteMetadata = getSiteMetadata();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
  };
}
