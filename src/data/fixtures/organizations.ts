import type { Adoption, AdoptionId, Organization } from '@/types';
import { AdoptionTargetType, OrgType, asId } from '@/types';
import { METRO_LOCALITY_IDS, METRO_PLACE_ID } from '@/config/places/metro';
import { getPlace } from '@/config/places';
import { afterImage, beforeImage } from '@/lib/placeholderImages';
import { daysAgoISO } from '@/lib/ids';
import { CSR_ORG_ID, USER_IDS } from './users';
import { ImageGenStatus } from '@/types';

export const ADOPTION_IDS = {
  greenfieldStretch: asId<AdoptionId>('adopt-greenfield'),
} as const;

export const organizations: Organization[] = [
  {
    id: CSR_ORG_ID,
    name: 'GreenCore Technologies',
    type: OrgType.Corporate,
    placeId: METRO_PLACE_ID,
    csrManagerId: USER_IDS.nikhil,
    isSampleData: true,
    createdAt: daysAgoISO(300),
  },
];

const greenfieldCenter =
  getPlace(METRO_PLACE_ID)?.localities.find((l) => l.id === METRO_LOCALITY_IDS.greenfield)?.center ??
  { lat: 12.964, lng: 77.588 };

export const adoptions: Adoption[] = [
  {
    id: ADOPTION_IDS.greenfieldStretch,
    orgId: CSR_ORG_ID,
    placeId: METRO_PLACE_ID,
    targetType: AdoptionTargetType.Stretch,
    targetName: 'Greenfield Layout Main Road stretch',
    area: [
      { lat: greenfieldCenter.lat + 0.002, lng: greenfieldCenter.lng - 0.002 },
      { lat: greenfieldCenter.lat + 0.002, lng: greenfieldCenter.lng + 0.002 },
      { lat: greenfieldCenter.lat - 0.002, lng: greenfieldCenter.lng + 0.002 },
      { lat: greenfieldCenter.lat - 0.002, lng: greenfieldCenter.lng - 0.002 },
    ],
    localityIds: [METRO_LOCALITY_IDS.greenfield],
    commitment: {
      csrFunds: { amount: 1500000, currency: 'INR' },
      materials: ['Saplings', 'LED fixtures', 'Paint'],
      employeeVolunteerHours: 480,
    },
    periodStart: daysAgoISO(120),
    periodEnd: daysAgoISO(-245), // ~12-month commitment
    impact: {
      issuesFixedIds: [],
      fundsDeployed: { amount: 420000, currency: 'INR' },
      employeeHoursLogged: 96,
      beforeAfterPairs: [
        {
          before: { url: beforeImage('Before'), caption: 'Greenfield corner' },
          after: { url: afterImage('After'), caption: 'Adopted & greened (sample)' },
          status: ImageGenStatus.Ready,
          generatedAt: daysAgoISO(30),
        },
      ],
    },
    createdAt: daysAgoISO(120),
  },
];
