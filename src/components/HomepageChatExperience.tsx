'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { m, useReducedMotion } from 'framer-motion';

import type { ProjectSummary } from '../lib/content/types';
import {
  Box,
  RazorSense,
} from './blade/PortfolioPrimitives';
import { preloadPortfolioRazorSenseAssets } from './blade/razorSensePreload';
import { ChatPanel } from './ChatPanel';
import { usePortfolioShell } from './PortfolioAppShell';

type HomepageChatExperienceProps = {
  placeholderSuggestions: string[];
  projects: ProjectSummary[];
  emptyStateHeading: string;
};

const HomepageProjectCarousel = dynamic(
  () => import('./HomepageProjectCarousel').then((module) => module.HomepageProjectCarousel),
  { ssr: false },
);

export function HomepageChatExperience({
  placeholderSuggestions,
  projects,
  emptyStateHeading,
}: HomepageChatExperienceProps) {
  const { activeChatId, handleFirstUserMessage } = usePortfolioShell();
  const [isBottomWaveReady, setIsBottomWaveReady] = useState(false);
  const shouldReduceMotion = useReducedMotion();

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
      as="aside"
      height="100%"
      backgroundColor="surface.background.gray.intense"
      minWidth="0px"
      minHeight="0px"
      position="relative"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <HomepageBottomWave isVisible={isBottomWaveReady} />
      <Box
        padding="spacing.0"
        minHeight="0px"
        minWidth="0px"
        position="relative"
        zIndex={1}
        flex="1"
      >
        <m.div
          data-motion
          layout={!shouldReduceMotion}
          transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', height: '100%', minWidth: 0, minHeight: 0 }}
        >
          <Box
            maxWidth="620px"
            marginX="auto"
            height="100%"
            minWidth="0px"
            display="flex"
            flexDirection="column"
            gap="spacing.8"
          >
            <ChatPanel
              scope="portfolio"
              storageKey={`portfolio-chat-${activeChatId}`}
              placeholderSuggestions={placeholderSuggestions}
              emptyStateSpacing="homepage"
              emptyStateHeading={emptyStateHeading}
              emptyStateFooter={<HomepageProjectCarousel projects={projects} />}
              onFirstUserMessage={handleFirstUserMessage}
            />
          </Box>
        </m.div>
      </Box>
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
        gradientMapBlend={0}
      />
    </Box>
  );
}
