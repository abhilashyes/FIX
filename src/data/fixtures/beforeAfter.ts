import type { BeforeAfterPair, IssueId, ResolutionPost } from '@/types';
import { ImageGenStatus } from '@/types';
import { afterImage, beforeImage } from '@/lib/placeholderImages';
import { daysAgoISO } from '@/lib/ids';
import { ISSUE_IDS } from './issues';
import { USER_IDS } from './users';

const pair = (label: string, generatedDaysAgo: number): BeforeAfterPair => ({
  before: { url: beforeImage('Now'), caption: 'Current situation (sample)' },
  after: { url: afterImage('After'), caption: `AI vision: ${label} (sample)` },
  status: ImageGenStatus.Ready,
  generatedAt: daysAgoISO(generatedDaysAgo),
});

/** 3–4 issues with a current photo + AI "after" image pair, for the before/after slider. */
export const beforeAfterByIssue: ReadonlyMap<IssueId, BeforeAfterPair> = new Map([
  [ISSUE_IDS.metroPocketPark, pair('a clean pocket park', 10)],
  [ISSUE_IDS.metroSchoolCrossing, pair('a raised school-zone crossing', 8)],
  [ISSUE_IDS.metroResurfaced, pair('a resurfaced road', 40)],
  [ISSUE_IDS.metroPlayground, pair('a restored playground', 60)],
]);

/** Resolution posts for resolved/closed issues (before/after photos + public summary). */
export const resolutionByIssue: ReadonlyMap<IssueId, ResolutionPost> = new Map([
  [
    ISSUE_IDS.metroResurfaced,
    {
      summary:
        'The sunken utility patch was properly compacted and given an asphalt overlay. Smooth riding surface restored — thanks to the ward engineering team and residents who tracked it.',
      beforePhoto: { url: beforeImage('Before'), caption: 'Sunken patch' },
      afterPhoto: { url: afterImage('Fixed'), caption: 'Resurfaced' },
      resolvedAt: daysAgoISO(38),
      resolvedByUserId: USER_IDS.suresh,
    },
  ],
  [
    ISSUE_IDS.metroPlayground,
    {
      summary:
        'Swings repaired, sandpit cleared and the play area re-turfed during a community fix-it day with an NGO partner. The playground is back in use.',
      beforePhoto: { url: beforeImage('Before'), caption: 'Neglected playground' },
      afterPhoto: { url: afterImage('Fixed'), caption: 'Restored playground' },
      resolvedAt: daysAgoISO(58),
      resolvedByUserId: USER_IDS.meera,
    },
  ],
]);
