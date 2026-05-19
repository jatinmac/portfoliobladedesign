import { describe, expect, it } from 'vitest';

import { parseMarkdownBlocks, stripInlineMarkdown } from './markdown';

describe('parseMarkdownBlocks', () => {
  it('keeps headings and separates unordered and ordered lists', () => {
    const blocks = parseMarkdownBlocks(`## Summary
Short intro.

- Evidence one
- Evidence two

1. First step
2. Second step`);

    expect(blocks).toEqual([
      { type: 'heading', level: 2, text: 'Summary' },
      { type: 'paragraph', text: 'Short intro.' },
      { type: 'list', ordered: false, items: ['Evidence one', 'Evidence two'] },
      { type: 'list', ordered: true, items: ['First step', 'Second step'] },
    ]);
  });

  it('promotes bold-only labels and ignores markdown separators', () => {
    const blocks = parseMarkdownBlocks(`---
**Evidence & Sources**
- Design System Operations`);

    expect(blocks).toEqual([
      { type: 'heading', level: 3, text: 'Evidence & Sources' },
      { type: 'list', ordered: false, items: ['Design System Operations'] },
    ]);
  });

  it('parses markdown tables into headers and rows', () => {
    const blocks = parseMarkdownBlocks(`## Comparison

| Project | Evidence | Outcome |
|---|---|---|
| Double.ai | Voice agent UX | Product learning |
| Quilo | Chrome extension | 600+ users |

Next paragraph.`);

    expect(blocks).toEqual([
      { type: 'heading', level: 2, text: 'Comparison' },
      {
        type: 'table',
        headers: ['Project', 'Evidence', 'Outcome'],
        rows: [
          ['Double.ai', 'Voice agent UX', 'Product learning'],
          ['Quilo', 'Chrome extension', '600+ users'],
        ],
      },
      { type: 'paragraph', text: 'Next paragraph.' },
    ]);
  });

  it('preserves inline markdown for the renderer while stripping remains available for search text', () => {
    const blocks = parseMarkdownBlocks('A **bold** point with `code` and [link](/contact).');

    expect(blocks).toEqual([
      {
        type: 'paragraph',
        text: 'A **bold** point with `code` and [link](/contact).',
      },
    ]);
    expect(stripInlineMarkdown('A **bold** point with `code` and [link](/contact).')).toBe(
      'A bold point with code and link.',
    );
  });
});
