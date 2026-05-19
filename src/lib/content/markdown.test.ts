import { describe, expect, it } from 'vitest';

import { parseMarkdownBlocks } from './markdown';

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
});
