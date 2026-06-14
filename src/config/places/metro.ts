import type { LocalityId, Locality, PlaceConfig, PlaceId, ResponsibleAuthorityMapping } from '@/types';
import { LanguageCode, PlaceType, asId } from '@/types';
import { CATEGORY_CATALOG, CATEGORY_IDS } from '@/config/categories';
import { STATE_IDS } from '@/config/states';

export const METRO_PLACE_ID = asId<PlaceId>('place-metro-nayanagar');

/** Ward ids for the fictional metro, Nayanagar. */
export const METRO_LOCALITY_IDS = {
  jalnagar: asId<LocalityId>('loc-metro-jalnagar'),
  sundarpet: asId<LocalityId>('loc-metro-sundarpet'),
  greenfield: asId<LocalityId>('loc-metro-greenfield'),
  kempapura: asId<LocalityId>('loc-metro-kempapura'),
  mahadevi: asId<LocalityId>('loc-metro-mahadevi'),
  rishivalley: asId<LocalityId>('loc-metro-rishivalley'),
  oldtown: asId<LocalityId>('loc-metro-oldtown'),
} as const;

const localities: Locality[] = [
  { id: METRO_LOCALITY_IDS.jalnagar, name: 'Jalnagar', center: { lat: 12.985, lng: 77.602 }, population: 48000 },
  { id: METRO_LOCALITY_IDS.sundarpet, name: 'Sundarpet', center: { lat: 12.972, lng: 77.61 }, population: 53000 },
  { id: METRO_LOCALITY_IDS.greenfield, name: 'Greenfield Layout', center: { lat: 12.964, lng: 77.588 }, population: 39000 },
  { id: METRO_LOCALITY_IDS.kempapura, name: 'Kempapura', center: { lat: 12.99, lng: 77.575 }, population: 61000 },
  { id: METRO_LOCALITY_IDS.mahadevi, name: 'Mahadevi Nagar', center: { lat: 12.957, lng: 77.604 }, population: 44000 },
  { id: METRO_LOCALITY_IDS.rishivalley, name: 'Rishi Valley', center: { lat: 12.978, lng: 77.566 }, population: 35000 },
  { id: METRO_LOCALITY_IDS.oldtown, name: 'Old Town', center: { lat: 12.969, lng: 77.594 }, population: 57000 },
];

const responsibleAuthorityMap: ResponsibleAuthorityMapping[] = [
  { categoryId: CATEGORY_IDS.roads, department: 'Roads & Infrastructure', roleTitle: 'Ward Engineer' },
  { categoryId: CATEGORY_IDS.traffic, department: 'Traffic Engineering Cell', roleTitle: 'Traffic Engineer' },
  { categoryId: CATEGORY_IDS.safety, department: 'Road Safety Unit', roleTitle: 'Road Safety Officer' },
  { categoryId: CATEGORY_IDS.footpaths, department: 'Roads & Infrastructure', roleTitle: 'Ward Engineer' },
  { categoryId: CATEGORY_IDS.streetlights, department: 'Electrical Maintenance', roleTitle: 'Electrical Engineer' },
  { categoryId: CATEGORY_IDS.waste, department: 'Solid Waste Management', roleTitle: 'Sanitation Inspector' },
  { categoryId: CATEGORY_IDS.water, department: 'Water Supply & Sewerage', roleTitle: 'Water Works Engineer' },
  { categoryId: CATEGORY_IDS.parks, department: 'Horticulture', roleTitle: 'Horticulture Officer' },
  { categoryId: CATEGORY_IDS.other, department: 'Ward Administration', roleTitle: 'Ward Officer' },
];

export const metroPlace: PlaceConfig = {
  id: METRO_PLACE_ID,
  name: 'Nayanagar',
  type: PlaceType.City,
  state: STATE_IDS.harithaPradesh,
  country: 'India',
  locale: 'en-IN',
  currency: 'INR',
  timezone: 'Asia/Kolkata',
  mapCenter: { lat: 12.975, lng: 77.592 },
  mapZoom: 13,
  localityLabel: 'ward',
  localities,
  issueCategories: CATEGORY_CATALOG.map((c) => ({
    id: c.id,
    labelKey: c.labelKey,
    icon: c.icon,
    defaultRoleTitle: c.defaultRoleTitle,
  })),
  civicBodyName: 'Nayanagar Municipal Corporation',
  responsibleAuthorityMap,
  defaultLanguage: LanguageCode.Kn,
  languages: [LanguageCode.En, LanguageCode.Hi, LanguageCode.Kn, LanguageCode.Ta, LanguageCode.Te],
  hierarchyStateId: STATE_IDS.harithaPradesh,
};
