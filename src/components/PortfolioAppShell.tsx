'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { NavigationItem, ProjectSummary } from '../lib/content/types';
import {
  Box,
  IconButton,
  SidebarIcon,
} from './blade/PortfolioPrimitives';
import { PortfolioSidebar, type RecentSidebarChat } from './PortfolioSidebar';

type PortfolioAppShellProps = {
  children: ReactNode;
  projects: ProjectSummary[];
  pages: NavigationItem[];
};

type PortfolioShellContextValue = {
  activeChatId: string;
  handleFirstUserMessage: (message: string) => void;
};

const RECENT_CHATS_STORAGE_KEY = 'portfolio-recent-chats';
const ACTIVE_CHAT_STORAGE_KEY = 'portfolio-active-chat-id';
const MAX_RECENT_CHATS = 5;
const MOBILE_TOP_BAR_HEIGHT = '68px';
const MOBILE_TOP_BAR_PADDING = 'spacing.5';
const MOBILE_TOP_BAR_BACKGROUND = 'surface.background.gray.subtle';
const MOBILE_TOP_BAR_BUTTON_BACKGROUND = 'surface.background.gray.subtle';
const MOBILE_TOP_BAR_ICON_COLOR = 'interactive.icon.gray.subtle';
const PortfolioShellContext = createContext<PortfolioShellContextValue | null>(null);

export function PortfolioAppShell({ children, projects, pages }: PortfolioAppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeChatId, setActiveChatId] = useState('current');
  const [recentChats, setRecentChats] = useState<RecentSidebarChat[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const storedRecentChats = parseRecentChats(
      window.sessionStorage.getItem(RECENT_CHATS_STORAGE_KEY),
    );
    const storedActiveChatId = window.sessionStorage.getItem(ACTIVE_CHAT_STORAGE_KEY);

    setRecentChats(storedRecentChats);
    if (storedActiveChatId) {
      setActiveChatId(storedActiveChatId);
    } else if (storedRecentChats[0]) {
      setActiveChatId(storedRecentChats[0].id);
    }
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(ACTIVE_CHAT_STORAGE_KEY, activeChatId);
  }, [activeChatId]);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  const handleNewChat = useCallback(() => {
    setIsMobileSidebarOpen(false);
    setActiveChatId(createChatSessionId());
    if (pathname !== '/') {
      router.push('/');
    }
  }, [pathname, router]);

  const handleSelectChat = useCallback(
    (chatId: string) => {
      setIsMobileSidebarOpen(false);
      setActiveChatId(chatId);
      if (pathname !== '/') {
        router.push('/');
      }
    },
    [pathname, router],
  );

  const handleFirstUserMessage = useCallback((message: string) => {
    setRecentChats((currentChats) => {
      const nextChats = [
        { id: activeChatId, title: formatRecentChatTitle(message) },
        ...currentChats.filter((chat) => chat.id !== activeChatId),
      ].slice(0, MAX_RECENT_CHATS);

      window.sessionStorage.setItem(RECENT_CHATS_STORAGE_KEY, JSON.stringify(nextChats));
      return nextChats;
    });
  }, [activeChatId]);

  const contextValue = useMemo(
    () => ({
      activeChatId,
      handleFirstUserMessage,
    }),
    [activeChatId, handleFirstUserMessage],
  );

  return (
    <PortfolioShellContext.Provider value={contextValue}>
      <Box
        minHeight="100svh"
        backgroundColor="surface.background.gray.intense"
        display="flex"
        flexDirection={{ base: 'column', m: 'row' }}
        minWidth="0px"
      >
        {isMobileSidebarOpen ? null : (
          <MobileSidebarTopBar onToggle={() => setIsMobileSidebarOpen(true)} />
        )}
        {isMobileSidebarOpen ? (
          <Box
            display={{ base: 'flex', m: 'none' }}
            position="fixed"
            top="spacing.0"
            left="spacing.0"
            right="spacing.0"
            bottom="spacing.0"
            zIndex={6}
          >
            <PortfolioSidebar
              projects={projects}
              pages={pages}
              recentChats={recentChats}
              activeChatId={activeChatId}
              onNewChat={handleNewChat}
              onSelectChat={handleSelectChat}
              variant="mobile"
              onRequestClose={() => setIsMobileSidebarOpen(false)}
            />
            <Box flex="1" minWidth="0px" backgroundColor="overlay.background.subtle" />
          </Box>
        ) : null}
        <Box
          position={{ base: 'relative', m: 'sticky' }}
          top={{ base: 'initial', m: 'spacing.0' }}
          alignSelf={{ base: 'stretch', m: 'flex-start' }}
          zIndex={3}
          display={{ base: 'none', m: 'block' }}
        >
          <PortfolioSidebar
            projects={projects}
            pages={pages}
            recentChats={recentChats}
            activeChatId={activeChatId}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
          />
        </Box>
        <Box flex="1" minWidth="0px">
          {children}
        </Box>
      </Box>
    </PortfolioShellContext.Provider>
  );
}

type MobileSidebarTopBarProps = {
  onToggle: () => void;
};

function MobileSidebarTopBar({ onToggle }: MobileSidebarTopBarProps) {
  return (
    <Box
      as="header"
      display={{ base: 'flex', m: 'none' }}
      alignItems="center"
      width="100%"
      height={MOBILE_TOP_BAR_HEIGHT}
      padding={MOBILE_TOP_BAR_PADDING}
      backgroundColor={MOBILE_TOP_BAR_BACKGROUND}
      flexShrink={0}
      zIndex={5}
    >
      <Box
        width="36px"
        height="36px"
        backgroundColor={MOBILE_TOP_BAR_BUTTON_BACKGROUND}
        borderRadius="medium"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
      >
        <IconButton
          icon={MobileSidebarToggleIcon}
          accessibilityLabel="Open sidebar"
          size="small"
          emphasis="subtle"
          onClick={onToggle}
        />
      </Box>
    </Box>
  );
}

type MobileSidebarToggleIconProps = {
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
};

function MobileSidebarToggleIcon({ size }: MobileSidebarToggleIconProps) {
  return <SidebarIcon size={size} color={MOBILE_TOP_BAR_ICON_COLOR} />;
}

export function usePortfolioShell() {
  const context = useContext(PortfolioShellContext);

  if (!context) {
    throw new Error('usePortfolioShell must be used inside PortfolioAppShell');
  }

  return context;
}

function parseRecentChats(value: string | null): RecentSidebarChat[] {
  if (!value) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(value);
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(isRecentSidebarChat).slice(0, MAX_RECENT_CHATS);
  } catch {
    window.sessionStorage.removeItem(RECENT_CHATS_STORAGE_KEY);
    return [];
  }
}

function isRecentSidebarChat(value: unknown): value is RecentSidebarChat {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const chat = value as Record<string, unknown>;
  return typeof chat.id === 'string' && typeof chat.title === 'string';
}

function formatRecentChatTitle(message: string): string {
  const normalizedMessage = message.replace(/\s+/g, ' ').trim();
  if (normalizedMessage.length <= 42) {
    return normalizedMessage;
  }

  return `${normalizedMessage.slice(0, 39)}...`;
}

function createChatSessionId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
