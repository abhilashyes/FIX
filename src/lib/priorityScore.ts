import type { PriorityBreakdown } from '@/types';
import { Severity, SEVERITY_WEIGHT } from '@/types';
import type { IssueId } from '@/types';
import { DEFAULT_PRIORITY_WEIGHTS, PRIORITY_CAPS } from '@/config/priority';

export interface PriorityWeights {
  /** Per upvote (capped). */
  upvotes: number;
  /** Multiplies SEVERITY_WEIGHT (1..4). */
  severity: number;
  /** Per day open (capped). */
  age: number;
  /** Per affected person (capped). */
  population: number;
}

export interface PriorityInputs {
  issueId: IssueId;
  upvoteCount: number;
  severity: Severity;
  /** Days since createdAt (treat as 0 once Resolved/Closed). */
  ageDays: number;
  affectedPopulationEstimate: number;
}

const round1 = (n: number): number => Math.round(n * 10) / 10;

/**
 * Composite priority score (higher = more urgent). Each component is capped, weighted and
 * summed. Returns the total plus a per-component breakdown and a human-readable formula
 * string for the transparency UI:
 *
 *   score = w_up·min(upvotes, UP_CAP)
 *         + w_sev·severityWeight(severity)       // Low 1, Med 2, High 3, Critical 4
 *         + w_age·min(ageDays, AGE_CAP)
 *         + w_pop·min(affectedPopulation, POP_CAP)
 */
export function computePriorityScore(
  inputs: PriorityInputs,
  weights: PriorityWeights = DEFAULT_PRIORITY_WEIGHTS,
): PriorityBreakdown {
  const upvotes = Math.min(inputs.upvoteCount, PRIORITY_CAPS.upvotes);
  const severityWeight = SEVERITY_WEIGHT[inputs.severity];
  const age = Math.min(inputs.ageDays, PRIORITY_CAPS.ageDays);
  const population = Math.min(inputs.affectedPopulationEstimate, PRIORITY_CAPS.population);

  const upvotesComponent = round1(weights.upvotes * upvotes);
  const severityComponent = round1(weights.severity * severityWeight);
  const ageComponent = round1(weights.age * age);
  const populationComponent = round1(weights.population * population);

  const total = round1(
    upvotesComponent + severityComponent + ageComponent + populationComponent,
  );

  const formula =
    `${weights.upvotes}×upvotes + ${weights.severity}×severity + ` +
    `${weights.age}×ageDays + ${weights.population}×peopleAffected`;

  return {
    issueId: inputs.issueId,
    upvotesComponent,
    severityComponent,
    ageComponent,
    populationComponent,
    total,
    formula,
  };
}
