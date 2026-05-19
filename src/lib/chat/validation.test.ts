import { describe, expect, it } from 'vitest';

import { validateChatPayload } from './validation';

describe('validateChatPayload', () => {
  it('rejects unsupported roles', () => {
    const result = validateChatPayload({
      messages: [{ role: 'system', content: 'Nope' }],
    });

    expect(result.ok).toBe(false);
  });

  it('accepts a portfolio user message', () => {
    const result = validateChatPayload({
      messages: [{ role: 'user', content: 'What projects are available?' }],
      scope: 'portfolio',
    });

    expect(result.ok).toBe(true);
  });
});
