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
  CloseIcon,
  IconButton,
  MessageSquareIcon,
  SidebarIcon,
  Text,
} from './blade/PortfolioPrimitives';
import { HomepageChatExperience } from './HomepageChatExperience';
import { PageTransition } from './PageTransition';
import { PortfolioSidebar, type RecentSidebarChat } from './PortfolioSidebar';
import { ScrollProgressBar } from './ScrollProgressBar';

type PortfolioAppShellProps = {
  children: ReactNode;
  projects: ProjectSummary[];
  pages: NavigationItem[];
  placeholderSuggestions: string[];
  emptyStateHeading: string;
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

export function PortfolioAppShell({
  children,
  projects,
  pages,
  placeholderSuggestions,
  emptyStateHeading,
}: PortfolioAppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeChatId, setActiveChatId] = useState('current');
  const [recentChats, setRecentChats] = useState<RecentSidebarChat[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const isMobileViewport = useIsMobileViewport();
  const pageTitle = getPageTitle(pathname);
  const shouldUseSplitWorkspace = isSplitWorkspaceRoute(pathname, pages);

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
    setIsMobileChatOpen(false);
  }, [pathname]);

  const handleNewChat = useCallback(() => {
    setIsMobileSidebarOpen(false);
    setIsMobileChatOpen(false);
    setActiveChatId(createChatSessionId());
    if (pathname !== '/') {
      router.push('/');
    }
  }, [pathname, router]);

  const handleSelectChat = useCallback(
    (chatId: string) => {
      setIsMobileSidebarOpen(false);
      setIsMobileChatOpen(false);
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
        {isMobileSidebarOpen || isMobileChatOpen ? null : (
          <MobileSidebarTopBar
            pageTitle={pageTitle}
            pathname={pathname}
            onToggle={() => setIsMobileSidebarOpen(true)}
            showChatToggle={shouldUseSplitWorkspace}
            isChatOpen={isMobileChatOpen}
            onToggleChat={() => setIsMobileChatOpen((isOpen) => !isOpen)}
          />
        )}
        <Box
          position="fixed"
          top="spacing.0"
          right="spacing.0"
          bottom="spacing.0"
          left="spacing.0"
          zIndex={6}
          display={{ base: isMobileSidebarOpen ? 'flex' : 'none', m: 'none' }}
        >
          <Box height="100%">
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
          </Box>
          <Box flex="1" minWidth="0px" height="100%" backgroundColor="overlay.background.subtle" />
        </Box>
        {shouldUseSplitWorkspace ? (
          <Box
            position="fixed"
            top="spacing.0"
            right="spacing.0"
            bottom="spacing.0"
            left="spacing.0"
            zIndex={7}
            display={{ base: isMobileChatOpen ? 'flex' : 'none', m: 'none' }}
            flexDirection="column"
            backgroundColor="surface.background.gray.subtle"
          >
            <Box
              as="header"
              display="flex"
              alignItems="center"
              width="100%"
              height={MOBILE_TOP_BAR_HEIGHT}
              padding={MOBILE_TOP_BAR_PADDING}
              backgroundColor={MOBILE_TOP_BAR_BACKGROUND}
              flexShrink={0}
              gap="spacing.3"
            >
              <Box minWidth="0px" flex="1">
                <Text
                  as="span"
                  size="medium"
                  weight="semibold"
                  color="surface.text.gray.normal"
                  truncateAfterLines={1}
                >
                  AI Chat
                </Text>
              </Box>
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
                  icon={MobileChatCloseIcon}
                  accessibilityLabel="Close chat"
                  size="small"
                  emphasis="subtle"
                  onClick={() => setIsMobileChatOpen(false)}
                />
              </Box>
            </Box>
            <Box flex="1" minHeight="0px" minWidth="0px">
              {isMobileChatOpen ? (
                <HomepageChatExperience
                  placeholderSuggestions={placeholderSuggestions}
                  projects={projects}
                  emptyStateHeading={emptyStateHeading}
                />
              ) : null}
            </Box>
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
        <Box flex="1" minWidth="0px" width="100%">
          {pathname === '/' ? null : <ScrollProgressBar />}
          {shouldUseSplitWorkspace ? (
            <Box
              display="grid"
              gridTemplateColumns={{
                base: 'minmax(0, 1fr)',
                l: 'minmax(0, 1fr) minmax(380px, 500px)',
                xl: 'minmax(0, 1fr) minmax(420px, 520px)',
              }}
              minHeight={{ base: 'calc(100svh - 68px)', m: '100svh' }}
              minWidth="0px"
              width="100%"
              backgroundColor="surface.background.gray.subtle"
            >
              <Box minWidth="0px">
                <PageTransition>{children}</PageTransition>
              </Box>
              <Box
                display={{ base: 'none', m: 'block' }}
                borderLeftColor="surface.border.gray.subtle"
                borderLeftStyle="solid"
                borderLeftWidth={{ base: 'none', l: 'thin' }}
                height={{ base: 'calc(100svh - 68px)', m: '100svh' }}
                minHeight={{ base: '560px', l: '0px' }}
                minWidth="0px"
                position={{ base: 'relative', l: 'sticky' }}
                top={{ base: 'initial', l: 'spacing.0' }}
              >
                {isMobileViewport ? null : (
                  <HomepageChatExperience
                    placeholderSuggestions={placeholderSuggestions}
                    projects={projects}
                    emptyStateHeading={emptyStateHeading}
                  />
                )}
              </Box>
            </Box>
          ) : (
            <PageTransition>{children}</PageTransition>
          )}
        </Box>
      </Box>
    </PortfolioShellContext.Provider>
  );
}

type MobileSidebarTopBarProps = {
  pageTitle: string;
  pathname: string;
  onToggle: () => void;
  showChatToggle: boolean;
  isChatOpen: boolean;
  onToggleChat: () => void;
};

function MobileSidebarTopBar({
  pageTitle,
  pathname,
  onToggle,
  showChatToggle,
  isChatOpen,
  onToggleChat,
}: MobileSidebarTopBarProps) {
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
      gap="spacing.3"
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
      <Box minWidth="0px" flex="1">
        <Text
          as="span"
          size="medium"
          weight="semibold"
          color="surface.text.gray.normal"
          truncateAfterLines={1}
        >
          {pageTitle}
        </Text>
      </Box>
      {showChatToggle ? (
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
            icon={MobileChatToggleIcon}
            accessibilityLabel={isChatOpen ? 'Close chat' : 'Open chat'}
            size="small"
            emphasis="subtle"
            onClick={onToggleChat}
          />
        </Box>
      ) : null}
    </Box>
  );
}

type MobileSidebarToggleIconProps = {
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
};

function MobileSidebarToggleIcon({ size }: MobileSidebarToggleIconProps) {
  return <SidebarIcon size={size} color={MOBILE_TOP_BAR_ICON_COLOR} />;
}

function MobileChatToggleIcon({ size }: MobileSidebarToggleIconProps) {
  return <MessageSquareIcon size={size} color={MOBILE_TOP_BAR_ICON_COLOR} />;
}

function MobileChatCloseIcon({ size }: MobileSidebarToggleIconProps) {
  return <CloseIcon size={size} color={MOBILE_TOP_BAR_ICON_COLOR} />;
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

function useIsMobileViewport(): boolean {
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateMobileViewport = () => setIsMobileViewport(mediaQuery.matches);

    updateMobileViewport();
    mediaQuery.addEventListener('change', updateMobileViewport);

    return () => {
      mediaQuery.removeEventListener('change', updateMobileViewport);
    };
  }, []);

  return isMobileViewport;
}

function getPageTitle(pathname: string): string {
  if (pathname === '/') {
    return 'About';
  }

  if (pathname === '/about') {
    return 'About';
  }

  if (pathname === '/projects' || pathname.startsWith('/projects/')) {
    return 'Projects';
  }

  if (pathname === '/experience') {
    return 'Experience';
  }

  if (pathname === '/contact') {
    return 'Contact';
  }

  return 'Portfolio';
}

function isSplitWorkspaceRoute(pathname: string, pages: NavigationItem[]): boolean {
  if (pathname === '/') {
    return true;
  }

  if (pathname.startsWith('/projects/')) {
    return true;
  }

  return pages.some((page) => page.href === pathname);
}
