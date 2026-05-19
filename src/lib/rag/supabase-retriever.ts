import { readNumberEnv } from '../env';
import { createSupabaseServiceClient, hasSupabaseRagConfig } from '../supabase/server';
import { embedText } from './embeddings';
import type { RagSourceType, RetrievalChunk, RetrievalScope } from './types';

const DEFAULT_MATCH_THRESHOLD = 0.25;
const DEFAULT_MATCH_COUNT = 8;

type SupabaseRagRow = {
  id: string;
  chunk_id: string;
  source_type: 'project' | 'site' | 'ai_note';
  source_slug: string;
  source_title: string;
  section_title: string;
  content: string;
  search_text: string;
  metadata: Record<string, unknown> | null;
  similarity: number;
  text_rank?: number;
  fused_score?: number;
};

export type SupabaseRetrieveOptions = {
  query: string;
  scope: RetrievalScope;
  projectSlug?: string;
  matchCount?: number;
  sourceTypes?: RagSourceType[];
};

export async function retrieveSupabaseContext(
  options: SupabaseRetrieveOptions,
): Promise<RetrievalChunk[] | null> {
  if (!hasSupabaseRagConfig()) {
    return null;
  }

  const query = options.query.trim();
  if (!query) {
    return null;
  }

  const embedding = await embedText(query);
  const supabase = createSupabaseServiceClient();
  const matchThreshold = readNumberEnv('RAG_MATCH_THRESHOLD', DEFAULT_MATCH_THRESHOLD);

  const { data, error } = await supabase.rpc('match_rag_chunks', {
    query_embedding: embedding,
    query_text: query,
    match_threshold: matchThreshold,
    match_count: options.matchCount ?? DEFAULT_MATCH_COUNT,
    project_slug_filter: options.scope === 'project' ? options.projectSlug ?? null : null,
    source_types_filter: options.sourceTypes ?? ['project', 'site'],
  });

  if (error) {
    throw new Error(`Supabase RAG retrieval failed: ${error.message}`);
  }

  const rows = (data ?? []) as SupabaseRagRow[];
  if (rows.length === 0) {
    return null;
  }

  return rows.map((row) => ({
    id: `${row.source_slug}#${row.chunk_id}`,
    sourceType: row.source_type,
    sourceSlug: row.source_slug,
    sourceTitle: row.source_title,
    projectSlug: row.source_type === 'project' ? row.source_slug : row.source_slug,
    projectTitle: row.source_title,
    sectionTitle: row.section_title,
    content: row.content,
    searchText: row.search_text,
    metadata: row.metadata ?? undefined,
    score: row.fused_score ?? row.similarity,
  }));
}
