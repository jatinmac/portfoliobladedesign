import { memo } from 'react';

import { Box, Text } from './blade/PortfolioPrimitives';
import { MarkdownRenderer } from './MarkdownRenderer';

type ChatMessageContentProps = {
  content: string;
  role: 'user' | 'assistant';
  isStreaming?: boolean;
};

function ChatMessageContentInner({ content, role, isStreaming = false }: ChatMessageContentProps) {
  if (role === 'user') {
    return (
      <Box padding="spacing.2">
        <Text wordBreak="break-word">{content}</Text>
      </Box>
    );
  }

  if (isStreaming) {
    return (
      <Box whiteSpace="pre-wrap">
        <Text size="small" wordBreak="break-word">
          {content}
        </Text>
      </Box>
    );
  }

  return <MarkdownRenderer content={content} variant="compact" />;
}

export const ChatMessageContent = memo(ChatMessageContentInner);
