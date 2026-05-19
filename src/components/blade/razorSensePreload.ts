'use client';

import { preloadRazorSenseAssets } from './PortfolioPrimitives';
import type { RazorSenseProps } from './PortfolioPrimitives';

const preloadPromises = new Map<string, Promise<void>>();

export function preloadPortfolioRazorSenseAssets(
  preset: NonNullable<RazorSenseProps['preset']>,
): Promise<void> {
  const presetKey = String(preset);
  const cachedPromise = preloadPromises.get(presetKey);

  if (cachedPromise) {
    return cachedPromise;
  }

  const preloadPromise = preloadRazorSenseAssets(preset);
  preloadPromises.set(presetKey, preloadPromise);

  return preloadPromise;
}
