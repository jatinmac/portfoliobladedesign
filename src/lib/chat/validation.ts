import { getProjectBySlug, isSafeProjectSlug } from '../content/projects';
import type { ChatMessage, ChatRequestPayload } from './types';

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

export type ValidationResult =
  | {
      ok: true;
      payload: Required<Pick<ChatRequestPayload, 'messages' | 'scope'>> &
        Pick<ChatRequestPayload, 'projectSlug'>;
    }
  | {
      ok: false;
      status: number;
      error: string;
    };

export function validateChatPayload(value: unknown): ValidationResult {
  if (!isRecord(value)) {
    return invalid('Request body must be a JSON object.');
  }

  if (!Array.isArray(value.messages)) {
    return invalid('Request body must include a messages array.');
  }

  if (value.messages.length === 0 || value.messages.length > MAX_MESSAGES) {
    return invalid(`Messages must include 1 to ${MAX_MESSAGES} turns.`);
  }

  const messages: ChatMessage[] = [];
  for (const message of value.messages) {
    if (!isRecord(message) || (message.role !== 'user' && message.role !== 'assistant')) {
      return invalid('Messages may only use user and assistant roles.');
    }

    if (typeof message.content !== 'string' || message.content.trim().length === 0) {
      return invalid('Message content must be a non-empty string.');
    }

    if (message.content.length > MAX_MESSAGE_LENGTH) {
      return invalid(`Each message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`);
    }

    messages.push({
      role: message.role,
      content: message.content.trim(),
    });
  }

  const scope = value.scope === 'project' ? 'project' : 'portfolio';
  const projectSlug = typeof value.projectSlug === 'string' ? value.projectSlug : undefined;

  if (scope === 'project') {
    if (!projectSlug) {
      return invalid('Project scope requires projectSlug.');
    }

    if (!isSafeProjectSlug(projectSlug)) {
      return invalid('Project slug must be lowercase kebab-case.');
    }

    if (!getProjectBySlug(projectSlug)) {
      return {
        ok: false,
        status: 404,
        error: 'Project not found.',
      };
    }
  }

  return {
    ok: true,
    payload: {
      messages,
      scope,
      projectSlug,
    },
  };
}

function invalid(error: string): ValidationResult {
  return {
    ok: false,
    status: 400,
    error,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
