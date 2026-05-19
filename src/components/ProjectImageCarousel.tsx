'use client';

import Image, { type StaticImageData } from 'next/image';

import {
  Box,
  Carousel,
  CarouselItem,
  Tooltip,
} from './blade/PortfolioPrimitives';

type ProjectImageCarouselProps = {
  images: StaticImageData[];
  projectSlug: string;
  projectTitle: string;
  accessibilityLabel?: string;
  imageLabel?: string;
  linkHref?: string;
};

export function ProjectImageCarousel({
  images,
  projectSlug,
  projectTitle,
  accessibilityLabel = `${projectTitle} screens`,
  imageLabel = `${projectTitle} screen`,
  linkHref,
}: ProjectImageCarouselProps) {
  const resolvedLinkHref = linkHref ?? `/projects/${projectSlug}`;

  return (
    <Box minWidth="0px" width="100%">
      <Carousel
        accessibilityLabel={accessibilityLabel}
        carouselItemWidth="100%"
        visibleItems={1}
        navigationButtonPosition="bottom"
        navigationButtonVariant="stroked"
        showIndicators
        gap="spacing.0"
      >
        {images.map((carouselImage, index) => (
          <CarouselItem key={carouselImage.src}>
            <Tooltip content={projectTitle} placement="top">
              {/* Blade Link/Button only accept string children here, so the anchor preserves image-link semantics. */}
              <a href={resolvedLinkHref} aria-label={`Open ${projectTitle} project`}>
                <Box
                  backgroundColor="surface.background.primary.subtle"
                  borderRadius="medium"
                  overflow="hidden"
                  minWidth="0px"
                  width="100%"
                >
                  <Image
                    src={carouselImage}
                    alt={`${imageLabel} ${index + 1}`}
                    placeholder="blur"
                    sizes="(min-width: 1200px) 1040px, (min-width: 768px) 80vw, 100vw"
                    priority={index === 0}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </Box>
              </a>
            </Tooltip>
          </CarouselItem>
        ))}
      </Carousel>
    </Box>
  );
}
