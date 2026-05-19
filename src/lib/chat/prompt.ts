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
const DEFAULT_MAX_OUTPUT_TOKENS = 1400;
const GROQ_MAX_INPUT_TOKENS = readNumberEnv('GROQ_MAX_INPUT_TOKENS', DEFAULT_MAX_INPUT_TOKENS);
const GROQ_MAX_OUTPUT_TOKENS = readNumberEnv('GROQ_MAX_TOKENS', DEFAULT_MAX_OUTPUT_TOKENS);
let intentKeywordCache: string[] | null = null;

export async function preparePortfolioChat(payload: ChatRequestPayload): Promise<PreparedChat> {
  const query = getLatestUserMessageContent(payload.messages);
  const queryRewrite = rewriteQueryForRetrieval(payload.messages);
  const intent = classifyIntent(query);
  const conversationStage = getConversationStage(payload.messages.length);
  const retrieval = await retrievePortfolioContext({
    query: queryRewrite,
    scope: payload.scope ?? 'portfolio',
    projectSlug: payload.projectSlug,
    maxChunks: intent === 'comparison' ? 10 : undefined,
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
        content: buildPortfolioAnswerSystemPrompt({ intent, conversationStage }),
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

export function buildPortfolioAnswerSystemPrompt(input: {
  intent?: ChatIntent;
  conversationStage?: AssistantMetadata['conversationStage'];
} = {}): string {
  const siteMetadata = getSiteMetadata();
  const intent = input.intent ?? 'overview';
  const conversationStage = input.conversationStage ?? 'active';

  return [
    `You represent ${siteMetadata.name}'s portfolio in conversation.`,
    'Speak like a knowledgeable teammate who can explain the work, the product thinking, and why it matters.',
    'Visitors are usually hiring managers, design leaders, founders, or peers evaluating product-design capability.',
    'Answer only from the provided portfolio context and the visible conversation.',
    'If the context does not support a claim, say what is missing instead of guessing.',
    'Use warm, specific, evidence-based product-design language. Replace generic praise with concrete examples from projects, pages, or resume content.',
    'For concrete claims, cite evidence inline with [Project Title - Section] or [Page Title - Section].',
    'When a question spans multiple projects, synthesize the thread across architecture, automotive HMI, AI product work, self-initiated building, and audience-building only when those sources are present.',
    'Use Jatin naturally in third person. Do not pretend to be Jatin or invent first-person claims.',
    'Label inferences clearly when synthesizing across sources.',
    'Do not invent biography, resume, contact, metrics, employers, or outcomes that are not in the context.',
    ...buildStageInstructions(conversationStage),
    ...buildIntentInstructions(intent),
    'Format in Markdown, but adapt the structure to the question. Short factual questions should be concise. Deeper questions can use a level-2 heading and level-3 sections.',
    'Use bullets for evidence, tradeoffs, or grouped points, and numbered lists only for ordered flows or steps.',
    'Keep paragraphs short. Do not add a Sources section unless it materially improves trust; citations inline are usually enough.',
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

  const intent = classifyIntent(input.query);
  const conversationStage = getConversationStage(input.messageCount);

  return {
    resolvedScope: input.resolvedScope,
    intent,
    retrievalMode: input.retrievalMode,
    conversationStage,
    retrievedChunkCount: input.chunks.length,
    representedProjectCount: input.representedProjects.length,
    sourceReferences: input.chunks.map(toSourceReference),
    agentSteps: input.agentSteps ?? [],
    queryRewrite: input.queryRewrite,
    followUps: buildFollowUps(input.query, input.resolvedScope, input.chunks, intent),
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

function buildFollowUps(
  query: string,
  resolvedScope: 'portfolio' | 'project',
  chunks: RetrievalChunk[] = [],
  intent: ChatIntent = classifyIntent(query),
): string[] {
  const followUps = getFollowUpConfig();
  const mentionedProjects = Array.from(
    new Set(chunks.filter((chunk) => chunk.sourceType === 'project').map((chunk) => chunk.projectTitle)),
  ).slice(0, 2);

  if (mentionedProjects.length > 0) {
    const [primaryProject, secondaryProject] = mentionedProjects;
    if (intent === 'comparison' && secondaryProject) {
      return [
        `How do ${primaryProject} and ${secondaryProject} show different strengths?`,
        `Which project best shows Jatin's product thinking?`,
        'What evidence would a hiring manager care about most?',
      ];
    }

    return [
      `What tradeoffs shaped ${primaryProject}?`,
      `What does ${primaryProject} show about Jatin's design process?`,
      `How did ${primaryProject} affect users or product outcomes?`,
    ];
  }

  if (resolvedScope === 'project') {
    return followUps.project;
  }

  if (query.toLowerCase().includes('design system')) {
    return followUps.designSystem;
  }

  return followUps.default;
}

function getConversationStage(messageCount: number): AssistantMetadata['conversationStage'] {
  if (messageCount <= 1) {
    return 'opening';
  }

  return messageCount > 6 ? 'deep_dive' : 'active';
}

function buildStageInstructions(stage: AssistantMetadata['conversationStage']): string[] {
  if (stage === 'opening') {
    return [
      'For opening questions, be welcoming and orient the visitor quickly before offering specific project paths.',
      'Avoid overloading the first response with every available detail.',
    ];
  }

  if (stage === 'deep_dive') {
    return [
      'For deep-dive questions, increase evidence density and connect decisions, constraints, and outcomes explicitly.',
      'Preserve nuance when the context is thin or an outcome is not quantified.',
    ];
  }

  return ['For active conversations, answer directly and keep continuity with the previous turn.'];
}

function buildIntentInstructions(intent: ChatIntent): string[] {
  switch (intent) {
    case 'contact_or_resume':
      return [
        'For contact or resume questions, answer briefly with the exact repository-owned contact or resume details available.',
      ];
    case 'comparison':
      return [
        'For comparisons, make the connecting thread explicit and use a compact table or bullets when it helps scanning.',
      ];
    case 'project_deep_dive':
      return [
        'For project deep-dives, prioritize problem, role, design decisions, constraints, and outcome evidence.',
      ];
    case 'overview':
    default:
      return [
        'For overview questions, give a clear portfolio-level read and name the best project examples to inspect next.',
      ];
  }
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
