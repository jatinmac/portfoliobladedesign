import { beforeEach, describe, expect, it, vi } from 'vitest';

import { retrievePortfolioContext } from './retriever';
import { retrieveSupabaseContext } from './supabase-retriever';

vi.mock('./supabase-retriever', () => ({
  retrieveSupabaseContext: vi.fn(),
}));

const retrieveSupabaseContextMock = vi.mocked(retrieveSupabaseContext);

describe('retrievePortfolioContext', () => {
  beforeEach(() => {
    retrieveSupabaseContextMock.mockReset();
    retrieveSupabaseContextMock.mockResolvedValue(null);
  });

  it('retrieves automotive HMI evidence lexically when Supabase is unavailable', async () => {
    const result = await retrievePortfolioContext({
      query: 'automotive HMI infotainment manufacturing scale',
      scope: 'portfolio',
    });

    expect(result.mode).toBe('lexical_fallback');
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

  it('uses Supabase chunks when hybrid retrieval returns matches', async () => {
    retrieveSupabaseContextMock.mockResolvedValue([
      {
        id: 'maruti-smartplay-pro-x#overview',
        sourceType: 'project',
        sourceSlug: 'maruti-smartplay-pro-x',
        sourceTitle: 'Maruti Suzuki SmartPlay Pro X',
        projectSlug: 'maruti-smartplay-pro-x',
        projectTitle: 'Maruti Suzuki SmartPlay Pro X',
        sectionTitle: 'Overview',
        content: 'Supabase ranked automotive evidence.',
        searchText: 'automotive HMI',
        score: 0.9,
      },
    ]);

    const result = await retrievePortfolioContext({
      query: 'automotive HMI',
      scope: 'portfolio',
    });

    expect(result.mode).toBe('supabase_hybrid');
    expect(result.chunks[0]?.content).toContain('Supabase ranked');
  });

  it('falls back when Supabase retrieval throws', async () => {
    retrieveSupabaseContextMock.mockRejectedValue(new Error('RPC failed'));

    const result = await retrievePortfolioContext({
      query: 'design system governance',
      scope: 'portfolio',
    });

    expect(result.mode).toBe('lexical_fallback');
    expect(result.chunks.length).toBeGreaterThan(0);
  });

  it('uses chatContext and simple stems when ranking lexical chunks', async () => {
    const result = await retrievePortfolioContext({
      query: 'designed identity-layer agent workflows',
      scope: 'portfolio',
    });

    expect(result.chunks[0]?.projectSlug).toBe('double-ai');
    expect(result.chunks[0]?.score).toBeGreaterThan(0);
  });
});
