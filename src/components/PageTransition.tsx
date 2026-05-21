'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { m, useReducedMotion } from 'framer-motion';

type PageTransitionProps = {
  children: ReactNode;
};

const pageTransition = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1],
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <m.div
      key={pathname}
      data-motion
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={pageTransition}
      style={{ width: '100%', minHeight: '100%' }}
    >
      {children}
    </m.div>
  );
}
