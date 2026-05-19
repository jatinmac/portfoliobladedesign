import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ContentDrivenPageExperience } from '../../components/page-layouts/ContentDrivenPageExperience';
import {
  getContentDrivenPage,
  getContentPageHeader,
  getOptionalContentPage,
} from '../../lib/content/content-loader';
import { buildPageMetadata } from '../../lib/content/site';

export const dynamic = 'force-static';

export function generateMetadata(): Metadata {
  const pageHeader = getContentPageHeader('experience');
  return buildPageMetadata(pageHeader.title, pageHeader.description, '/experience');
}

export default function ExperiencePage() {
  const page = getOptionalContentPage('experience');

  if (!page) {
    notFound();
  }

  return <ContentDrivenPageExperience page={getContentDrivenPage('experience')} />;
}
