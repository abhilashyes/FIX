/**
 * Branded primitive ids so an IssueId can never be passed where a UserId is expected.
 * These are compile-time only — at runtime they are plain strings.
 */
type Brand<K, T> = K & { readonly __brand: T };

export type IssueId = Brand<string, 'IssueId'>;
export type UserId = Brand<string, 'UserId'>;
export type OrgId = Brand<string, 'OrgId'>;
export type CommentId = Brand<string, 'CommentId'>;
export type CountermeasureId = Brand<string, 'CountermeasureId'>;
export type VoteId = Brand<string, 'VoteId'>;
export type PlanId = Brand<string, 'PlanId'>;
export type NeedId = Brand<string, 'NeedId'>;
export type PledgeId = Brand<string, 'PledgeId'>;
export type EventId = Brand<string, 'EventId'>;
export type AuthorityId = Brand<string, 'AuthorityId'>;
export type EngagementId = Brand<string, 'EngagementId'>;
export type CommitmentId = Brand<string, 'CommitmentId'>;
export type RoleId = Brand<string, 'RoleId'>;
export type OfficialId = Brand<string, 'OfficialId'>;
export type AdoptionId = Brand<string, 'AdoptionId'>;
export type PlaceId = Brand<string, 'PlaceId'>;
export type StateId = Brand<string, 'StateId'>;
export type LocalityId = Brand<string, 'LocalityId'>;
export type CategoryId = Brand<string, 'CategoryId'>;

/** ISO-8601 timestamp, e.g. "2026-06-14T10:00:00.000Z". */
export type ISODateString = Brand<string, 'ISODate'>;

/** Cast a raw string to a branded id. Use only at data-layer boundaries. */
export const asId = <T extends string>(raw: string): T => raw as T;

/** Cast a Date/string to a branded ISODateString. */
export const asISODate = (value: string | Date): ISODateString =>
  (typeof value === 'string' ? value : value.toISOString()) as ISODateString;
