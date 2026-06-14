import type {
  EventId,
  ISODateString,
  IssueId,
  NeedId,
  OrgId,
  PledgeId,
  PlanId,
  UserId,
} from './ids';
import type { GeoPoint, Money } from './common';
import { NeedKind, PledgeKind } from './enums';

export interface MobilizationPlan {
  id: PlanId;
  issueId: IssueId;
  title: string;
  description: string;
  createdById: UserId;
  needIds: NeedId[];
  fixItDayIds: EventId[];
  createdAt: ISODateString;
}

export interface Need {
  id: NeedId;
  planId: PlanId;
  kind: NeedKind;
  label: string;
  /** For NeedKind.Volunteers. */
  requiredSkills?: string[];
  /** People | units | hours, depending on kind. */
  targetQuantity: number;
  /** For NeedKind.Funds. */
  fundsTarget?: Money;
  /** Denormalized progress. */
  fulfilledQuantity: number;
  fundsRaised?: Money;
}

export interface Pledge {
  id: PledgeId;
  needId: NeedId;
  planId: PlanId;
  pledgerId: UserId;
  /** Org-backed pledge. */
  pledgerOrgId?: OrgId;
  kind: PledgeKind;
  /** Hours | units. */
  quantity: number;
  /** For PledgeKind.Money. */
  amount?: Money;
  fulfilled: boolean;
  createdAt: ISODateString;
}

export type RsvpStatus = 'going' | 'maybe' | 'declined';

export interface Attendee {
  userId: UserId;
  orgId?: OrgId;
  rsvp: RsvpStatus;
  checkedIn: boolean;
}

export interface FixItDay {
  id: EventId;
  planId: PlanId;
  issueId: IssueId;
  title: string;
  date: ISODateString;
  meetingPoint: GeoPoint;
  meetingPointLabel: string;
  attendees: Attendee[];
  createdAt: ISODateString;
}
