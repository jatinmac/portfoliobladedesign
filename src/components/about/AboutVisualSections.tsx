'use client';

import type { ReactNode } from 'react';

import type { ContentPageSection } from '../../lib/content/types';
import {
  Badge,
  Box,
  Divider,
  Heading,
  Text,
} from '../blade/PortfolioPrimitives';

const VISUAL_SECTION_TITLES = [
  'How I Think',
  'Product Design Problem Solving Process',
  'My Resources',
  'Best Products',
] as const;

type VisualSectionTitle = typeof VISUAL_SECTION_TITLES[number];

type VisualSection = ContentPageSection & {
  title: VisualSectionTitle;
};

export function isAboutVisualSection(section: ContentPageSection): section is VisualSection {
  return VISUAL_SECTION_TITLES.includes(section.title as VisualSectionTitle);
}

export function AboutVisualSections({ sections }: { sections: ContentPageSection[] }) {
  const visualSections = sections.filter(isAboutVisualSection);

  if (visualSections.length === 0) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="column" gap={{ base: 'spacing.5', m: 'spacing.6' }} width="100%">
      {visualSections.map((section) => {
        if (section.title === 'How I Think') {
          return <ThinkingFlow key={section.title} section={section} />;
        }

        if (section.title === 'Product Design Problem Solving Process') {
          return <ProblemSolvingProcess key={section.title} section={section} />;
        }

        if (section.title === 'My Resources') {
          return <ResourceSystem key={section.title} section={section} />;
        }

        return <BestProducts key={section.title} section={section} />;
      })}
    </Box>
  );
}

function ThinkingFlow({ section }: { section: VisualSection }) {
  const desktopColumns =
    section.subsections.length >= 4
      ? 'repeat(4, minmax(0, 1fr))'
      : 'repeat(3, minmax(0, 1fr))';

  return (
    <VisualPanel
      title={section.title}
      description="The product lens Jatin uses to connect customer value, real pain points, and technology shifts."
    >
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', s: 'repeat(2, minmax(0, 1fr))', l: desktopColumns }}
        alignItems="start"
        gap={{ base: 'spacing.3', m: 'spacing.4' }}
      >
        {section.subsections.map((item, index) => (
          <FlowNode
            key={item.title}
            eyebrow={`0${index + 1}`}
            title={item.title}
            items={readItems(item)}
            isLast={index === section.subsections.length - 1}
          />
        ))}
      </Box>
    </VisualPanel>
  );
}

function ProblemSolvingProcess({ section }: { section: VisualSection }) {
  return (
    <VisualPanel
      title={section.title}
      description="A repeatable path from audience understanding to shippable high-fidelity prototypes."
    >
      <Box
        display="grid"
        gridTemplateColumns={{ base: '1fr', l: '300px minmax(0, 1fr)' }}
        alignItems="start"
        gap="spacing.5"
      >
        <Box
          position={{ base: 'static', l: 'sticky' }}
          top="spacing.6"
          padding="spacing.4"
          borderRadius="medium"
          backgroundColor="surface.background.gray.intense"
        >
          <Box display="flex" flexDirection="column" gap="spacing.0">
            {section.subsections.map((step, index) => (
              <ProcessTimelineItem
                key={step.title}
                index={index + 1}
                title={step.title}
                description={readItems(step)[0]}
                isLast={index === section.subsections.length - 1}
              />
            ))}
          </Box>
        </Box>

        <Box
          display="grid"
          gridTemplateColumns={{ base: '1fr', m: 'repeat(2, minmax(0, 1fr))' }}
          alignItems="start"
          gap="spacing.4"
        >
          {section.subsections.map((step, index) => (
            <ProcessBlock key={step.title} index={index + 1} title={step.title} items={readItems(step)} />
          ))}
        </Box>
      </Box>
    </VisualPanel>
  );
}

function ProcessTimelineItem({
  index,
  title,
  description,
  isLast,
}: {
  index: number;
  title: string;
  description: string;
  isLast: boolean;
}) {
  return (
    <Box display="grid" gridTemplateColumns="32px minmax(0, 1fr)" gap="spacing.3">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Badge color={index === 1 ? 'primary' : 'neutral'} emphasis="subtle" size="small">
          {String(index).padStart(2, '0')}
        </Badge>
        {!isLast ? (
          <Box
            width="2px"
            minHeight="48px"
            flex="1"
            marginY="spacing.2"
            backgroundColor="surface.background.primary.intense"
          />
        ) : null}
      </Box>
      <Box display="flex" flexDirection="column" gap="spacing.1" paddingBottom={isLast ? 'spacing.0' : 'spacing.4'}>
        <Text weight="semibold" color="surface.text.gray.normal">
          {title}
        </Text>
        {description ? (
          <Text size="small" color="surface.text.gray.muted">
            {description}
          </Text>
        ) : null}
      </Box>
    </Box>
  );
}

function ResourceSystem({ section }: { section: VisualSection }) {
  return (
    <VisualPanel title={section.title} description="The inputs, tools, and feedback loops that shape the work.">
      <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(2, minmax(0, 1fr))' }} alignItems="start" gap="spacing.4">
        {section.subsections.map((group) => (
          <Box
            key={group.title}
            display="flex"
            flexDirection="column"
            gap="spacing.3"
            padding="spacing.4"
            borderRadius="medium"
            backgroundColor="surface.background.gray.intense"
            minWidth="0px"
          >
            <Heading as="h3" size="small" color="surface.text.gray.normal">
              {group.title}
            </Heading>
            <Box display="grid" gridTemplateColumns="1fr" gap="spacing.3">
              {readItems(group).map((item, index) => (
                <ResourceTile key={`${group.title}-${item}`} label={item} index={index + 1} />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </VisualPanel>
  );
}

function BestProducts({ section }: { section: VisualSection }) {
  return (
    <VisualPanel title={section.title} description="The strongest shipped surfaces and product-learning loops.">
      <Box display="grid" gridTemplateColumns={{ base: '1fr', m: 'repeat(2, minmax(0, 1fr))' }} alignItems="start" gap="spacing.4">
        {section.subsections.map((product, index) => (
          <Box
            key={product.title}
            display="flex"
            flexDirection="column"
            gap="spacing.3"
            padding="spacing.4"
            borderRadius="medium"
            backgroundColor="surface.background.gray.intense"
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" gap="spacing.3">
              <Heading as="h3" size="small" color="surface.text.gray.normal">
                {product.title}
              </Heading>
              <Badge color={index === 0 ? 'primary' : 'neutral'} emphasis="subtle" size="small">
                Product
              </Badge>
            </Box>
            <Divider />
            <Text size="small" color="surface.text.gray.muted">
              {readItems(product).join(' ')}
            </Text>
          </Box>
        ))}
      </Box>
    </VisualPanel>
  );
}

function VisualPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
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
      <Box display="flex" flexDirection="column" gap="spacing.2">
        <Heading as="h2" size="medium" color="surface.text.gray.normal">
          {title}
        </Heading>
        <Text size="small" color="surface.text.gray.muted">
          {description}
        </Text>
        <Divider />
      </Box>
      {children}
    </Box>
  );
}

function FlowNode({
  eyebrow,
  title,
  items,
  isLast,
}: {
  eyebrow: string;
  title: string;
  items: string[];
  isLast: boolean;
}) {
  return (
    <Box position="relative" minWidth="0px">
      {!isLast ? (
        <Box
          display={{ base: 'none', l: 'block' }}
          position="absolute"
          top="36px"
          right="-18px"
          width="32px"
          height="2px"
          backgroundColor="surface.background.primary.intense"
        />
      ) : null}
      <Box
        display="flex"
        flexDirection="column"
        gap="spacing.3"
        height="100%"
        padding="spacing.4"
        borderRadius="medium"
        backgroundColor="surface.background.gray.intense"
      >
        <Badge color="primary" emphasis="subtle" size="small">
          {eyebrow}
        </Badge>
        <Heading as="h3" size="small" color="surface.text.gray.normal">
          {title}
        </Heading>
        <Box display="flex" flexDirection="column" gap="spacing.2">
          {items.map((item) => (
            <Text key={item} size="small" color="surface.text.gray.muted">
              {item}
            </Text>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function ProcessBlock({ index, title, items }: { index: number; title: string; items: string[] }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing.3"
      padding="spacing.4"
      borderRadius="medium"
      backgroundColor="surface.background.gray.intense"
      minHeight="100%"
    >
      <Box display="flex" alignItems="flex-start" gap="spacing.3">
        <Badge color={index === 1 ? 'primary' : 'neutral'} emphasis="subtle" size="small">
          {String(index).padStart(2, '0')}
        </Badge>
        <Text weight="semibold" color="surface.text.gray.normal">
          {title}
        </Text>
      </Box>
      <Box display="flex" flexDirection="column" gap="spacing.2">
        {items.map((item) => (
          <Text key={item} size="small" color="surface.text.gray.muted">
            {item}
          </Text>
        ))}
      </Box>
    </Box>
  );
}

function ResourceTile({ label, index }: { label: string; index: number }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap="spacing.3"
      padding="spacing.4"
      borderRadius="medium"
      backgroundColor="surface.background.gray.intense"
    >
      <Badge color={index % 2 === 0 ? 'neutral' : 'primary'} emphasis="subtle" size="small">
        {String(index).padStart(2, '0')}
      </Badge>
      <Text weight="semibold" color="surface.text.gray.normal">
        {label}
      </Text>
    </Box>
  );
}

function readItems(section: ContentPageSection): string[] {
  return section.blocks.flatMap((block) => {
    if (block.type === 'paragraph') {
      return [block.text];
    }

    return block.items.map((item) => item.text);
  });
}
