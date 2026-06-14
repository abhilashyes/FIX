import type {
  EventId,
  FixItDay,
  MobilizationPlan,
  Need,
  NeedId,
  Pledge,
  PledgeId,
  PlanId,
} from '@/types';
import { NeedKind, PledgeKind, asId } from '@/types';
import { METRO_LOCALITY_IDS } from '@/config/places/metro';
import { getPlace } from '@/config/places';
import { METRO_PLACE_ID } from '@/config/places/metro';
import { daysAgoISO } from '@/lib/ids';
import { ISSUE_IDS } from './issues';
import { USER_IDS } from './users';
import { CSR_ORG_ID } from './users';

const planId = (s: string): PlanId => asId<PlanId>(s);
const needId = (s: string): NeedId => asId<NeedId>(s);
const pledgeId = (s: string): PledgeId => asId<PledgeId>(s);
const eventId = (s: string): EventId => asId<EventId>(s);

export const PLAN_IDS = {
  pocketPark: planId('plan-pocket-park'),
  schoolCrossing: planId('plan-school-crossing'),
} as const;

export const EVENT_IDS = {
  pocketParkDay: eventId('event-pocket-park-day'),
} as const;

const greenfieldCenter =
  getPlace(METRO_PLACE_ID)?.localities.find((l) => l.id === METRO_LOCALITY_IDS.greenfield)?.center ??
  { lat: 12.964, lng: 77.588 };

export const mobilizationPlans: MobilizationPlan[] = [
  {
    id: PLAN_IDS.pocketPark,
    issueId: ISSUE_IDS.metroPocketPark,
    title: 'Greenfield pocket-park clean-up & planting drive',
    description: 'Clear the dumping corner and turn it into a small green space the whole neighbourhood can use.',
    createdById: USER_IDS.meera,
    needIds: [needId('need-pp-vol'), needId('need-pp-mat'), needId('need-pp-funds')],
    fixItDayIds: [EVENT_IDS.pocketParkDay],
    createdAt: daysAgoISO(22),
  },
  {
    id: PLAN_IDS.schoolCrossing,
    issueId: ISSUE_IDS.metroSchoolCrossing,
    title: 'Fund a raised school-zone crossing',
    description: 'Pool community and CSR funds to co-finance a raised crossing and signage near Mahadevi school.',
    createdById: USER_IDS.ravi,
    needIds: [needId('need-sc-funds')],
    fixItDayIds: [],
    createdAt: daysAgoISO(18),
  },
];

export const needs: Need[] = [
  {
    id: needId('need-pp-vol'),
    planId: PLAN_IDS.pocketPark,
    kind: NeedKind.Volunteers,
    label: 'Weekend volunteers',
    requiredSkills: ['gardening', 'general-labour'],
    targetQuantity: 20,
    fulfilledQuantity: 12,
  },
  {
    id: needId('need-pp-mat'),
    planId: PLAN_IDS.pocketPark,
    kind: NeedKind.Materials,
    label: 'Saplings & soil (units)',
    targetQuantity: 60,
    fulfilledQuantity: 35,
  },
  {
    id: needId('need-pp-funds'),
    planId: PLAN_IDS.pocketPark,
    kind: NeedKind.Funds,
    label: 'Tools, fencing & refreshments',
    targetQuantity: 40000,
    fundsTarget: { amount: 40000, currency: 'INR' },
    fulfilledQuantity: 26000,
    fundsRaised: { amount: 26000, currency: 'INR' },
  },
  {
    id: needId('need-sc-funds'),
    planId: PLAN_IDS.schoolCrossing,
    kind: NeedKind.Funds,
    label: 'Community co-funding for the crossing',
    targetQuantity: 150000,
    fundsTarget: { amount: 150000, currency: 'INR' },
    fulfilledQuantity: 90000,
    fundsRaised: { amount: 90000, currency: 'INR' },
  },
];

export const pledges: Pledge[] = [
  { id: pledgeId('pl-1'), needId: needId('need-pp-vol'), planId: PLAN_IDS.pocketPark, pledgerId: USER_IDS.lakshmi, kind: PledgeKind.VolunteerTime, quantity: 1, fulfilled: false, createdAt: daysAgoISO(15) },
  { id: pledgeId('pl-2'), needId: needId('need-pp-vol'), planId: PLAN_IDS.pocketPark, pledgerId: USER_IDS.divya, kind: PledgeKind.VolunteerTime, quantity: 1, fulfilled: false, createdAt: daysAgoISO(14) },
  { id: pledgeId('pl-3'), needId: needId('need-pp-funds'), planId: PLAN_IDS.pocketPark, pledgerId: USER_IDS.asha, kind: PledgeKind.Money, quantity: 1, amount: { amount: 1000, currency: 'INR' }, fulfilled: true, createdAt: daysAgoISO(12) },
  { id: pledgeId('pl-4'), needId: needId('need-sc-funds'), planId: PLAN_IDS.schoolCrossing, pledgerId: USER_IDS.nikhil, pledgerOrgId: CSR_ORG_ID, kind: PledgeKind.Money, quantity: 1, amount: { amount: 75000, currency: 'INR' }, fulfilled: true, createdAt: daysAgoISO(10) },
  { id: pledgeId('pl-5'), needId: needId('need-pp-mat'), planId: PLAN_IDS.pocketPark, pledgerId: USER_IDS.meera, kind: PledgeKind.Resource, quantity: 20, fulfilled: false, createdAt: daysAgoISO(9) },
];

export const fixItDays: FixItDay[] = [
  {
    id: EVENT_IDS.pocketParkDay,
    planId: PLAN_IDS.pocketPark,
    issueId: ISSUE_IDS.metroPocketPark,
    title: 'Pocket-park fix-it day',
    date: daysAgoISO(-7), // next week
    meetingPoint: greenfieldCenter,
    meetingPointLabel: 'Greenfield Layout corner plot (near park gate)',
    attendees: [
      { userId: USER_IDS.meera, rsvp: 'going', checkedIn: false },
      { userId: USER_IDS.lakshmi, rsvp: 'going', checkedIn: false },
      { userId: USER_IDS.divya, rsvp: 'maybe', checkedIn: false },
      { userId: USER_IDS.nikhil, orgId: CSR_ORG_ID, rsvp: 'going', checkedIn: false },
    ],
    createdAt: daysAgoISO(16),
  },
];
