import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ContentDrivenPageExperience } from '../../components/page-layouts/ContentDrivenPageExperience';
import {
  getAllContentPages,
  getContentDrivenPage,
  getContentPageHeader,
  getOptionalContentPage,
} from '../../lib/content/content-loader';
import { buildPageMetadata } from '../../lib/content/site';

const CUSTOM_PAGE_SLUGS = new Set(['about', 'contact', 'experience', 'projects']);

export const dynamic = 'force-static';

type GenericContentPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllContentPages()
    .filter((page) => !CUSTOM_PAGE_SLUGS.has(page.slug))
    .map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: GenericContentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getOptionalContentPage(slug);

  if (!page || CUSTOM_PAGE_SLUGS.has(slug)) {
    return buildPageMetadata('Page not found', '', `/${slug}`);
  }

  const pageHeader = getContentPageHeader(slug);
  return buildPageMetadata(pageHeader.title, pageHeader.description, page.path);
}

export default async function GenericContentPage({ params }: GenericContentPageProps) {
  const { slug } = await params;
  const page = getOptionalContentPage(slug);

  if (!page || CUSTOM_PAGE_SLUGS.has(slug)) {
    notFound();
  }

  return <ContentDrivenPageExperience page={getContentDrivenPage(slug)} />;
}
