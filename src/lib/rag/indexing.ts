import type { SupabaseClient } from '@supabase/supabase-js';

import { buildDocumentChunks, hashContent, type RagSourceDocument } from './chunks';
import { embedText, getRagEmbeddingModel, RAG_EMBEDDING_DIMENSIONS } from './embeddings';
import type { RetrievalChunk } from './types';

export type ExistingChunkState = {
  sourceId: string;
  chunkId: string;
  contentHash: string;
};

export type ChunkIndexPlan = {
  unchanged: RetrievalChunk[];
  changed: RetrievalChunk[];
};

export function planChunkIndex(
  chunks: RetrievalChunk[],
  existingChunks: ExistingChunkState[],
): ChunkIndexPlan {
  const existingHashes = new Map(
    existingChunks.map((chunk) => [`${chunk.sourceId}:${chunk.chunkId}`, chunk.contentHash]),
  );

  return chunks.reduce<ChunkIndexPlan>(
    (plan, chunk) => {
      const sourceId = String(chunk.metadata?.sourceId ?? chunk.sourceSlug);
      const chunkId = chunk.id.split('#').at(-1) ?? chunk.id;
      const existingHash = existingHashes.get(`${sourceId}:${chunkId}`);

      if (existingHash && existingHash === chunk.contentHash) {
        plan.unchanged.push(chunk);
      } else {
        plan.changed.push(chunk);
      }

      return plan;
    },
    { unchanged: [], changed: [] },
  );
}

export function hashSourceDocument(source: RagSourceDocument): string {
  return hashContent(
    JSON.stringify({
      type: source.type,
      slug: source.slug,
      title: source.title,
      canonicalPath: source.canonicalPath,
      content: source.content,
      metadata: source.metadata ?? {},
    }),
  );
}

export async function indexRagSources(
  supabase: SupabaseClient,
  sources: RagSourceDocument[],
): Promise<{ sourceCount: number; chunkCount: number; skippedChunkCount: number }> {
  const run = await insertIndexRun(supabase);
  let chunkCount = 0;
  let skippedChunkCount = 0;

  try {
    for (const source of sources) {
      const sourceId = await upsertSource(supabase, source);
      const chunks = buildDocumentChunks(source).map((chunk) => ({
        ...chunk,
        metadata: {
          ...chunk.metadata,
          sourceId,
        },
      }));
      const existingChunks = await fetchExistingChunks(supabase, sourceId);
      const plan = planChunkIndex(chunks, existingChunks);

      skippedChunkCount += plan.unchanged.length;
      chunkCount += chunks.length;

      for (const chunk of plan.changed) {
        await upsertChunk(supabase, sourceId, chunk);
      }
    }

    await updateIndexRun(supabase, run.id, {
      status: 'completed',
      source_count: sources.length,
      chunk_count: chunkCount,
    });

    return {
      sourceCount: sources.length,
      chunkCount,
      skippedChunkCount,
    };
  } catch (error) {
    await updateIndexRun(supabase, run.id, {
      status: 'failed',
      error_message: error instanceof Error ? error.message : String(error),
      source_count: sources.length,
      chunk_count: chunkCount,
    });
    throw error;
  }
}

async function insertIndexRun(supabase: SupabaseClient): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from('rag_index_runs')
    .insert({
      embedding_model: getRagEmbeddingModel(),
      dimensions: RAG_EMBEDDING_DIMENSIONS,
      status: 'running',
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to create RAG index run: ${error.message}`);
  }

  return data as { id: string };
}

async function upsertSource(supabase: SupabaseClient, source: RagSourceDocument): Promise<string> {
  const { data, error } = await supabase
    .from('rag_sources')
    .upsert(
      {
        source_type: source.type,
        slug: source.slug,
        title: source.title,
        canonical_path: source.canonicalPath,
        content_hash: hashSourceDocument(source),
        active: true,
      },
      { onConflict: 'source_type,slug' },
    )
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to upsert RAG source ${source.slug}: ${error.message}`);
  }

  return (data as { id: string }).id;
}

async function fetchExistingChunks(
  supabase: SupabaseClient,
  sourceId: string,
): Promise<ExistingChunkState[]> {
  const { data, error } = await supabase
    .from('rag_chunks')
    .select('source_id, chunk_id, content_hash')
    .eq('source_id', sourceId);

  if (error) {
    throw new Error(`Failed to fetch existing RAG chunks: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    sourceId: row.source_id,
    chunkId: row.chunk_id,
    contentHash: row.content_hash,
  }));
}

async function upsertChunk(
  supabase: SupabaseClient,
  sourceId: string,
  chunk: RetrievalChunk,
): Promise<void> {
  const embedding = await embedText(`${chunk.sectionTitle}\n${chunk.content}`);
  const chunkId = chunk.id.split('#').at(-1) ?? chunk.id;
  const { error } = await supabase.from('rag_chunks').upsert(
    {
      source_id: sourceId,
      chunk_id: chunkId,
      section_title: chunk.sectionTitle,
      content: chunk.content,
      search_text: chunk.searchText,
      metadata: chunk.metadata ?? {},
      embedding,
      content_hash: chunk.contentHash,
    },
    { onConflict: 'source_id,chunk_id' },
  );

  if (error) {
    throw new Error(`Failed to upsert RAG chunk ${chunk.id}: ${error.message}`);
  }
}

async function updateIndexRun(
  supabase: SupabaseClient,
  id: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabase.from('rag_index_runs').update(patch).eq('id', id);
  if (error) {
    throw new Error(`Failed to update RAG index run: ${error.message}`);
  }
}
