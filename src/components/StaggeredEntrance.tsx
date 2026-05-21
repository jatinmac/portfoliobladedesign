'use client';

import { Children, isValidElement, type ReactNode } from 'react';
import { m, useReducedMotion } from 'framer-motion';

import { Box } from './blade/PortfolioPrimitives';

type StaggeredEntranceProps = {
  children: ReactNode;
};

export function StaggeredEntrance({ children }: StaggeredEntranceProps) {
  const items = Children.toArray(children).filter(Boolean);
  const shouldReduceMotion = useReducedMotion();

  if (items.length === 0) {
    return null;
  }

  if (shouldReduceMotion) {
    return (
      <>
        {items.map((child, index) => {
          const childElement = isValidElement(child) ? child : <Box>{child}</Box>;

          return (
            <Box key={`${childElement.key ?? 'item'}-${index}`} width="100%">
              {childElement}
            </Box>
          );
        })}
      </>
    );
  }

  return (
    <m.div
      data-motion
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      style={{ display: 'contents' }}
    >
      {items.map((child, index) => {
        const childElement = isValidElement(child) ? child : <Box>{child}</Box>;

        return (
          <m.div
            key={`${childElement.key ?? 'item'}-${index}`}
            data-motion
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.28,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
            style={{ width: '100%' }}
          >
            <Box width="100%">{childElement}</Box>
          </m.div>
        );
      })}
    </m.div>
  );
}
