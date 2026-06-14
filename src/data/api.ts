import type {
  Adoption,
  AdoptionId,
  Attendee,
  Authority,
  AuthorityId,
  BeforeAfterPair,
  Comment,
  CommentId,
  Commitment,
  CommitmentId,
  CommitmentStatus,
  Countermeasure,
  CountermeasureId,
  CommunityScore,
  DashboardFilters,
  DepartmentScore,
  EmployeeVolunteering,
  EngagementKind,
  EngagementLogEntry,
  EventId,
  FixItDay,
  FunnelBucket,
  HeatmapCell,
  HierarchyConfig,
  Issue,
  IssueId,
  IssueStatus,
  LetterTemplate,
  Money,
  MobilizationPlan,
  Need,
  NeedId,
  NeedKind,
  OrgId,
  Organization,
  PlaceConfig,
  PlaceId,
  PledgeKind,
  Pledge,
  PledgeId,
  PlanId,
  PriorityBreakdown,
  ResolutionPost,
  ResponsibleChain,
  RoleId,
  RsvpStatus,
  Severity,
  SlaAging,
  StateId,
  TrendPoint,
  User,
  UserId,
  Vote,
  VoteId,
  EngagementId,
  GeoPoint,
  IssuePhoto,
  CategoryId,
  LocalityId,
} from '@/types';
import { ISSUE_STATUS_ORDER, IssueStatus as Status, VoteKind } from '@/types';
import { db } from './db';
import { clone, withLatency } from './latency';
import { ALL_PLACES, getPlace } from '@/config/places';
import { getHierarchy } from '@/config/hierarchy';
import { computePriorityScore } from '@/lib/priorityScore';
import { resolveResponsibleChain } from '@/lib/jurisdiction';
import { SLA_THRESHOLD_DAYS } from '@/config/priority';
import { daysSince } from '@/lib/format';
import { genId, nowISO } from '@/lib/ids';

// ── Input DTOs (omit server-set fields) ──
export interface CreateIssueInput {
  placeId: PlaceId;
  categoryId: CategoryId;
  title: string;
  description: string;
  severity: Severity;
  location: GeoPoint;
  localityId: LocalityId;
  address?: string;
  beforePhoto: IssuePhoto;
  proposedCountermeasure?: string;
  reporterId: UserId;
  affectedPopulationEstimate: number;
}
export interface AddCommentInput {
  issueId: IssueId;
  authorId: UserId;
  parentId: CommentId | null;
  body: string;
}
export interface AddCountermeasureInput {
  issueId: IssueId;
  authorId: UserId;
  title: string;
  description: string;
  estimatedCost?: Money;
}
export interface VoteCountermeasureInput {
  countermeasureId: CountermeasureId;
  voterId: UserId;
  kind: VoteKind;
  reason?: string;
}
export interface CreatePlanNeedInput {
  kind: NeedKind;
  label: string;
  requiredSkills?: string[];
  targetQuantity: number;
  fundsTarget?: Money;
}
export interface CreatePlanInput {
  issueId: IssueId;
  title: string;
  description: string;
  createdById: UserId;
  needs: CreatePlanNeedInput[];
}
export interface AddPledgeInput {
  needId: NeedId;
  planId: PlanId;
  pledgerId: UserId;
  pledgerOrgId?: OrgId;
  kind: PledgeKind;
  quantity: number;
  amount?: Money;
}
export interface AddEngagementInput {
  issueId: IssueId;
  authorityId: AuthorityId;
  kind: EngagementKind;
  byUserId: UserId;
  summary: string;
  outcome?: string;
  escalatedToRoleId?: RoleId;
}
export interface UpsertCommitmentInput {
  id?: CommitmentId;
  issueId: IssueId;
  authorityId: AuthorityId;
  description: string;
  status: CommitmentStatus;
  promisedBy?: string;
  note?: string;
}

export interface FixApi {
  // Places & config
  getPlaces(): Promise<PlaceConfig[]>;
  getPlace(id: PlaceId): Promise<PlaceConfig>;
  getHierarchy(stateId: StateId): Promise<HierarchyConfig>;

  // Users & orgs
  getUsers(placeId: PlaceId): Promise<User[]>;
  getUser(id: UserId): Promise<User>;
  getOrganizations(placeId: PlaceId): Promise<Organization[]>;

  // Issues
  listIssues(filters: DashboardFilters): Promise<Issue[]>;
  getIssue(id: IssueId): Promise<Issue>;
  createIssue(input: CreateIssueInput): Promise<Issue>;
  updateIssueStatus(id: IssueId, to: IssueStatus, byUserId: UserId, note?: string): Promise<Issue>;
  upvoteIssue(id: IssueId, userId: UserId): Promise<Issue>;
  attachAfterImage(id: IssueId, pair: BeforeAfterPair): Promise<Issue>;
  resolveIssue(id: IssueId, post: ResolutionPost): Promise<Issue>;

  // Discussion
  listComments(issueId: IssueId): Promise<Comment[]>;
  addComment(input: AddCommentInput): Promise<Comment>;
  listCountermeasures(issueId: IssueId): Promise<Countermeasure[]>;
  addCountermeasure(input: AddCountermeasureInput): Promise<Countermeasure>;
  voteCountermeasure(input: VoteCountermeasureInput): Promise<Vote>;

  // Mobilization
  getMobilizationPlan(id: PlanId): Promise<MobilizationPlan>;
  getNeeds(planId: PlanId): Promise<Need[]>;
  createMobilizationPlan(input: CreatePlanInput): Promise<MobilizationPlan>;
  addPledge(input: AddPledgeInput): Promise<Pledge>;
  getFixItDay(id: EventId): Promise<FixItDay>;
  rsvpFixItDay(id: EventId, userId: UserId, rsvp: RsvpStatus): Promise<FixItDay>;

  // Authority & accountability
  getAuthority(id: AuthorityId): Promise<Authority>;
  resolveResponsibleChain(issueId: IssueId): Promise<ResponsibleChain>;
  listEngagement(issueId: IssueId): Promise<EngagementLogEntry[]>;
  addEngagement(input: AddEngagementInput): Promise<EngagementLogEntry>;
  getCommitments(issueId: IssueId): Promise<Commitment[]>;
  upsertCommitment(input: UpsertCommitmentInput): Promise<Commitment>;
  getLetterTemplates(): Promise<LetterTemplate[]>;

  // Adoption / CSR
  listAdoptions(placeId: PlaceId): Promise<Adoption[]>;
  getAdoption(id: AdoptionId): Promise<Adoption>;
  logEmployeeVolunteering(input: EmployeeVolunteering): Promise<Adoption>;

  // Dashboard
  getPriorityList(filters: DashboardFilters): Promise<PriorityBreakdown[]>;
  getStatusFunnel(filters: DashboardFilters): Promise<FunnelBucket[]>;
  getTrends(placeId: PlaceId, months: number): Promise<TrendPoint[]>;
  getHeatmap(filters: DashboardFilters): Promise<HeatmapCell[]>;
  getSlaAging(placeId: PlaceId): Promise<SlaAging[]>;
  getDepartmentScores(placeId: PlaceId): Promise<DepartmentScore[]>;
  getCommunityScores(placeId: PlaceId): Promise<CommunityScore[]>;
}

// ── Helpers ──
function must<T>(value: T | undefined, label: string): T {
  if (value === undefined) throw new Error(`Not found: ${label}`);
  return value;
}

function ageDaysFor(issue: Issue): number {
  return issue.status === Status.Resolved || issue.status === Status.Closed
    ? 0
    : daysSince(issue.createdAt);
}

function priorityFor(issue: Issue): PriorityBreakdown {
  return computePriorityScore({
    issueId: issue.id,
    upvoteCount: issue.upvoteCount,
    severity: issue.severity,
    ageDays: ageDaysFor(issue),
    affectedPopulationEstimate: issue.affectedPopulationEstimate,
  });
}

function matchesFilters(issue: Issue, f: DashboardFilters): boolean {
  if (issue.placeId !== f.placeId) return false;
  if (f.localityIds?.length && !f.localityIds.includes(issue.localityId)) return false;
  if (f.categoryIds?.length && !f.categoryIds.includes(issue.categoryId)) return false;
  if (f.severities?.length && !f.severities.includes(issue.severity)) return false;
  if (f.statuses?.length && !f.statuses.includes(issue.status)) return false;
  return true;
}

const mock: FixApi = {
  // ── Places & config ──
  getPlaces: () => withLatency(clone([...ALL_PLACES])),
  getPlace: (id) => withLatency(clone(must(getPlace(id), `place ${id}`))),
  getHierarchy: (stateId) => withLatency(clone(must(getHierarchy(stateId), `hierarchy ${stateId}`))),

  // ── Users & orgs ──
  getUsers: (placeId) =>
    withLatency(clone([...db.users.values()].filter((u) => u.placeId === placeId))),
  getUser: (id) => withLatency(clone(must(db.users.get(id), `user ${id}`))),
  getOrganizations: (placeId) =>
    withLatency(clone([...db.organizations.values()].filter((o) => o.placeId === placeId))),

  // ── Issues ──
  listIssues: (filters) =>
    withLatency(clone([...db.issues.values()].filter((i) => matchesFilters(i, filters)))),
  getIssue: (id) => withLatency(clone(must(db.issues.get(id), `issue ${id}`))),
  createIssue: (input) => {
    const id = genId<IssueId>('issue');
    const now = nowISO();
    const issue: Issue = {
      id,
      placeId: input.placeId,
      categoryId: input.categoryId,
      title: input.title,
      description: input.description,
      severity: input.severity,
      status: Status.Reported,
      location: input.location,
      localityId: input.localityId,
      address: input.address,
      beforePhoto: input.beforePhoto,
      proposedCountermeasure: input.proposedCountermeasure,
      reporterId: input.reporterId,
      affectedUserIds: [input.reporterId],
      upvoteCount: 1,
      affectedPopulationEstimate: input.affectedPopulationEstimate,
      createdAt: now,
      updatedAt: now,
      statusHistory: [{ from: null, to: Status.Reported, at: now, byUserId: input.reporterId }],
    };
    db.issues.set(id, issue);
    return withLatency(clone(issue));
  },
  updateIssueStatus: (id, to, byUserId, note) => {
    const issue = must(db.issues.get(id), `issue ${id}`);
    const now = nowISO();
    issue.statusHistory.push({ from: issue.status, to, at: now, byUserId, note });
    issue.status = to;
    issue.updatedAt = now;
    return withLatency(clone(issue));
  },
  upvoteIssue: (id, userId) => {
    const issue = must(db.issues.get(id), `issue ${id}`);
    if (!issue.affectedUserIds.includes(userId)) {
      issue.affectedUserIds.push(userId);
      issue.upvoteCount += 1;
      db.issueUpvotes.push({ issueId: id, userId, createdAt: nowISO() });
      issue.updatedAt = nowISO();
    }
    return withLatency(clone(issue));
  },
  attachAfterImage: (id, pair) => {
    const issue = must(db.issues.get(id), `issue ${id}`);
    issue.beforeAfter = pair;
    issue.updatedAt = nowISO();
    return withLatency(clone(issue));
  },
  resolveIssue: (id, post) => {
    const issue = must(db.issues.get(id), `issue ${id}`);
    const now = nowISO();
    issue.resolution = post;
    issue.statusHistory.push({ from: issue.status, to: Status.Resolved, at: now });
    issue.status = Status.Resolved;
    issue.updatedAt = now;
    return withLatency(clone(issue));
  },

  // ── Discussion ──
  listComments: (issueId) =>
    withLatency(clone(db.comments.filter((c) => c.issueId === issueId))),
  addComment: (input) => {
    const comment: Comment = {
      id: genId<CommentId>('comment'),
      issueId: input.issueId,
      authorId: input.authorId,
      parentId: input.parentId,
      body: input.body,
      createdAt: nowISO(),
      upvoteCount: 0,
    };
    db.comments.push(comment);
    return withLatency(clone(comment));
  },
  listCountermeasures: (issueId) =>
    withLatency(clone([...db.countermeasures.values()].filter((c) => c.issueId === issueId))),
  addCountermeasure: (input) => {
    const cm: Countermeasure = {
      id: genId<CountermeasureId>('cm'),
      issueId: input.issueId,
      authorId: input.authorId,
      title: input.title,
      description: input.description,
      estimatedCost: input.estimatedCost,
      wouldWorkCount: 0,
      wouldNotWorkCount: 0,
      accepted: false,
      createdAt: nowISO(),
    };
    db.countermeasures.set(cm.id, cm);
    return withLatency(clone(cm));
  },
  voteCountermeasure: (input) => {
    const cm = must(db.countermeasures.get(input.countermeasureId), `countermeasure ${input.countermeasureId}`);
    const vote: Vote = {
      id: genId<VoteId>('vote'),
      countermeasureId: input.countermeasureId,
      voterId: input.voterId,
      kind: input.kind,
      reason: input.reason,
      createdAt: nowISO(),
    };
    db.votes.push(vote);
    if (input.kind === VoteKind.WouldWork) cm.wouldWorkCount += 1;
    else cm.wouldNotWorkCount += 1;
    return withLatency(clone(vote));
  },

  // ── Mobilization ──
  getMobilizationPlan: (id) =>
    withLatency(clone(must(db.mobilizationPlans.get(id), `plan ${id}`))),
  getNeeds: (planId) =>
    withLatency(clone([...db.needs.values()].filter((n) => n.planId === planId))),
  createMobilizationPlan: (input) => {
    const planId = genId<PlanId>('plan');
    const needs: Need[] = input.needs.map((n) => ({
      id: genId<NeedId>('need'),
      planId,
      kind: n.kind,
      label: n.label,
      requiredSkills: n.requiredSkills,
      targetQuantity: n.targetQuantity,
      fundsTarget: n.fundsTarget,
      fulfilledQuantity: 0,
      fundsRaised: n.fundsTarget ? { amount: 0, currency: n.fundsTarget.currency } : undefined,
    }));
    needs.forEach((n) => db.needs.set(n.id, n));
    const plan: MobilizationPlan = {
      id: planId,
      issueId: input.issueId,
      title: input.title,
      description: input.description,
      createdById: input.createdById,
      needIds: needs.map((n) => n.id),
      fixItDayIds: [],
      createdAt: nowISO(),
    };
    db.mobilizationPlans.set(planId, plan);
    const issue = db.issues.get(input.issueId);
    if (issue) issue.mobilizationPlanId = planId;
    return withLatency(clone(plan));
  },
  addPledge: (input) => {
    const need = must(db.needs.get(input.needId), `need ${input.needId}`);
    const pledge: Pledge = {
      id: genId<PledgeId>('pledge'),
      needId: input.needId,
      planId: input.planId,
      pledgerId: input.pledgerId,
      pledgerOrgId: input.pledgerOrgId,
      kind: input.kind,
      quantity: input.quantity,
      amount: input.amount,
      fulfilled: false,
      createdAt: nowISO(),
    };
    db.pledges.push(pledge);
    if (input.amount && need.fundsRaised) {
      need.fundsRaised = {
        amount: need.fundsRaised.amount + input.amount.amount,
        currency: need.fundsRaised.currency,
      };
      need.fulfilledQuantity = need.fundsRaised.amount;
    } else {
      need.fulfilledQuantity += input.quantity;
    }
    return withLatency(clone(pledge));
  },
  getFixItDay: (id) => withLatency(clone(must(db.fixItDays.get(id), `event ${id}`))),
  rsvpFixItDay: (id, userId, rsvp) => {
    const event = must(db.fixItDays.get(id), `event ${id}`);
    const existing = event.attendees.find((a) => a.userId === userId);
    if (existing) existing.rsvp = rsvp;
    else event.attendees.push({ userId, rsvp, checkedIn: false } satisfies Attendee);
    return withLatency(clone(event));
  },

  // ── Authority & accountability ──
  getAuthority: (id) => withLatency(clone(must(db.authorities.get(id), `authority ${id}`))),
  resolveResponsibleChain: (issueId) => {
    const issue = must(db.issues.get(issueId), `issue ${issueId}`);
    const place = must(getPlace(issue.placeId), `place ${issue.placeId}`);
    const hierarchy = must(getHierarchy(place.hierarchyStateId), `hierarchy ${place.hierarchyStateId}`);
    return withLatency(clone(resolveResponsibleChain(hierarchy, issue.localityId)));
  },
  listEngagement: (issueId) =>
    withLatency(clone(db.engagementLog.filter((e) => e.issueId === issueId))),
  addEngagement: (input) => {
    const entry: EngagementLogEntry = {
      id: genId<EngagementId>('eng'),
      issueId: input.issueId,
      authorityId: input.authorityId,
      kind: input.kind,
      date: nowISO(),
      byUserId: input.byUserId,
      summary: input.summary,
      outcome: input.outcome,
      escalatedToRoleId: input.escalatedToRoleId,
    };
    db.engagementLog.push(entry);
    return withLatency(clone(entry));
  },
  getCommitments: (issueId) =>
    withLatency(clone([...db.commitments.values()].filter((c) => c.issueId === issueId))),
  upsertCommitment: (input) => {
    const now = nowISO();
    if (input.id && db.commitments.has(input.id)) {
      const existing = must(db.commitments.get(input.id), `commitment ${input.id}`);
      existing.status = input.status;
      existing.description = input.description;
      existing.promisedBy = input.promisedBy as Commitment['promisedBy'];
      existing.updatedAt = now;
      existing.history.push({ status: input.status, at: now, note: input.note });
      return withLatency(clone(existing));
    }
    const commitment: Commitment = {
      id: genId<CommitmentId>('commit'),
      issueId: input.issueId,
      authorityId: input.authorityId,
      description: input.description,
      status: input.status,
      promisedBy: input.promisedBy as Commitment['promisedBy'],
      updatedAt: now,
      history: [{ status: input.status, at: now, note: input.note }],
    };
    db.commitments.set(commitment.id, commitment);
    return withLatency(clone(commitment));
  },
  getLetterTemplates: () => withLatency(clone([...db.letterTemplates])),

  // ── Adoption / CSR ──
  listAdoptions: (placeId) =>
    withLatency(clone([...db.adoptions.values()].filter((a) => a.placeId === placeId))),
  getAdoption: (id) => withLatency(clone(must(db.adoptions.get(id), `adoption ${id}`))),
  logEmployeeVolunteering: (input) => {
    const adoption = must(
      input.adoptionId ? db.adoptions.get(input.adoptionId) : undefined,
      `adoption ${input.adoptionId}`,
    );
    adoption.impact.employeeHoursLogged += input.hours;
    return withLatency(clone(adoption));
  },

  // ── Dashboard ──
  getPriorityList: (filters) => {
    const list = [...db.issues.values()]
      .filter((i) => matchesFilters(i, filters))
      .filter((i) => i.status !== Status.Resolved && i.status !== Status.Closed)
      .map(priorityFor)
      .sort((a, b) => b.total - a.total);
    return withLatency(clone(list));
  },
  getStatusFunnel: (filters) => {
    const buckets: FunnelBucket[] = ISSUE_STATUS_ORDER.map((status) => ({
      status,
      count: [...db.issues.values()].filter(
        (i) => matchesFilters(i, filters) && i.status === status,
      ).length,
    }));
    return withLatency(clone(buckets));
  },
  getTrends: (placeId, months) => {
    const points: TrendPoint[] = [];
    const now = new Date();
    for (let m = months - 1; m >= 0; m -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthStart = d.getTime();
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
      const placeIssues = [...db.issues.values()].filter((i) => i.placeId === placeId);
      const reported = placeIssues.filter((i) => {
        const t = new Date(i.createdAt).getTime();
        return t >= monthStart && t < monthEnd;
      }).length;
      const resolved = placeIssues.filter((i) => {
        if (!i.resolution) return false;
        const t = new Date(i.resolution.resolvedAt).getTime();
        return t >= monthStart && t < monthEnd;
      }).length;
      points.push({ month: key, reported, resolved });
    }
    return withLatency(clone(points));
  },
  getHeatmap: (filters) => {
    const place = getPlace(filters.placeId);
    const cells: HeatmapCell[] = (place?.localities ?? []).map((loc) => {
      const localityIssues = [...db.issues.values()].filter(
        (i) => matchesFilters(i, filters) && i.localityId === loc.id,
      );
      const weightedScore = localityIssues.reduce((sum, i) => sum + priorityFor(i).total, 0);
      return {
        localityId: loc.id,
        localityName: loc.name,
        center: loc.center,
        issueCount: localityIssues.length,
        weightedScore: Math.round(weightedScore),
      };
    });
    return withLatency(clone(cells));
  },
  getSlaAging: (placeId) => {
    const rows: SlaAging[] = [...db.issues.values()]
      .filter((i) => i.placeId === placeId && i.status !== Status.Closed)
      .map((i) => {
        const last = i.statusHistory[i.statusHistory.length - 1];
        const daysInStatus = last ? daysSince(last.at) : daysSince(i.updatedAt);
        const threshold = SLA_THRESHOLD_DAYS[i.status] ?? 0;
        return {
          issueId: i.id,
          status: i.status,
          daysInStatus,
          slaThresholdDays: threshold,
          breached: threshold > 0 && daysInStatus > threshold,
        };
      });
    return withLatency(clone(rows));
  },
  getDepartmentScores: (placeId) => {
    const place = getPlace(placeId);
    const departments = new Map<string, DepartmentScore>();
    const ensure = (dept: string): DepartmentScore => {
      let d = departments.get(dept);
      if (!d) {
        d = {
          department: dept,
          placeId,
          reportedCount: 0,
          resolvedCount: 0,
          inProgressCount: 0,
          avgResolutionDays: null,
          commitmentsCompleted: 0,
          commitmentsNeedsAttention: 0,
          responsivenessScore: 0,
        };
        departments.set(dept, d);
      }
      return d;
    };
    const catToDept = new Map(
      (place?.responsibleAuthorityMap ?? []).map((m) => [m.categoryId, m.department]),
    );
    for (const issue of db.issues.values()) {
      if (issue.placeId !== placeId) continue;
      const dept = catToDept.get(issue.categoryId) ?? 'Other';
      const d = ensure(dept);
      d.reportedCount += 1;
      if (issue.status === Status.Resolved || issue.status === Status.Closed) d.resolvedCount += 1;
      if (issue.status === Status.InProgress) d.inProgressCount += 1;
    }
    for (const score of departments.values()) {
      score.responsivenessScore =
        score.reportedCount > 0
          ? Math.round((score.resolvedCount / score.reportedCount) * 100)
          : 0;
    }
    return withLatency(clone([...departments.values()]));
  },
  getCommunityScores: (placeId) => {
    const place = getPlace(placeId);
    const scores: CommunityScore[] = (place?.localities ?? []).map((loc) => {
      const localityIssues = [...db.issues.values()].filter(
        (i) => i.placeId === placeId && i.localityId === loc.id,
      );
      const resolved = localityIssues.filter(
        (i) => i.status === Status.Resolved || i.status === Status.Closed,
      ).length;
      const inProgress = localityIssues.filter((i) => i.status === Status.InProgress).length;
      const members = new Set<UserId>();
      localityIssues.forEach((i) => i.affectedUserIds.forEach((u) => members.add(u)));
      return {
        localityId: loc.id,
        activeMembers: members.size,
        pledgesFulfilled: 0,
        reportedCount: localityIssues.length,
        resolvedCount: resolved,
        inProgressCount: inProgress,
        avgResolutionDays: null,
        commitmentsCompleted: 0,
        commitmentsNeedsAttention: 0,
        responsivenessScore:
          localityIssues.length > 0 ? Math.round((resolved / localityIssues.length) * 100) : 0,
      };
    });
    return withLatency(clone(scores));
  },
};

/** The single concrete api instance. Swapping backends replaces only this binding. */
export const api: FixApi = mock;
