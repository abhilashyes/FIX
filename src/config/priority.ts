import type { PriorityWeights } from '@/lib/priorityScore';

/** Caps so no single factor dominates the composite priority score. */
export const PRIORITY_CAPS = {
  upvotes: 200,
  ageDays: 120,
  population: 20000,
} as const;

/** Default weights — tuned so a typical score lands in roughly 0–100. */
export const DEFAULT_PRIORITY_WEIGHTS: PriorityWeights = {
  upvotes: 0.18,
  severity: 8,
  age: 0.18,
  population: 0.0018,
};

/** SLA aging thresholds per status, in days (used by the Civic Body View). */
export const SLA_THRESHOLD_DAYS: Record<string, number> = {
  Reported: 3,
  Verified: 7,
  Prioritized: 10,
  InProgress: 30,
  Resolved: 0,
  Closed: 0,
};
