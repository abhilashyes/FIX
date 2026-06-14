import type {
  AdoptionId,
  AuthorityId,
  CategoryId,
  CountermeasureId,
  EventId,
  ISODateString,
  IssueId,
  LocalityId,
  PlaceId,
  PlanId,
  UserId,
} from './ids';
import type { GeoPoint, IssuePhoto } from './common';
import { ImageGenStatus, IssueStatus, Severity } from './enums';

/** "Show the fix" — before/after pair produced by imageService. */
export interface BeforeAfterPair {
  before: IssuePhoto;
  /** AI-generated; absent while Pending/Failed. */
  after?: IssuePhoto;
  status: ImageGenStatus;
  /** Which countermeasure proposal this after-image visualizes. */
  countermeasureId?: CountermeasureId;
  generatedAt?: ISODateString;
}

export interface StatusChange {
  from: IssueStatus | null;
  to: IssueStatus;
  at: ISODateString;
  byUserId?: UserId;
  note?: string;
}

/** Required at completion: before/after photos + a public resolution post. */
export interface ResolutionPost {
  summary: string;
  beforePhoto: IssuePhoto;
  afterPhoto: IssuePhoto;
  resolvedAt: ISODateString;
  resolvedByUserId?: UserId;
  fixItDayId?: EventId;
}

export interface Issue {
  id: IssueId;
  placeId: PlaceId;
  categoryId: CategoryId;
  title: string;
  description: string;
  severity: Severity;
  status: IssueStatus;

  location: GeoPoint;
  localityId: LocalityId;
  address?: string;

  /** Required current-situation photo. */
  beforePhoto: IssuePhoto;
  /** Free-text proposal at report time; formal proposals live in Countermeasure[]. */
  proposedCountermeasure?: string;
  /** "Show the fix" visualization. */
  beforeAfter?: BeforeAfterPair;

  reporterId: UserId;
  /** "affects me too" community (mirrors IssueUpvote[]). */
  affectedUserIds: UserId[];
  /** Denormalized for sorting/score. */
  upvoteCount: number;

  responsibleAuthorityId?: AuthorityId;
  mobilizationPlanId?: PlanId;
  /** Set if the location falls within an adopted area. */
  adoptionId?: AdoptionId;

  /** Present when Resolved/Closed. */
  resolution?: ResolutionPost;

  affectedPopulationEstimate: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  statusHistory: StatusChange[];
}
