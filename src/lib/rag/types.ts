import type { Project } from '../content/types';

export type RetrievalScope = 'portfolio' | 'project';
export type RetrievalMode = 'lexical';
export type RagSourceType = 'project' | 'site' | 'ai_note';

export type RetrievalChunk = {
  id: string;
  sourceType: RagSourceType;
  sourceSlug: string;
  sourceTitle: string;
  projectSlug: string;
  projectTitle: string;
  sectionTitle: string;
  content: string;
  searchText: string;
  metadata?: Record<string, unknown>;
  score?: number;
  contentHash?: string;
};

export type SourceReference = {
  id: string;
  sourceType: RagSourceType;
  sourceSlug: string;
  sourceTitle: string;
  projectSlug: string;
  projectTitle: string;
  sectionTitle: string;
  score?: number;
};

export type RetrievalResult = {
  mode: RetrievalMode;
  scope: RetrievalScope;
  resolvedProjectSlug?: string;
  chunks: RetrievalChunk[];
  representedProjects: string[];
};

export type ChunkBuildInput = Pick<
  Project,
  'title' | 'slug' | 'summary' | 'role' | 'timeline' | 'chatContext' | 'body'
>;
