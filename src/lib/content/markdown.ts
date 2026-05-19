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
    }
  | {
      type: 'table';
      headers: string[];
      rows: string[][];
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
    list.push(item.trim());
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      flushParagraph();
      flushList();
      continue;
    }

    if (/^-{3,}$/.test(trimmedLine)) {
      flushParagraph();
      flushList();
      continue;
    }

    const tableHeaders = parseTableRow(trimmedLine);
    const tableSeparator = parseTableRow(lines[index + 1]?.trim() ?? '');
    if (
      tableHeaders.length > 0 &&
      tableSeparator.length === tableHeaders.length &&
      tableSeparator.every(isTableSeparatorCell)
    ) {
      flushParagraph();
      flushList();

      const rows: string[][] = [];
      index += 2;

      while (index < lines.length) {
        const row = parseTableRow(lines[index].trim());
        if (row.length === 0) {
          index -= 1;
          break;
        }

        rows.push(normalizeTableRow(row, tableHeaders.length));
        index += 1;
      }

      blocks.push({
        type: 'table',
        headers: tableHeaders,
        rows,
      });
      continue;
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
      continue;
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
      continue;
    }

    const listMatch = trimmedLine.match(/^[-*]\s+(.+)$/);
    if (listMatch) {
      flushParagraph();
      pushListItem(listMatch[1], false);
      continue;
    }

    const orderedListMatch = trimmedLine.match(/^\d+[.)]\s+(.+)$/);
    if (orderedListMatch) {
      flushParagraph();
      pushListItem(orderedListMatch[1], true);
      continue;
    }

    flushList();
    paragraph.push(trimmedLine);
  }

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

function parseTableRow(value: string): string[] {
  if (!value.includes('|')) {
    return [];
  }

  const normalized = value.replace(/^\|/, '').replace(/\|$/, '');
  const cells = normalized.split('|').map((cell) => cell.trim());

  return cells.length > 1 ? cells : [];
}

function isTableSeparatorCell(value: string): boolean {
  return /^:?-{3,}:?$/.test(value.replace(/\s+/g, ''));
}

function normalizeTableRow(row: string[], columnCount: number): string[] {
  if (row.length === columnCount) {
    return row;
  }

  if (row.length > columnCount) {
    return row.slice(0, columnCount);
  }

  return [...row, ...Array.from({ length: columnCount - row.length }, () => '')];
}
