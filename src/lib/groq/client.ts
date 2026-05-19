import { readEnv, readNumberEnv, readOptionalEnv } from '../env';

export type GroqToolCall = {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
};

export type GroqMessage =
  | {
      role: 'system' | 'user';
      content: string;
    }
  | {
      role: 'assistant';
      content?: string | null;
      tool_calls?: GroqToolCall[];
    }
  | {
      role: 'tool';
      tool_call_id: string;
      content: string;
    };

export type GroqTool = {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, unknown>;
      required?: string[];
      additionalProperties?: boolean;
    };
  };
};

export type GroqStreamOptions = {
  messages: GroqMessage[];
};

export type GroqToolCallOptions = {
  messages: GroqMessage[];
  tools: GroqTool[];
  maxTokens?: number;
  temperature?: number;
};

export type GroqToolCallResponse = {
  content: string;
  toolCalls: GroqToolCall[];
};

export class GroqConfigurationError extends Error {}

export class GroqUpstreamError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const DEFAULT_BASE_URL = 'https://api.groq.com/openai/v1';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
const DEFAULT_TIMEOUT_MS = 30000;
const DEFAULT_RETRY_COUNT = 2;
const DEFAULT_RETRY_BACKOFF_MS = 350;
const GROQ_API_KEY = readOptionalEnv('GROQ_API_KEY');
const GROQ_RETRY_COUNT = readNumberEnv('GROQ_RETRY_COUNT', DEFAULT_RETRY_COUNT);
const GROQ_RETRY_BACKOFF_MS = readNumberEnv('GROQ_RETRY_BACKOFF_MS', DEFAULT_RETRY_BACKOFF_MS);
const GROQ_TIMEOUT_MS = readNumberEnv('GROQ_TIMEOUT_MS', DEFAULT_TIMEOUT_MS);
const GROQ_BASE_URL = readEnv('GROQ_BASE_URL', DEFAULT_BASE_URL);
const GROQ_MODEL = readEnv('GROQ_MODEL', DEFAULT_MODEL);
const GROQ_MAX_TOKENS = readNumberEnv('GROQ_MAX_TOKENS', 1400);
const GROQ_TEMPERATURE = readNumberEnv('GROQ_TEMPERATURE', 0.2);
const GROQ_REASONING_EFFORT = readOptionalEnv('GROQ_REASONING_EFFORT');

export async function createGroqCompletionStream(
  options: GroqStreamOptions,
): Promise<AsyncIterable<string>> {
  const apiKey = GROQ_API_KEY;
  if (!apiKey) {
    throw new GroqConfigurationError('GROQ_API_KEY is not configured.');
  }

  const response = await fetchWithRetry(apiKey, buildGroqRequestBody({
    messages: options.messages,
    stream: true,
    maxTokens: GROQ_MAX_TOKENS,
    temperature: GROQ_TEMPERATURE,
  }));
  return parseOpenAICompatibleStream(response);
}

export async function createGroqToolCallResponse(
  options: GroqToolCallOptions,
): Promise<GroqToolCallResponse> {
  const apiKey = GROQ_API_KEY;
  if (!apiKey) {
    throw new GroqConfigurationError('GROQ_API_KEY is not configured.');
  }

  const response = await fetchWithRetry(apiKey, buildGroqRequestBody({
    messages: options.messages,
    stream: false,
    maxTokens: options.maxTokens ?? 500,
    temperature: options.temperature ?? 0.1,
    tools: options.tools,
  }));
  const parsed = await response.json() as {
    choices?: Array<{
      message?: {
        content?: string | null;
        tool_calls?: GroqToolCall[];
      };
    }>;
  };
  const message = parsed.choices?.[0]?.message;

  if (!message) {
    throw new GroqUpstreamError(502, 'Groq response did not include a message.');
  }

  return {
    content: message.content ?? '',
    toolCalls: message.tool_calls ?? [],
  };
}

async function fetchWithRetry(apiKey: string, body: Record<string, unknown>): Promise<Response> {
  const retryCount = GROQ_RETRY_COUNT;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retryCount; attempt += 1) {
    try {
      const response = await fetchGroq(apiKey, body);

      if (!isRetryableStatus(response.status)) {
        if (!response.ok) {
          throw new GroqUpstreamError(response.status, await response.text());
        }

        return response;
      }

      lastError = new GroqUpstreamError(response.status, await response.text());
    } catch (error) {
      lastError = error;
      if (error instanceof GroqConfigurationError) {
        throw error;
      }
    }

    if (attempt < retryCount) {
      await sleep(GROQ_RETRY_BACKOFF_MS * (attempt + 1));
    }
  }

  if (lastError instanceof GroqUpstreamError) {
    throw lastError;
  }

  throw new GroqUpstreamError(502, 'Groq upstream request failed.');
}

function buildGroqRequestBody(input: {
  messages: GroqMessage[];
  stream: boolean;
  maxTokens: number;
  temperature: number;
  tools?: GroqTool[];
}): Record<string, unknown> {
  return {
    model: GROQ_MODEL,
    messages: input.messages,
    stream: input.stream,
    max_tokens: input.maxTokens,
    temperature: input.temperature,
    reasoning_effort: GROQ_REASONING_EFFORT,
    tools: input.tools,
    tool_choice: input.tools ? 'auto' : undefined,
  };
}

async function fetchGroq(apiKey: string, body: Record<string, unknown>): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);

  try {
    return await fetch(`${GROQ_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function* parseOpenAICompatibleStream(response: Response): AsyncIterable<string> {
  if (!response.body) {
    throw new GroqUpstreamError(502, 'Groq response did not include a stream body.');
  }

  const decoder = new TextDecoder();
  const reader = response.body.getReader();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine.startsWith('data:')) {
        continue;
      }

      const payload = trimmedLine.slice('data:'.length).trim();
      if (payload === '[DONE]') {
        return;
      }

      const parsed = JSON.parse(payload) as {
        choices?: Array<{ delta?: { content?: string } }>;
      };
      const content = parsed.choices?.[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
