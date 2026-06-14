import type { HierarchyConfig, HierarchyRole, MockContact, OfficialId, RoleId } from '@/types';
import { HierarchyKind, asId } from '@/types';
import { STATE_IDS } from '@/config/states';
import { METRO_LOCALITY_IDS } from '@/config/places/metro';
import { TOWN_LOCALITY_IDS } from '@/config/places/town';

const sample = (): MockContact => ({
  email: 'office@sample.gov.example',
  phone: '+91 80 0000 0000',
  note: 'Sample data — not a real person/contact',
});

const rid = (s: string): RoleId => asId<RoleId>(s);
const oid = (s: string): OfficialId => asId<OfficialId>(s);

const CM = rid('hp-role-cm');

// North wards vs south wards (metro), with the town grouped under the south AEE for the demo.
const northLocalities = [
  METRO_LOCALITY_IDS.jalnagar,
  METRO_LOCALITY_IDS.kempapura,
  METRO_LOCALITY_IDS.rishivalley,
];
const southLocalities = [
  METRO_LOCALITY_IDS.sundarpet,
  METRO_LOCALITY_IDS.greenfield,
  METRO_LOCALITY_IDS.mahadevi,
  METRO_LOCALITY_IDS.oldtown,
  TOWN_LOCALITY_IDS.market,
  TOWN_LOCALITY_IDS.station,
  TOWN_LOCALITY_IDS.temple,
  TOWN_LOCALITY_IDS.newcolony,
  TOWN_LOCALITY_IDS.riverside,
];

const administrativeRoles: HierarchyRole[] = [
  {
    id: rid('hp-role-commissioner'),
    kind: HierarchyKind.Administrative,
    title: 'Municipal Commissioner',
    level: 1,
    parentRoleId: CM,
    jurisdiction: { localityIds: [], scopeLabel: 'Nayanagar Municipal Corporation' },
    officeHolder: {
      id: oid('hp-off-commissioner'),
      name: 'A. Ramesh (sample)',
      designation: 'Municipal Commissioner',
      jurisdictionLabel: 'Nayanagar Municipal Corporation',
      contact: sample(),
      isSampleData: true,
    },
  },
  {
    id: rid('hp-role-ee'),
    kind: HierarchyKind.Administrative,
    title: 'Executive Engineer',
    level: 2,
    parentRoleId: rid('hp-role-commissioner'),
    jurisdiction: { localityIds: [], scopeLabel: 'City Engineering Division' },
    officeHolder: {
      id: oid('hp-off-ee'),
      name: 'S. Lakshmi (sample)',
      designation: 'Executive Engineer',
      jurisdictionLabel: 'City Engineering Division',
      contact: sample(),
      isSampleData: true,
    },
  },
  {
    id: rid('hp-role-aee-north'),
    kind: HierarchyKind.Administrative,
    title: 'Assistant Executive Engineer (North)',
    level: 3,
    parentRoleId: rid('hp-role-ee'),
    jurisdiction: { localityIds: northLocalities, scopeLabel: 'North Zone' },
    officeHolder: {
      id: oid('hp-off-aee-north'),
      name: 'M. Iqbal (sample)',
      designation: 'Assistant Executive Engineer, North Zone',
      jurisdictionLabel: 'North Zone',
      contact: sample(),
      isSampleData: true,
    },
  },
  {
    id: rid('hp-role-aee-south'),
    kind: HierarchyKind.Administrative,
    title: 'Assistant Executive Engineer (South)',
    level: 3,
    parentRoleId: rid('hp-role-ee'),
    jurisdiction: { localityIds: southLocalities, scopeLabel: 'South Zone' },
    officeHolder: {
      id: oid('hp-off-aee-south'),
      name: 'P. Anjali (sample)',
      designation: 'Assistant Executive Engineer, South Zone',
      jurisdictionLabel: 'South Zone',
      contact: sample(),
      isSampleData: true,
    },
  },
  {
    id: rid('hp-role-we-north'),
    kind: HierarchyKind.Administrative,
    title: 'Ward Engineer (North)',
    level: 4,
    parentRoleId: rid('hp-role-aee-north'),
    jurisdiction: { localityIds: northLocalities, scopeLabel: 'North wards' },
    officeHolder: {
      id: oid('hp-off-we-north'),
      name: 'R. Kumar (sample)',
      designation: 'Ward Engineer, North wards',
      jurisdictionLabel: 'North wards',
      contact: sample(),
      isSampleData: true,
    },
  },
  {
    id: rid('hp-role-we-south'),
    kind: HierarchyKind.Administrative,
    title: 'Ward Engineer (South)',
    level: 4,
    parentRoleId: rid('hp-role-aee-south'),
    jurisdiction: { localityIds: southLocalities, scopeLabel: 'South wards' },
    officeHolder: {
      id: oid('hp-off-we-south'),
      name: 'V. Fatima (sample)',
      designation: 'Ward Engineer, South wards',
      jurisdictionLabel: 'South wards',
      contact: sample(),
      isSampleData: true,
    },
  },
];

const electedRoles: HierarchyRole[] = [
  {
    id: CM,
    kind: HierarchyKind.Elected,
    title: 'Chief Minister',
    level: 0,
    parentRoleId: null,
    jurisdiction: { localityIds: [], scopeLabel: 'State of Haritha Pradesh' },
    officeHolder: {
      id: oid('hp-off-cm'),
      name: 'Dr. N. Sharma (sample)',
      designation: 'Chief Minister, Haritha Pradesh',
      jurisdictionLabel: 'State of Haritha Pradesh',
      contact: sample(),
      isSampleData: true,
    },
  },
  {
    id: rid('hp-role-minister'),
    kind: HierarchyKind.Elected,
    title: 'Minister for Urban Development',
    level: 1,
    parentRoleId: CM,
    jurisdiction: { localityIds: [], scopeLabel: 'Urban Development, Haritha Pradesh' },
    officeHolder: {
      id: oid('hp-off-minister'),
      name: 'K. Devi (sample)',
      designation: 'Minister for Urban Development',
      jurisdictionLabel: 'Haritha Pradesh',
      contact: sample(),
      isSampleData: true,
    },
  },
  {
    id: rid('hp-role-mp'),
    kind: HierarchyKind.Elected,
    title: 'Member of Parliament',
    level: 2,
    parentRoleId: rid('hp-role-minister'),
    jurisdiction: { localityIds: [], constituencyNames: ['Nayanagar (Lok Sabha)'], scopeLabel: 'Nayanagar (Lok Sabha)' },
    officeHolder: {
      id: oid('hp-off-mp'),
      name: 'T. Reddy (sample)',
      designation: 'Member of Parliament, Nayanagar',
      jurisdictionLabel: 'Nayanagar (Lok Sabha)',
      contact: sample(),
      isSampleData: true,
    },
  },
  {
    id: rid('hp-role-mla-north'),
    kind: HierarchyKind.Elected,
    title: 'MLA (Nayanagar North)',
    level: 3,
    parentRoleId: rid('hp-role-mp'),
    jurisdiction: { localityIds: northLocalities, constituencyNames: ['Nayanagar North'], scopeLabel: 'Nayanagar North' },
    officeHolder: {
      id: oid('hp-off-mla-north'),
      name: 'G. Nair (sample)',
      designation: 'MLA, Nayanagar North',
      jurisdictionLabel: 'Nayanagar North',
      contact: sample(),
      isSampleData: true,
    },
  },
  {
    id: rid('hp-role-mla-south'),
    kind: HierarchyKind.Elected,
    title: 'MLA (Nayanagar South)',
    level: 3,
    parentRoleId: rid('hp-role-mp'),
    jurisdiction: { localityIds: southLocalities, constituencyNames: ['Nayanagar South'], scopeLabel: 'Nayanagar South' },
    officeHolder: {
      id: oid('hp-off-mla-south'),
      name: 'B. Pillai (sample)',
      designation: 'MLA, Nayanagar South',
      jurisdictionLabel: 'Nayanagar South',
      contact: sample(),
      isSampleData: true,
    },
  },
  {
    id: rid('hp-role-corp-north'),
    kind: HierarchyKind.Elected,
    title: 'Corporator (North wards)',
    level: 4,
    parentRoleId: rid('hp-role-mla-north'),
    jurisdiction: { localityIds: northLocalities, scopeLabel: 'North wards' },
    officeHolder: {
      id: oid('hp-off-corp-north'),
      name: 'L. Mathew (sample)',
      designation: 'Corporator, North wards',
      jurisdictionLabel: 'North wards',
      contact: sample(),
      isSampleData: true,
    },
  },
  {
    id: rid('hp-role-corp-south'),
    kind: HierarchyKind.Elected,
    title: 'Corporator (South wards)',
    level: 4,
    parentRoleId: rid('hp-role-mla-south'),
    jurisdiction: { localityIds: southLocalities, scopeLabel: 'South wards' },
    officeHolder: {
      id: oid('hp-off-corp-south'),
      name: 'S. Begum (sample)',
      designation: 'Corporator, South wards',
      jurisdictionLabel: 'South wards',
      contact: sample(),
      isSampleData: true,
    },
  },
];

export const urbanHierarchy: HierarchyConfig = {
  stateId: STATE_IDS.harithaPradesh,
  stateName: 'Haritha Pradesh',
  administrativeRoles,
  electedRoles,
  chiefMinisterRoleId: CM,
};
