'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import chatExperienceIntroImage from '../../assets/profile/chat_experience_intro.png';
import type { AssistantMetadata, ChatMessage as ApiChatMessage } from '../lib/chat/types';
import { portfolioColorScheme, portfolioTheme } from './blade/portfolio-theme';
import { ChatMessageContent } from './ChatMessageContent';
import {
  BladeProvider,
  Box,
  Button,
  ChatInput,
  ChatMessage,
  Chip,
  ChipGroup,
  Fade,
  Heading,
  Move,
  RayIcon,
  RefreshIcon,
  Text,
} from './blade/PortfolioPrimitives';

type ChatPanelProps = {
  scope: 'portfolio' | 'project';
  storageKey: string;
  projectSlug?: string;
  starterPrompts?: string[];
  emptyStateHeading?: ReactNode;
  emptyStateFooter?: ReactNode;
  emptyStateSpacing?: 'default' | 'homepage';
  onFirstUserMessage?: (message: string) => void;
  onEmptyStateChange?: (isEmptyChat: boolean) => void;
  resetSignal?: number;
};

type ChatMessage = ApiChatMessage & {
  id: string;
  metadata?: AssistantMetadata;
};

const METADATA_START = '[[PORTFOLIO_CHAT_METADATA]]';
const METADATA_END = '[[/PORTFOLIO_CHAT_METADATA]]';
const roundedChatChipTheme = {
  ...portfolioTheme,
  border: {
    ...portfolioTheme.border,
    radius: {
      ...portfolioTheme.border.radius,
      small: 1000,
      medium: 1000,
    },
  },
} as unknown as typeof portfolioTheme;

export function ChatPanel({
  scope,
  storageKey,
  projectSlug,
  starterPrompts = [],
  emptyStateHeading,
  emptyStateFooter,
  emptyStateSpacing = 'default',
  onFirstUserMessage,
  onEmptyStateChange,
  resetSignal,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const hasLoadedRef = useRef(false);
  const isEmptyChat = messages.length === 0;
  const isHomepageEmptyState = emptyStateSpacing === 'homepage';

  useEffect(() => {
    try {
      const storedMessages = window.sessionStorage.getItem(storageKey);
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages) as ChatMessage[];
        setMessages(parsedMessages);
        onEmptyStateChange?.(parsedMessages.length === 0);
      } else {
        setMessages([]);
        onEmptyStateChange?.(true);
      }
    } catch {
      window.sessionStorage.removeItem(storageKey);
      setMessages([]);
      onEmptyStateChange?.(true);
    } finally {
      setDraft('');
      setError(null);
      hasLoadedRef.current = true;
    }
  }, [onEmptyStateChange, storageKey]);

  useEffect(() => {
    if (!resetSignal) {
      return;
    }

    abortControllerRef.current?.abort();
    setMessages([]);
    setDraft('');
    setError(null);
    window.sessionStorage.removeItem(storageKey);
    onEmptyStateChange?.(true);
  }, [onEmptyStateChange, resetSignal, storageKey]);

  useEffect(() => {
    if (!hasLoadedRef.current) {
      return;
    }

    onEmptyStateChange?.(isEmptyChat);
  }, [isEmptyChat, onEmptyStateChange]);

  useEffect(() => {
    if (!hasLoadedRef.current) {
      return;
    }

    if (messages.length === 0) {
      window.sessionStorage.removeItem(storageKey);
      return;
    }

    if (isStreaming) {
      return;
    }

    window.sessionStorage.setItem(storageKey, JSON.stringify(messages));
  }, [isStreaming, messages, storageKey]);

  useEffect(() => {
    if (messages.length === 0) {
      return undefined;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      const messageList = messageListRef.current;
      if (messageList) {
        messageList.scrollTo({
          top: messageList.scrollHeight,
          behavior: isStreaming ? 'auto' : 'smooth',
        });
      }
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [isStreaming, messages]);

  const latestUserMessage = useMemo(
    () => {
      for (let index = messages.length - 1; index >= 0; index -= 1) {
        if (messages[index].role === 'user') {
          return messages[index];
        }
      }

      return undefined;
    },
    [messages],
  );

  const updateAssistantMessage = useCallback(
    (
      messageId: string,
      content: string,
      assistantMetadata?: AssistantMetadata,
    ) => {
      setMessages((currentMessages) => {
        let didUpdate = false;
        const nextMessages = currentMessages.map((message) => {
          if (message.id !== messageId) {
            return message;
          }

          const nextMetadata = assistantMetadata ?? message.metadata;
          if (message.content === content && message.metadata === nextMetadata) {
            return message;
          }

          didUpdate = true;
          return {
            ...message,
            content,
            metadata: nextMetadata,
          };
        });

        return didUpdate ? nextMessages : currentMessages;
      });
    },
    [],
  );

  const removeMessage = useCallback((messageId: string) => {
    setMessages((currentMessages) => {
      const nextMessages = currentMessages.filter((message) => message.id !== messageId);
      return nextMessages.length === currentMessages.length ? currentMessages : nextMessages;
    });
  }, []);

  const sendMessage = useCallback(
    async (messageText: string, baseMessages = messages) => {
      const content = messageText.trim();
      if (!content || isStreaming) {
        return;
      }

      const hadNoUserMessages = !baseMessages.some((message) => message.role === 'user');
      const userMessage: ChatMessage = {
        id: createMessageId(),
        role: 'user',
        content,
      };
      const assistantMessage: ChatMessage = {
        id: createMessageId(),
        role: 'assistant',
        content: '',
      };
      const nextMessages = [...baseMessages, userMessage, assistantMessage];

      setMessages(nextMessages);
      setDraft('');
      setError(null);
      setIsStreaming(true);
      if (hadNoUserMessages) {
        onFirstUserMessage?.(content);
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      let assistantContent = '';
      let buffer = '';
      let parsedMetadata = false;
      let assistantMetadata: AssistantMetadata | undefined;

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          signal: abortController.signal,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [...baseMessages, userMessage].map(({ role, content }) => ({ role, content })),
            scope,
            projectSlug,
          }),
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error ?? 'Chat request failed.');
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Chat response did not include a readable stream.');
        }

        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const decoded = decoder.decode(value, { stream: true });
          if (!parsedMetadata) {
            buffer += decoded;
            const metadataEndIndex = buffer.indexOf(METADATA_END);
            if (buffer.startsWith(METADATA_START) && metadataEndIndex !== -1) {
              const metadataPayload = buffer.slice(METADATA_START.length, metadataEndIndex);
              assistantMetadata = JSON.parse(metadataPayload) as AssistantMetadata;
              assistantContent += buffer.slice(metadataEndIndex + METADATA_END.length);
              parsedMetadata = true;
              buffer = '';
            }
          } else {
            assistantContent += decoded;
          }

          if (parsedMetadata || assistantContent) {
            updateAssistantMessage(assistantMessage.id, assistantContent, assistantMetadata);
          }
        }

      } catch (caughtError) {
        if ((caughtError as Error).name === 'AbortError') {
          if (!assistantContent) {
            removeMessage(assistantMessage.id);
          }
          return;
        }

        const message = caughtError instanceof Error ? caughtError.message : 'Chat failed.';
        setError(message);
        updateAssistantMessage(assistantMessage.id, `I could not answer that yet. ${message}`);
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [isStreaming, messages, onFirstUserMessage, projectSlug, removeMessage, scope, updateAssistantMessage],
  );

  const handleStop = () => {
    abortControllerRef.current?.abort();
  };

  const handleRetry = () => {
    if (!latestUserMessage || isStreaming) {
      return;
    }

    const lastUserIndex = findMessageIndexFromEnd(
      messages,
      (message) => message.id === latestUserMessage.id,
    );
    const baseMessages = messages.slice(0, lastUserIndex);
    setMessages(baseMessages);
    void sendMessage(latestUserMessage.content, baseMessages);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="flex-end"
      gap="spacing.4"
      height="100%"
      minWidth="0px"
      minHeight="0px"
      position="relative"
      overflow="visible"
    >
      <Box
        ref={messageListRef}
        position="relative"
        display="flex"
        flexDirection="column"
        gap="spacing.4"
        justifyContent={isHomepageEmptyState && isEmptyChat ? 'center' : 'flex-start'}
        overflow={isEmptyChat ? 'visible' : undefined}
        overflowY={isEmptyChat ? 'visible' : 'auto'}
        flex="1"
        minHeight="0px"
        minWidth="0px"
        maxWidth="620px"
        width="100%"
        marginX="auto"
        paddingTop={
          isEmptyChat
            ? isHomepageEmptyState
              ? 'spacing.3'
              : 'spacing.2'
            : { base: 'spacing.4', m: 'spacing.6' }
        }
        paddingBottom={{ base: 'spacing.4', m: 'spacing.6' }}
        zIndex={2}
      >
        {isEmptyChat ? (
          <Fade isVisible type="inout" shouldUnmountWhenHidden>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              width="100%"
              gap={isHomepageEmptyState ? 'spacing.0' : 'spacing.5'}
            >
              <ChatProfileIntroCard />
              {emptyStateHeading ? (
                <Box marginTop={isHomepageEmptyState ? 'spacing.6' : 'spacing.0'}>
                  <Heading
                    as="h1"
                    size="large"
                    weight="regular"
                    textAlign="center"
                    color="surface.text.gray.normal"
                  >
                    {emptyStateHeading}
                  </Heading>
                </Box>
              ) : null}
              <Box
                marginTop={isHomepageEmptyState ? 'spacing.5' : 'spacing.0'}
                width="100%"
                display="flex"
                flexDirection="column"
                gap="spacing.4"
              >
                <ChatComposer
                  draft={draft}
                  error={error}
                  isStreaming={isStreaming}
                  onDraftChange={setDraft}
                  onSubmit={sendMessage}
                  onStop={handleStop}
                  onErrorDismiss={() => setError(null)}
                />
                <StarterPromptActions
                  prompts={starterPrompts}
                  isDisabled={isStreaming}
                  onSelectPrompt={(prompt) => void sendMessage(prompt)}
                />
              </Box>
              {emptyStateFooter ? (
                <Box marginTop={isHomepageEmptyState ? 'spacing.3' : 'spacing.0'} width="100%">
                  {emptyStateFooter}
                </Box>
              ) : null}
            </Box>
          </Fade>
        ) : null}

        {messages.map((message) => (
          <Box key={message.id} position="relative" zIndex={2}>
            <ChatMessage
              senderType={message.role === 'user' ? 'self' : 'other'}
              leading={
                message.role === 'assistant' ? (
                  <RayIcon size="large" color="interactive.icon.primary.normal" />
                ) : undefined
              }
              isLoading={message.role === 'assistant' && !message.content}
              loadingText="Thinking..."
              maxWidth="100%"
              wordBreak="break-word"
              footerActions={
                message.role === 'assistant' && message.content && message.metadata ? (
                  <AssistantResponseMetadata
                    metadata={message.metadata}
                    isDisabled={isStreaming}
                    onFollowUp={(followUp) => void sendMessage(followUp)}
                  />
                ) : undefined
              }
            >
              {message.content ? (
                <ChatMessageContent
                  content={message.content}
                  role={message.role}
                  isStreaming={
                    isStreaming &&
                    message.role === 'assistant' &&
                    message.id === messages[messages.length - 1]?.id
                  }
                />
              ) : (
                ''
              )}
            </ChatMessage>
          </Box>
        ))}
      </Box>

      {isEmptyChat ? null : (
        <Move isVisible={!isEmptyChat} type="inout" shouldUnmountWhenHidden>
          <ChatComposerShell
            error={error}
            isRetryDisabled={!latestUserMessage || isStreaming}
            onRetry={handleRetry}
          >
            <ChatComposer
              draft={draft}
              error={error}
              isStreaming={isStreaming}
              onDraftChange={setDraft}
              onSubmit={sendMessage}
              onStop={handleStop}
              onErrorDismiss={() => setError(null)}
            />
          </ChatComposerShell>
        </Move>
      )}
    </Box>
  );
}

type ChatComposerProps = {
  draft: string;
  error: string | null;
  isStreaming: boolean;
  onDraftChange: (value: string) => void;
  onSubmit: (value: string) => void | Promise<void>;
  onStop: () => void;
  onErrorDismiss: () => void;
};

function ChatComposer({
  draft,
  error,
  isStreaming,
  onDraftChange,
  onSubmit,
  onStop,
  onErrorDismiss,
}: ChatComposerProps) {
  const handleChange = (input: ChatInputPayload) => {
    const nextDraft = readChatInputValue(input, draft);
    if (nextDraft !== draft) {
      onDraftChange(nextDraft);
    }
  };

  const handleSubmit = (input: ChatInputPayload) => {
    preventDefaultIfEvent(input);
    void onSubmit(readChatInputValue(input, draft));
  };

  return (
    <Box width="620px" maxWidth={{ base: 'calc(100% - 8px)', m: '100%' }} marginX="auto">
      <ChatInput
        accessibilityLabel="Ask about Jatin's work"
        placeholder="Ask anything about Jatin's work"
        value={draft}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isGenerating={isStreaming}
        onStop={onStop}
        validationState={error ? 'error' : 'none'}
        errorText={error ?? undefined}
        onErrorDismiss={onErrorDismiss}
      />
    </Box>
  );
}

type ChatInputPayload =
  | { value?: string }
  | { target?: { value?: string }; currentTarget?: { value?: string }; preventDefault?: () => void }
  | string
  | unknown;

function readChatInputValue(input: ChatInputPayload, fallback: string): string {
  if (typeof input === 'string') {
    return input;
  }

  if (!input || typeof input !== 'object') {
    return fallback;
  }

  const payload = input as {
    value?: unknown;
    target?: { value?: unknown };
    currentTarget?: { value?: unknown };
  };

  if (typeof payload.value === 'string') {
    return payload.value;
  }

  if (typeof payload.target?.value === 'string') {
    return payload.target.value;
  }

  if (typeof payload.currentTarget?.value === 'string') {
    return payload.currentTarget.value;
  }

  return fallback;
}

function preventDefaultIfEvent(input: ChatInputPayload): void {
  if (input && typeof input === 'object' && 'preventDefault' in input) {
    (input as { preventDefault?: () => void }).preventDefault?.();
  }
}

type ChatComposerShellProps = {
  children: React.ReactNode;
  error: string | null;
  isRetryDisabled: boolean;
  onRetry: () => void;
};

function ChatComposerShell({
  children,
  error,
  isRetryDisabled,
  onRetry,
}: ChatComposerShellProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing.3"
      width="620px"
      maxWidth={{ base: 'calc(100% - 8px)', m: '100%' }}
      marginX="auto"
      position="relative"
      zIndex={2}
    >
      {error ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Button
            variant="secondary"
            size="small"
            icon={RefreshIcon}
            onClick={onRetry}
            isDisabled={isRetryDisabled}
          >
            Retry
          </Button>
        </Box>
      ) : null}

      {children}
    </Box>
  );
}

type StarterPromptActionsProps = {
  prompts: string[];
  isDisabled: boolean;
  onSelectPrompt: (prompt: string) => void;
};

function StarterPromptActions({ prompts, isDisabled, onSelectPrompt }: StarterPromptActionsProps) {
  if (prompts.length === 0) {
    return null;
  }

  return (
    <RoundedChatChipTheme>
      <Box width="max-content">
        <ChipGroup
          accessibilityLabel="Starter chat suggestions"
          selectionType="single"
          size="xsmall"
          isDisabled={isDisabled}
          onChange={({ values }) => {
            const selectedPrompt = values[0];
            if (selectedPrompt) {
              onSelectPrompt(selectedPrompt);
            }
          }}
        >
          {prompts.map((prompt) => (
            <Chip key={prompt} value={prompt}>
              {prompt}
            </Chip>
          ))}
        </ChipGroup>
      </Box>
    </RoundedChatChipTheme>
  );
}

type AssistantResponseMetadataProps = {
  metadata: AssistantMetadata;
  isDisabled: boolean;
  onFollowUp: (followUp: string) => void;
};

function AssistantResponseMetadata({
  metadata,
  isDisabled,
  onFollowUp,
}: AssistantResponseMetadataProps) {
  const followUps = metadata.followUps.slice(0, 3);

  if (followUps.length === 0) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing.3"
      marginTop="spacing.3"
      padding="spacing.3"
      backgroundColor="surface.background.gray.subtle"
      borderRadius="medium"
    >
      <RoundedChatChipTheme>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          gap="spacing.0"
        >
          {followUps.map((followUp, followUpIndex) => (
            <ChipGroup
              key={followUp}
              accessibilityLabel={`Follow-up chat suggestion ${followUpIndex + 1}`}
              selectionType="single"
              size="xsmall"
              isDisabled={isDisabled}
              onChange={({ values }) => {
                const selectedFollowUp = values[0];
                if (selectedFollowUp) {
                  onFollowUp(selectedFollowUp);
                }
              }}
            >
              <Chip value={followUp}>{followUp}</Chip>
            </ChipGroup>
          ))}
        </Box>
      </RoundedChatChipTheme>
    </Box>
  );
}

function RoundedChatChipTheme({ children }: { children: ReactNode }) {
  return (
    <BladeProvider themeTokens={roundedChatChipTheme} colorScheme={portfolioColorScheme}>
      {children}
    </BladeProvider>
  );
}

function ChatProfileIntroCard() {
  return (
    <Box
      width="100%"
      maxWidth="206px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="spacing.3"
      position="relative"
    >
      <Box width="100px" height="100px" position="relative" zIndex={1}>
        <Box
          width="100px"
          height="100px"
          borderRadius="medium"
          overflow="hidden"
          position="relative"
        >
          <Image
            src={chatExperienceIntroImage}
            alt="Jatin Davis"
            width={100}
            height={100}
            sizes="100px"
            priority
          />
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="spacing.2"
        position="relative"
        zIndex={1}
        width="100%"
      >
        <Text size="medium" weight="semibold" color="surface.text.gray.normal" textAlign="center">
          Jatin Davis
        </Text>
        <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.1">
          <Text variant="caption" size="medium" color="surface.text.gray.normal" textAlign="center">
            Product Builder, Designer
          </Text>
          <Text variant="caption" size="small" color="surface.text.gray.muted" textAlign="center">
            @ Double AI, Ex Maruti Suzuki
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

function createMessageId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function findMessageIndexFromEnd(
  messages: ChatMessage[],
  predicate: (message: ChatMessage) => boolean,
): number {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (predicate(messages[index])) {
      return index;
    }
  }

  return -1;
}
