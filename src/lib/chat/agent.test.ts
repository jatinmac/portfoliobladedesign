import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createGroqCompletionStream, createGroqToolCallResponse } from '../groq/client';
import { MAX_AGENT_STEPS, runPortfolioAgent } from './agent';

vi.mock('../groq/client', () => ({
  createGroqCompletionStream: vi.fn(),
  createGroqToolCallResponse: vi.fn(),
}));

const createGroqCompletionStreamMock = vi.mocked(createGroqCompletionStream);
const createGroqToolCallResponseMock = vi.mocked(createGroqToolCallResponse);

describe('runPortfolioAgent', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    createGroqCompletionStreamMock.mockResolvedValue(streamFrom('## Grounded answer'));
  });

  it('executes Groq tool calls before creating the final stream', async () => {
    createGroqToolCallResponseMock
      .mockResolvedValueOnce({
        content: '',
        toolCalls: [
          {
            id: 'call-project-list',
            type: 'function',
            function: {
              name: 'get_project_list',
              arguments: '{}',
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        content: 'Enough evidence gathered.',
        toolCalls: [],
      });

    const result = await runPortfolioAgent({
      messages: [{ role: 'user', content: 'Which projects should I compare?' }],
      scope: 'portfolio',
    });

    await expect(readStream(result.stream)).resolves.toBe('## Grounded answer');
    expect(result.metadata.agentSteps).toEqual([
      {
        tool: 'get_project_list',
        inputSummary: 'project list',
        chunkCount: 0,
      },
    ]);
    expect(createGroqCompletionStreamMock).toHaveBeenCalledOnce();
    const [{ messages }] = createGroqCompletionStreamMock.mock.calls[0];
    expect(messages.at(-1)?.content).toContain('[Tool: get_project_list]');
  });

  it('falls back to a deterministic page tool when the model returns no tool calls', async () => {
    createGroqToolCallResponseMock.mockResolvedValue({
      content: 'I can answer directly.',
      toolCalls: [],
    });

    const result = await runPortfolioAgent({
      messages: [{ role: 'user', content: 'How can I contact Jatin?' }],
      scope: 'portfolio',
    });

    expect(result.metadata.agentSteps[0]).toEqual(
      expect.objectContaining({
        tool: 'get_page_content',
        inputSummary: 'page: contact',
      }),
    );
    expect(result.metadata.sourceReferences.some((source) => source.sourceSlug === 'page-contact'))
      .toBe(true);
  });

  it('caps repeated tool planning at the max agent steps', async () => {
    createGroqToolCallResponseMock.mockResolvedValue({
      content: '',
      toolCalls: [
        {
          id: 'call-project-list',
          type: 'function',
          function: {
            name: 'get_project_list',
            arguments: '{}',
          },
        },
      ],
    });

    const result = await runPortfolioAgent({
      messages: [{ role: 'user', content: 'Compare everything.' }],
      scope: 'portfolio',
    });

    expect(createGroqToolCallResponseMock).toHaveBeenCalledTimes(MAX_AGENT_STEPS);
    expect(result.metadata.agentSteps).toHaveLength(MAX_AGENT_STEPS);
  });
});

async function* streamFrom(value: string): AsyncIterable<string> {
  yield value;
}

async function readStream(stream: AsyncIterable<string>): Promise<string> {
  let result = '';
  for await (const chunk of stream) {
    result += chunk;
  }

  return result;
}
