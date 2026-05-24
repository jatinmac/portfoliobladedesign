'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import type { NavigationItem, ProjectSummary } from '../lib/content/types';
import { portfolioColorScheme, portfolioTheme } from './blade/portfolio-theme';
import {
  ActionList,
  ActionListItem,
  AnimateInteractions,
  BladeProvider,
  Box,
  Button,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  DownloadIcon,
  Fade,
  IconButton,
  MailIcon,
  MessageSquareIcon,
  Move,
  Scale,
  SidebarIcon,
  Slide,
  Text,
} from './blade/PortfolioPrimitives';

type PortfolioSidebarProps = {
  projects: ProjectSummary[];
  pages: NavigationItem[];
  recentChats: RecentSidebarChat[];
  activeChatId: string;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  variant?: 'desktop' | 'mobile';
  onRequestClose?: () => void;
};

export type RecentSidebarChat = {
  id: string;
  title: string;
};

const SIDEBAR_EXIT_DELAY_MS = 180;
const SIDEBAR_OPEN_WIDTH = '280px';
const SIDEBAR_CLOSED_WIDTH = '68px';
const SIDEBAR_ICON_BUTTON_SIZE = '36px';
const SIDEBAR_BACKGROUND = 'surface.background.gray.intense';
const SIDEBAR_TOGGLE_BACKGROUND = 'surface.background.gray.moderate';
const SIDEBAR_MOBILE_CLOSE_BACKGROUND = 'surface.background.gray.moderate';
const SIDEBAR_TOGGLE_ICON_COLOR = 'interactive.icon.gray.subtle';
const SIDEBAR_CLOSE_ICON_COLOR = 'surface.icon.gray.normal';
const SIDEBAR_SECTION_CHEVRON_COLOR = 'surface.icon.gray.subtle';
const SIDEBAR_COLLAPSED_STORAGE_KEY = 'portfolio-sidebar-collapsed';
const newChatButtonTheme = {
  ...portfolioTheme,
  colors: {
    ...portfolioTheme.colors,
    onLight: {
      ...portfolioTheme.colors.onLight,
      surface: {
        ...portfolioTheme.colors.onLight.surface,
        background: {
          ...portfolioTheme.colors.onLight.surface.background,
          gray: {
            ...portfolioTheme.colors.onLight.surface.background.gray,
            intense: portfolioTheme.colors.onLight.transparent,
          },
        },
      },
      interactive: {
        ...portfolioTheme.colors.onLight.interactive,
        text: {
          ...portfolioTheme.colors.onLight.interactive.text,
          gray: portfolioTheme.colors.onLight.interactive.text.primary,
        },
        icon: {
          ...portfolioTheme.colors.onLight.interactive.icon,
          gray: portfolioTheme.colors.onLight.interactive.icon.primary,
        },
        border: {
          ...portfolioTheme.colors.onLight.interactive.border,
          gray: portfolioTheme.colors.onLight.interactive.border.primary,
        },
      },
    },
  },
} as unknown as typeof portfolioTheme;
type SidebarToggleIconProps = {
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
  color?: string;
};

export function PortfolioSidebar({
  projects,
  pages,
  recentChats,
  activeChatId,
  onNewChat,
  onSelectChat,
  variant = 'desktop',
  onRequestClose,
}: PortfolioSidebarProps) {
  const pathname = usePathname();
  const isMobileVariant = variant === 'mobile';
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isChatsExpanded, setIsChatsExpanded] = useState(recentChats.length > 0);
  const [isPagesExpanded, setIsPagesExpanded] = useState(true);
  const [isOpenContentVisible, setIsOpenContentVisible] = useState(true);
  const collapseTimerRef = useRef<number | null>(null);
  const hasContactPage = pages.some((page) => page.href === '/contact');
  const sidebarPages = pages.filter((page) => page.href !== '/resume');

  useEffect(() => {
    if (isMobileVariant) {
      return;
    }

    setIsCollapsed(window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true');
  }, [isMobileVariant]);

  useEffect(() => {
    if (recentChats.length > 0) {
      setIsChatsExpanded(true);
    }
  }, [recentChats.length]);

  useEffect(() => {
    return () => {
      if (collapseTimerRef.current) {
        window.clearTimeout(collapseTimerRef.current);
      }
    };
  }, []);

  const toggleSidebar = () => {
    if (collapseTimerRef.current) {
      window.clearTimeout(collapseTimerRef.current);
    }

    if (isCollapsed) {
      setIsCollapsed(false);
      window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, 'false');
      window.requestAnimationFrame(() => setIsOpenContentVisible(true));
      return;
    }

    setIsOpenContentVisible(false);
    collapseTimerRef.current = window.setTimeout(() => {
      setIsCollapsed(true);
      window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, 'true');
    }, SIDEBAR_EXIT_DELAY_MS);
  };

  return (
    <Box
      as="aside"
      width={{
        base: isMobileVariant ? SIDEBAR_OPEN_WIDTH : isCollapsed ? SIDEBAR_CLOSED_WIDTH : '100%',
        m: isCollapsed ? SIDEBAR_CLOSED_WIDTH : SIDEBAR_OPEN_WIDTH,
      }}
      minWidth={{
        base: isMobileVariant ? SIDEBAR_OPEN_WIDTH : isCollapsed ? SIDEBAR_CLOSED_WIDTH : '0px',
        m: isCollapsed ? SIDEBAR_CLOSED_WIDTH : SIDEBAR_OPEN_WIDTH,
      }}
      height={{ base: isMobileVariant ? '100svh' : 'auto', m: '100svh' }}
      maxHeight={{ base: isMobileVariant ? '100svh' : 'none', m: '100svh' }}
      backgroundColor={SIDEBAR_BACKGROUND}
      borderRightColor="surface.border.gray.subtle"
      borderRightStyle="solid"
      borderRightWidth="thin"
      display="flex"
      flexDirection="column"
      padding="spacing.5"
      gap={isCollapsed ? 'spacing.6' : 'spacing.0'}
      alignItems={isCollapsed ? 'flex-start' : 'stretch'}
      overflowY="auto"
      position="relative"
    >
      <Box
        display="flex"
        justifyContent={isCollapsed ? 'flex-start' : 'space-between'}
        width="100%"
        height="24px"
        alignItems="center"
        position="relative"
      >
        {isCollapsed ? null : (
          <Text
            as="span"
            variant="body"
            size="large"
            weight="semibold"
            color="surface.text.gray.normal"
          >
            Jatin Davis
          </Text>
        )}
        <Box
          width={SIDEBAR_ICON_BUTTON_SIZE}
          height={SIDEBAR_ICON_BUTTON_SIZE}
          backgroundColor={
            isMobileVariant ? SIDEBAR_MOBILE_CLOSE_BACKGROUND : SIDEBAR_TOGGLE_BACKGROUND
          }
          borderRadius="small"
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
        >
          <IconButton
            icon={isMobileVariant ? SidebarCloseIcon : SidebarToggleIcon}
            accessibilityLabel={
              isMobileVariant ? 'Close sidebar' : isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
            }
            size="small"
            emphasis="subtle"
            onClick={isMobileVariant && onRequestClose ? onRequestClose : toggleSidebar}
          />
        </Box>
      </Box>

      {isCollapsed ? (
        <Button
          icon={MessageSquareIcon}
          size="medium"
          accessibilityLabel="New Chat"
          onClick={onNewChat}
        />
      ) : (
        <Fade
          isVisible={isOpenContentVisible}
          type="inout"
          shouldUnmountWhenHidden={false}
        >
          <Box marginTop="spacing.10">
            <NewChatButtonTheme>
              <Button
                icon={MessageSquareIcon}
                isFullWidth
                size="medium"
                variant="secondary"
                color="primary"
                onClick={onNewChat}
              >
                New Chat
              </Button>
            </NewChatButtonTheme>
          </Box>
        </Fade>
      )}

      {isCollapsed ? null : (
        <Move
          isVisible={isOpenContentVisible}
          type="inout"
          shouldUnmountWhenHidden={false}
        >
          <Box display="flex" flexDirection="column" width="100%" gap="spacing.8">
            <Box
              display="flex"
              flexDirection="column"
              width="100%"
              marginTop="spacing.3"
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                height="40px"
              >
                <Text
                  as="span"
                  variant="body"
                  size="small"
                  weight="regular"
                  color="surface.text.gray.muted"
                >
                  Chats
                </Text>
                <IconButton
                  icon={isChatsExpanded ? SidebarChevronUpIcon : SidebarChevronDownIcon}
                  accessibilityLabel={isChatsExpanded ? 'Collapse chats' : 'Expand chats'}
                  size="small"
                  emphasis="subtle"
                  onClick={() => setIsChatsExpanded((isExpanded) => !isExpanded)}
                />
              </Box>

              <Slide
                isVisible={isChatsExpanded}
                type="inout"
                direction="top"
                fromOffset="100%"
                shouldUnmountWhenHidden
              >
                <Move
                  key={recentChats.map((chat) => chat.id).join(':') || 'empty-recent-chats'}
                  motionTriggers={['mount']}
                  type="in"
                >
                  <Box
                    width="100%"
                    minWidth="0px"
                    borderRadius="small"
                    overflow="hidden"
                  >
                    <ActionList>
                      {recentChats.map((chat) => (
                        <ActionListItem
                          key={chat.id}
                          title={chat.title}
                          value={chat.id}
                          isSelected={chat.id === activeChatId}
                          onClick={() => onSelectChat(chat.id)}
                          data-analytics-section="sidebar-chats"
                        />
                      ))}
                    </ActionList>
                  </Box>
                </Move>
              </Slide>
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              width="100%"
            >
              <Box height="34px" display="flex" alignItems="center">
                <Text
                  as="span"
                  variant="body"
                  size="small"
                  weight="regular"
                  color="surface.text.gray.muted"
                >
                  Projects
                </Text>
              </Box>

              <Box display="flex" flexDirection="column" gap="spacing.2">
                {projects.slice(0, 3).map((project, projectIndex) => (
                  <ProjectSidebarCard
                    key={`${project.slug}-${projectIndex}`}
                    project={project}
                    isActive={pathname === `/projects/${project.slug}`}
                  />
                ))}
              </Box>
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              width="100%"
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                height="40px"
              >
                <Text
                  as="span"
                  variant="body"
                  size="small"
                  weight="regular"
                  color="surface.text.gray.muted"
                >
                  Pages
                </Text>
                <IconButton
                  icon={isPagesExpanded ? SidebarChevronUpIcon : SidebarChevronDownIcon}
                  accessibilityLabel={isPagesExpanded ? 'Collapse pages' : 'Expand pages'}
                  size="small"
                  emphasis="subtle"
                  onClick={() => setIsPagesExpanded((isExpanded) => !isExpanded)}
                />
              </Box>

              <Slide
                isVisible={isPagesExpanded}
                type="inout"
                direction="top"
                fromOffset="100%"
                shouldUnmountWhenHidden
              >
                <Box display="flex" flexDirection="column" gap="spacing.0">
                  {sidebarPages.map((item) => (
                    <SidebarTabLink
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      isActive={pathname === item.href || (pathname === '/' && item.href === '/about')}
                    />
                  ))}
                </Box>
              </Slide>
            </Box>

            <SidebarLinksPanel hasContactPage={hasContactPage} />
          </Box>
        </Move>
      )}
    </Box>
  );
}

function SidebarToggleIcon({ size }: SidebarToggleIconProps) {
  return <SidebarIcon size={size} color={SIDEBAR_TOGGLE_ICON_COLOR} />;
}

function SidebarCloseIcon({ size }: SidebarToggleIconProps) {
  return <CloseIcon size={size} color={SIDEBAR_CLOSE_ICON_COLOR} />;
}

function SidebarChevronDownIcon({ size }: SidebarToggleIconProps) {
  return <ChevronDownIcon size={size} color={SIDEBAR_SECTION_CHEVRON_COLOR} />;
}

function SidebarChevronUpIcon({ size }: SidebarToggleIconProps) {
  return <ChevronUpIcon size={size} color={SIDEBAR_SECTION_CHEVRON_COLOR} />;
}

function NewChatButtonTheme({ children }: { children: ReactNode }) {
  return (
    <BladeProvider themeTokens={newChatButtonTheme} colorScheme={portfolioColorScheme}>
      {children}
    </BladeProvider>
  );
}

type ProjectSidebarCardProps = {
  project: ProjectSummary;
  isActive: boolean;
};

type SidebarTabLinkProps = {
  href: string;
  label: string;
  isActive: boolean;
};

function SidebarTabLink({ href, label, isActive }: SidebarTabLinkProps) {
  return (
    <AnimateInteractions motionTriggers={['hover']}>
      <Box width="100%">
        {/* Blade Link only accepts string children here; NextLink keeps the whole tab clickable. */}
        <NextLink
          href={href}
          style={{ display: 'block', textDecoration: 'none' }}
        >
          <Box
            width="100%"
            height="36px"
            display="flex"
            alignItems="center"
            minWidth="0px"
            padding="spacing.3"
            borderRadius="small"
            backgroundColor={isActive ? 'surface.background.primary.subtle' : 'transparent'}
            position="relative"
            overflow="hidden"
          >
            {isActive ? null : (
              <Fade motionTriggers={['on-animate-interactions']} type="inout">
                <Box
                  position="absolute"
                  top="spacing.0"
                  right="spacing.0"
                  bottom="spacing.0"
                  left="spacing.0"
                  backgroundColor="surface.background.primary.subtle"
                />
              </Fade>
            )}
            <Box position="relative" zIndex={1} minWidth="0px">
              <Text
                as="span"
                variant="body"
                size="medium"
                weight={isActive ? 'semibold' : 'regular'}
                color={isActive ? 'interactive.text.primary.normal' : 'surface.text.staticBlack.normal'}
                truncateAfterLines={1}
              >
                {label}
              </Text>
            </Box>
          </Box>
        </NextLink>
      </Box>
    </AnimateInteractions>
  );
}

function ProjectSidebarCard({ project, isActive }: ProjectSidebarCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const projectTags = project.tags ?? [];

  return (
    <AnimateInteractions motionTriggers={['hover']}>
      <Scale motionTriggers={['on-animate-interactions']}>
        <Box width="100%">
          {/* Blade Link/Button only accept string children here; NextLink keeps the full card semantic. */}
          <NextLink
            href={`/projects/${project.slug}`}
            style={{ display: 'block', textDecoration: 'none', width: '100%' }}
          >
            <Box
              backgroundColor={
                isActive || isHovered ? 'surface.background.primary.subtle' : 'transparent'
              }
              borderColor={
                isActive ? 'surface.border.primary.normal' : 'surface.border.primary.muted'
              }
              borderWidth="thin"
              borderStyle="solid"
              borderRadius="small"
              padding="spacing.3"
              display="flex"
              minWidth="0px"
              width="100%"
              flexDirection="column"
              alignItems="flex-start"
              gap="spacing.1"
              overflow="hidden"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Text
                as="span"
                size="medium"
                weight={isActive ? 'semibold' : 'regular'}
                color={isActive ? 'interactive.text.primary.normal' : 'surface.text.staticBlack.normal'}
                truncateAfterLines={1}
              >
                {project.title}
              </Text>
              <Text size="small" color="surface.text.staticBlack.muted" truncateAfterLines={1}>
                {project.role}
              </Text>

              {projectTags.length > 0 ? (
                <Box
                  display="flex"
                  flexWrap="nowrap"
                  gap="spacing.2"
                  minWidth="0px"
                  width="100%"
                  height="24px"
                  overflow="hidden"
                >
                  {projectTags.map((tag) => (
                    <ProjectSidebarTag key={`${project.slug}-${tag}`} tag={tag} />
                  ))}
                </Box>
              ) : null}
            </Box>
          </NextLink>
        </Box>
      </Scale>
    </AnimateInteractions>
  );
}

function ProjectSidebarTag({ tag }: { tag: string }) {
  return (
    <Box
      height="24px"
      minWidth="fit-content"
      flexShrink={0}
      backgroundColor="surface.background.gray.moderate"
      borderColor="surface.border.gray.muted"
      borderWidth="thin"
      borderStyle="solid"
      borderRadius="max"
      paddingX="spacing.4"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      <Text as="span" size="small" color="interactive.text.gray.subtle" truncateAfterLines={1}>
        {tag}
      </Text>
    </Box>
  );
}

function SidebarLinksPanel({
  hasContactPage,
}: {
  hasContactPage: boolean;
}) {
  if (!hasContactPage) {
    return null;
  }

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      borderRadius="medium"
      padding="spacing.4"
      display="flex"
      flexDirection="column"
      gap="spacing.3"
    >
      <Text
        as="span"
        variant="body"
        size="small"
        weight="regular"
        color="surface.text.gray.muted"
      >
        Links
      </Text>
      <Box display="flex" flexDirection="column" gap="spacing.3">
        {hasContactPage ? (
          <NewChatButtonTheme>
            <Button
              icon={MailIcon}
              isFullWidth
              href="/contact"
              size="medium"
              variant="primary"
              color="primary"
            >
              Contact
            </Button>
          </NewChatButtonTheme>
        ) : null}
        <NewChatButtonTheme>
          <Button
            icon={DownloadIcon}
            isFullWidth
            href="/resume-download"
            size="medium"
            variant="secondary"
            color="primary"
          >
            Resume
          </Button>
        </NewChatButtonTheme>
      </Box>
    </Box>
  );
}
