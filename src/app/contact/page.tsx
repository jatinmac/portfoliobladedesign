import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import type { ContactLink } from '../../lib/content/types';
import { ContentDrivenPageExperience } from '../../components/page-layouts/ContentDrivenPageExperience';
import {
  Box,
  Button,
  DownloadIcon,
  ExternalLinkIcon,
  Heading,
  MailIcon,
  Text,
} from '../../components/blade/PortfolioPrimitives';
import {
  getContactLinks,
  getContentDrivenPage,
  getContentPageHeader,
  getOptionalContentPage,
} from '../../lib/content/content-loader';
import { buildPageMetadata } from '../../lib/content/site';

export const dynamic = 'force-static';

export function generateMetadata(): Metadata {
  const pageHeader = getContentPageHeader('contact');
  return buildPageMetadata(pageHeader.title, pageHeader.description, '/contact');
}

export default function ContactPage() {
  const page = getOptionalContentPage('contact');

  if (!page) {
    notFound();
  }

  const contentPage = getContentDrivenPage('contact');
  const contactLinks = getContactLinks();

  return (
    <ContentDrivenPageExperience page={{ ...contentPage, sections: [] }}>
      <ContactActions links={contactLinks} />
    </ContentDrivenPageExperience>
  );
}

function ContactActions({ links }: { links: ContactLink[] }) {
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
        Open channels
      </Heading>
      <Box display="flex" flexDirection="column" gap="spacing.3">
        {links.map((link) => (
          <ContactActionRow key={`${link.label}-${link.href}`} link={link} />
        ))}
      </Box>
    </Box>
  );
}

function ContactActionRow({ link }: { link: ContactLink }) {
  const kind = getContactLinkKind(link);
  const href = kind === 'resume' ? '/resume-download' : link.href;
  const isExternal = href.startsWith('http');
  const actionLabel = getContactActionLabel(kind);

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
          {formatContactLabel(link.label)}
        </Text>
        <Text color="surface.text.gray.muted" wordBreak="break-word">
          {formatContactValue(link)}
        </Text>
      </Box>
      <Button
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        variant={kind === 'email' ? 'primary' : 'secondary'}
        icon={kind === 'email' ? MailIcon : kind === 'resume' ? DownloadIcon : ExternalLinkIcon}
        iconPosition="right"
      >
        {actionLabel}
      </Button>
    </Box>
  );
}

function getContactLinkKind(link: ContactLink): 'email' | 'resume' | 'external' {
  const label = link.label.toLowerCase();

  if (label.includes('email') || link.href.startsWith('mailto:')) {
    return 'email';
  }

  if (label.includes('resume')) {
    return 'resume';
  }

  return 'external';
}

function getContactActionLabel(kind: ReturnType<typeof getContactLinkKind>): string {
  if (kind === 'email') {
    return 'Email me';
  }

  if (kind === 'resume') {
    return 'Download';
  }

  return 'Open';
}

function formatContactLabel(label: string): string {
  if (label.toLowerCase() === 'linkedin') {
    return 'LinkedIn';
  }

  if (label.toLowerCase().includes('youtube')) {
    return 'YouTube Channel';
  }

  return label
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function formatContactValue(link: ContactLink): string {
  if (link.href.startsWith('mailto:')) {
    return link.href.replace(/^mailto:/, '');
  }

  if (link.label.toLowerCase().includes('resume')) {
    return 'PDF resume';
  }

  return link.value.replace(/^https?:\/\//, '').replace(/\/$/, '');
}
