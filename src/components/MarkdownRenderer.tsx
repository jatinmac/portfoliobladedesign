import { parseMarkdownBlocks } from '../lib/content/markdown';
import {
  Box,
  Heading,
  Text,
} from './blade/PortfolioPrimitives';

type MarkdownRendererProps = {
  content: string;
  variant: 'article' | 'compact';
};

export function MarkdownRenderer({ content, variant }: MarkdownRendererProps) {
  const blocks = parseMarkdownBlocks(content);

  if (blocks.length === 0) {
    return null;
  }

  const isCompact = variant === 'compact';

  return (
    <Box display="flex" flexDirection="column" gap={isCompact ? 'spacing.3' : 'spacing.5'}>
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <Heading
              key={`${block.text}-${index}`}
              as={
                isCompact ? (block.level === 2 ? 'h3' : 'h4') : block.level === 2 ? 'h2' : 'h3'
              }
              size={isCompact ? 'small' : 'large'}
            >
              {block.text}
            </Heading>
          );
        }

        if (block.type === 'list') {
          const ListElement = block.ordered ? 'ol' : 'ul';

          return (
            <ListElement key={`list-${index}`}>
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>
                  <Text size={isCompact ? 'small' : 'medium'} wordBreak="break-word">
                    {item}
                  </Text>
                </li>
              ))}
            </ListElement>
          );
        }

        return (
          <Text
            key={`${block.text}-${index}`}
            size={isCompact ? 'small' : 'medium'}
            wordBreak="break-word"
          >
            {block.text}
          </Text>
        );
      })}
    </Box>
  );
}
