export type MarkdownBlock =
  | {
      type: 'heading';
      level: 2 | 3;
      text: string;
    }
  | {
      type: 'paragraph';
      text: string;
    }
  | {
      type: 'list';
      ordered: boolean;
      items: string[];
    };

export function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  const lines = markdown.split(/\r?\n/);
  let paragraph: string[] = [];
  let list: string[] = [];
  let listOrdered = false;

  const flushParagraph = (): void => {
    if (paragraph.length > 0) {
      blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
      paragraph = [];
    }
  };

  const flushList = (): void => {
    if (list.length > 0) {
      blocks.push({ type: 'list', ordered: listOrdered, items: list });
      list = [];
      listOrdered = false;
    }
  };

  const pushListItem = (item: string, ordered: boolean): void => {
    if (list.length > 0 && listOrdered !== ordered) {
      flushList();
    }

    listOrdered = ordered;
    list.push(stripInlineMarkdown(item));
  };

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      flushParagraph();
      flushList();
      return;
    }

    if (/^-{3,}$/.test(trimmedLine)) {
      flushParagraph();
      flushList();
      return;
    }

    const headingMatch = trimmedLine.match(/^(#{2,3})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length as 2 | 3,
        text: stripInlineMarkdown(headingMatch[2]),
      });
      return;
    }

    const boldLabelMatch = trimmedLine.match(/^\*\*(.+?)\*\*:?\s*$/);
    if (boldLabelMatch) {
      flushParagraph();
      flushList();
      blocks.push({
        type: 'heading',
        level: 3,
        text: stripInlineMarkdown(boldLabelMatch[1]),
      });
      return;
    }

    const listMatch = trimmedLine.match(/^[-*]\s+(.+)$/);
    if (listMatch) {
      flushParagraph();
      pushListItem(listMatch[1], false);
      return;
    }

    const orderedListMatch = trimmedLine.match(/^\d+[.)]\s+(.+)$/);
    if (orderedListMatch) {
      flushParagraph();
      pushListItem(orderedListMatch[1], true);
      return;
    }

    flushList();
    paragraph.push(stripInlineMarkdown(trimmedLine));
  });

  flushParagraph();
  flushList();

  return blocks;
}

export function stripInlineMarkdown(value: string): string {
  return value
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1');
}
