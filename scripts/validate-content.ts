import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

import {
  getAllContentPages,
  getChatConfig,
  getContentDirectory,
} from '../src/lib/content/content-loader';
import { isSafeProjectSlug, parseProjectMarkdown } from '../src/lib/content/projects';

const REQUIRED_PROJECT_FIELDS = ['title', 'slug', 'summary', 'role', 'timeline'] as const;

function main(): void {
  const errors: string[] = [];
  const contentDirectory = getContentDirectory();
  const projectsDirectory = path.join(contentDirectory, 'projects');
  const seenPageSlugs = new Map<string, string>();

  fs.readdirSync(contentDirectory)
    .filter((fileName) => fileName.endsWith('.md'))
    .filter((fileName) => fileName !== 'README.md')
    .forEach((fileName) => {
      const sourcePath = path.join(contentDirectory, fileName);
      try {
        const parsed = matter(fs.readFileSync(sourcePath, 'utf8'));
        const pageSlug = readString(parsed.data.page);
        if (!pageSlug) {
          errors.push(`${sourcePath}: missing frontmatter field: page`);
          return;
        }
        if (seenPageSlugs.has(pageSlug)) {
          errors.push(`${sourcePath}: duplicate page "${pageSlug}" also used by ${seenPageSlugs.get(pageSlug)}`);
        }
        seenPageSlugs.set(pageSlug, sourcePath);
      } catch (error) {
        errors.push(`${sourcePath}: ${readErrorMessage(error)}`);
      }
    });

  try {
    getAllContentPages();
  } catch (error) {
    errors.push(`content/*.md loader failed: ${readErrorMessage(error)}`);
  }

  try {
    const config = getChatConfig();
    if (config.starterPrompts.length === 0) {
      errors.push('content/chat-config.yaml: starterPrompts must contain at least one prompt.');
    }
  } catch (error) {
    errors.push(`content/chat-config.yaml: ${readErrorMessage(error)}`);
  }

  const seenSlugs = new Map<string, string>();
  fs.readdirSync(projectsDirectory)
    .filter((fileName) => fileName.endsWith('.md'))
    .forEach((fileName) => {
      const sourcePath = path.join(projectsDirectory, fileName);
      try {
        const raw = fs.readFileSync(sourcePath, 'utf8');
        const parsed = matter(raw);
        const missingFields = REQUIRED_PROJECT_FIELDS.filter((field) => !readString(parsed.data[field]));
        if (missingFields.length > 0) {
          errors.push(`${sourcePath}: missing frontmatter fields: ${missingFields.join(', ')}`);
        }

        const slug = readString(parsed.data.slug);
        if (slug && !isSafeProjectSlug(slug)) {
          errors.push(`${sourcePath}: slug must be kebab-case: ${slug}`);
        }
        if (slug && seenSlugs.has(slug)) {
          errors.push(`${sourcePath}: duplicate slug "${slug}" also used by ${seenSlugs.get(slug)}`);
        }
        if (slug) {
          seenSlugs.set(slug, sourcePath);
        }

        if (slug && fileName !== `${slug}.md`) {
          errors.push(`${sourcePath}: filename must match slug as "${slug}.md".`);
        }

        const order = parsed.data.order;
        if (order !== undefined && (typeof order !== 'number' || !Number.isFinite(order))) {
          errors.push(`${sourcePath}: order must be a finite number when provided.`);
        }

        parseProjectMarkdown(raw, sourcePath);
      } catch (error) {
        errors.push(`${sourcePath}: ${readErrorMessage(error)}`);
      }
    });

  if (errors.length > 0) {
    console.error(['Content validation failed:', ...errors.map((error) => `- ${error}`)].join('\n'));
    process.exitCode = 1;
    return;
  }

  console.log('Content validation passed.');
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function readErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

main();
