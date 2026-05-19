import { describe, expect, it } from 'vitest';

import { retrievePortfolioContext } from './retriever';

describe('retrievePortfolioContext', () => {
  it('retrieves automotive HMI evidence lexically', async () => {
    const result = await retrievePortfolioContext({
      query: 'automotive HMI infotainment manufacturing scale',
      scope: 'portfolio',
    });

    expect(result.mode).toBe('lexical');
    expect(result.chunks.some((chunk) => chunk.projectSlug === 'maruti-smartplay-pro-x')).toBe(true);
  });

  it('keeps project scope unless the query broadens', async () => {
    const result = await retrievePortfolioContext({
      query: 'What evidence supports this project?',
      scope: 'project',
      projectSlug: 'quilo',
    });

    expect(result.scope).toBe('project');
    expect(result.chunks.every((chunk) => chunk.projectSlug === 'quilo')).toBe(true);
  });

  it('uses chatContext aliases and simple stems when ranking lexical chunks', async () => {
    const result = await retrievePortfolioContext({
      query: 'designed identity-layer assistant workflows',
      scope: 'portfolio',
    });

    expect(result.chunks[0]?.projectSlug).toBe('double-ai');
    expect(result.chunks[0]?.score).toBeGreaterThan(0);
  });
});
