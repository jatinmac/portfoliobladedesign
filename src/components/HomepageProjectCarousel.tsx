'use client';

import Image, { type StaticImageData } from 'next/image';

import doubleAiImage from '../../assets/projects/double-ai-01.png';
import doubleAiSecondImage from '../../assets/projects/double-ai-02.png';
import formulaOneImage from '../../assets/projects/formula-1-design-youtube.png';
import smartplayProXImage from '../../assets/projects/maruti-smartplay-pro-x.png';
import quiloImage from '../../assets/projects/quilo.png';
import u3kImage from '../../assets/projects/u3k-instrument-cluster.png';
import type { ProjectSummary } from '../lib/content/types';
import {
  Box,
  Carousel,
  CarouselItem,
  Fade,
  Text,
  Tooltip,
} from './blade/PortfolioPrimitives';

type HomepageProjectCarouselProps = {
  projects: ProjectSummary[];
};

const projectImagesByFileName: Record<string, StaticImageData> = {
  'double-ai-01.png': doubleAiImage,
  'double-ai-02.png': doubleAiSecondImage,
  'maruti-smartplay-pro-x.png': smartplayProXImage,
  'quilo.png': quiloImage,
  'u3k-instrument-cluster.png': u3kImage,
  'formula-1-design-youtube.png': formulaOneImage,
};

export function HomepageProjectCarousel({ projects }: HomepageProjectCarouselProps) {
  const items = projects.flatMap((project) =>
    (project.galleryImages?.length ? project.galleryImages : [project.heroImage])
      .map((imageFileName) => (imageFileName ? projectImagesByFileName[imageFileName] : undefined))
      .filter((image): image is StaticImageData => Boolean(image))
      .map((image, imageIndex) => ({
        image,
        imageIndex,
        project,
      })),
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <Fade motionTriggers={['mount']} type="in" delay="moderate">
      <Box
        as="section"
        display="flex"
        flexDirection="column"
        alignSelf="stretch"
        gap="spacing.1"
        minWidth="0px"
        width="100%"
      >
        <Text variant="caption" size="medium" color="surface.text.gray.muted">
          Browse my projects
        </Text>
        <Carousel
          accessibilityLabel="Project image carousel"
          carouselItemWidth={{
            base: '100%',
            s: 'calc((100% - 16px) / 2)',
            m: 'calc((100% - 32px) / 3)',
          }}
          visibleItems="autofit"
          navigationButtonPosition="bottom"
          navigationButtonVariant="filled"
          showIndicators
          gap="spacing.5"
        >
          {items.map(({ image, imageIndex, project }) => (
            <CarouselItem key={`${project.slug}-${image.src}`}>
              <Tooltip content={project.title} placement="top">
                {/* Blade Link/Button only accept string children here, so the anchor preserves image-link semantics. */}
                <a href={`/projects/${project.slug}`} aria-label={`Open ${project.title} project`}>
                  <Box
                    backgroundColor="surface.background.primary.subtle"
                    borderRadius="medium"
                    height={{ base: '136px', m: '140px' }}
                    overflow="hidden"
                    position="relative"
                    width="100%"
                  >
                    <Image
                      src={image}
                      alt={`${project.title} project image ${imageIndex + 1}`}
                      fill
                      placeholder="blur"
                      sizes="(min-width: 768px) 190px, 82vw"
                      style={{ objectFit: 'contain' }}
                    />
                  </Box>
                </a>
              </Tooltip>
            </CarouselItem>
          ))}
        </Carousel>
      </Box>
    </Fade>
  );
}
