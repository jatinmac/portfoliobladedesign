import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AboutPageExperience } from '../../components/about/AboutPageExperience';
import {
  getContentPageHeader,
  getOptionalContentPage,
} from '../../lib/content/content-loader';
import { buildPageMetadata } from '../../lib/content/site';

export const dynamic = 'force-static';

export function generateMetadata(): Metadata {
  const pageHeader = getContentPageHeader('about');
  return buildPageMetadata(pageHeader.title, pageHeader.description, '/about');
}

export default function AboutPage() {
  if (!getOptionalContentPage('about')) {
    notFound();
  }

  return <AboutPageExperience />;
}
