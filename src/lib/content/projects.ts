import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

import { shouldBypassContentCache } from './content-loader';
import type { Project, ProjectFrontmatter, ProjectSummary } from './types';

const PROJECTS_DIRECTORY = path.join(process.cwd(), 'content', 'projects');
const REQUIRED_FRONTMATTER_FIELDS: Array<keyof ProjectFrontmatter> = [
  'title',
  'slug',
  'summary',
  'role',
  'timeline',
];
const SAFE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

let projectCache: Project[] | null = null;
let projectSummaryCache: ProjectSummary[] | null = null;

export function isSafeProjectSlug(slug: string): boolean {
  return SAFE_SLUG_PATTERN.test(slug);
}

export function getAllProjects(): Project[] {
  if (!shouldBypassContentCache() && projectCache) {
    return projectCache;
  }

  if (!fs.existsSync(PROJECTS_DIRECTORY)) {
    if (!shouldBypassContentCache()) {
      projectCache = [];
    }
    return [];
  }

  const projects = fs
    .readdirSync(PROJECTS_DIRECTORY)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const sourcePath = path.join(PROJECTS_DIRECTORY, fileName);
      const project = parseProjectMarkdown(fs.readFileSync(sourcePath, 'utf8'), sourcePath);
      return {
        ...project,
        order: project.order ?? getProjectOrder(fileName),
      };
    })
    .sort(
      (a, b) =>
        (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) ||
        a.title.localeCompare(b.title),
    );
  if (!shouldBypassContentCache()) {
    projectCache = projects;
  }
  projectSummaryCache = null;

  return projects;
}

export function getProjectSummaries(): ProjectSummary[] {
  if (!shouldBypassContentCache() && projectSummaryCache) {
    return projectSummaryCache;
  }

  const summaries = getAllProjects().map(({ body: _body, sourcePath: _sourcePath, ...summary }) => summary);
  if (!shouldBypassContentCache()) {
    projectSummaryCache = summaries;
  }
  return summaries;
}

export function getProjectBySlug(slug: string): Project | null {
  if (!isSafeProjectSlug(slug)) {
    return null;
  }

  return getAllProjects().find((project) => project.slug === slug) ?? null;
}

export function parseProjectMarkdown(source: string, sourcePath = 'inline.md'): Project {
  const parsed = matter(source);
  if (!/^---\r?\n/.test(source)) {
    throw new Error(`Project markdown is missing frontmatter: ${sourcePath}`);
  }

  const frontmatter = parseFrontmatter(parsed.data, sourcePath);
  const body = parsed.content.trim();

  return {
    ...frontmatter,
    body,
    sourcePath,
  };
}

function getProjectOrder(fileName: string): number {
  const orderMatch = fileName.match(/^(\d+)/);
  if (!orderMatch) {
    return Number.MAX_SAFE_INTEGER;
  }

  return Number(orderMatch[1]);
}

function parseFrontmatter(rawFrontmatter: Record<string, unknown>, sourcePath: string): ProjectFrontmatter {
  const missingFields = REQUIRED_FRONTMATTER_FIELDS.filter((field) => !readString(rawFrontmatter[field]));
  if (missingFields.length > 0) {
    throw new Error(
      `Project markdown ${sourcePath} is missing frontmatter fields: ${missingFields.join(', ')}`,
    );
  }

  const slug = readString(rawFrontmatter.slug);
  if (!isSafeProjectSlug(slug)) {
    throw new Error(`Project markdown ${sourcePath} has an invalid slug: ${slug}`);
  }

  return {
    title: readString(rawFrontmatter.title),
    slug,
    summary: readString(rawFrontmatter.summary),
    role: readString(rawFrontmatter.role),
    timeline: readString(rawFrontmatter.timeline),
    order: readOptionalNumber(rawFrontmatter.order),
    chatContext: readString(rawFrontmatter.chatContext) || undefined,
    tags: readStringArray(rawFrontmatter.tags),
    stack: readStringArray(rawFrontmatter.stack),
    platform: readString(rawFrontmatter.platform) || undefined,
    outcome: readString(rawFrontmatter.outcome) || undefined,
    productUrl: readString(rawFrontmatter.productUrl) || undefined,
    heroImage: readString(rawFrontmatter.heroImage) || undefined,
    galleryImages: readStringArray(rawFrontmatter.galleryImages),
    pitchDeckImages: readStringArray(rawFrontmatter.pitchDeckImages),
  };
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function readStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const values = value.filter((item): item is string => typeof item === 'string' && Boolean(item.trim()));
  return values.length > 0 ? values.map((item) => item.trim()) : undefined;
}

function readOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}
