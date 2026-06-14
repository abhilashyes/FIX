/** Simulated network latency so the mock layer feels like a real async backend. */
const BASE_MS = 120;
const JITTER_MS = 180;

export function withLatency<T>(value: T, ms?: number): Promise<T> {
  const delay = ms ?? BASE_MS + Math.random() * JITTER_MS;
  return new Promise((resolve) => setTimeout(() => resolve(value), delay));
}

/** Clone so callers cannot mutate the in-memory store by reference. */
export function clone<T>(value: T): T {
  return typeof structuredClone === 'function'
    ? structuredClone(value)
    : (JSON.parse(JSON.stringify(value)) as T);
}
