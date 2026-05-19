import type { ReactNode } from 'react';

import { parseMarkdownBlocks, type MarkdownBlock } from '../lib/content/markdown';
import {
  Box,
  Code,
  Heading,
  Link,
  List,
  ListItem,
  ListItemText,
  Text,
} from './blade/PortfolioPrimitives';

type MarkdownRendererProps = {
  content: string;
  variant: 'article' | 'compact';
};

type InlineTextSize = 'small' | 'medium';

const INLINE_MARKDOWN_PATTERN = /(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*\n]+\*)/g;

export function MarkdownRenderer({ content, variant }: MarkdownRendererProps) {
  const blocks = parseMarkdownBlocks(content);

  if (blocks.length === 0) {
    return null;
  }

  const isCompact = variant === 'compact';

  return (
    <Box display="flex" flexDirection="column" gap={isCompact ? 'spacing.3' : 'spacing.5'}>
      {blocks.map((block, index) => (
        <MarkdownBlockRenderer
          key={getBlockKey(block, index)}
          block={block}
          blockIndex={index}
          isCompact={isCompact}
        />
      ))}
    </Box>
  );
}

export function MarkdownBlockRenderer({
  block,
  blockIndex,
  isCompact,
}: {
  block: MarkdownBlock;
  blockIndex: number;
  isCompact: boolean;
}) {
  const textSize = isCompact ? 'small' : 'medium';

  if (block.type === 'heading') {
    return (
      <Heading
        as={isCompact ? (block.level === 2 ? 'h3' : 'h4') : block.level === 2 ? 'h2' : 'h3'}
        size={isCompact ? 'small' : 'large'}
      >
        {block.text}
      </Heading>
    );
  }

  if (block.type === 'list') {
    return (
      <List variant={block.ordered ? 'ordered' : 'unordered'} size={isCompact ? 'small' : 'medium'}>
        {block.items.map((item, itemIndex) => (
          <ListItem key={`${item}-${itemIndex}`}>
            <ListItemText>
              {renderInlineMarkdown(item, textSize, `list-${blockIndex}-${itemIndex}`)}
            </ListItemText>
          </ListItem>
        ))}
      </List>
    );
  }

  if (block.type === 'table') {
    return (
      <MarkdownTableBlock block={block} blockIndex={blockIndex} isCompact={isCompact} />
    );
  }

  return (
    <Text size={textSize} wordBreak="break-word">
      {renderInlineMarkdown(block.text, textSize, `paragraph-${blockIndex}`)}
    </Text>
  );
}

export function MarkdownTableBlock({
  block,
  blockIndex,
  isCompact,
}: {
  block: Extract<MarkdownBlock, { type: 'table' }>;
  blockIndex: number;
  isCompact: boolean;
}) {
  const textSize = isCompact ? 'small' : 'medium';
  const minColumnWidth = isCompact ? 148 : 180;
  const minTableWidth = `${Math.max(block.headers.length, 1) * minColumnWidth}px` as `${number}px`;
  const gridTemplateColumns = `repeat(${Math.max(block.headers.length, 1)}, minmax(${minColumnWidth}px, 1fr))`;

  return (
    <Box width="100%" overflowX="auto">
      <Box
        display="grid"
        gridTemplateColumns={gridTemplateColumns}
        minWidth={minTableWidth}
        borderWidth="thin"
        borderStyle="solid"
        borderColor="surface.border.gray.muted"
        borderRadius="small"
        overflow="hidden"
      >
        {block.headers.map((header, headerIndex) => (
          <MarkdownTableCell
            key={`${header}-${headerIndex}`}
            content={header}
            id={`table-${blockIndex}-header-${headerIndex}`}
            isHeader
            textSize={textSize}
          />
        ))}
        {block.rows.flatMap((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <MarkdownTableCell
              key={`table-${blockIndex}-${rowIndex}-${cellIndex}`}
              content={cell}
              id={`table-${blockIndex}-${rowIndex}-${cellIndex}`}
              textSize={textSize}
            />
          )),
        )}
      </Box>
    </Box>
  );
}

function MarkdownTableCell({
  content,
  id,
  isHeader = false,
  textSize,
}: {
  content: string;
  id: string;
  isHeader?: boolean;
  textSize: InlineTextSize;
}) {
  return (
    <Box
      padding={textSize === 'small' ? 'spacing.3' : 'spacing.4'}
      backgroundColor={isHeader ? 'surface.background.gray.intense' : 'surface.background.gray.subtle'}
      borderRightWidth="thin"
      borderBottomWidth="thin"
      borderStyle="solid"
      borderColor="surface.border.gray.muted"
      minWidth="0px"
    >
      <Text size={textSize} weight={isHeader ? 'semibold' : 'regular'} wordBreak="break-word">
        {renderInlineMarkdown(content, textSize, id)}
      </Text>
    </Box>
  );
}

export function renderInlineMarkdown(
  value: string,
  size: InlineTextSize,
  keyPrefix: string,
): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  Array.from(value.matchAll(INLINE_MARKDOWN_PATTERN)).forEach((match, matchIndex) => {
    if (match.index === undefined) {
      return;
    }

    if (match.index > lastIndex) {
      nodes.push(value.slice(lastIndex, match.index));
    }

    const token = match[0];
    nodes.push(renderInlineToken(token, size, `${keyPrefix}-${matchIndex}`));
    lastIndex = match.index + token.length;
  });

  if (lastIndex < value.length) {
    nodes.push(value.slice(lastIndex));
  }

  return nodes;
}

function renderInlineToken(token: string, size: InlineTextSize, key: string): ReactNode {
  const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (linkMatch) {
    const [, label, href] = linkMatch;
    if (!isSafeInlineHref(href)) {
      return label;
    }

    const external = /^https?:\/\//i.test(href);
    return (
      <Link
        key={key}
        href={href}
        size={size}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {label}
      </Link>
    );
  }

  if (token.startsWith('`') && token.endsWith('`')) {
    return (
      <Code key={key} size="small">
        {token.slice(1, -1)}
      </Code>
    );
  }

  if (token.startsWith('**') && token.endsWith('**')) {
    return (
      <Text key={key} as="span" size={size} weight="semibold">
        {token.slice(2, -2)}
      </Text>
    );
  }

  if (token.startsWith('*') && token.endsWith('*')) {
    return <em key={key}>{token.slice(1, -1)}</em>;
  }

  return token;
}

function isSafeInlineHref(href: string): boolean {
  return /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(href);
}

function getBlockKey(block: MarkdownBlock, index: number): string {
  if (block.type === 'heading' || block.type === 'paragraph') {
    return `${block.text}-${index}`;
  }

  if (block.type === 'table') {
    return `table-${index}-${block.headers.join('-')}`;
  }

  return `list-${index}-${block.items.join('-')}`;
}
