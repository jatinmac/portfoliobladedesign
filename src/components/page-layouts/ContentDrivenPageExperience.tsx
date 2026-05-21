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
  ExternalLinkIcon,
  Heading,
  List,
  ListItem,
  ListItemText,
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
    <Box minHeight="100svh" backgroundColor="surface.background.gray.intense">
      <Box
        as="main"
        paddingX={{ base: 'spacing.4', s: 'spacing.5', l: 'spacing.7' }}
        paddingY={{ base: 'spacing.6', m: 'spacing.8' }}
        maxWidth="920px"
        marginX="auto"
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
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <Box
        display="flex"
        flexDirection={{ base: 'column', m: 'row' }}
        alignItems={{ base: 'flex-start', m: 'flex-start' }}
        justifyContent="space-between"
        gap="spacing.4"
      >
        <Box display="flex" flexDirection="column" gap="spacing.2" minWidth="0px">
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
            <Text size="medium" color="surface.text.gray.muted">
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

  return (
    <InfoPanel title={section.title}>
      <SectionBlocks blocks={section.blocks} />
      {section.subsections.length > 0 ? (
        <Box
          display="grid"
          gridTemplateColumns={{
            base: '1fr',
            m: shouldGridSubsections ? 'repeat(2, minmax(0, 1fr))' : '1fr',
          }}
          gap="spacing.4"
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
              <Heading as="h3" size="small" color="surface.text.gray.normal">
                {subsection.title}
              </Heading>
              <SectionBlocks blocks={subsection.blocks} />
            </Box>
          ))}
        </Box>
      ) : null}
    </InfoPanel>
  );
}

function SectionBlocks({ blocks }: { blocks: ContentPageSectionBlock[] }) {
  if (blocks.length === 0) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      {blocks.map((block, index) => {
        if (block.type === 'paragraph') {
          return (
            <Text key={`${block.text}-${index}`} size="medium" color="surface.text.gray.muted">
              {block.text}
            </Text>
          );
        }

        return <ContentList key={`list-${index}`} block={block} />;
      })}
    </Box>
  );
}

function ContentList({ block }: { block: Extract<ContentPageSectionBlock, { type: 'list' }> }) {
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
    <List variant={block.ordered ? 'ordered' : 'unordered'} size="small">
      {block.items.map((item, itemIndex) => (
        <ListItem key={`${item.text}-${itemIndex}`}>
          <ListItemText>{item.text}</ListItemText>
        </ListItem>
      ))}
    </List>
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
      gap="spacing.3"
      padding={{ base: 'spacing.4', m: 'spacing.5' }}
      borderRadius="medium"
      backgroundColor="surface.background.primary.subtle"
    >
      <Heading as="h2" size="medium" color="surface.text.gray.normal">
        {title}
      </Heading>
      {children}
    </Box>
  );
}
