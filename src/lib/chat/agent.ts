import {
  createGroqCompletionStream,
  createGroqToolCallResponse,
  type GroqMessage,
  type GroqToolCall,
} from '../groq/client';
import type { PortfolioPage } from '../content/pages';
import type { RetrievalChunk, RetrievalMode, RetrievalScope } from '../rag/types';
import {
  buildMetadata,
  buildPortfolioAnswerSystemPrompt,
  classifyIntent,
  decomposeMultiPartQuery,
  getLatestUserMessageContent,
  rewriteQueryForRetrieval,
  trimHistory,
} from './prompt';
import {
  executePortfolioTool,
  portfolioToolDefinitions,
  type PortfolioToolExecution,
} from './tools';
import type { AssistantMetadata, ChatRequestPayload } from './types';

export const MAX_AGENT_STEPS = 3;

const MAX_TOOL_CALLS_PER_STEP = 4;
const MAX_TOOL_RESULT_CHARS = 6000;
const FINAL_CONTEXT_CHAR_LIMIT = 16000;

export type PortfolioAgentResult = {
  metadata: AssistantMetadata;
  stream: AsyncIterable<string>;
};

export async function runPortfolioAgent(
  payload: ChatRequestPayload,
): Promise<PortfolioAgentResult> {
  const latestQuery = getLatestUserMessageContent(payload.messages);
  const queryRewrite = rewriteQueryForRetrieval(payload.messages);
  const planningMessages = buildPlanningMessages(payload, queryRewrite);
  const executions: PortfolioToolExecution[] = [];

  for (let step = 0; step < MAX_AGENT_STEPS; step += 1) {
    const response = await createGroqToolCallResponse({
      messages: planningMessages,
      tools: portfolioToolDefinitions,
      maxTokens: 600,
      temperature: 0,
    });

    if (response.toolCalls.length === 0) {
      break;
    }

    const toolCalls = response.toolCalls.slice(0, MAX_TOOL_CALLS_PER_STEP);
    planningMessages.push({
      role: 'assistant',
      content: response.content || null,
      tool_calls: toolCalls,
    });

    for (const toolCall of toolCalls) {
      const execution = await executeToolCall(toolCall, payload, queryRewrite);
      executions.push(execution);
      planningMessages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: truncateToolResult(execution.content),
      });
    }
  }

  if (executions.length === 0) {
    executions.push(...(await runFallbackRetrieval(payload, latestQuery, queryRewrite)));
  }

  const chunks = uniqueChunks(executions.flatMap((execution) => execution.chunks));
  const metadata = buildMetadata({
    query: latestQuery,
    messageCount: payload.messages.length,
    chunks,
    representedProjects: Array.from(new Set(chunks.map((chunk) => chunk.projectSlug))),
    resolvedScope: resolveMetadataScope(payload, executions),
    retrievalMode: resolveRetrievalMode(executions),
    agentSteps: executions.map((execution) => ({
      tool: execution.tool,
      inputSummary: execution.inputSummary,
      chunkCount: execution.chunks.length,
    })),
    queryRewrite: queryRewrite === latestQuery ? undefined : queryRewrite,
  });
  const stream = await createGroqCompletionStream({
    messages: buildFinalAnswerMessages(payload, executions, latestQuery),
  });

  return {
    metadata,
    stream,
  };
}

function buildPlanningMessages(payload: ChatRequestPayload, queryRewrite: string): GroqMessage[] {
  return [
    {
      role: 'system',
      content: [
        'You plan retrieval for a repository-grounded portfolio chat assistant.',
        'Use only the provided tools. They read checked-in project markdown and static page content.',
        'Do not use external search, browser knowledge, or unsupported biography.',
        'Call tools before answering factual questions.',
        'Use get_project_list when a query asks across projects or when the right slug is unclear.',
        'Use get_page_content for contact, resume, about, experience, or home questions.',
        'Use search_projects for project details, comparisons, design process, outcomes, and vague follow-ups.',
        `Stop after enough evidence is gathered. The hard maximum is ${MAX_AGENT_STEPS} planning steps.`,
      ].join('\n'),
    },
    {
      role: 'user',
      content: [
        `Current scope: ${payload.scope ?? 'portfolio'}`,
        payload.projectSlug ? `Current project slug: ${payload.projectSlug}` : null,
        `Conversation:\n${trimHistory(payload.messages)}`,
        `Context-aware retrieval query:\n${queryRewrite}`,
      ]
        .filter(Boolean)
        .join('\n\n'),
    },
  ];
}

async function executeToolCall(
  toolCall: GroqToolCall,
  payload: ChatRequestPayload,
  queryRewrite: string,
): Promise<PortfolioToolExecution> {
  const args = parseToolArguments(toolCall.function.arguments);

  if (toolCall.function.name === 'search_projects' && !args.query) {
    args.query = queryRewrite;
  }

  return executePortfolioTool({
    tool: toolCall.function.name,
    args,
    payload,
    remainingTokenBudget: 4500,
  });
}

async function runFallbackRetrieval(
  payload: ChatRequestPayload,
  latestQuery: string,
  queryRewrite: string,
): Promise<PortfolioToolExecution[]> {
  const page = inferPageTool(latestQuery);

  if (page) {
    return [
      await executePortfolioTool({
        tool: 'get_page_content',
        args: { page },
        payload,
      }),
    ];
  }

  if (/\b(profile|who is|about jatin|overview|summary)\b/i.test(latestQuery)) {
    return [
      await executePortfolioTool({
        tool: 'get_site_profile',
        args: {},
        payload,
      }),
    ];
  }

  const queryParts = decomposeMultiPartQuery(latestQuery);
  const queries = (queryParts.length > 1 ? queryParts : [queryRewrite]).slice(0, 2);
  return Promise.all(
    queries.map((query) =>
      executePortfolioTool({
        tool: 'search_projects',
        args: { query },
        payload,
        remainingTokenBudget: 4500,
      }),
    ),
  );
}

function buildFinalAnswerMessages(
  payload: ChatRequestPayload,
  executions: PortfolioToolExecution[],
  latestQuery: string,
): GroqMessage[] {
  const gatheredContext = truncateFinalContext(
    executions.map((execution) => execution.content).join('\n\n'),
  );

  return [
    {
      role: 'system',
      content: buildPortfolioAnswerSystemPrompt({
        intent: classifyIntent(latestQuery),
        conversationStage:
          payload.messages.length <= 1 ? 'opening' : payload.messages.length > 6 ? 'deep_dive' : 'active',
      }),
    },
    {
      role: 'user',
      content: [
        `Visible conversation:\n${trimHistory(payload.messages)}`,
        `Portfolio context gathered by tools:\n${gatheredContext}`,
        `Answer the latest user question:\n${latestQuery}`,
      ].join('\n\n'),
    },
  ];
}

function resolveMetadataScope(
  payload: ChatRequestPayload,
  executions: PortfolioToolExecution[],
): RetrievalScope {
  return (
    [...executions].reverse().find((execution) => execution.resolvedScope)?.resolvedScope ??
    payload.scope ??
    'portfolio'
  );
}

function resolveRetrievalMode(executions: PortfolioToolExecution[]): RetrievalMode {
  return 'lexical';
}

function uniqueChunks(chunks: RetrievalChunk[]): RetrievalChunk[] {
  const seen = new Set<string>();
  const unique: RetrievalChunk[] = [];

  chunks.forEach((chunk) => {
    if (seen.has(chunk.id)) {
      return;
    }

    seen.add(chunk.id);
    unique.push(chunk);
  });

  return unique;
}

function parseToolArguments(value: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(value) as unknown;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : {};
  } catch {
    return {};
  }
}

function inferPageTool(query: string): PortfolioPage | null {
  const normalized = query.toLowerCase();

  if (/\b(contact|email|linkedin|github|reach)\b/.test(normalized)) {
    return 'contact';
  }

  if (/\b(resume|cv|highlights)\b/.test(normalized)) {
    return 'resume';
  }

  if (/\b(experience|work history|background)\b/.test(normalized)) {
    return 'experience';
  }

  if (/\b(about|bio|who is)\b/.test(normalized)) {
    return 'about';
  }

  return null;
}

function truncateToolResult(value: string): string {
  return value.length > MAX_TOOL_RESULT_CHARS
    ? `${value.slice(0, MAX_TOOL_RESULT_CHARS)}\n[Tool result truncated]`
    : value;
}

function truncateFinalContext(value: string): string {
  return value.length > FINAL_CONTEXT_CHAR_LIMIT
    ? `${value.slice(0, FINAL_CONTEXT_CHAR_LIMIT)}\n[Portfolio context truncated]`
    : value;
}
