import type {
  CommentId,
  CountermeasureId,
  ISODateString,
  IssueId,
  UserId,
  VoteId,
} from './ids';
import type { Money } from './common';
import { VoteKind } from './enums';

export interface Comment {
  id: CommentId;
  issueId: IssueId;
  authorId: UserId;
  /** null = top-level; enables threading. */
  parentId: CommentId | null;
  body: string;
  createdAt: ISODateString;
  upvoteCount: number;
}

/** First-class proposal object (distinct from Issue.proposedCountermeasure free-text). */
export interface Countermeasure {
  id: CountermeasureId;
  issueId: IssueId;
  authorId: UserId;
  title: string;
  description: string;
  estimatedCost?: Money;
  /** Denormalized vote tallies. */
  wouldWorkCount: number;
  wouldNotWorkCount: number;
  /** Marked when chosen by the community as the agreed solution. */
  accepted: boolean;
  createdAt: ISODateString;
}

/** Vote on a countermeasure (Would work / Wouldn't work + reason). */
export interface Vote {
  id: VoteId;
  countermeasureId: CountermeasureId;
  voterId: UserId;
  kind: VoteKind;
  reason?: string;
  createdAt: ISODateString;
}

/** Upvote an issue ("affects me too" → joins the affected community). */
export interface IssueUpvote {
  issueId: IssueId;
  userId: UserId;
  createdAt: ISODateString;
}
