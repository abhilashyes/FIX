import type {
  AdoptionId,
  EventId,
  IssueId,
  OfficialId,
  PlaceId,
  PlanId,
} from './ids';
import { LanguageCode, ShareKind } from './enums';

/** What is being shared — drives deep-link routing and preview composition. */
export type ShareEntityRef =
  | { type: 'issue'; id: IssueId }
  | { type: 'event'; id: EventId }
  | { type: 'plan'; id: PlanId }
  | { type: 'adoption'; id: AdoptionId }
  | { type: 'official'; id: OfficialId }
  | { type: 'referral'; placeId: PlaceId };

export interface ShareCardData {
  kind: ShareKind;
  title: string;
  summary: string;
  /** OG image (may be a before/after "We fixed it!" composite). */
  ogImageUrl: string;
  language: LanguageCode;
  brand: 'fix';
}

export interface SharePayload {
  kind: ShareKind;
  /** Deep link back into the app. */
  url: string;
  title: string;
  text: string;
  card: ShareCardData;
  entityRef: ShareEntityRef;
}
