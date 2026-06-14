import type { ISODateString, LocalityId, OrgId, PlaceId, UserId } from './ids';
import type { MockContact } from './common';
import { UserRole } from './enums';

/** Lightweight reputation: points for verified reports, accepted countermeasures, etc. */
export interface Reputation {
  points: number;
  /** Derived band from points. */
  level: number;
  breakdown: {
    reports: number;
    verifiedReports: number;
    acceptedCountermeasures: number;
    helpfulComments: number;
    pledgesFulfilled: number;
    resolutionsContributed: number;
    referrals: number;
  };
}

export interface User {
  id: UserId;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  homeLocalityId?: LocalityId;
  placeId: PlaceId;
  /** Set for org-affiliated personas (e.g. the CSR manager). */
  orgId?: OrgId;
  /** For volunteer skill matching. */
  skills: string[];
  reputation: Reputation;
  contact: MockContact;
  /** Every persona is clearly sample data. */
  isSampleData: true;
  createdAt: ISODateString;
}
