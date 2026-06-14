import type {
  CategoryId,
  LocalityId,
  OfficialId,
  RoleId,
  StateId,
} from './ids';
import type { MockContact } from './common';
import { HierarchyKind } from './enums';

/** Scope of a role: which localities and/or constituencies it covers. */
export interface Jurisdiction {
  /** Empty = whole place/state. */
  localityIds: LocalityId[];
  /** For elected roles (e.g. an assembly constituency). */
  constituencyNames?: string[];
  /** Human label, e.g. "Ward 12", "Nayanagar South (MLA)". */
  scopeLabel: string;
}

/** A representative/sample office-holder, clearly labelled as sample data. */
export interface OfficialProfile {
  id: OfficialId;
  name: string;
  designation: string;
  jurisdictionLabel: string;
  contact: MockContact;
  isSampleData: true;
}

export interface HierarchyRole {
  id: RoleId;
  kind: HierarchyKind;
  /** e.g. "Ward Engineer", "MLA". */
  title: string;
  /** 0 = apex (Chief Minister); higher = more local. */
  level: number;
  /** Rolls up; both chains terminate at the CM (parentRoleId null). */
  parentRoleId: RoleId | null;
  jurisdiction: Jurisdiction;
  officeHolder?: OfficialProfile;
  /** Categories this role is responsible for (administrative chain). */
  remitCategoryIds?: CategoryId[];
}

/** Per-state configurable structure: two parallel trees rolling up to a shared CM. */
export interface HierarchyConfig {
  stateId: StateId;
  stateName: string;
  administrativeRoles: HierarchyRole[];
  electedRoles: HierarchyRole[];
  /** The shared apex both chains point to. */
  chiefMinisterRoleId: RoleId;
}

/** Resolved view for a specific issue location (used by the Responsible panel). */
export interface ResponsibleChain {
  /** Ordered local → CM, filtered by jurisdiction. */
  administrative: HierarchyRole[];
  elected: HierarchyRole[];
  /** Merged, ordered next-step escalation targets. */
  escalationLadder: HierarchyRole[];
}
