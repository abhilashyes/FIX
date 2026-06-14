import type {
  Adoption,
  AdoptionId,
  Authority,
  AuthorityId,
  Comment,
  Commitment,
  CommitmentId,
  Countermeasure,
  CountermeasureId,
  EngagementLogEntry,
  FixItDay,
  EventId,
  Issue,
  IssueId,
  IssueUpvote,
  LetterTemplate,
  MobilizationPlan,
  Need,
  NeedId,
  Organization,
  OrgId,
  PlanId,
  Pledge,
  User,
  UserId,
  Vote,
} from '@/types';
import { buildSeed } from './fixtures';

/** The in-memory database: mutable maps built from the seed at boot (NOT localStorage). */
export interface Db {
  users: Map<UserId, User>;
  organizations: Map<OrgId, Organization>;
  adoptions: Map<AdoptionId, Adoption>;
  issues: Map<IssueId, Issue>;
  comments: Comment[];
  countermeasures: Map<CountermeasureId, Countermeasure>;
  votes: Vote[];
  issueUpvotes: IssueUpvote[];
  mobilizationPlans: Map<PlanId, MobilizationPlan>;
  needs: Map<NeedId, Need>;
  pledges: Pledge[];
  fixItDays: Map<EventId, FixItDay>;
  authorities: Map<AuthorityId, Authority>;
  engagementLog: EngagementLogEntry[];
  commitments: Map<CommitmentId, Commitment>;
  letterTemplates: LetterTemplate[];
}

function build(): Db {
  const seed = buildSeed();
  return {
    users: new Map(seed.users.map((u) => [u.id, u])),
    organizations: new Map(seed.organizations.map((o) => [o.id, o])),
    adoptions: new Map(seed.adoptions.map((a) => [a.id, a])),
    issues: new Map(seed.issues.map((i) => [i.id, i])),
    comments: seed.comments,
    countermeasures: new Map(seed.countermeasures.map((c) => [c.id, c])),
    votes: seed.votes,
    issueUpvotes: seed.issueUpvotes,
    mobilizationPlans: new Map(seed.mobilizationPlans.map((p) => [p.id, p])),
    needs: new Map(seed.needs.map((n) => [n.id, n])),
    pledges: seed.pledges,
    fixItDays: new Map(seed.fixItDays.map((e) => [e.id, e])),
    authorities: new Map(seed.authorities.map((a) => [a.id, a])),
    engagementLog: seed.engagementLog,
    commitments: new Map(seed.commitments.map((c) => [c.id, c])),
    letterTemplates: seed.letterTemplates,
  };
}

/** Singleton in-memory store for the session (resets on reload). */
export const db: Db = build();
