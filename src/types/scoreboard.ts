import type { LocalityId, PlaceId } from './ids';

export interface ScoreboardEntry {
  reportedCount: number;
  resolvedCount: number;
  inProgressCount: number;
  avgResolutionDays: number | null;
  commitmentsCompleted: number;
  commitmentsNeedsAttention: number;
  /** 0–100 derived responsiveness indicator. */
  responsivenessScore: number;
}

export interface DepartmentScore extends ScoreboardEntry {
  department: string;
  placeId: PlaceId;
}

export interface CommunityScore extends ScoreboardEntry {
  localityId: LocalityId;
  activeMembers: number;
  pledgesFulfilled: number;
}
