/** Issue status lifecycle. */
export enum IssueStatus {
  Reported = 'Reported',
  Verified = 'Verified',
  Prioritized = 'Prioritized',
  InProgress = 'InProgress',
  Resolved = 'Resolved',
  Closed = 'Closed',
}

/** Ordered lifecycle, used for the funnel and SLA aging steps. */
export const ISSUE_STATUS_ORDER: readonly IssueStatus[] = [
  IssueStatus.Reported,
  IssueStatus.Verified,
  IssueStatus.Prioritized,
  IssueStatus.InProgress,
  IssueStatus.Resolved,
  IssueStatus.Closed,
] as const;

export enum Severity {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
}

/** Numeric weight per severity, used in the priority score. */
export const SEVERITY_WEIGHT: Readonly<Record<Severity, number>> = {
  [Severity.Low]: 1,
  [Severity.Medium]: 2,
  [Severity.High]: 3,
  [Severity.Critical]: 4,
};

export enum UserRole {
  Resident = 'Resident',
  CommunityLead = 'CommunityLead',
  NgoCoordinator = 'NgoCoordinator',
  CivicOfficial = 'CivicOfficial',
  CsrManager = 'CsrManager',
}

export enum OrgType {
  Corporate = 'Corporate',
  Ngo = 'Ngo',
  ResidentAssociation = 'ResidentAssociation',
}

export enum VoteKind {
  WouldWork = 'WouldWork',
  WouldNotWork = 'WouldNotWork',
}

export enum NeedKind {
  Volunteers = 'Volunteers',
  Materials = 'Materials',
  Funds = 'Funds',
  Tools = 'Tools',
}

export enum PledgeKind {
  VolunteerTime = 'VolunteerTime',
  Money = 'Money',
  Resource = 'Resource',
}

/** Neutral, partnership-first commitment statuses (never "broken promise"). */
export enum CommitmentStatus {
  Completed = 'Completed',
  OnTrack = 'OnTrack',
  NeedsAttention = 'NeedsAttention',
}

export enum EngagementKind {
  Meeting = 'Meeting',
  Call = 'Call',
  Letter = 'Letter',
  Request = 'Request',
  Escalation = 'Escalation',
}

export enum HierarchyKind {
  Administrative = 'Administrative',
  Elected = 'Elected',
}

export enum PlaceType {
  City = 'city',
  Town = 'town',
  Village = 'village',
}

export enum AdoptionTargetType {
  Street = 'Street',
  Junction = 'Junction',
  Park = 'Park',
  Stretch = 'Stretch',
}

export enum LanguageCode {
  En = 'en',
  Hi = 'hi',
  Kn = 'kn',
  Ta = 'ta',
  Te = 'te',
}

/** Language metadata for the switcher (endonyms render in their own script). */
export const LANGUAGE_META: Readonly<
  Record<LanguageCode, { label: string; endonym: string }>
> = {
  [LanguageCode.En]: { label: 'English', endonym: 'English' },
  [LanguageCode.Hi]: { label: 'Hindi', endonym: 'हिन्दी' },
  [LanguageCode.Kn]: { label: 'Kannada', endonym: 'ಕನ್ನಡ' },
  [LanguageCode.Ta]: { label: 'Tamil', endonym: 'தமிழ்' },
  [LanguageCode.Te]: { label: 'Telugu', endonym: 'తెలుగు' },
};

export enum ShareKind {
  ShareIssue = 'ShareIssue',
  InviteToEvent = 'InviteToEvent',
  RallyMobilization = 'RallyMobilization',
  CelebrateResolution = 'CelebrateResolution',
  NeighbourReferral = 'NeighbourReferral',
  AdopterRecognition = 'AdopterRecognition',
  ThankOfficial = 'ThankOfficial',
}

export enum ShareTarget {
  WebShare = 'WebShare',
  CopyLink = 'CopyLink',
  WhatsApp = 'WhatsApp',
  Telegram = 'Telegram',
  Facebook = 'Facebook',
  X = 'X',
  Email = 'Email',
}

export enum ImageGenStatus {
  Pending = 'Pending',
  Ready = 'Ready',
  Failed = 'Failed',
}
