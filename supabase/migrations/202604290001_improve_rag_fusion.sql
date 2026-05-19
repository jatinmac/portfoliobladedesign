create or replace function public.match_rag_chunks(
  query_embedding extensions.vector(384),
  query_text text,
  match_threshold double precision default 0.25,
  match_count integer default 8,
  project_slug_filter text default null,
  source_types_filter text[] default array['project', 'site', 'ai_note']
)
returns table (
  id uuid,
  chunk_id text,
  source_type text,
  source_slug text,
  source_title text,
  section_title text,
  content text,
  search_text text,
  metadata jsonb,
  similarity double precision,
  text_rank double precision,
  fused_score double precision
)
language sql
stable
as $$
  with ranked_chunks as (
    select
      c.id,
      c.chunk_id,
      s.source_type,
      s.slug as source_slug,
      s.title as source_title,
      c.section_title,
      c.content,
      c.search_text,
      c.metadata,
      1 - (c.embedding <=> query_embedding) as similarity,
      ts_rank_cd(to_tsvector('english', c.search_text), plainto_tsquery('english', query_text)) as text_rank
    from public.rag_chunks c
    join public.rag_sources s on s.id = c.source_id
    where
      s.active = true
      and (source_types_filter is null or s.source_type = any(source_types_filter))
      and (project_slug_filter is null or (s.source_type = 'project' and s.slug = project_slug_filter))
  )
  select
    ranked_chunks.id,
    ranked_chunks.chunk_id,
    ranked_chunks.source_type,
    ranked_chunks.source_slug,
    ranked_chunks.source_title,
    ranked_chunks.section_title,
    ranked_chunks.content,
    ranked_chunks.search_text,
    ranked_chunks.metadata,
    ranked_chunks.similarity,
    ranked_chunks.text_rank,
    (
      (0.7 * ranked_chunks.similarity)
      + (0.3 * (ranked_chunks.text_rank / (ranked_chunks.text_rank + 1)))
    ) as fused_score
  from ranked_chunks
  where
    ranked_chunks.similarity >= match_threshold
    or ranked_chunks.text_rank > 0
  order by fused_score desc
  limit match_count;
$$;
