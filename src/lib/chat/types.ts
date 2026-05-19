import type { RetrievalMode, RetrievalScope, SourceReference } from '../rag/types';

export type ChatRole = 'user' | 'assistant';

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatRequestPayload = {
  messages: ChatMessage[];
  scope?: RetrievalScope;
  projectSlug?: string;
};

export type ChatIntent = 'overview' | 'project_deep_dive' | 'comparison' | 'contact_or_resume';

export type AgentStep = {
  tool: string;
  inputSummary: string;
  chunkCount: number;
};

export type AssistantMetadata = {
  resolvedScope: RetrievalScope;
  intent: ChatIntent;
  retrievalMode: RetrievalMode;
  conversationStage: 'opening' | 'active' | 'deep_dive';
  retrievedChunkCount: number;
  representedProjectCount: number;
  sourceReferences: SourceReference[];
  agentSteps: AgentStep[];
  queryRewrite?: string;
  followUps: string[];
  tokenBudget: {
    maxInputTokens: number;
    estimatedInputTokens: number;
    maxOutputTokens: number;
  };
};

export type PreparedChat = {
  metadata: AssistantMetadata;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
};
