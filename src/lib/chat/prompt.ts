import { shouldBypassContentCache } from '../content/content-loader';
import { getAllProjects } from '../content/projects';
import { getFollowUpConfig, getSiteMetadata } from '../content/site';
import { readNumberEnv } from '../env';
import { retrievePortfolioContext } from '../rag/retriever';
import type { RetrievalChunk, RetrievalMode, SourceReference } from '../rag/types';
import type {
  AgentStep,
  AssistantMetadata,
  ChatIntent,
  ChatMessage,
  ChatRequestPayload,
  PreparedChat,
} from './types';

const DEFAULT_MAX_INPUT_TOKENS = 6000;
const DEFAULT_MAX_OUTPUT_TOKENS = 900;
const GROQ_MAX_INPUT_TOKENS = readNumberEnv('GROQ_MAX_INPUT_TOKENS', DEFAULT_MAX_INPUT_TOKENS);
const GROQ_MAX_OUTPUT_TOKENS = readNumberEnv('GROQ_MAX_TOKENS', DEFAULT_MAX_OUTPUT_TOKENS);
let intentKeywordCache: string[] | null = null;

export async function preparePortfolioChat(payload: ChatRequestPayload): Promise<PreparedChat> {
  const query = getLatestUserMessageContent(payload.messages);
  const queryRewrite = rewriteQueryForRetrieval(payload.messages);
  const retrieval = await retrievePortfolioContext({
    query: queryRewrite,
    scope: payload.scope ?? 'portfolio',
    projectSlug: payload.projectSlug,
  });
  const context = formatRetrievedContext(retrieval.chunks);
  const history = trimHistory(payload.messages);
  const metadata = buildMetadata({
    query,
    messageCount: payload.messages.length,
    chunks: retrieval.chunks,
    representedProjects: retrieval.representedProjects,
    resolvedScope: retrieval.scope,
    retrievalMode: retrieval.mode,
    agentSteps: [
      {
        tool: 'search_projects',
        inputSummary: `search: "${queryRewrite}"`,
        chunkCount: retrieval.chunks.length,
      },
    ],
    queryRewrite,
  });

  return {
    metadata,
    messages: [
      {
        role: 'system',
        content: buildPortfolioAnswerSystemPrompt(),
      },
      {
        role: 'user',
        content: `Portfolio context:\n${context}\n\nConversation:\n${history}`,
      },
    ],
  };
}

export function formatMetadataPreamble(metadata: AssistantMetadata): string {
  return `[[PORTFOLIO_CHAT_METADATA]]${JSON.stringify(metadata)}[[/PORTFOLIO_CHAT_METADATA]]\n\n`;
}

export function buildPortfolioAnswerSystemPrompt(): string {
  const siteMetadata = getSiteMetadata();

  return [
    `You are the repository-grounded assistant for ${siteMetadata.name}'s portfolio.`,
    'Answer only from the provided portfolio context and the visible conversation.',
    'If the context does not support a claim, say what is missing instead of guessing.',
    'Use concise product-design language. Avoid generic portfolio filler.',
    'For concrete claims, cite evidence inline with [Project Title - Section].',
    'Label inferences clearly when you synthesize across sources.',
    'Do not invent biography, resume, contact, metrics, employers, or outcomes that are not in the context.',
    'Format every answer in Markdown with clear visual hierarchy.',
    'Start with a level-2 heading that names the answer, then use level-3 headings to separate major sections when the answer has multiple ideas.',
    'Do not use bold-only labels as section headings; use level-3 headings for section titles.',
    'Use bullets for evidence, tradeoffs, or grouped points, and numbered lists only for ordered flows or steps.',
    'Keep paragraphs short. Avoid returning one dense block of text unless the user explicitly asks for a one-sentence answer.',
    'When useful, include a concise Evidence or Sources section with inline repository citations.',
  ].join('\n');
}

export function buildMetadata(input: {
  query: string;
  messageCount: number;
  chunks: RetrievalChunk[];
  representedProjects: string[];
  resolvedScope: 'portfolio' | 'project';
  retrievalMode: RetrievalMode;
  agentSteps?: AgentStep[];
  queryRewrite?: string;
}): AssistantMetadata {
  const estimatedInputTokens = estimateTokens(
    `${input.query}\n${input.chunks.map((chunk) => chunk.content).join('\n')}`,
  );

  return {
    resolvedScope: input.resolvedScope,
    intent: classifyIntent(input.query),
    retrievalMode: input.retrievalMode,
    conversationStage:
      input.messageCount <= 1 ? 'opening' : input.messageCount > 6 ? 'deep_dive' : 'active',
    retrievedChunkCount: input.chunks.length,
    representedProjectCount: input.representedProjects.length,
    sourceReferences: input.chunks.map(toSourceReference),
    agentSteps: input.agentSteps ?? [],
    queryRewrite: input.queryRewrite,
    followUps: buildFollowUps(input.query, input.resolvedScope),
    tokenBudget: {
      maxInputTokens: GROQ_MAX_INPUT_TOKENS,
      estimatedInputTokens,
      maxOutputTokens: GROQ_MAX_OUTPUT_TOKENS,
    },
  };
}

export function formatRetrievedContext(chunks: RetrievalChunk[]): string {
  if (chunks.length === 0) {
    return 'No matching repository content was found.';
  }

  return chunks
    .map(
      (chunk) =>
        `[${chunk.projectTitle} - ${chunk.sectionTitle}]\nProject slug: ${chunk.projectSlug}\n${chunk.content}`,
    )
    .join('\n\n');
}

export function trimHistory(messages: ChatRequestPayload['messages'], maxTurns = 8): string {
  return messages
    .slice(-maxTurns)
    .map((message) => `${message.role}: ${message.content}`)
    .join('\n');
}

export function rewriteQueryForRetrieval(messages: ChatMessage[]): string {
  const latestUserMessage = getLatestUserMessageContent(messages);
  const previousTurns = messages
    .slice(0, -1)
    .slice(-6)
    .map((message) => `${message.role}: ${message.content}`)
    .join('\n');

  if (!previousTurns) {
    return latestUserMessage;
  }

  return [
    latestUserMessage,
    'Conversation context for resolving references:',
    previousTurns.slice(0, 1200),
  ].join('\n');
}

export function decomposeMultiPartQuery(query: string): string[] {
  const parts = query
    .split(/\b(?:and|also|plus|along with)\b|[?;]/i)
    .map((part) => part.trim())
    .filter((part) => part.length > 8);

  return parts.length > 1 ? Array.from(new Set(parts)) : [query.trim()].filter(Boolean);
}

export function getLatestUserMessageContent(messages: ChatMessage[]): string {
  return [...messages].reverse().find((message) => message.role === 'user')?.content ?? '';
}

export function classifyIntent(query: string): ChatIntent {
  const normalized = query.toLowerCase();

  if (/\b(contact|resume|email|linkedin|reach|github|available|availability)\b/.test(normalized)) {
    return 'contact_or_resume';
  }

  if (/\b(compare|across|which project|best shows|both|all projects|portfolio-wide)\b/.test(normalized)) {
    return 'comparison';
  }

  if (
    /\b(project|case study|checkout|design system|onboarding)\b/.test(normalized) ||
    getProjectIntentKeywords().some((keyword) => normalized.includes(keyword))
  ) {
    return 'project_deep_dive';
  }

  return 'overview';
}

function buildFollowUps(query: string, resolvedScope: 'portfolio' | 'project'): string[] {
  const followUps = getFollowUpConfig();
  if (resolvedScope === 'project') {
    return followUps.project;
  }

  if (query.toLowerCase().includes('design system')) {
    return followUps.designSystem;
  }

  return followUps.default;
}

function getProjectIntentKeywords(): string[] {
  if (intentKeywordCache && !shouldBypassContentCache()) {
    return intentKeywordCache;
  }

  intentKeywordCache = getAllProjects().flatMap((project) =>
    [
      project.title,
      project.slug,
      ...(project.tags ?? []),
      ...(project.stack ?? []),
      project.platform,
      project.outcome,
    ]
      .filter((value): value is string => Boolean(value))
      .flatMap((value) => tokenizeIntentKeyword(value)),
  );

  return intentKeywordCache;
}

function tokenizeIntentKeyword(value: string): string[] {
  const normalized = value.toLowerCase();
  const tokens = normalized
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);

  return Array.from(new Set([normalized, ...tokens]));
}

function toSourceReference(chunk: RetrievalChunk): SourceReference {
  return {
    id: chunk.id,
    sourceType: chunk.sourceType,
    sourceSlug: chunk.sourceSlug,
    sourceTitle: chunk.sourceTitle,
    projectSlug: chunk.projectSlug,
    projectTitle: chunk.projectTitle,
    sectionTitle: chunk.sectionTitle,
    score: chunk.score,
  };
}

function estimateTokens(value: string): number {
  return Math.ceil(value.length / 4);
}
