import type { CategoryId, IssueId, LocalityId, PlaceId } from './ids';
import type { GeoPoint } from './common';
import { IssueStatus, Severity } from './enums';

export interface PriorityBreakdown {
  issueId: IssueId;
  upvotesComponent: number;
  severityComponent: number;
  ageComponent: number;
  populationComponent: number;
  /** Weighted sum. */
  total: number;
  /** Human-readable formula string for the transparency UI. */
  formula: string;
}

export interface FunnelBucket {
  status: IssueStatus;
  count: number;
}

export interface TrendPoint {
  /** e.g. "2026-01". */
  month: string;
  reported: number;
  resolved: number;
}

export interface HeatmapCell {
  localityId: LocalityId;
  localityName: string;
  center: GeoPoint;
  issueCount: number;
  /** Sum of priority scores in the locality. */
  weightedScore: number;
}

export interface SlaAging {
  issueId: IssueId;
  status: IssueStatus;
  daysInStatus: number;
  slaThresholdDays: number;
  breached: boolean;
}

export interface DashboardFilters {
  placeId: PlaceId;
  localityIds?: LocalityId[];
  categoryIds?: CategoryId[];
  severities?: Severity[];
  statuses?: IssueStatus[];
  /** Civic Body View toggle. */
  civicBodyView: boolean;
}
