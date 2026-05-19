'use client';

import type { ReactNode } from 'react';

import { BladeMotionProvider } from './BladeMotionProvider';
import { BladeProvider } from './PortfolioPrimitives';
import { portfolioColorScheme, portfolioTheme } from './portfolio-theme';
import './blade-fonts';

type BladeProvidersProps = {
  children: ReactNode;
};

export function BladeProviders({ children }: BladeProvidersProps) {
  return (
    <BladeMotionProvider>
      <BladeProvider themeTokens={portfolioTheme} colorScheme={portfolioColorScheme}>
        {children}
      </BladeProvider>
    </BladeMotionProvider>
  );
}
