import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

import type {
  AboutPageContent,
  AboutSummaryCard,
  ChatConfig,
  ContactLink,
  ContentDrivenPage,
  ContentPage,
  ContentPageHeader,
  ContentPageListItem,
  ContentPageSection,
  ContentPageSectionBlock,
  ExperienceItem,
  NavigationItem,
  SiteMetadataContent,
} from './types';

const CONTENT_DIRECTORY = path.join(process.cwd(), 'content');
const IGNORED_CONTENT_PAGE_FILES = new Set(['README.md']);
const DEFAULT_CONTENT_PAGE_ORDER = ['about', 'contact', 'projects', 'experience'];
const SAFE_PAGE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DEFAULT_CHAT_CONFIG: ChatConfig = {
  starterPrompts: [],
  followUps: {
    project: [],
    designSystem: [],
    default: [],
  },
};

let pageCache: ContentPage[] | null = null;
let chatConfigCache: ChatConfig | null = null;

export type ContentPageSlug = string;

export function shouldBypassContentCache(): boolean {
  return process.env.NODE_ENV !== 'production';
}

export function getContentDirectory(): string {
  return CONTENT_DIRECTORY;
}

export function getContentPageSlugs(): ContentPageSlug[] {
  return getAllContentPages().map((page) => page.slug);
}

export function getAllContentPages(): ContentPage[] {
  if (!shouldBypassContentCache() && pageCache) {
    return pageCache;
  }

  const pages = loadContentPages();

  if (!shouldBypassContentCache()) {
    pageCache = pages;
  }

  return pages;
}

export function getContentPage(slug: ContentPageSlug): ContentPage {
  const page = getOptionalContentPage(slug);
  if (!page) {
    throw new Error(`Content page not found for slug: ${slug}`);
  }

  return page;
}

export function getOptionalContentPage(slug: ContentPageSlug): ContentPage | null {
  return getAllContentPages().find((page) => page.slug === slug) ?? null;
}

export function getContentNavigationItems(): NavigationItem[] {
  return getAllContentPages().map((page) => ({
    label: page.navigationLabel,
    href: page.path,
  }));
}

export function getProfilePage(): ContentPage {
  return getContentPage('about');
}

export function getContentPageHeader(slug: ContentPageSlug): ContentPageHeader {
  const page = getContentPage(slug);

  return {
    eyebrow: titleize(slug),
    title: readString(page.frontmatter.title, page.title),
    description: readString(page.frontmatter.description, ''),
  };
}

export function getContentPageSectionTitle(slug: ContentPageSlug, fallback: string): string {
  return readString(getOptionalContentPage(slug)?.frontmatter.sectionTitle, fallback);
}

export function getContentDrivenPage(slug: ContentPageSlug): ContentDrivenPage {
  const page = getContentPage(slug);

  return {
    slug: page.slug,
    path: page.path,
    header: getContentPageHeader(slug),
    tags: readStringArray(page.frontmatter.tags),
    sections: parseContentPageSections(page.body),
  };
}

export function getSiteMetadataContent(): SiteMetadataContent {
  const profile = getOptionalContentPage('about');

  return {
    name: readString(profile?.frontmatter.name, 'Jatin Davis'),
    title: readString(profile?.frontmatter.title, 'Jatin Davis Portfolio'),
    description: readString(profile?.frontmatter.description, ''),
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  };
}

export function getChatConfig(): ChatConfig {
  if (!shouldBypassContentCache() && chatConfigCache) {
    return chatConfigCache;
  }

  const sourcePath = path.join(CONTENT_DIRECTORY, 'chat-config.yaml');
  const parsed = matter(`---\n${fs.readFileSync(sourcePath, 'utf8')}\n---\n`).data;
  const config: ChatConfig = {
    starterPrompts: readStringArray(parsed.starterPrompts),
    followUps: {
      project: readStringArray(readRecord(parsed.followUps).project),
      designSystem: readStringArray(readRecord(parsed.followUps).designSystem),
      default: readStringArray(readRecord(parsed.followUps).default),
    },
  };

  if (!shouldBypassContentCache()) {
    chatConfigCache = config;
  }

  return config;
}

export function getExpertiseChips(): string[] {
  const profile = getProfilePage();
  const frontmatterTags = readStringArray(profile.frontmatter.tags);

  return frontmatterTags.length > 0 ? frontmatterTags : extractListUnderHeading(profile.body, 'Expertise');
}

export function getHomeHeadline(): string {
  const profile = getProfilePage();

  return readString(profile.frontmatter.homeHeadline, readString(profile.frontmatter.description, profile.title));
}

export function getAboutPageContent(): AboutPageContent {
  const profile = getProfilePage();
  const contactLinks = getContactLinks();
  const linkedInHref = contactLinks.find((link) => link.label.toLowerCase() === 'linkedin')?.href;

  return {
    ...getContentPageHeader('about'),
    name: readString(profile.frontmatter.headline, readString(profile.frontmatter.name, profile.title)),
    tags: getExpertiseChips(),
    aboutItems: extractParagraphsUnderHeading(profile.body, 'About'),
    summaryCards: extractSummaryCards(profile.body, 'Summary'),
    workedOnItems: extractListUnderHeading(profile.body, 'What I Worked On'),
    interestItems: extractListUnderHeading(profile.body, 'Interests'),
    linkedInHref,
  };
}

export function getExperienceItems(): ExperienceItem[] {
  const body = getOptionalContentPage('experience')?.body;
  if (!body) {
    return [];
  }

  const headings = Array.from(body.matchAll(/^###\s+(.+)$/gm));

  return headings.map((match, index) => {
    const nextMatch = headings[index + 1];
    const startIndex = (match.index ?? 0) + match[0].length;
    const endIndex = nextMatch?.index ?? body.length;
    const detailLines = body.slice(startIndex, endIndex).trim().split(/\r?\n/).filter(Boolean);
    const meta = detailLines[0] ?? '';
    const metaMatch = meta.match(/^\*\*(.+?)\*\*\s*\|\s*(.+)$/);
    const summary = detailLines.slice(1).join('\n').trim();

    return {
      role: match[1].trim(),
      company: metaMatch?.[1]?.trim() ?? '',
      period: metaMatch?.[2]?.trim() ?? '',
      summary,
    };
  });
}

export function getContactLinks(): ContactLink[] {
  const body = getOptionalContentPage('contact')?.body;
  if (!body) {
    return [];
  }

  return extractListUnderHeading(body, 'Contact')
    .map((item) => parseContentPageListItem(item))
    .map((item) =>
      item.href && item.label && item.value
        ? {
            label: item.label,
            value: item.value,
            href: item.href,
          }
        : null,
    )
    .filter((item): item is ContactLink => Boolean(item));
}

export function getResumeHighlights(): string[] {
  const body = getOptionalContentPage('resume')?.body;
  return body ? extractListUnderHeading(body, 'Resume') : [];
}

export function resetContentLoaderCacheForTests(): void {
  pageCache = null;
  chatConfigCache = null;
}

function loadContentPages(): ContentPage[] {
  if (!fs.existsSync(CONTENT_DIRECTORY)) {
    return [];
  }

  const pages = fs
    .readdirSync(CONTENT_DIRECTORY)
    .filter((fileName) => fileName.endsWith('.md'))
    .filter((fileName) => !IGNORED_CONTENT_PAGE_FILES.has(fileName))
    .map((fileName) => loadContentPageFromFile(path.join(CONTENT_DIRECTORY, fileName)))
    .filter((page): page is ContentPage => Boolean(page));
  const seenSlugs = new Map<string, string>();

  pages.forEach((page) => {
    const existingSourcePath = seenSlugs.get(page.slug);
    if (existingSourcePath) {
      throw new Error(
        `Duplicate content page slug "${page.slug}" in ${page.sourcePath}; already used by ${existingSourcePath}`,
      );
    }
    seenSlugs.set(page.slug, page.sourcePath);
  });

  return pages.sort(sortContentPages);
}

function loadContentPageFromFile(sourcePath: string): ContentPage | null {
  const parsed = matter(fs.readFileSync(sourcePath, 'utf8'));
  const slug = readString(parsed.data.page);

  if (!slug) {
    return null;
  }

  if (!SAFE_PAGE_SLUG_PATTERN.test(slug)) {
    throw new Error(`Content page ${sourcePath} has an invalid page slug: ${slug}`);
  }

  const title = readString(parsed.data.title, titleize(slug));

  return {
    slug,
    navigationLabel: readString(parsed.data.navLabel, titleize(slug)),
    path: `/${slug}`,
    title,
    body: parsed.content.trim(),
    frontmatter: parsed.data,
    sourcePath,
  };
}

function sortContentPages(a: ContentPage, b: ContentPage): number {
  const orderA = readOptionalNumber(a.frontmatter.navOrder ?? a.frontmatter.order);
  const orderB = readOptionalNumber(b.frontmatter.navOrder ?? b.frontmatter.order);

  if (orderA !== undefined || orderB !== undefined) {
    return (orderA ?? Number.MAX_SAFE_INTEGER) - (orderB ?? Number.MAX_SAFE_INTEGER);
  }

  const defaultOrderA = DEFAULT_CONTENT_PAGE_ORDER.indexOf(a.slug);
  const defaultOrderB = DEFAULT_CONTENT_PAGE_ORDER.indexOf(b.slug);
  const normalizedOrderA = defaultOrderA === -1 ? Number.MAX_SAFE_INTEGER : defaultOrderA;
  const normalizedOrderB = defaultOrderB === -1 ? Number.MAX_SAFE_INTEGER : defaultOrderB;

  return normalizedOrderA - normalizedOrderB || a.navigationLabel.localeCompare(b.navigationLabel);
}

function extractListUnderHeading(markdown: string, heading: string): string[] {
  const section = extractSectionUnderHeading(markdown, heading);

  return section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.replace(/^-\s+/, '').trim())
    .filter(Boolean);
}

function extractParagraphsUnderHeading(markdown: string, heading: string): string[] {
  return extractSectionUnderHeading(markdown, heading)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, ' ').trim())
    .filter((paragraph) => paragraph && !paragraph.startsWith('##'));
}

function extractSummaryCards(markdown: string, heading: string): AboutSummaryCard[] {
  const section = extractSectionUnderHeading(markdown, heading);
  const headings = Array.from(section.matchAll(/^###\s+(.+)$/gm));

  return headings
    .map((match, index) => {
      const nextMatch = headings[index + 1];
      const startIndex = (match.index ?? 0) + match[0].length;
      const endIndex = nextMatch?.index ?? section.length;
      const subsection = section.slice(startIndex, endIndex);
      const items = extractListItems(subsection);

      return {
        title: match[1].trim(),
        items: items.length > 0 ? items : extractParagraphs(subsection),
      };
    })
    .filter((card) => card.title && card.items.length > 0);
}

function extractListItems(markdown: string): string[] {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.replace(/^-\s+/, '').trim())
    .filter(Boolean);
}

function extractParagraphs(markdown: string): string[] {
  return markdown
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);
}

function extractSectionUnderHeading(markdown: string, heading: string): string {
  const headingPattern = new RegExp(`^##\\s+${escapeRegExp(heading)}\\s*$([\\s\\S]*?)(?=^##\\s+|$(?![\\s\\S]))`, 'm');
  return markdown.match(headingPattern)?.[1] ?? '';
}

function parseContentPageSections(markdown: string): ContentPageSection[] {
  const sections: ContentPageSection[] = [];
  let currentSection: ContentPageSection | null = null;
  let currentSubsection: ContentPageSection | null = null;
  let paragraphLines: string[] = [];
  let listItems: ContentPageListItem[] = [];
  let listOrdered = false;

  const targetBlocks = (): ContentPageSectionBlock[] | null => {
    return currentSubsection?.blocks ?? currentSection?.blocks ?? null;
  };

  const flushParagraph = (): void => {
    const blocks = targetBlocks();
    if (!blocks || paragraphLines.length === 0) {
      paragraphLines = [];
      return;
    }

    blocks.push({
      type: 'paragraph',
      text: normalizeMarkdownText(paragraphLines.join(' ')),
    });
    paragraphLines = [];
  };

  const flushList = (): void => {
    const blocks = targetBlocks();
    if (!blocks || listItems.length === 0) {
      listItems = [];
      listOrdered = false;
      return;
    }

    blocks.push({
      type: 'list',
      ordered: listOrdered,
      items: listItems,
    });
    listItems = [];
    listOrdered = false;
  };

  const startSection = (title: string): void => {
    flushParagraph();
    flushList();
    currentSection = {
      title: normalizeMarkdownText(title),
      blocks: [],
      subsections: [],
    };
    currentSubsection = null;
    sections.push(currentSection);
  };

  const startSubsection = (title: string): void => {
    flushParagraph();
    flushList();

    if (!currentSection) {
      startSection(title);
      return;
    }

    currentSubsection = {
      title: normalizeMarkdownText(title),
      blocks: [],
      subsections: [],
    };
    currentSection.subsections.push(currentSubsection);
  };

  markdown.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      flushParagraph();
      flushList();
      return;
    }

    if (/^-{3,}$/.test(trimmedLine)) {
      flushParagraph();
      flushList();
      return;
    }

    const headingMatch = trimmedLine.match(/^(#{2,3})\s+(.+)$/);
    if (headingMatch) {
      if (headingMatch[1].length === 2) {
        startSection(headingMatch[2]);
        return;
      }

      startSubsection(headingMatch[2]);
      return;
    }

    const listMatch = trimmedLine.match(/^[-*]\s+(.+)$/);
    if (listMatch) {
      flushParagraph();
      if (listItems.length > 0 && listOrdered) {
        flushList();
      }
      listOrdered = false;
      listItems.push(parseContentPageListItem(listMatch[1]));
      return;
    }

    const orderedListMatch = trimmedLine.match(/^\d+[.)]\s+(.+)$/);
    if (orderedListMatch) {
      flushParagraph();
      if (listItems.length > 0 && !listOrdered) {
        flushList();
      }
      listOrdered = true;
      listItems.push(parseContentPageListItem(orderedListMatch[1]));
      return;
    }

    flushList();
    paragraphLines.push(trimmedLine);
  });

  flushParagraph();
  flushList();

  return sections.filter(
    (section) => section.blocks.length > 0 || section.subsections.length > 0,
  );
}

function parseContentPageListItem(value: string): ContentPageListItem {
  const normalizedValue = normalizeMarkdownText(value);
  const labeledLinkMatch = value.match(/^([^:]+):\s*(.+?)\s*\(([^)\s]+:[^)]+|https?:\/\/[^)]+)\)$/);
  if (labeledLinkMatch) {
    return {
      text: normalizedValue,
      label: normalizeMarkdownText(labeledLinkMatch[1]),
      value: normalizeMarkdownText(labeledLinkMatch[2]),
      href: labeledLinkMatch[3].trim(),
    };
  }

  const markdownLinkMatch = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (markdownLinkMatch) {
    return {
      text: normalizeMarkdownText(markdownLinkMatch[1]),
      value: normalizeMarkdownText(markdownLinkMatch[1]),
      href: markdownLinkMatch[2].trim(),
    };
  }

  const labeledBareLinkMatch = value.match(/^([^:]+):\s*(.+)$/);
  if (labeledBareLinkMatch) {
    const label = normalizeMarkdownText(labeledBareLinkMatch[1]);
    const linkValue = labeledBareLinkMatch[2].trim();
    const href = readBareHref(linkValue);

    if (href) {
      return {
        text: normalizedValue,
        label,
        value: normalizeMarkdownText(linkValue),
        href,
      };
    }
  }

  return {
    text: normalizedValue,
  };
}

function readBareHref(value: string): string {
  if (/^(?:https?:\/\/|mailto:)/.test(value)) {
    return value;
  }

  if (/^\/.+/.test(value)) {
    return value;
  }

  return '';
}

function normalizeMarkdownText(value: string): string {
  return value
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .trim();
}

function readString(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function readOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function readRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function titleize(value: string): string {
  return value.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
