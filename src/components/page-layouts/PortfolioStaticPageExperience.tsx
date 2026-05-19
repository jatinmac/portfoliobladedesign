'use client';

import type { ReactNode } from 'react';

import { Box, Heading, Text } from '../blade/PortfolioPrimitives';

type PortfolioStaticPageExperienceProps = {
  title: string;
  eyebrow: string;
  description: string;
  children: ReactNode;
};

export function PortfolioStaticPageExperience({
  title,
  eyebrow,
  description,
  children,
}: PortfolioStaticPageExperienceProps) {
  return (
    <Box minHeight="100svh" backgroundColor="surface.background.gray.intense">
      <Box
        as="main"
        paddingX={{ base: 'spacing.4', s: 'spacing.5', l: 'spacing.7' }}
        paddingY={{ base: 'spacing.7', m: 'spacing.9', l: 'spacing.10' }}
        maxWidth="1120px"
        marginX="auto"
        minWidth="0px"
      >
        <Box display="flex" flexDirection="column" gap={{ base: 'spacing.6', m: 'spacing.8' }}>
          <Box display="flex" flexDirection="column" gap="spacing.3" maxWidth="820px">
            <Text
              variant="caption"
              size="medium"
              weight="semibold"
              color="interactive.text.primary.normal"
            >
              {eyebrow}
            </Text>
            <Heading as="h1" size="2xlarge">
              {title}
            </Heading>
            <Text size="large" color="surface.text.gray.muted">
              {description}
            </Text>
          </Box>
          <Box display="flex" flexDirection="column" gap="spacing.6">
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
