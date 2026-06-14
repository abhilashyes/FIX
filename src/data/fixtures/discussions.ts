import type {
  Comment,
  CommentId,
  Countermeasure,
  CountermeasureId,
  IssueUpvote,
  Vote,
  VoteId,
} from '@/types';
import { VoteKind, asId } from '@/types';
import { daysAgoISO } from '@/lib/ids';
import { ISSUE_IDS } from './issues';
import { USER_IDS } from './users';

const cmId = (s: string): CountermeasureId => asId<CountermeasureId>(s);
const coId = (s: string): CommentId => asId<CommentId>(s);
const vId = (s: string): VoteId => asId<VoteId>(s);

export const COUNTERMEASURE_IDS = {
  potholesResurface: cmId('cm-potholes-resurface'),
  potholesPatch: cmId('cm-potholes-patch'),
  parkCleanup: cmId('cm-park-cleanup'),
  drainDesilt: cmId('cm-drain-desilt'),
} as const;

export const countermeasures: Countermeasure[] = [
  {
    id: COUNTERMEASURE_IDS.potholesResurface,
    issueId: ISSUE_IDS.metroPotholes,
    authorId: USER_IDS.ravi,
    title: 'Full resurfacing with proper drainage camber',
    description: 'Mill and repave the full 200m stretch and fix the camber so water drains instead of pooling into new potholes.',
    estimatedCost: { amount: 450000, currency: 'INR' },
    wouldWorkCount: 47,
    wouldNotWorkCount: 4,
    accepted: true,
    createdAt: daysAgoISO(30),
  },
  {
    id: COUNTERMEASURE_IDS.potholesPatch,
    issueId: ISSUE_IDS.metroPotholes,
    authorId: USER_IDS.asha,
    title: 'Quick patching of the worst holes',
    description: 'A faster, cheaper stopgap — patch the deepest holes now while a full repave is planned.',
    estimatedCost: { amount: 60000, currency: 'INR' },
    wouldWorkCount: 18,
    wouldNotWorkCount: 21,
    accepted: false,
    createdAt: daysAgoISO(29),
  },
  {
    id: COUNTERMEASURE_IDS.parkCleanup,
    issueId: ISSUE_IDS.metroPocketPark,
    authorId: USER_IDS.meera,
    title: 'Community clean-up + planting drive',
    description: 'Organize a weekend drive to clear the dump and plant a small pocket park with a low-cost boundary.',
    estimatedCost: { amount: 120000, currency: 'INR' },
    wouldWorkCount: 52,
    wouldNotWorkCount: 3,
    accepted: true,
    createdAt: daysAgoISO(40),
  },
  {
    id: COUNTERMEASURE_IDS.drainDesilt,
    issueId: ISSUE_IDS.metroDrain,
    authorId: USER_IDS.imran,
    title: 'Desilt and widen the storm drain',
    description: 'Clear accumulated silt, widen the channel at the choke point and add a grating to stop blockages.',
    estimatedCost: { amount: 300000, currency: 'INR' },
    wouldWorkCount: 61,
    wouldNotWorkCount: 6,
    accepted: true,
    createdAt: daysAgoISO(50),
  },
];

export const votes: Vote[] = [
  { id: vId('vote-1'), countermeasureId: COUNTERMEASURE_IDS.potholesResurface, voterId: USER_IDS.asha, kind: VoteKind.WouldWork, reason: 'Patching never lasts here — do it properly once.', createdAt: daysAgoISO(28) },
  { id: vId('vote-2'), countermeasureId: COUNTERMEASURE_IDS.potholesResurface, voterId: USER_IDS.divya, kind: VoteKind.WouldWork, createdAt: daysAgoISO(27) },
  { id: vId('vote-3'), countermeasureId: COUNTERMEASURE_IDS.potholesPatch, voterId: USER_IDS.ravi, kind: VoteKind.WouldNotWork, reason: 'Stopgaps wash away in the first rain.', createdAt: daysAgoISO(26) },
  { id: vId('vote-4'), countermeasureId: COUNTERMEASURE_IDS.parkCleanup, voterId: USER_IDS.lakshmi, kind: VoteKind.WouldWork, reason: 'Happy to volunteer on the weekend.', createdAt: daysAgoISO(20) },
  { id: vId('vote-5'), countermeasureId: COUNTERMEASURE_IDS.drainDesilt, voterId: USER_IDS.divya, kind: VoteKind.WouldWork, createdAt: daysAgoISO(48) },
];

export const comments: Comment[] = [
  { id: coId('c-1'), issueId: ISSUE_IDS.metroPotholes, authorId: USER_IDS.divya, parentId: null, body: 'My scooter nearly skidded here yesterday. This needs urgent attention.', createdAt: daysAgoISO(32), upvoteCount: 12 },
  { id: coId('c-2'), issueId: ISSUE_IDS.metroPotholes, authorId: USER_IDS.ravi, parentId: coId('c-1'), body: 'Agreed — I have started a countermeasure proposal for a full resurfacing.', createdAt: daysAgoISO(31), upvoteCount: 8 },
  { id: coId('c-3'), issueId: ISSUE_IDS.metroPotholes, authorId: USER_IDS.suresh, parentId: coId('c-2'), body: 'Noted from the ward engineering side. We can schedule an inspection this week.', createdAt: daysAgoISO(20), upvoteCount: 15 },
  { id: coId('c-4'), issueId: ISSUE_IDS.metroPocketPark, authorId: USER_IDS.lakshmi, parentId: null, body: 'This corner has been an eyesore for years. A pocket park would be wonderful.', createdAt: daysAgoISO(42), upvoteCount: 9 },
  { id: coId('c-5'), issueId: ISSUE_IDS.metroDrain, authorId: USER_IDS.asha, parentId: null, body: 'Shops here flood every monsoon. Please prioritise before the rains.', createdAt: daysAgoISO(55), upvoteCount: 11 },
];

/** A few explicit "affects me too" upvote records on key issues. */
export const issueUpvotes: IssueUpvote[] = [
  { issueId: ISSUE_IDS.metroPotholes, userId: USER_IDS.divya, createdAt: daysAgoISO(33) },
  { issueId: ISSUE_IDS.metroPotholes, userId: USER_IDS.ravi, createdAt: daysAgoISO(33) },
  { issueId: ISSUE_IDS.metroPotholes, userId: USER_IDS.imran, createdAt: daysAgoISO(30) },
  { issueId: ISSUE_IDS.metroPocketPark, userId: USER_IDS.lakshmi, createdAt: daysAgoISO(42) },
  { issueId: ISSUE_IDS.metroDrain, userId: USER_IDS.asha, createdAt: daysAgoISO(55) },
];
