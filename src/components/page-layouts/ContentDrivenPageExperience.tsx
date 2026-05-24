'use client';

import type { ReactNode } from 'react';

import type {
  ContentDrivenPage,
  ContentPageListItem,
  ContentPageSection,
  ContentPageSectionBlock,
} from '../../lib/content/types';
import {
  Badge,
  Box,
  Button,
  Divider,
  ExternalLinkIcon,
  Heading,
  Text,
} from '../blade/PortfolioPrimitives';
import { ScrollReveal } from '../ScrollReveal';
import { StaggeredEntrance } from '../StaggeredEntrance';

type ContentDrivenPageExperienceProps = {
  page: ContentDrivenPage;
  action?: {
    label: string;
    href: string;
  };
  hero?: ReactNode;
  children?: ReactNode;
};

export function ContentDrivenPageExperience({
  page,
  action,
  hero,
  children,
}: ContentDrivenPageExperienceProps) {
  return (
    <Box
      minHeight="100svh"
      backgroundColor="surface.background.gray.intense"
      display="flex"
      justifyContent="center"
    >
      <Box
        as="main"
        width="100%"
        paddingX={{ base: 'spacing.4', s: 'spacing.5', l: 'spacing.7' }}
        paddingY={{ base: 'spacing.6', m: 'spacing.8' }}
        maxWidth="900px"
        minWidth="0px"
      >
        <Box display="flex" flexDirection="column" gap={{ base: 'spacing.6', m: 'spacing.7' }}>
          <StaggeredEntrance>
            <PageHeader page={page} action={action} />
            {hero ? <ScrollReveal>{hero}</ScrollReveal> : null}
          </StaggeredEntrance>
          {page.sections.map((section, sectionIndex) => (
            <ScrollReveal key={`${section.title}-${sectionIndex}`}>
              <ContentSectionPanel section={section} />
            </ScrollReveal>
          ))}
          {children ? <ScrollReveal>{children}</ScrollReveal> : null}
        </Box>
      </Box>
    </Box>
  );
}

function PageHeader({
  page,
  action,
}: {
  page: ContentDrivenPage;
  action?: ContentDrivenPageExperienceProps['action'];
}) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing.4"
      alignItems="flex-start"
      width="100%"
    >
      <Box
        display="flex"
        flexDirection={{ base: 'column', m: 'row' }}
        alignItems={{ base: 'flex-start', m: 'flex-start' }}
        justifyContent="space-between"
        gap="spacing.4"
        width="100%"
      >
        <Box display="flex" flexDirection="column" gap="spacing.2" minWidth="0px" maxWidth="720px">
          <Text
            variant="caption"
            size="medium"
            weight="semibold"
            color="interactive.text.primary.normal"
          >
            {page.header.eyebrow}
          </Text>
          <Heading as="h1" size="2xlarge" color="surface.text.gray.normal">
            {page.header.title}
          </Heading>
          {page.header.description ? (
            <Text size="medium" color="surface.text.gray.muted" wordBreak="break-word">
              {page.header.description}
            </Text>
          ) : null}
        </Box>

        {action ? (
          <Button
            href={action.href}
            target={action.href.startsWith('http') ? '_blank' : undefined}
            rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            icon={ExternalLinkIcon}
            size="medium"
          >
            {action.label}
          </Button>
        ) : null}
      </Box>

      {page.tags.length > 0 ? (
        <Box display="flex" flexWrap="wrap" gap="spacing.3">
          {page.tags.map((tag, tagIndex) => (
            <Badge key={`${tag}-${tagIndex}`} color="neutral" emphasis="subtle" size="small">
              {tag}
            </Badge>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}

function ContentSectionPanel({ section }: { section: ContentPageSection }) {
  const shouldGridSubsections = section.subsections.length > 1 && section.blocks.length === 0;
  const hasIntroBlocks = section.blocks.length > 0;

  return (
    <InfoPanel title={section.title}>
      <SectionBlocks blocks={section.blocks} mode="feature" />
      {section.subsections.length > 0 ? (
        <Box
          display="grid"
          gridTemplateColumns={{
            base: '1fr',
            m: shouldGridSubsections ? 'repeat(2, minmax(0, 1fr))' : '1fr',
          }}
          alignItems="start"
          gap="spacing.4"
          marginTop={hasIntroBlocks ? 'spacing.2' : undefined}
        >
          {section.subsections.map((subsection, subsectionIndex) => (
            <Box
              key={`${section.title}-${subsection.title}-${subsectionIndex}`}
              display="flex"
              flexDirection="column"
              gap="spacing.3"
              padding="spacing.4"
              borderRadius="medium"
              backgroundColor="surface.background.gray.intense"
            >
              <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap="spacing.3">
                <Heading as="h3" size="small" color="surface.text.gray.normal">
                  {subsection.title}
                </Heading>
                <Badge color="neutral" emphasis="subtle" size="small">
                  {String(subsectionIndex + 1).padStart(2, '0')}
                </Badge>
              </Box>
              <Divider />
              <SectionBlocks blocks={subsection.blocks} mode="compact" />
            </Box>
          ))}
        </Box>
      ) : null}
    </InfoPanel>
  );
}

function SectionBlocks({
  blocks,
  mode,
}: {
  blocks: ContentPageSectionBlock[];
  mode: 'feature' | 'compact';
}) {
  if (blocks.length === 0) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="column" gap={mode === 'feature' ? 'spacing.4' : 'spacing.3'}>
      {blocks.map((block, index) => {
        if (block.type === 'paragraph') {
          return (
            <ParagraphFeature
              key={`${block.text}-${index}`}
              text={block.text}
              index={index}
              mode={mode}
            />
          );
        }

        return <ContentList key={`list-${index}`} block={block} mode={mode} blockIndex={index} />;
      })}
    </Box>
  );
}

function ParagraphFeature({
  text,
  index,
  mode,
}: {
  text: string;
  index: number;
  mode: 'feature' | 'compact';
}) {
  if (mode === 'compact') {
    return (
      <Text size="small" color="surface.text.gray.muted">
        {text}
      </Text>
    );
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: '40px minmax(0, 1fr)', m: '48px minmax(0, 1fr)' }}
      gap="spacing.3"
      alignItems="flex-start"
      padding="spacing.4"
      borderRadius="medium"
      backgroundColor="surface.background.gray.intense"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="32px"
        height="32px"
        borderRadius="round"
        backgroundColor="surface.background.primary.subtle"
      >
        <Text size="small" weight="semibold" color="interactive.text.primary.normal">
          {String(index + 1).padStart(2, '0')}
        </Text>
      </Box>
      <Text size="medium" color="surface.text.gray.muted">
        {text}
      </Text>
    </Box>
  );
}

function ContentList({
  block,
  mode,
  blockIndex,
}: {
  block: Extract<ContentPageSectionBlock, { type: 'list' }>;
  mode: 'feature' | 'compact';
  blockIndex: number;
}) {
  const hasLinkedItems = block.items.some((item) => item.href);

  if (hasLinkedItems) {
    return (
      <Box display="flex" flexDirection="column" gap="spacing.3">
        {block.items.map((item, itemIndex) => (
          <LinkedListRow
            key={`${item.label ?? item.text}-${item.href ?? item.value}-${itemIndex}`}
            item={item}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns="1fr"
      alignItems="start"
      gap="spacing.3"
    >
      {block.items.map((item, itemIndex) => (
        <Box
          key={`${item.text}-${itemIndex}`}
          display="flex"
          gap="spacing.3"
          alignItems="flex-start"
          padding="spacing.3"
          borderRadius="medium"
          backgroundColor={mode === 'feature' ? 'surface.background.gray.intense' : 'surface.background.gray.subtle'}
        >
          <Badge color={block.ordered ? 'primary' : 'neutral'} emphasis="subtle" size="small">
            {String(block.items.length === 1 ? blockIndex + 1 : itemIndex + 1).padStart(2, '0')}
          </Badge>
          <Text size="small" color="surface.text.gray.muted">
            {item.text}
          </Text>
        </Box>
      ))}
    </Box>
  );
}

function LinkedListRow({ item }: { item: ContentPageListItem }) {
  return (
    <Box
      display="flex"
      flexDirection={{ base: 'column', m: 'row' }}
      justifyContent="space-between"
      alignItems={{ base: 'stretch', m: 'center' }}
      gap="spacing.4"
      padding="spacing.4"
      borderRadius="medium"
      backgroundColor="surface.background.gray.intense"
    >
      <Box display="flex" flexDirection="column" gap="spacing.1" minWidth="0px">
        <Text weight="semibold" size="medium" color="surface.text.gray.normal">
          {item.label ?? item.value ?? item.text}
        </Text>
        {item.value && item.value !== item.label ? (
          <Text color="surface.text.gray.muted" wordBreak="break-word">
            {item.value}
          </Text>
        ) : null}
      </Box>
      {item.href ? (
        <Button
          href={item.href}
          target={item.href.startsWith('http') ? '_blank' : undefined}
          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          variant="secondary"
          icon={ExternalLinkIcon}
          iconPosition="right"
        >
          Open
        </Button>
      ) : null}
    </Box>
  );
}

type InfoPanelProps = {
  title: string;
  children: ReactNode;
};

function InfoPanel({ title, children }: InfoPanelProps) {
  return (
    <Box
      as="section"
      display="flex"
      flexDirection="column"
      gap="spacing.4"
      padding={{ base: 'spacing.4', m: 'spacing.5' }}
      borderRadius="medium"
      backgroundColor="surface.background.primary.subtle"
    >
      <Box display="flex" flexDirection="column" gap="spacing.3">
        <Heading as="h2" size="medium" color="surface.text.gray.normal">
          {title}
        </Heading>
        <Divider />
      </Box>
      {children}
    </Box>
  );
}
