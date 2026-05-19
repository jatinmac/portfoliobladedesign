'use client';

import type { ReactNode } from 'react';
import { LazyMotion } from 'framer-motion';

const loadFeatures = () => import('./framer-motion-features.js').then((res) => res.default);

type BladeMotionProviderProps = {
  children: ReactNode;
};

export function BladeMotionProvider({ children }: BladeMotionProviderProps) {
  return (
    <LazyMotion strict features={loadFeatures}>
      {children}
    </LazyMotion>
  );
}
