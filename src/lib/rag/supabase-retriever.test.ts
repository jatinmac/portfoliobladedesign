import { beforeEach, describe, expect, it, vi } from 'vitest';

import { retrieveSupabaseContext } from './supabase-retriever';
import { createSupabaseServiceClient, hasSupabaseRagConfig } from '../supabase/server';
import { embedText } from './embeddings';

vi.mock('../supabase/server', () => ({
  createSupabaseServiceClient: vi.fn(),
  hasSupabaseRagConfig: vi.fn(),
}));

vi.mock('./embeddings', () => ({
  embedText: vi.fn(),
}));

const createSupabaseServiceClientMock = vi.mocked(createSupabaseServiceClient);
const hasSupabaseRagConfigMock = vi.mocked(hasSupabaseRagConfig);
const embedTextMock = vi.mocked(embedText);

describe('retrieveSupabaseContext', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    hasSupabaseRagConfigMock.mockReturnValue(true);
    embedTextMock.mockResolvedValue(Array.from({ length: 384 }, () => 0.1));
  });

  it('returns null when Supabase env vars are missing', async () => {
    hasSupabaseRagConfigMock.mockReturnValue(false);

    await expect(
      retrieveSupabaseContext({
        query: 'checkout',
        scope: 'portfolio',
      }),
    ).resolves.toBeNull();
  });

  it('maps Supabase RPC rows to retrieval chunks', async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [
        {
          id: 'chunk-row-id',
          chunk_id: 'overview',
          source_type: 'project',
          source_slug: 'checkout-trust-redesign',
          source_title: 'Checkout Trust Redesign',
          section_title: 'Overview',
          content: 'Matched checkout content.',
          search_text: 'checkout content',
          metadata: { canonicalPath: '/projects/checkout-trust-redesign' },
          similarity: 0.82,
          fused_score: 0.91,
        },
      ],
      error: null,
    });
    createSupabaseServiceClientMock.mockReturnValue({ rpc } as never);

    const chunks = await retrieveSupabaseContext({
      query: 'checkout trust',
      scope: 'portfolio',
    });

    expect(rpc).toHaveBeenCalledWith(
      'match_rag_chunks',
      expect.objectContaining({
        match_count: 8,
        project_slug_filter: null,
        source_types_filter: ['project', 'site'],
      }),
    );
    expect(chunks?.[0]).toEqual(
      expect.objectContaining({
        sourceType: 'project',
        sourceSlug: 'checkout-trust-redesign',
        content: 'Matched checkout content.',
        score: 0.91,
      }),
    );
  });
});
