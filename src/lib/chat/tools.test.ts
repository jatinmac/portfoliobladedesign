import { describe, expect, it } from 'vitest';

import { executePortfolioTool } from './tools';

describe('portfolio chat tools', () => {
  it('returns page-specific contact content', async () => {
    const result = await executePortfolioTool({
      tool: 'get_page_content',
      args: { page: 'contact' },
      payload: {
        messages: [{ role: 'user', content: 'How can I contact Jatin?' }],
        scope: 'portfolio',
      },
    });

    expect(result.inputSummary).toBe('page: contact');
    expect(result.content).toContain('jatindavis5@gmail.com');
    expect(result.content).toContain('youtube.com/@formula1design/shorts');
    expect(result.chunks.some((chunk) => chunk.sourceSlug === 'page-contact')).toBe(true);
  });

  it('searches checked-in project content through the retriever', async () => {
    const result = await executePortfolioTool({
      tool: 'search_projects',
      args: { query: 'Quilo Chrome extension 600 users' },
      payload: {
        messages: [{ role: 'user', content: 'Tell me about Quilo.' }],
        scope: 'portfolio',
      },
    });

    expect(result.content).toContain('[Tool: search_projects');
    expect(result.chunks.some((chunk) => chunk.projectSlug === 'quilo')).toBe(true);
    expect(result.retrievalMode).toBe('lexical');
  });

  it('returns the repository project list', async () => {
    const result = await executePortfolioTool({
      tool: 'get_project_list',
      args: {},
      payload: {
        messages: [{ role: 'user', content: 'What projects are available?' }],
        scope: 'portfolio',
      },
    });

    expect(result.content).toContain('slug: double-ai');
    expect(result.content).toContain('slug: quilo');
  });
});
