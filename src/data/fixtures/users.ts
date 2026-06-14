import type { OrgId, User, UserId } from '@/types';
import { UserRole, asId } from '@/types';
import { METRO_PLACE_ID, METRO_LOCALITY_IDS } from '@/config/places/metro';
import { TOWN_PLACE_ID, TOWN_LOCALITY_IDS } from '@/config/places/town';
import { VILLAGE_PLACE_ID, VILLAGE_LOCALITY_IDS } from '@/config/places/village';
import { daysAgoISO } from '@/lib/ids';

export const CSR_ORG_ID = asId<OrgId>('org-greencore');

const uid = (s: string): UserId => asId<UserId>(s);

/** The five primary demo personas (plus supporting residents for realistic activity). */
export const USER_IDS = {
  asha: uid('user-asha'), // resident
  ravi: uid('user-ravi'), // community lead
  meera: uid('user-meera'), // NGO coordinator
  suresh: uid('user-suresh'), // civic official
  nikhil: uid('user-nikhil'), // corporate CSR manager
  divya: uid('user-divya'),
  imran: uid('user-imran'),
  lakshmi: uid('user-lakshmi'),
  town1: uid('user-town-gopal'),
  town2: uid('user-town-fatima'),
  village1: uid('user-village-murugan'),
  village2: uid('user-village-amudha'),
} as const;

const rep = (
  points: number,
  breakdown: Partial<User['reputation']['breakdown']> = {},
): User['reputation'] => ({
  points,
  level: 1 + Math.floor(points / 100),
  breakdown: {
    reports: 0,
    verifiedReports: 0,
    acceptedCountermeasures: 0,
    helpfulComments: 0,
    pledgesFulfilled: 0,
    resolutionsContributed: 0,
    referrals: 0,
    ...breakdown,
  },
});

const contact = {
  email: 'demo@sample.example',
  phone: '+91 90000 00000',
  note: 'Sample data — not a real person/contact' as const,
};

export const users: User[] = [
  {
    id: USER_IDS.asha,
    displayName: 'Asha Reddy',
    role: UserRole.Resident,
    placeId: METRO_PLACE_ID,
    homeLocalityId: METRO_LOCALITY_IDS.jalnagar,
    skills: ['photography', 'first-aid'],
    reputation: rep(120, { reports: 6, verifiedReports: 4 }),
    contact,
    isSampleData: true,
    createdAt: daysAgoISO(220),
  },
  {
    id: USER_IDS.ravi,
    displayName: 'Ravi Menon',
    role: UserRole.CommunityLead,
    placeId: METRO_PLACE_ID,
    homeLocalityId: METRO_LOCALITY_IDS.sundarpet,
    skills: ['organizing', 'masonry', 'fundraising'],
    reputation: rep(340, { reports: 9, verifiedReports: 8, acceptedCountermeasures: 3, resolutionsContributed: 2 }),
    contact,
    isSampleData: true,
    createdAt: daysAgoISO(400),
  },
  {
    id: USER_IDS.meera,
    displayName: 'Meera Iyer',
    role: UserRole.NgoCoordinator,
    placeId: METRO_PLACE_ID,
    homeLocalityId: METRO_LOCALITY_IDS.greenfield,
    skills: ['coordination', 'grant-writing', 'community-outreach'],
    reputation: rep(280, { reports: 4, verifiedReports: 4, pledgesFulfilled: 6 }),
    contact,
    isSampleData: true,
    createdAt: daysAgoISO(360),
  },
  {
    id: USER_IDS.suresh,
    displayName: 'Suresh Kulkarni',
    role: UserRole.CivicOfficial,
    placeId: METRO_PLACE_ID,
    homeLocalityId: METRO_LOCALITY_IDS.kempapura,
    skills: ['civil-engineering'],
    reputation: rep(90, { resolutionsContributed: 5 }),
    contact,
    isSampleData: true,
    createdAt: daysAgoISO(500),
  },
  {
    id: USER_IDS.nikhil,
    displayName: 'Nikhil Rao',
    role: UserRole.CsrManager,
    placeId: METRO_PLACE_ID,
    orgId: CSR_ORG_ID,
    homeLocalityId: METRO_LOCALITY_IDS.rishivalley,
    skills: ['csr-strategy', 'project-management'],
    reputation: rep(150, { pledgesFulfilled: 3, resolutionsContributed: 2 }),
    contact,
    isSampleData: true,
    createdAt: daysAgoISO(300),
  },
  {
    id: USER_IDS.divya,
    displayName: 'Divya Shenoy',
    role: UserRole.Resident,
    placeId: METRO_PLACE_ID,
    homeLocalityId: METRO_LOCALITY_IDS.mahadevi,
    skills: ['gardening'],
    reputation: rep(70, { reports: 3, verifiedReports: 2 }),
    contact,
    isSampleData: true,
    createdAt: daysAgoISO(150),
  },
  {
    id: USER_IDS.imran,
    displayName: 'Imran Khan',
    role: UserRole.Resident,
    placeId: METRO_PLACE_ID,
    homeLocalityId: METRO_LOCALITY_IDS.oldtown,
    skills: ['electrical'],
    reputation: rep(95, { reports: 5, verifiedReports: 3 }),
    contact,
    isSampleData: true,
    createdAt: daysAgoISO(180),
  },
  {
    id: USER_IDS.lakshmi,
    displayName: 'Lakshmi Pillai',
    role: UserRole.Resident,
    placeId: METRO_PLACE_ID,
    homeLocalityId: METRO_LOCALITY_IDS.greenfield,
    skills: ['teaching'],
    reputation: rep(60, { reports: 2, verifiedReports: 2 }),
    contact,
    isSampleData: true,
    createdAt: daysAgoISO(140),
  },
  {
    id: USER_IDS.town1,
    displayName: 'Gopal Hegde',
    role: UserRole.CommunityLead,
    placeId: TOWN_PLACE_ID,
    homeLocalityId: TOWN_LOCALITY_IDS.market,
    skills: ['organizing'],
    reputation: rep(110, { reports: 4, verifiedReports: 3 }),
    contact,
    isSampleData: true,
    createdAt: daysAgoISO(200),
  },
  {
    id: USER_IDS.town2,
    displayName: 'Fatima Sheikh',
    role: UserRole.Resident,
    placeId: TOWN_PLACE_ID,
    homeLocalityId: TOWN_LOCALITY_IDS.station,
    skills: ['first-aid'],
    reputation: rep(50, { reports: 2, verifiedReports: 1 }),
    contact,
    isSampleData: true,
    createdAt: daysAgoISO(120),
  },
  {
    id: USER_IDS.village1,
    displayName: 'Murugan S.',
    role: UserRole.CommunityLead,
    placeId: VILLAGE_PLACE_ID,
    homeLocalityId: VILLAGE_LOCALITY_IDS.mainvillage,
    skills: ['farming', 'organizing'],
    reputation: rep(85, { reports: 3, verifiedReports: 3 }),
    contact,
    isSampleData: true,
    createdAt: daysAgoISO(160),
  },
  {
    id: USER_IDS.village2,
    displayName: 'Amudha R.',
    role: UserRole.Resident,
    placeId: VILLAGE_PLACE_ID,
    homeLocalityId: VILLAGE_LOCALITY_IDS.tankarea,
    skills: ['weaving'],
    reputation: rep(40, { reports: 2, verifiedReports: 1 }),
    contact,
    isSampleData: true,
    createdAt: daysAgoISO(100),
  },
];
