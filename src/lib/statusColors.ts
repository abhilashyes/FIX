import { CommitmentStatus, IssueStatus, Severity } from '@/types';

/** Semantic status colours (hex mirrors the Tailwind theme; used in badges, timeline, pins). */
export const STATUS_COLOR: Readonly<Record<IssueStatus, string>> = {
  [IssueStatus.Reported]: '#6B7280',
  [IssueStatus.Verified]: '#2563EB',
  [IssueStatus.Prioritized]: '#D97706',
  [IssueStatus.InProgress]: '#7C3AED',
  [IssueStatus.Resolved]: '#16A34A',
  [IssueStatus.Closed]: '#4B5563',
};

export const SEVERITY_COLOR: Readonly<Record<Severity, string>> = {
  [Severity.Low]: '#16A34A',
  [Severity.Medium]: '#D97706',
  [Severity.High]: '#EA580C',
  [Severity.Critical]: '#DC2626',
};

/** Neutral, partnership-first commitment status colours. */
export const COMMITMENT_COLOR: Readonly<Record<CommitmentStatus, string>> = {
  [CommitmentStatus.Completed]: '#16A34A',
  [CommitmentStatus.OnTrack]: '#2563EB',
  [CommitmentStatus.NeedsAttention]: '#D97706',
};
