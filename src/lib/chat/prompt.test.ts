import { describe, expect, it } from 'vitest';

import { preparePortfolioChat, rewriteQueryForRetrieval } from './prompt';

describe('preparePortfolioChat', () => {
  it('asks the model to structure answers with markdown sections', async () => {
    const prepared = await preparePortfolioChat({
      messages: [{ role: 'user', content: 'How does the chat work?' }],
      scope: 'portfolio',
    });

    const systemPrompt = prepared.messages[0]?.content ?? '';
    expect(systemPrompt).toContain('Format every answer in Markdown');
    expect(systemPrompt).toContain('level-2 heading');
    expect(systemPrompt).toContain('Do not use bold-only labels');
    expect(systemPrompt).toContain('Use bullets');
  });

  it('includes retrieval mode metadata for fallback retrieval', async () => {
    const prepared = await preparePortfolioChat({
      messages: [{ role: 'user', content: 'Tell me about checkout trust work.' }],
      scope: 'portfolio',
    });

    expect(prepared.metadata.retrievalMode).toBe('lexical_fallback');
    expect(prepared.metadata.agentSteps[0]).toEqual(
      expect.objectContaining({
        tool: 'search_projects',
        chunkCount: expect.any(Number),
      }),
    );
    expect(prepared.metadata.sourceReferences[0]).toEqual(
      expect.objectContaining({
        sourceType: expect.any(String),
        sourceSlug: expect.any(String),
      }),
    );
  });

  it('rewrites follow-up retrieval queries with recent conversation context', () => {
    const query = rewriteQueryForRetrieval([
      { role: 'user', content: 'Tell me about Quilo.' },
      { role: 'assistant', content: 'Quilo is the Chrome extension project.' },
      { role: 'user', content: 'Tell me more about that design process.' },
    ]);

    expect(query).toContain('Tell me more about that design process.');
    expect(query).toContain('Quilo is the Chrome extension project.');
  });
});
