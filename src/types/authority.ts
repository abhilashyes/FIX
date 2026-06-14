import type {
  AuthorityId,
  CategoryId,
  CommitmentId,
  EngagementId,
  ISODateString,
  IssueId,
  LocalityId,
  OfficialId,
  PlaceId,
  RoleId,
  UserId,
} from './ids';
import { CommitmentStatus, EngagementKind } from './enums';

/** Responsible authority (department + role) for an issue's category + locality. */
export interface Authority {
  id: AuthorityId;
  placeId: PlaceId;
  department: string;
  /** Role/title, e.g. "Assistant Executive Engineer". */
  designation: string;
  categoryId: CategoryId;
  jurisdictionLocalityIds: LocalityId[];
  /** Links to a HierarchyConfig office-holder when known. */
  officeHolderId?: OfficialId;
  isSampleData: true;
}

/** One shared record of meetings, calls, letters and requests (for both sides). */
export interface EngagementLogEntry {
  id: EngagementId;
  issueId: IssueId;
  authorityId: AuthorityId;
  kind: EngagementKind;
  date: ISODateString;
  byUserId: UserId;
  summary: string;
  outcome?: string;
  /** If this engagement produced/updated a commitment. */
  commitmentId?: CommitmentId;
  /** For EngagementKind.Escalation — the role informed next. */
  escalatedToRoleId?: RoleId;
}

export interface CommitmentHistoryEntry {
  status: CommitmentStatus;
  at: ISODateString;
  note?: string;
}

export interface Commitment {
  id: CommitmentId;
  issueId: IssueId;
  authorityId: AuthorityId;
  description: string;
  status: CommitmentStatus;
  /** SLA-style date, e.g. "will resurface by March 15". */
  promisedBy?: ISODateString;
  updatedAt: ISODateString;
  history: CommitmentHistoryEntry[];
}

/** Pre-filled, respectful request/follow-up letter templates (partnership tone). */
export interface LetterTemplate {
  id: string;
  kind: 'Request' | 'Reminder' | 'Thanks' | 'Escalation';
  titleKey: string;
  bodyKey: string;
  /** Placeholders the generator fills, e.g. ["{{officialName}}","{{issueTitle}}"]. */
  placeholders: string[];
}
