import { afterEach, describe, expect, it, vi } from 'vitest';

describe('createGroqCompletionStream', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('uses defaults when optional Groq environment variables are blank', async () => {
    vi.stubEnv('GROQ_API_KEY', ' test-key ');
    vi.stubEnv('GROQ_BASE_URL', '');
    vi.stubEnv('GROQ_MODEL', '');
    vi.stubEnv('GROQ_MAX_TOKENS', '');
    vi.stubEnv('GROQ_TEMPERATURE', '');
    vi.stubEnv('GROQ_TIMEOUT_MS', '');
    vi.stubEnv('GROQ_REASONING_EFFORT', '');

    const fetchMock = vi.fn(async (_url: string, _init: RequestInit) => {
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          controller.close();
        },
      });

      return new Response(stream, { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const { createGroqCompletionStream } = await import('./client');

    await createGroqCompletionStream({
      messages: [{ role: 'user', content: 'Summarize the portfolio.' }],
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.groq.com/openai/v1/chat/completions');
    expect(init.headers).toEqual({
      Authorization: 'Bearer test-key',
      'Content-Type': 'application/json',
    });

    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body).toMatchObject({
      model: 'llama-3.3-70b-versatile',
      stream: true,
      max_tokens: 900,
      temperature: 0.2,
    });
    expect(body).not.toHaveProperty('reasoning_effort');
  });

  it('creates a non-streaming tool-call request', async () => {
    vi.stubEnv('GROQ_API_KEY', ' test-key ');
    vi.stubEnv('GROQ_BASE_URL', '');
    vi.stubEnv('GROQ_MODEL', '');

    const fetchMock = vi.fn(async (_url: string, _init: RequestInit) =>
      Response.json({
        choices: [
          {
            message: {
              content: null,
              tool_calls: [
                {
                  id: 'call-1',
                  type: 'function',
                  function: {
                    name: 'get_project_list',
                    arguments: '{}',
                  },
                },
              ],
            },
          },
        ],
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const { createGroqToolCallResponse } = await import('./client');

    const response = await createGroqToolCallResponse({
      messages: [{ role: 'user', content: 'Which projects exist?' }],
      tools: [
        {
          type: 'function',
          function: {
            name: 'get_project_list',
            description: 'Return projects.',
            parameters: {
              type: 'object',
              properties: {},
              additionalProperties: false,
            },
          },
        },
      ],
    });

    expect(response.toolCalls[0]?.function.name).toBe('get_project_list');
    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body).toMatchObject({
      stream: false,
      tool_choice: 'auto',
    });
    expect(body.tools).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'function',
        }),
      ]),
    );
  });
});
