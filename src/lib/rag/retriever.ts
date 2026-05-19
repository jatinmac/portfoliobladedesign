import { getAllProjects, getProjectBySlug } from '../content/projects';
import { shouldBypassContentCache } from '../content/content-loader';
import { buildAllChunks } from './chunks';
import { retrieveSupabaseContext } from './supabase-retriever';
import type { RagSourceType, RetrievalChunk, RetrievalResult, RetrievalScope } from './types';

const DEFAULT_MAX_CHUNKS = 6;
const MAX_DYNAMIC_CHUNKS = 10;
const DEFAULT_MAX_CHUNKS_PER_PROJECT = 3;
const APPROX_TOKENS_PER_CHUNK = 500;
const DEFAULT_REMAINING_TOKEN_BUDGET = DEFAULT_MAX_CHUNKS * APPROX_TOKENS_PER_CHUNK;
const BROADENING_TERMS = new Set([
  'all',
  'across',
  'another',
  'compare',
  'different',
  'else',
  'other',
  'overall',
  'portfolio',
  'projects',
]);

let chunkCache: RetrievalChunk[] | null = null;

export type RetrieveOptions = {
  query: string;
  scope: RetrievalScope;
  projectSlug?: string;
  maxChunks?: number;
  maxChunksPerProject?: number;
  remainingTokenBudget?: number;
  sourceTypes?: RagSourceType[];
};

export async function retrievePortfolioContext(options: RetrieveOptions): Promise<RetrievalResult> {
  const lexicalScope = resolveRetrievalScope(options);
  const limits = resolveChunkLimits(options);

  try {
    const supabaseChunks = await retrieveSupabaseContext({
      ...options,
      scope: lexicalScope.scope,
      projectSlug: lexicalScope.resolvedProjectSlug,
      matchCount: limits.maxChunks + 2,
      sourceTypes: options.sourceTypes ?? ['project', 'site'],
    });

    if (supabaseChunks && supabaseChunks.length > 0) {
      const chunks = capChunksByProject(supabaseChunks, limits);
      return {
        mode: 'supabase_hybrid',
        scope: lexicalScope.scope,
        resolvedProjectSlug: lexicalScope.resolvedProjectSlug,
        chunks,
        representedProjects: Array.from(new Set(chunks.map((chunk) => chunk.projectSlug))),
      };
    }
  } catch {
    // Supabase RAG is a retrieval enhancement. Chat must stay available through lexical fallback.
  }

  return retrieveLexicalPortfolioContext(options, 'lexical_fallback');
}

export function retrieveLexicalPortfolioContext(
  options: RetrieveOptions,
  mode: RetrievalResult['mode'] = 'lexical',
): RetrievalResult {
  const resolvedScope = resolveRetrievalScope(options);
  const queryTokens = tokenize(options.query);
  const limits = resolveChunkLimits(options);
  const sourceTypes = options.sourceTypes ?? ['project', 'site'];

  const candidateChunks = resolvedScope.scope === 'project'
    ? getChunkCache().filter((chunk) => chunk.projectSlug === resolvedScope.resolvedProjectSlug)
    : getChunkCache();
  const scopedCandidateChunks = candidateChunks.filter((chunk) => sourceTypes.includes(chunk.sourceType));

  const rankedChunks = scopedCandidateChunks
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, queryTokens, options.query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ chunk, score }) => ({ ...chunk, score }));

  const chunks = capChunksByProject(
    rankedChunks.length > 0 ? rankedChunks : scopedCandidateChunks,
    limits,
  );
  const representedProjects = Array.from(new Set(chunks.map((chunk) => chunk.projectSlug)));

  return {
    mode,
    scope: resolvedScope.scope,
    resolvedProjectSlug: resolvedScope.resolvedProjectSlug,
    chunks,
    representedProjects,
  };
}

export function resetRetrievalCacheForTests(): void {
  chunkCache = null;
}

function getChunkCache(): RetrievalChunk[] {
  if (shouldBypassContentCache()) {
    return buildAllChunks(getAllProjects());
  }

  if (!chunkCache) {
    chunkCache = buildAllChunks(getAllProjects());
  }

  return chunkCache;
}

function resolveRetrievalScope(options: RetrieveOptions): {
  scope: RetrievalScope;
  resolvedProjectSlug?: string;
} {
  const queryTokens = tokenize(options.query);
  const shouldUseProjectScope =
    options.scope === 'project' &&
    options.projectSlug &&
    getProjectBySlug(options.projectSlug) &&
    !queryTokens.some((token) => BROADENING_TERMS.has(token));

  return {
    scope: shouldUseProjectScope ? 'project' : 'portfolio',
    resolvedProjectSlug: shouldUseProjectScope ? options.projectSlug : undefined,
  };
}

function scoreChunk(chunk: RetrievalChunk, queryTokens: string[], rawQuery: string): number {
  const haystack = chunk.searchText.toLowerCase();
  const title = chunk.sectionTitle.toLowerCase();
  const projectTitle = chunk.projectTitle.toLowerCase();
  const chatContext = String(chunk.metadata?.chatContext ?? '').toLowerCase();
  const keywordMetadata = [
    ...readStringArray(chunk.metadata?.tags),
    ...readStringArray(chunk.metadata?.stack),
    chunk.metadata?.platform,
    chunk.metadata?.outcome,
  ].filter(Boolean).join(' ').toLowerCase();
  const phrase = rawQuery.trim().toLowerCase();
  const haystackStems = new Set(tokenize(haystack).map(stemToken));

  let score = 0;

  if (phrase && haystack.includes(phrase)) {
    score += 8;
  }

  queryTokens.forEach((token) => {
    const stem = stemToken(token);
    if (projectTitle.includes(token)) {
      score += 6;
    }
    if (title.includes(token)) {
      score += 4;
    }
    if (chatContext.includes(token)) {
      score += 5;
    }
    if (keywordMetadata.includes(token)) {
      score += 5;
    }
    if (haystack.includes(token)) {
      score += 1;
    }
    if (!haystack.includes(token) && stem.length > 3 && haystackStems.has(stem)) {
      score += 3;
    }
  });

  return score;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function capChunksByProject(
  chunks: RetrievalChunk[],
  limits: { maxChunks: number; maxChunksPerProject: number },
): RetrievalChunk[] {
  const counts = new Map<string, number>();
  const capped: RetrievalChunk[] = [];

  chunks.forEach((chunk) => {
    const count = counts.get(chunk.projectSlug) ?? 0;
    if (count >= limits.maxChunksPerProject || capped.length >= limits.maxChunks) {
      return;
    }

    capped.push(chunk);
    counts.set(chunk.projectSlug, count + 1);
  });

  return capped;
}

function resolveChunkLimits(options: RetrieveOptions): { maxChunks: number; maxChunksPerProject: number } {
  const remainingTokenBudget = options.remainingTokenBudget ?? DEFAULT_REMAINING_TOKEN_BUDGET;
  const budgetBasedMax = Math.floor(remainingTokenBudget / APPROX_TOKENS_PER_CHUNK);
  const maxChunks = clamp(
    options.maxChunks ?? budgetBasedMax,
    1,
    MAX_DYNAMIC_CHUNKS,
  );

  return {
    maxChunks,
    maxChunksPerProject: clamp(options.maxChunksPerProject ?? DEFAULT_MAX_CHUNKS_PER_PROJECT, 1, maxChunks),
  };
}

function tokenize(value: string): string[] {
  return Array.from(
    new Set(
      value
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((token) => token.length > 2),
    ),
  );
}

function stemToken(token: string): string {
  return token
    .replace(/(?:ing|ers|er|ed|es|s)$/i, '')
    .replace(/(.)\1$/i, '$1');
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
