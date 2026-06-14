import type {
  Adoption,
  Authority,
  Comment,
  Commitment,
  Countermeasure,
  EngagementLogEntry,
  FixItDay,
  Issue,
  IssueUpvote,
  LetterTemplate,
  MobilizationPlan,
  Need,
  Organization,
  Pledge,
  User,
  Vote,
} from '@/types';

import { users } from './users';
import { issues as rawIssues, ISSUE_IDS } from './issues';
import { beforeAfterByIssue, resolutionByIssue } from './beforeAfter';
import { comments, countermeasures, issueUpvotes, votes } from './discussions';
import { fixItDays, mobilizationPlans, needs, pledges } from './mobilization';
import {
  AUTHORITY_IDS,
  authorities,
  commitments,
  engagementLog,
  letterTemplates,
} from './accountability';
import { adoptions, ADOPTION_IDS, organizations } from './organizations';

export interface SeedData {
  users: User[];
  organizations: Organization[];
  adoptions: Adoption[];
  issues: Issue[];
  comments: Comment[];
  countermeasures: Countermeasure[];
  votes: Vote[];
  issueUpvotes: IssueUpvote[];
  mobilizationPlans: MobilizationPlan[];
  needs: Need[];
  pledges: Pledge[];
  fixItDays: FixItDay[];
  authorities: Authority[];
  engagementLog: EngagementLogEntry[];
  commitments: Commitment[];
  letterTemplates: LetterTemplate[];
}

/** Link issues to their before/after pairs, resolutions, plans, authorities and adoption. */
function linkIssues(issues: Issue[]): Issue[] {
  const planByIssue = new Map(mobilizationPlans.map((p) => [p.issueId, p.id]));
  const authorityByIssue = new Map<string, Authority['id']>([
    [ISSUE_IDS.metroResurfaced, AUTHORITY_IDS.roadsSundarpet],
    [ISSUE_IDS.metroDrain, AUTHORITY_IDS.waterKempapura],
  ]);

  return issues.map((issue) => {
    const linked: Issue = { ...issue };
    const ba = beforeAfterByIssue.get(issue.id);
    if (ba) linked.beforeAfter = ba;
    const res = resolutionByIssue.get(issue.id);
    if (res) linked.resolution = res;
    const plan = planByIssue.get(issue.id);
    if (plan) linked.mobilizationPlanId = plan;
    const auth = authorityByIssue.get(issue.id);
    if (auth) linked.responsibleAuthorityId = auth;
    if (issue.id === ISSUE_IDS.metroPocketPark) linked.adoptionId = ADOPTION_IDS.greenfieldStretch;
    return linked;
  });
}

/** Assemble a fresh, fully-linked seed (called once at db boot). */
export function buildSeed(): SeedData {
  return {
    users: [...users],
    organizations: [...organizations],
    adoptions: [...adoptions],
    issues: linkIssues(rawIssues),
    comments: [...comments],
    countermeasures: [...countermeasures],
    votes: [...votes],
    issueUpvotes: [...issueUpvotes],
    mobilizationPlans: [...mobilizationPlans],
    needs: [...needs],
    pledges: [...pledges],
    fixItDays: [...fixItDays],
    authorities: [...authorities],
    engagementLog: [...engagementLog],
    commitments: [...commitments],
    letterTemplates: [...letterTemplates],
  };
}
