'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { m, useReducedMotion } from 'framer-motion';

type ScrollRevealProps = {
  children: ReactNode;
  delay?: number;
  offset?: number;
  threshold?: number;
};

const revealTransition = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1],
};

const revealHiddenState = (offset: number) => ({
  opacity: 0.94,
  y: Math.min(offset, 4),
});

export function ScrollReveal({
  children,
  delay = 0,
  offset = 16,
  threshold = 0.15,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setHasEntered(true);
      return undefined;
    }

    const element = elementRef.current;
    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.intersectionRatio >= threshold) {
          setHasEntered(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [shouldReduceMotion, threshold]);

  return (
    <m.div
      ref={elementRef}
      data-motion
      initial={shouldReduceMotion ? false : revealHiddenState(offset)}
      animate={hasEntered ? { opacity: 1, y: 0 } : revealHiddenState(offset)}
      transition={{ ...revealTransition, delay }}
      style={{ width: '100%' }}
    >
      {children}
    </m.div>
  );
}
