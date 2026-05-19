import { describe, expect, it } from 'vitest';

import { buildFullPortfolioChunks, buildFullPortfolioSources, hashContent } from './chunks';

const project = {
  title: 'Sample Checkout Project',
  slug: 'sample-checkout-project',
  summary: 'Improved payment recovery and checkout confidence.',
  role: 'Product designer',
  timeline: '2026',
  chatContext: 'Useful for checkout trust questions.',
  body: '## Discovery\nMapped checkout failure states.\n\n## Outcome\nReduced confusion after payment errors.',
  sourcePath: 'content/projects/sample-checkout-project.md',
};

describe('full portfolio chunk generation', () => {
  it('builds chunks from projects and site content', () => {
    const chunks = buildFullPortfolioChunks([project]);

    expect(chunks.some((chunk) => chunk.sourceType === 'project')).toBe(true);
    expect(chunks.some((chunk) => chunk.sourceType === 'site')).toBe(true);
    expect(chunks.every((chunk) => chunk.contentHash)).toBe(true);
  });

  it('builds source documents for indexing full portfolio content', () => {
    const sources = buildFullPortfolioSources([project]);

    expect(sources).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'project',
          slug: 'sample-checkout-project',
          canonicalPath: '/projects/sample-checkout-project',
        }),
        expect.objectContaining({
          type: 'site',
          slug: 'page-home',
          canonicalPath: '/',
        }),
        expect.objectContaining({
          type: 'site',
          slug: 'page-contact',
          canonicalPath: '/contact',
        }),
      ]),
    );
  });

  it('hashes content deterministically', () => {
    expect(hashContent('same content')).toBe(hashContent('same content'));
    expect(hashContent('same content')).not.toBe(hashContent('changed content'));
  });

  it('auto-generates searchable chat context when project frontmatter omits it', () => {
    const chunks = buildFullPortfolioChunks([
      {
        ...project,
        chatContext: undefined,
        tags: ['checkout', 'trust'],
        stack: ['Payment UX'],
        platform: 'Web checkout',
        outcome: 'Recovered failed payments',
      },
    ]);
    const overview = chunks.find((chunk) => chunk.id === 'sample-checkout-project#overview');

    expect(overview?.searchText).toContain('checkout');
    expect(overview?.searchText).toContain('Payment UX');
    expect(overview?.metadata?.chatContext).toContain('Recovered failed payments');
  });
});
