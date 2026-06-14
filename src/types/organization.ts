import type {
  AdoptionId,
  EventId,
  ISODateString,
  IssueId,
  LocalityId,
  OrgId,
  PlaceId,
  UserId,
} from './ids';
import type { GeoPoint, Money } from './common';
import type { BeforeAfterPair } from './issue';
import { AdoptionTargetType, OrgType } from './enums';

/** Organization account (corporate, NGO, resident association) — distinct from a User. */
export interface Organization {
  id: OrgId;
  name: string;
  type: OrgType;
  logoUrl?: string;
  placeId: PlaceId;
  /** Primary contact persona. */
  csrManagerId?: UserId;
  isSampleData: true;
  createdAt: ISODateString;
}

/** Adopt a Street — a defined commitment over a defined period. */
export interface Adoption {
  id: AdoptionId;
  orgId: OrgId;
  placeId: PlaceId;
  targetType: AdoptionTargetType;
  targetName: string;
  /** Polygon/polyline approximating the stretch. */
  area: GeoPoint[];
  /** Which localities the adopted area touches. */
  localityIds: LocalityId[];

  commitment: {
    csrFunds: Money;
    materials?: string[];
    employeeVolunteerHours: number;
  };
  periodStart: ISODateString;
  periodEnd: ISODateString;

  /** Live impact, denormalized for the adoption dashboard. */
  impact: {
    issuesFixedIds: IssueId[];
    fundsDeployed: Money;
    employeeHoursLogged: number;
    beforeAfterPairs: BeforeAfterPair[];
  };
  createdAt: ISODateString;
}

export interface EmployeeVolunteering {
  orgId: OrgId;
  volunteerUserId: UserId;
  eventId?: EventId;
  hours: number;
  date: ISODateString;
  adoptionId?: AdoptionId;
}
