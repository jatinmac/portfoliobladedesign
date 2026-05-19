create extension if not exists vector with schema extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.rag_sources (
  id uuid primary key default extensions.gen_random_uuid(),
  source_type text not null check (source_type in ('project', 'site', 'ai_note')),
  slug text not null,
  title text not null,
  canonical_path text not null,
  content_hash text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_type, slug)
);

create table if not exists public.rag_chunks (
  id uuid primary key default extensions.gen_random_uuid(),
  source_id uuid not null references public.rag_sources(id) on delete cascade,
  chunk_id text not null,
  section_title text not null,
  content text not null,
  search_text text not null,
  metadata jsonb not null default '{}'::jsonb,
  embedding extensions.vector(384) not null,
  content_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_id, chunk_id)
);

create table if not exists public.rag_index_runs (
  id uuid primary key default extensions.gen_random_uuid(),
  embedding_model text not null,
  dimensions integer not null,
  source_count integer not null default 0,
  chunk_count integer not null default 0,
  status text not null check (status in ('running', 'completed', 'failed')),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_knowledge_notes (
  id uuid primary key default extensions.gen_random_uuid(),
  title text not null,
  body text not null,
  tags text[] not null default '{}',
  visibility text not null default 'private' check (visibility in ('private', 'public')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rag_sources_active_idx on public.rag_sources(active);
create index if not exists rag_sources_slug_idx on public.rag_sources(source_type, slug);
create index if not exists rag_chunks_source_idx on public.rag_chunks(source_id);
create index if not exists rag_chunks_search_idx on public.rag_chunks using gin (to_tsvector('english', search_text));
create index if not exists rag_chunks_embedding_idx
  on public.rag_chunks using ivfflat (embedding extensions.vector_cosine_ops)
  with (lists = 100);
create index if not exists ai_knowledge_notes_active_idx on public.ai_knowledge_notes(active);
create index if not exists ai_knowledge_notes_tags_idx on public.ai_knowledge_notes using gin(tags);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists rag_sources_set_updated_at on public.rag_sources;
create trigger rag_sources_set_updated_at
before update on public.rag_sources
for each row execute function public.set_updated_at();

drop trigger if exists rag_chunks_set_updated_at on public.rag_chunks;
create trigger rag_chunks_set_updated_at
before update on public.rag_chunks
for each row execute function public.set_updated_at();

drop trigger if exists rag_index_runs_set_updated_at on public.rag_index_runs;
create trigger rag_index_runs_set_updated_at
before update on public.rag_index_runs
for each row execute function public.set_updated_at();

drop trigger if exists ai_knowledge_notes_set_updated_at on public.ai_knowledge_notes;
create trigger ai_knowledge_notes_set_updated_at
before update on public.ai_knowledge_notes
for each row execute function public.set_updated_at();

create or replace function public.match_rag_chunks(
  query_embedding extensions.vector(384),
  query_text text,
  match_threshold double precision default 0.25,
  match_count integer default 8,
  project_slug_filter text default null
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
  text_rank double precision
)
language sql
stable
as $$
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
    and (project_slug_filter is null or (s.source_type = 'project' and s.slug = project_slug_filter))
    and (
      1 - (c.embedding <=> query_embedding) >= match_threshold
      or to_tsvector('english', c.search_text) @@ plainto_tsquery('english', query_text)
    )
  order by
    (1 - (c.embedding <=> query_embedding)) desc,
    ts_rank_cd(to_tsvector('english', c.search_text), plainto_tsquery('english', query_text)) desc
  limit match_count;
$$;
