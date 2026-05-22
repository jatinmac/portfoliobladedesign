'use client';

import { Box, Fade, Scale, Spinner, Text } from './blade/PortfolioPrimitives';

export function ProjectPageLoading() {
  return (
    <Box
      minHeight="100svh"
      backgroundColor="surface.background.gray.intense"
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding="spacing.6"
    >
      <Fade motionTriggers={['mount']} type="in">
        <Scale motionTriggers={['mount']} type="in">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="spacing.4"
            padding={{ base: 'spacing.5', m: 'spacing.6' }}
            backgroundColor="surface.background.gray.intense"
            borderRadius="large"
          >
            <Spinner accessibilityLabel="Loading project" />
            <Text color="surface.text.gray.muted">Loading case study...</Text>
          </Box>
        </Scale>
      </Fade>
    </Box>
  );
}
