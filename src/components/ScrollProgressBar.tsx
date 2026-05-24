'use client';

import { m, useScroll, useTransform } from 'framer-motion';

import { Box } from './blade/PortfolioPrimitives';

const SCROLL_VISIBILITY_THRESHOLD = 0.05;

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(
    scrollYProgress,
    [0, SCROLL_VISIBILITY_THRESHOLD, SCROLL_VISIBILITY_THRESHOLD + 0.01],
    [0, 0, 1],
  );

  return (
    <Box
      position="fixed"
      top="spacing.0"
      left="spacing.0"
      width="100%"
      height="3px"
      zIndex={8}
      pointerEvents="none"
    >
      <m.div
        data-motion
        initial={false}
        style={{
          opacity,
          scaleX: scrollYProgress,
          width: '100%',
          height: '100%',
          transformOrigin: '0 50%',
        }}
      >
        <Box
          width="100%"
          height="100%"
          backgroundColor="surface.background.primary.intense"
        />
      </m.div>
    </Box>
  );
}
