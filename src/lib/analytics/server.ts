import { createHash } from 'node:crypto';

export function hashClientIp(ipAddress: string): string {
  return createHash('sha256').update(ipAddress).digest('hex');
}
