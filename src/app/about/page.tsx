import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import aboutImage from '../../../assets/profile/about.png';
import { ContentDrivenPageExperience } from '../../components/page-layouts/ContentDrivenPageExperience';
import { Box } from '../../components/blade/PortfolioPrimitives';
import {
  getAboutPageContent,
  getContentDrivenPage,
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

  const aboutPage = getAboutPageContent();
  const contentPage = getContentDrivenPage('about');
  const page = {
    ...contentPage,
    header: {
      ...contentPage.header,
      title: aboutPage.name,
      description: aboutPage.description,
    },
    tags: aboutPage.tags,
  };

  return (
    <ContentDrivenPageExperience
      page={page}
      action={
        aboutPage.linkedInHref ? { label: 'LinkedIn', href: aboutPage.linkedInHref } : undefined
      }
      hero={
        <Box
          position="relative"
          width="100%"
          height={{ base: '260px', xs: '320px', s: '420px', m: '654px' }}
          borderRadius="medium"
          overflow="hidden"
          backgroundColor="surface.background.primary.subtle"
        >
          <Image
            src={aboutImage}
            alt="Jatin Davis portrait over a blue wave background"
            fill
            priority
            sizes="(min-width: 1024px) 920px, 100vw"
            style={{ objectFit: 'cover' }}
          />
        </Box>
      }
    />
  );
}
