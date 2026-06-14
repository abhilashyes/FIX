import type {
  Authority,
  AuthorityId,
  Commitment,
  CommitmentId,
  EngagementId,
  EngagementLogEntry,
  LetterTemplate,
  OfficialId,
} from '@/types';
import { CommitmentStatus, EngagementKind, asId } from '@/types';
import { CATEGORY_IDS } from '@/config/categories';
import { METRO_LOCALITY_IDS, METRO_PLACE_ID } from '@/config/places/metro';
import { daysAgoISO } from '@/lib/ids';
import { ISSUE_IDS } from './issues';
import { USER_IDS } from './users';

const aId = (s: string): AuthorityId => asId<AuthorityId>(s);
const eId = (s: string): EngagementId => asId<EngagementId>(s);
const ctId = (s: string): CommitmentId => asId<CommitmentId>(s);
const oId = (s: string): OfficialId => asId<OfficialId>(s);

export const AUTHORITY_IDS = {
  roadsSundarpet: aId('auth-roads-sundarpet'),
  waterKempapura: aId('auth-water-kempapura'),
} as const;

export const authorities: Authority[] = [
  {
    id: AUTHORITY_IDS.roadsSundarpet,
    placeId: METRO_PLACE_ID,
    department: 'Roads & Infrastructure',
    designation: 'Ward Engineer, South wards',
    categoryId: CATEGORY_IDS.roads,
    jurisdictionLocalityIds: [METRO_LOCALITY_IDS.sundarpet],
    officeHolderId: oId('hp-off-we-south'),
    isSampleData: true,
  },
  {
    id: AUTHORITY_IDS.waterKempapura,
    placeId: METRO_PLACE_ID,
    department: 'Water Supply & Sewerage',
    designation: 'Water Works Engineer',
    categoryId: CATEGORY_IDS.water,
    jurisdictionLocalityIds: [METRO_LOCALITY_IDS.kempapura],
    officeHolderId: oId('hp-off-we-north'),
    isSampleData: true,
  },
];

export const commitments: Commitment[] = [
  {
    id: ctId('commit-resurface'),
    issueId: ISSUE_IDS.metroResurfaced,
    authorityId: AUTHORITY_IDS.roadsSundarpet,
    description: 'Re-lay the sunken utility patch with proper compaction and an asphalt overlay.',
    status: CommitmentStatus.Completed,
    promisedBy: daysAgoISO(45),
    updatedAt: daysAgoISO(38),
    history: [
      { status: CommitmentStatus.OnTrack, at: daysAgoISO(60), note: 'Work order raised.' },
      { status: CommitmentStatus.Completed, at: daysAgoISO(38), note: 'Overlay completed and inspected.' },
    ],
  },
  {
    id: ctId('commit-drain'),
    issueId: ISSUE_IDS.metroDrain,
    authorityId: AUTHORITY_IDS.waterKempapura,
    description: 'Desilt and widen the storm drain at Kempapura junction and add a grating before the monsoon.',
    status: CommitmentStatus.OnTrack,
    promisedBy: daysAgoISO(-20), // due in ~3 weeks
    updatedAt: daysAgoISO(7),
    history: [
      { status: CommitmentStatus.OnTrack, at: daysAgoISO(25), note: 'Survey done; tender floated.' },
      { status: CommitmentStatus.OnTrack, at: daysAgoISO(7), note: 'Desilting started at the choke point.' },
    ],
  },
];

export const engagementLog: EngagementLogEntry[] = [
  { id: eId('eng-1'), issueId: ISSUE_IDS.metroResurfaced, authorityId: AUTHORITY_IDS.roadsSundarpet, kind: EngagementKind.Request, date: daysAgoISO(62), byUserId: USER_IDS.ravi, summary: 'Submitted a request with photos and the resident vote count.', outcome: 'Acknowledged; inspection scheduled.' },
  { id: eId('eng-2'), issueId: ISSUE_IDS.metroResurfaced, authorityId: AUTHORITY_IDS.roadsSundarpet, kind: EngagementKind.Meeting, date: daysAgoISO(55), byUserId: USER_IDS.ravi, summary: 'Met the ward engineer on site to agree the scope.', outcome: 'Commitment recorded: overlay by target date.', commitmentId: ctId('commit-resurface') },
  { id: eId('eng-3'), issueId: ISSUE_IDS.metroResurfaced, authorityId: AUTHORITY_IDS.roadsSundarpet, kind: EngagementKind.Call, date: daysAgoISO(40), byUserId: USER_IDS.asha, summary: 'Follow-up call confirming completion date.', outcome: 'Work completed two days later.' },
  { id: eId('eng-4'), issueId: ISSUE_IDS.metroDrain, authorityId: AUTHORITY_IDS.waterKempapura, kind: EngagementKind.Letter, date: daysAgoISO(50), byUserId: USER_IDS.imran, summary: 'Sent a respectful follow-up letter citing the flooding history.', outcome: 'Survey commissioned.', commitmentId: ctId('commit-drain') },
  { id: eId('eng-5'), issueId: ISSUE_IDS.metroDrain, authorityId: AUTHORITY_IDS.waterKempapura, kind: EngagementKind.Meeting, date: daysAgoISO(25), byUserId: USER_IDS.ravi, summary: 'Joint site visit with the water works team.', outcome: 'Commitment recorded: desilt and widen before monsoon.', commitmentId: ctId('commit-drain') },
];

/** Pre-filled, respectful letter templates (i18n keys filled by the generator). */
export const letterTemplates: LetterTemplate[] = [
  { id: 'tmpl-request', kind: 'Request', titleKey: 'letter.request.title', bodyKey: 'letter.request.body', placeholders: ['{{officialName}}', '{{issueTitle}}', '{{locality}}', '{{votes}}', '{{ageDays}}'] },
  { id: 'tmpl-reminder', kind: 'Reminder', titleKey: 'letter.reminder.title', bodyKey: 'letter.reminder.body', placeholders: ['{{officialName}}', '{{issueTitle}}', '{{promisedBy}}'] },
  { id: 'tmpl-thanks', kind: 'Thanks', titleKey: 'letter.thanks.title', bodyKey: 'letter.thanks.body', placeholders: ['{{officeName}}', '{{issueTitle}}'] },
  { id: 'tmpl-escalation', kind: 'Escalation', titleKey: 'letter.escalation.title', bodyKey: 'letter.escalation.body', placeholders: ['{{nextOfficialName}}', '{{issueTitle}}', '{{locality}}', '{{ageDays}}'] },
];
