import { describe, expect, it } from 'vitest';

import { parseProjectMarkdown } from './projects';

describe('parseProjectMarkdown', () => {
  it('requires complete project frontmatter', () => {
    expect(() =>
      parseProjectMarkdown(`---\ntitle: Missing Fields\nslug: missing-fields\n---\n## Body`),
    ).toThrow(/missing frontmatter fields/);
  });

  it('parses required fields and body content', () => {
    const project = parseProjectMarkdown(`---\ntitle: Test Project\nslug: test-project\norder: 2\nsummary: Summary\nrole: Designer\ntimeline: 2 weeks\nchatContext: Test context\ntags:\n  - checkout\nstack:\n  - Web UX\nplatform: Web\noutcome: Better trust\n---\n## Context\nBody`);

    expect(project.slug).toBe('test-project');
    expect(project.order).toBe(2);
    expect(project.body).toContain('## Context');
    expect(project.tags).toEqual(['checkout']);
    expect(project.stack).toEqual(['Web UX']);
    expect(project.platform).toBe('Web');
    expect(project.outcome).toBe('Better trust');
  });
});
