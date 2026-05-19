import { createHash } from 'node:crypto';

import { stripInlineMarkdown } from '../content/markdown';
import { getAllPageContent } from '../content/pages';
import type { Project } from '../content/types';
import type { RagSourceType, RetrievalChunk } from './types';

const SECTION_PATTERN = /^##\s+(.+)$/gm;

export type RagSourceDocument = {
  type: RagSourceType;
  slug: string;
  title: string;
  canonicalPath: string;
  content: string;
  metadata?: Record<string, unknown>;
};

export function buildProjectChunks(project: Project): RetrievalChunk[] {
  const derivedChatContext = getProjectChatContext(project);
  const projectKeywords = [
    ...(project.tags ?? []),
    ...(project.stack ?? []),
    project.platform,
    project.outcome,
    project.productUrl,
  ].filter(Boolean).join(' ');
  const chunks: RetrievalChunk[] = [
    withChunkHash({
      id: `${project.slug}#overview`,
      sourceType: 'project',
      sourceSlug: project.slug,
      sourceTitle: project.title,
      projectSlug: project.slug,
      projectTitle: project.title,
      sectionTitle: 'Overview',
      content: [
        project.summary,
        `Role: ${project.role}.`,
        `Timeline: ${project.timeline}.`,
        project.platform ? `Platform: ${project.platform}.` : '',
        project.outcome ? `Outcome: ${project.outcome}.` : '',
        project.productUrl ? `Product URL: ${project.productUrl}.` : '',
        derivedChatContext,
      ].join('\n'),
      searchText: [
        project.title,
        project.slug,
        project.summary,
        project.role,
        project.timeline,
        projectKeywords,
        derivedChatContext,
      ].join(' '),
      metadata: {
        sourcePath: project.sourcePath,
        role: project.role,
        timeline: project.timeline,
        chatContext: derivedChatContext,
        tags: project.tags ?? [],
        stack: project.stack ?? [],
        platform: project.platform,
        outcome: project.outcome,
        productUrl: project.productUrl,
      },
    }),
  ];

  const sections = splitMarkdownSections(project.body);
  sections.forEach((section) => {
    chunks.push(withChunkHash({
      id: `${project.slug}#${slugifySection(section.title)}`,
      sourceType: 'project',
      sourceSlug: project.slug,
      sourceTitle: project.title,
      projectSlug: project.slug,
      projectTitle: project.title,
      sectionTitle: section.title,
      content: section.content,
      searchText: [
        project.title,
        project.summary,
        projectKeywords,
        derivedChatContext,
        section.title,
        section.content,
      ].join(' '),
      metadata: {
        sourcePath: project.sourcePath,
        chatContext: derivedChatContext,
        tags: project.tags ?? [],
        stack: project.stack ?? [],
        platform: project.platform,
        outcome: project.outcome,
        productUrl: project.productUrl,
      },
    }));
  });

  return chunks;
}

export function buildAllChunks(projects: Project[]): RetrievalChunk[] {
  return [...projects.flatMap(buildProjectChunks), ...buildSiteChunks()];
}

export function buildFullPortfolioSources(projects: Project[]): RagSourceDocument[] {
  return [
    ...projects.map((project) => ({
      type: 'project' as const,
      slug: project.slug,
      title: project.title,
      canonicalPath: `/projects/${project.slug}`,
      content: [
        '## Overview',
        project.title,
        project.summary,
        `Role: ${project.role}`,
        `Timeline: ${project.timeline}`,
        project.platform ? `Platform: ${project.platform}` : '',
        project.outcome ? `Outcome: ${project.outcome}` : '',
        project.productUrl ? `Product URL: ${project.productUrl}` : '',
        getProjectChatContext(project),
        project.body,
      ].join('\n\n'),
      metadata: {
        sourcePath: project.sourcePath,
        role: project.role,
        timeline: project.timeline,
        chatContext: getProjectChatContext(project),
        tags: project.tags ?? [],
        stack: project.stack ?? [],
        platform: project.platform,
        outcome: project.outcome,
        productUrl: project.productUrl,
      },
    })),
    ...buildSiteSourceDocuments(),
  ];
}

export function buildSiteSourceDocuments(): RagSourceDocument[] {
  return getAllPageContent().map((page) => ({
    type: 'site',
    slug: `page-${page.page}`,
    title: page.title,
    canonicalPath: page.path,
    content: page.content,
    metadata: {
      sourcePath: page.sourcePath,
      page: page.page,
      frontmatter: page.frontmatter,
    },
  }));
}

export function buildSiteChunks(): RetrievalChunk[] {
  return buildSiteSourceDocuments().flatMap(buildDocumentChunks);
}

function getProjectChatContext(project: Project): string {
  if (project.chatContext?.trim()) {
    return project.chatContext.trim();
  }

  const sectionHeadings = splitMarkdownSections(project.body)
    .map((section) => section.title)
    .filter(Boolean)
    .join(', ');

  return [
    project.title,
    project.summary,
    `Role: ${project.role}`,
    `Timeline: ${project.timeline}`,
    project.platform ? `Platform: ${project.platform}` : '',
    project.outcome ? `Outcome: ${project.outcome}` : '',
    project.productUrl ? `Product URL: ${project.productUrl}` : '',
    project.tags?.length ? `Tags: ${project.tags.join(', ')}` : '',
    project.stack?.length ? `Stack: ${project.stack.join(', ')}` : '',
    sectionHeadings ? `Sections: ${sectionHeadings}` : '',
  ].filter(Boolean).join('. ');
}

export function buildDocumentChunks(source: RagSourceDocument): RetrievalChunk[] {
  const sections = splitContentSections(source.content);
  return sections.map((section, index) =>
    withChunkHash({
      id: `${source.slug}#${slugifySection(section.title || `section-${index + 1}`)}`,
      sourceType: source.type,
      sourceSlug: source.slug,
      sourceTitle: source.title,
      projectSlug: source.type === 'project' ? source.slug : source.slug,
      projectTitle: source.title,
      sectionTitle: section.title || source.title,
      content: section.content,
      searchText: [source.title, source.slug, section.title, section.content].join(' '),
      metadata: {
        ...source.metadata,
        canonicalPath: source.canonicalPath,
      },
    }),
  );
}

export function buildFullPortfolioChunks(projects: Project[]): RetrievalChunk[] {
  return buildFullPortfolioSources(projects).flatMap(buildDocumentChunks);
}

export function hashContent(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function splitMarkdownSections(markdown: string): Array<{ title: string; content: string }> {
  const matches = Array.from(markdown.matchAll(SECTION_PATTERN));
  if (matches.length === 0) {
    return [{ title: 'Case Study', content: stripMarkdown(markdown) }];
  }

  return matches.map((match, index) => {
    const nextMatch = matches[index + 1];
    const startIndex = (match.index ?? 0) + match[0].length;
    const endIndex = nextMatch?.index ?? markdown.length;

    return {
      title: stripInlineMarkdown(match[1].trim()),
      content: stripMarkdown(markdown.slice(startIndex, endIndex).trim()),
    };
  });
}

function splitContentSections(content: string): Array<{ title: string; content: string }> {
  const markdownSections = splitMarkdownSections(content);
  if (markdownSections.length > 1 || markdownSections[0]?.title !== 'Case Study') {
    return markdownSections;
  }

  const paragraphs = stripMarkdown(content)
    .split(/\n{2,}/)
    .map((section) => section.trim())
    .filter(Boolean);

  if (paragraphs.length <= 1) {
    return [{ title: 'Overview', content: stripMarkdown(content) }];
  }

  return paragraphs.map((paragraph, index) => ({
    title: index === 0 ? 'Overview' : `Section ${index + 1}`,
    content: paragraph,
  }));
}

function stripMarkdown(markdown: string): string {
  return markdown
    .split(/\r?\n/)
    .map((line) => stripInlineMarkdown(line.replace(/^[-*]\s+/, '').replace(/^#{1,6}\s+/, '')))
    .filter(Boolean)
    .join('\n');
}

function slugifySection(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function withChunkHash(chunk: RetrievalChunk): RetrievalChunk {
  return {
    ...chunk,
    contentHash: hashContent([chunk.id, chunk.content, chunk.searchText].join('\n')),
  };
}
