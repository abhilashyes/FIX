import type { HierarchyConfig, HierarchyRole, MockContact, OfficialId, RoleId } from '@/types';
import { HierarchyKind, asId } from '@/types';
import { STATE_IDS } from '@/config/states';

const sample = (): MockContact => ({
  email: 'office@sample.gov.example',
  phone: '+91 00 0000 0000',
  note: 'Sample data — not a real person/contact',
});

const rid = (s: string): RoleId => asId<RoleId>(s);
const oid = (s: string): OfficialId => asId<OfficialId>(s);

const CM = rid('nv-role-cm');

/**
 * Generic three-tier panchayati-raj administrative chain:
 * Panchayat Secretary → PDO → BDO → District Collector → State Dept → Chief Minister.
 * Jurisdictions left broad (whole panchayat) for the village demo.
 */
const administrativeRoles: HierarchyRole[] = [
  {
    id: rid('nv-role-collector'),
    kind: HierarchyKind.Administrative,
    title: 'District Collector',
    level: 1,
    parentRoleId: CM,
    jurisdiction: { localityIds: [], scopeLabel: 'Nadu Valley District' },
    officeHolder: {
      id: oid('nv-off-collector'),
      name: 'D. Selvan (sample)',
      designation: 'District Collector',
      jurisdictionLabel: 'Nadu Valley District',
      contact: sample(),
      isSampleData: true,
    },
  },
  {
    id: rid('nv-role-bdo'),
    kind: HierarchyKind.Administrative,
    title: 'Block Development Officer',
    level: 2,
    parentRoleId: rid('nv-role-collector'),
    jurisdiction: { localityIds: [], scopeLabel: 'Development Block' },
    officeHolder: {
      id: oid('nv-off-bdo'),
      name: 'M. Arasi (sample)',
      designation: 'Block Development Officer',
      jurisdictionLabel: 'Development Block',
      contact: sample(),
      isSampleData: true,
    },
  },
  {
    id: rid('nv-role-pdo'),
    kind: HierarchyKind.Administrative,
    title: 'Panchayat Development Officer',
    level: 3,
    parentRoleId: rid('nv-role-bdo'),
    jurisdiction: { localityIds: [], scopeLabel: 'Hosakere cluster' },
    officeHolder: {
      id: oid('nv-off-pdo'),
      name: 'K. Murugan (sample)',
      designation: 'Panchayat Development Officer',
      jurisdictionLabel: 'Hosakere cluster',
      contact: sample(),
      isSampleData: true,
    },
  },
  {
    id: rid('nv-role-secretary'),
    kind: HierarchyKind.Administrative,
    title: 'Panchayat Secretary',
    level: 4,
    parentRoleId: rid('nv-role-pdo'),
    jurisdiction: { localityIds: [], scopeLabel: 'Hosakere Gram Panchayat' },
    officeHolder: {
      id: oid('nv-off-secretary'),
      name: 'S. Amudha (sample)',
      designation: 'Panchayat Secretary',
      jurisdictionLabel: 'Hosakere Gram Panchayat',
      contact: sample(),
      isSampleData: true,
    },
  },
];

/** Elected chain: Ward Member → Panchayat President → MLA → MP → State Minister → CM. */
const electedRoles: HierarchyRole[] = [
  {
    id: CM,
    kind: HierarchyKind.Elected,
    title: 'Chief Minister',
    level: 0,
    parentRoleId: null,
    jurisdiction: { localityIds: [], scopeLabel: 'State of Nadu Valley' },
    officeHolder: {
      id: oid('nv-off-cm'),
      name: 'Dr. R. Valli (sample)',
      designation: 'Chief Minister, Nadu Valley',
      jurisdictionLabel: 'State of Nadu Valley',
      contact: sample(),
      isSampleData: true,
    },
  },
  {
    id: rid('nv-role-minister'),
    kind: HierarchyKind.Elected,
    title: 'Minister for Rural Development',
    level: 1,
    parentRoleId: CM,
    jurisdiction: { localityIds: [], scopeLabel: 'Rural Development, Nadu Valley' },
    officeHolder: {
      id: oid('nv-off-minister'),
      name: 'P. Kannan (sample)',
      designation: 'Minister for Rural Development',
      jurisdictionLabel: 'Nadu Valley',
      contact: sample(),
      isSampleData: true,
    },
  },
  {
    id: rid('nv-role-mp'),
    kind: HierarchyKind.Elected,
    title: 'Member of Parliament',
    level: 2,
    parentRoleId: rid('nv-role-minister'),
    jurisdiction: { localityIds: [], constituencyNames: ['Nadu Valley (Lok Sabha)'], scopeLabel: 'Nadu Valley (Lok Sabha)' },
    officeHolder: {
      id: oid('nv-off-mp'),
      name: 'A. Maran (sample)',
      designation: 'Member of Parliament',
      jurisdictionLabel: 'Nadu Valley (Lok Sabha)',
      contact: sample(),
      isSampleData: true,
    },
  },
  {
    id: rid('nv-role-mla'),
    kind: HierarchyKind.Elected,
    title: 'MLA (Hosakere constituency)',
    level: 3,
    parentRoleId: rid('nv-role-mp'),
    jurisdiction: { localityIds: [], constituencyNames: ['Hosakere'], scopeLabel: 'Hosakere constituency' },
    officeHolder: {
      id: oid('nv-off-mla'),
      name: 'V. Ezhil (sample)',
      designation: 'MLA, Hosakere',
      jurisdictionLabel: 'Hosakere constituency',
      contact: sample(),
      isSampleData: true,
    },
  },
  {
    id: rid('nv-role-president'),
    kind: HierarchyKind.Elected,
    title: 'Panchayat President',
    level: 4,
    parentRoleId: rid('nv-role-mla'),
    jurisdiction: { localityIds: [], scopeLabel: 'Hosakere Gram Panchayat' },
    officeHolder: {
      id: oid('nv-off-president'),
      name: 'T. Bhuvana (sample)',
      designation: 'Panchayat President',
      jurisdictionLabel: 'Hosakere Gram Panchayat',
      contact: sample(),
      isSampleData: true,
    },
  },
  {
    id: rid('nv-role-wardmember'),
    kind: HierarchyKind.Elected,
    title: 'Ward Member',
    level: 5,
    parentRoleId: rid('nv-role-president'),
    jurisdiction: { localityIds: [], scopeLabel: 'Panchayat ward' },
    officeHolder: {
      id: oid('nv-off-wardmember'),
      name: 'M. Sundari (sample)',
      designation: 'Ward Member',
      jurisdictionLabel: 'Panchayat ward',
      contact: sample(),
      isSampleData: true,
    },
  },
];

export const ruralHierarchy: HierarchyConfig = {
  stateId: STATE_IDS.naduValley,
  stateName: 'Nadu Valley',
  administrativeRoles,
  electedRoles,
  chiefMinisterRoleId: CM,
};
