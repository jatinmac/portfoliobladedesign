import Image from 'next/image';

import aboutImage from '../../../assets/profile/about.png';
import { Box } from '../blade/PortfolioPrimitives';
import { ContentDrivenPageExperience } from '../page-layouts/ContentDrivenPageExperience';
import {
  getAboutPageContent,
  getContentDrivenPage,
} from '../../lib/content/content-loader';
import type { ContentPageSection } from '../../lib/content/types';
import { AboutVisualSections } from './AboutVisualSections';

const ABOUT_VISUAL_SECTION_TITLES = new Set([
  'How I Think',
  'Product Design Problem Solving Process',
  'My Resources',
  'Best Products',
]);

function isAboutVisualSection(section: ContentPageSection): boolean {
  return ABOUT_VISUAL_SECTION_TITLES.has(section.title);
}

export function AboutPageExperience() {
  const aboutPage = getAboutPageContent();
  const contentPage = getContentDrivenPage('about');
  const visualSections = contentPage.sections.filter(isAboutVisualSection);
  const page = {
    ...contentPage,
    header: {
      ...contentPage.header,
      title: aboutPage.name,
      description: aboutPage.description,
    },
    tags: aboutPage.tags,
    sections: contentPage.sections.filter((section) => !isAboutVisualSection(section)),
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
    >
      <AboutVisualSections sections={visualSections} />
    </ContentDrivenPageExperience>
  );
}
