import { getProjectSummaries } from '../content/projects';
import { shouldBypassContentCache } from '../content/content-loader';
import { getStructuredPageContent, type PortfolioPage } from '../content/pages';
import { buildSiteChunks } from '../rag/chunks';
import { retrievePortfolioContext, type RetrieveOptions } from '../rag/retriever';
import type { RetrievalChunk, RetrievalMode, RetrievalScope } from '../rag/types';
import type { GroqTool } from '../groq/client';
import type { ChatRequestPayload } from './types';

export type PortfolioToolName =
  | 'search_projects'
  | 'get_project_list'
  | 'get_page_content'
  | 'get_site_profile';

export type PortfolioToolExecution = {
  tool: PortfolioToolName;
  inputSummary: string;
  content: string;
  chunks: RetrievalChunk[];
  retrievalMode?: RetrievalMode;
  resolvedScope?: RetrievalScope;
};

let siteChunkCache: ReturnType<typeof buildSiteChunks> | null = null;

export const portfolioToolDefinitions: GroqTool[] = [
  {
    type: 'function',
    function: {
      name: 'search_projects',
      description:
        'Search repository-grounded project and site chunks for evidence. Use for project questions, comparisons, vague follow-ups, and design-process questions.',
      parameters: {
        type: 'object',
        additionalProperties: false,
        properties: {
          query: {
            type: 'string',
            description: 'A specific retrieval query with resolved project names and topic words.',
          },
          projectSlug: {
            type: 'string',
            description:
              'Optional project slug when the search should stay inside one project.',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_project_list',
      description:
        'Return the checked-in project list with slugs, summaries, roles, timelines, and routing context.',
      parameters: {
        type: 'object',
        additionalProperties: false,
        properties: {},
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_page_content',
      description:
        'Return repository-owned content for a specific static portfolio page such as contact, resume, about, experience, projects, or home.',
      parameters: {
        type: 'object',
        additionalProperties: false,
        properties: {
          page: {
            type: 'string',
            enum: ['home', 'about', 'experience', 'projects', 'contact', 'resume'],
          },
        },
        required: ['page'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_site_profile',
      description:
        'Return a compact repository-owned profile across the home, about, experience, contact, and resume pages.',
      parameters: {
        type: 'object',
        additionalProperties: false,
        properties: {},
      },
    },
  },
];

export async function executePortfolioTool(input: {
  tool: string;
  args: Record<string, unknown>;
  payload: ChatRequestPayload;
  remainingTokenBudget?: number;
}): Promise<PortfolioToolExecution> {
  switch (input.tool) {
    case 'search_projects':
      return searchProjects(input.args, input.payload, input.remainingTokenBudget);
    case 'get_project_list':
      return getProjectList();
    case 'get_page_content':
      return getPageContentTool(input.args);
    case 'get_site_profile':
      return getSiteProfile();
    default:
      return {
        tool: 'search_projects',
        inputSummary: `unsupported tool: ${input.tool}`,
        content: `Unsupported portfolio tool: ${input.tool}`,
        chunks: [],
        resolvedScope: input.payload.scope ?? 'portfolio',
      };
  }
}

async function searchProjects(
  args: Record<string, unknown>,
  payload: ChatRequestPayload,
  remainingTokenBudget?: number,
): Promise<PortfolioToolExecution> {
  const query = readString(args.query).trim();
  const projectSlug = readString(args.projectSlug).trim() || payload.projectSlug;
  const scope: RetrievalScope = projectSlug ? 'project' : payload.scope ?? 'portfolio';
  const retrievalOptions: RetrieveOptions = {
    query,
    scope,
    projectSlug,
    remainingTokenBudget,
    sourceTypes: ['project', 'site'],
  };
  const retrieval = await retrievePortfolioContext(retrievalOptions);

  return {
    tool: 'search_projects',
    inputSummary: projectSlug ? `search ${projectSlug}: "${query}"` : `search: "${query}"`,
    content: formatToolContext('search_projects', { query, projectSlug }, retrieval.chunks),
    chunks: retrieval.chunks,
    retrievalMode: retrieval.mode,
    resolvedScope: retrieval.scope,
  };
}

function getProjectList(): PortfolioToolExecution {
  const summaries = getProjectSummaries();
  const content = summaries
    .map((project) =>
      [
        `- ${project.title}`,
        `  slug: ${project.slug}`,
        `  summary: ${project.summary}`,
        `  role: ${project.role}`,
        `  timeline: ${project.timeline}`,
        project.platform ? `  platform: ${project.platform}` : '',
        project.outcome ? `  outcome: ${project.outcome}` : '',
        project.productUrl ? `  product URL: ${project.productUrl}` : '',
        project.tags?.length ? `  tags: ${project.tags.join(', ')}` : '',
        project.stack?.length ? `  stack: ${project.stack.join(', ')}` : '',
        project.chatContext ? `  routing context: ${project.chatContext}` : '',
      ].filter(Boolean).join('\n'),
    )
    .join('\n\n');

  return {
    tool: 'get_project_list',
    inputSummary: 'project list',
    content: `[Tool: get_project_list]\n${content}`,
    chunks: [],
    resolvedScope: 'portfolio',
  };
}

function getPageContentTool(args: Record<string, unknown>): PortfolioToolExecution {
  const page = normalizePage(readString(args.page));
  const pageContent = getStructuredPageContent(page);
  const chunks = getCachedSiteChunks().filter((chunk) => chunk.sourceSlug === `page-${page}`);

  return {
    tool: 'get_page_content',
    inputSummary: `page: ${page}`,
    content: `[Tool: get_page_content | Page: ${page}]\n${pageContent.content}`,
    chunks,
    retrievalMode: 'lexical',
    resolvedScope: 'portfolio',
  };
}

function getSiteProfile(): PortfolioToolExecution {
  const chunks = getCachedSiteChunks();

  return {
    tool: 'get_site_profile',
    inputSummary: 'site profile',
    content: formatToolContext('get_site_profile', {}, chunks),
    chunks,
    retrievalMode: 'lexical',
    resolvedScope: 'portfolio',
  };
}

function getCachedSiteChunks(): ReturnType<typeof buildSiteChunks> {
  if (!siteChunkCache || shouldBypassContentCache()) {
    siteChunkCache = buildSiteChunks();
  }

  return siteChunkCache;
}

function formatToolContext(
  tool: PortfolioToolName,
  input: Record<string, unknown>,
  chunks: RetrievalChunk[],
): string {
  const inputText = Object.entries(input)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(' | ');
  const header = inputText ? `[Tool: ${tool} | ${inputText}]` : `[Tool: ${tool}]`;

  if (chunks.length === 0) {
    return `${header}\nNo matching repository content was found.`;
  }

  return [
    header,
    ...chunks.map((chunk) =>
      [
        `[${chunk.projectTitle} - ${chunk.sectionTitle}]`,
        `Source: ${chunk.sourceType}/${chunk.sourceSlug}`,
        chunk.content,
      ].join('\n'),
    ),
  ].join('\n\n');
}

function normalizePage(value: string): PortfolioPage {
  const page = value.toLowerCase();

  if (
    page === 'home' ||
    page === 'about' ||
    page === 'experience' ||
    page === 'projects' ||
    page === 'contact' ||
    page === 'resume'
  ) {
    return page;
  }

  return 'home';
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}
