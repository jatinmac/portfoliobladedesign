import { NextRequest, NextResponse } from 'next/server';

import { hashClientIp } from '../../../lib/analytics/server';
import { runPortfolioAgent } from '../../../lib/chat/agent';
import { formatMetadataPreamble } from '../../../lib/chat/prompt';
import { validateChatPayload } from '../../../lib/chat/validation';
import {
  GroqConfigurationError,
  GroqUpstreamError,
} from '../../../lib/groq/client';

export const runtime = 'nodejs';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 12;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
let nextRateLimitCleanupAt = Date.now() + RATE_LIMIT_WINDOW_MS;

export async function POST(request: NextRequest): Promise<Response> {
  if (!isSameOriginRequest(request)) {
    return jsonError('Cross-origin chat requests are not allowed.', 403);
  }

  const clientIp = getClientIp(request);
  const hashedIp = hashClientIp(clientIp);
  if (!consumeRateLimit(hashedIp)) {
    return jsonError('Too many chat requests. Please wait before trying again.', 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Request body must be valid JSON.', 400);
  }

  const validation = validateChatPayload(body);
  if (!validation.ok) {
    return jsonError(validation.error, validation.status);
  }

  if (!process.env.GROQ_API_KEY) {
    return jsonError('Chat is unavailable because GROQ_API_KEY is not configured.', 503);
  }

  try {
    const agentResult = await runPortfolioAgent(validation.payload);
    const encoder = new TextEncoder();

    const responseStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        controller.enqueue(encoder.encode(formatMetadataPreamble(agentResult.metadata)));

        try {
          for await (const chunk of agentResult.stream) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch {
          controller.enqueue(
            encoder.encode(
              '\n\nI could not complete the streamed response. Please retry this question.',
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(responseStream, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    if (error instanceof GroqConfigurationError) {
      return jsonError(error.message, 503);
    }

    if (error instanceof GroqUpstreamError) {
      return jsonError('The model provider could not complete the request.', mapUpstreamStatus(error.status));
    }

    return jsonError('Chat failed unexpectedly.', 500);
  }
}

function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) {
    return true;
  }

  const host = request.headers.get('host');
  if (!host) {
    return false;
  }

  return origin === `${request.nextUrl.protocol}//${host}`;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}

function consumeRateLimit(hashedIp: string): boolean {
  const now = Date.now();
  if (now >= nextRateLimitCleanupAt) {
    evictExpiredRateLimits(now);
    nextRateLimitCleanupAt = now + RATE_LIMIT_WINDOW_MS;
  }

  const current = rateLimitStore.get(hashedIp);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(hashedIp, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  current.count += 1;
  return true;
}

function evictExpiredRateLimits(now: number): void {
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

function mapUpstreamStatus(status: number): number {
  if (status === 401 || status === 403) {
    return 503;
  }

  if (status === 429) {
    return 429;
  }

  return 502;
}

function jsonError(error: string, status: number): NextResponse<{ error: string }> {
  return NextResponse.json({ error }, { status });
}
