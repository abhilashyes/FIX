import type { Issue, PriorityBreakdown } from '@/types';
import { IssueStatus } from '@/types';
import { computePriorityScore } from './priorityScore';
import { daysSince } from './format';

/** Convenience: compute the transparent priority breakdown directly from an Issue. */
export function computeIssuePriority(issue: Issue): PriorityBreakdown {
  const ageDays =
    issue.status === IssueStatus.Resolved || issue.status === IssueStatus.Closed
      ? 0
      : daysSince(issue.createdAt);
  return computePriorityScore({
    issueId: issue.id,
    upvoteCount: issue.upvoteCount,
    severity: issue.severity,
    ageDays,
    affectedPopulationEstimate: issue.affectedPopulationEstimate,
  });
}
