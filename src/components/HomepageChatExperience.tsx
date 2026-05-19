'use client';

import Image, { type StaticImageData } from 'next/image';
import { useEffect, useState } from 'react';

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
  Divider,
  RazorSense,
  Text,
  Tooltip,
} from './blade/PortfolioPrimitives';
import { preloadPortfolioRazorSenseAssets } from './blade/razorSensePreload';
import { ChatPanel } from './ChatPanel';
import { usePortfolioShell } from './PortfolioAppShell';

type HomepageChatExperienceProps = {
  starterPrompts: string[];
  projects: ProjectSummary[];
  emptyStateHeading: string;
};

const projectImagesByFileName: Record<string, StaticImageData> = {
  'double-ai-01.png': doubleAiImage,
  'double-ai-02.png': doubleAiSecondImage,
  'maruti-smartplay-pro-x.png': smartplayProXImage,
  'quilo.png': quiloImage,
  'u3k-instrument-cluster.png': u3kImage,
  'formula-1-design-youtube.png': formulaOneImage,
};

export function HomepageChatExperience({
  starterPrompts,
  projects,
  emptyStateHeading,
}: HomepageChatExperienceProps) {
  const { activeChatId, handleFirstUserMessage } = usePortfolioShell();
  const [isHomepageChatEmpty, setIsHomepageChatEmpty] = useState(true);
  const [isBottomWaveReady, setIsBottomWaveReady] = useState(false);
  const carouselItems = projects.flatMap((project) =>
    (project.galleryImages?.length ? project.galleryImages : [project.heroImage])
      .map((imageFileName) => (imageFileName ? projectImagesByFileName[imageFileName] : undefined))
      .filter((image): image is StaticImageData => Boolean(image))
      .map((image, imageIndex) => ({
        image,
        imageIndex,
        project,
      })),
  );

  useEffect(() => {
    let isMounted = true;

    preloadPortfolioRazorSenseAssets('bottomWave')
      .then(() => {
        if (isMounted) {
          setIsBottomWaveReady(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsBottomWaveReady(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Box
      as="main"
      minHeight={{ base: 'calc(100svh - 68px)', m: '100svh' }}
      backgroundColor="surface.background.gray.intense"
      minWidth="0px"
      position="relative"
      overflow="hidden auto"
      display="flex"
      flexDirection="column"
    >
      <HomepageBottomWave isVisible={isBottomWaveReady} />
      <Box
        padding="spacing.0"
        paddingBottom={isHomepageChatEmpty ? 'spacing.0' : { base: 'spacing.6', m: 'spacing.8' }}
        minHeight="0px"
        minWidth="0px"
        position="relative"
        zIndex={1}
        flex="1"
      >
        <Box
          maxWidth="620px"
          marginX="auto"
          height={
            isHomepageChatEmpty
              ? { base: 'calc(100svh - 142px)', m: 'calc(100svh - 82px)' }
              : { base: 'calc(100svh - 92px)', m: 'calc(100svh - 44px)' }
          }
          minHeight="0px"
          minWidth="0px"
          display="flex"
          flexDirection="column"
          gap="spacing.8"
        >
          <ChatPanel
            scope="portfolio"
            storageKey={`portfolio-chat-${activeChatId}`}
            starterPrompts={starterPrompts}
            emptyStateSpacing="homepage"
            emptyStateHeading={emptyStateHeading}
            emptyStateFooter={<HomepageProjectCarousel items={carouselItems} />}
            onFirstUserMessage={handleFirstUserMessage}
            onEmptyStateChange={setIsHomepageChatEmpty}
          />
        </Box>
      </Box>
      {isHomepageChatEmpty ? <HomepageFooter /> : null}
    </Box>
  );
}

function HomepageBottomWave({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) {
    return null;
  }

  return (
    <Box
      position="absolute"
      left="spacing.0"
      right="spacing.0"
      bottom="spacing.0"
      width="100%"
      height={{ base: '180px', m: '260px' }}
      overflow="hidden"
      zIndex={0}
    >
      <RazorSense
        width="100%"
        height="100%"
        preset="bottomWave"
        edgeFeather={[0.35, 0, 0, 0]}
        enableCenterElement={false}
      />
    </Box>
  );
}

function HomepageFooter() {
  return (
    <Box as="footer" width="100%" flexShrink={0} position="relative" zIndex={1}>
      <Divider variant="muted" />
      <Box
        minHeight="50px"
        paddingX={{ base: 'spacing.5', m: 'spacing.5' }}
        paddingY="spacing.3"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        gap="spacing.1"
      >
        <Text size="medium" weight="semibold" color="surface.text.gray.normal">
          Built with ❤️
        </Text>
        <Text variant="caption" size="medium" color="surface.text.gray.muted">
          Using blade design system
        </Text>
      </Box>
    </Box>
  );
}

type HomepageProjectCarouselProps = {
  items: Array<{
    image: StaticImageData;
    imageIndex: number;
    project: ProjectSummary;
  }>;
};

function HomepageProjectCarousel({ items }: HomepageProjectCarouselProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Box
      as="section"
      display="flex"
      flexDirection="column"
      alignSelf="stretch"
      gap="spacing.3"
      minWidth="0px"
      width="100%"
    >
      <Text variant="caption" size="medium" color="surface.text.gray.muted">
        Projects
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
                    style={{ objectFit: 'cover' }}
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
