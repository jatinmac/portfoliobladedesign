export function readOptionalEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export function readEnv(name: string, fallback: string): string {
  return readOptionalEnv(name) ?? fallback;
}

export function readNumberEnv(name: string, fallback: number): number {
  const value = readOptionalEnv(name);
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
