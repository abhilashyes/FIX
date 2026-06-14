import type { LocalityId, Locality, PlaceConfig, PlaceId, ResponsibleAuthorityMapping } from '@/types';
import { LanguageCode, PlaceType, asId } from '@/types';
import { CATEGORY_CATALOG, CATEGORY_IDS } from '@/config/categories';
import { STATE_IDS } from '@/config/states';

export const TOWN_PLACE_ID = asId<PlaceId>('place-town-devarahalli');

/** Municipal wards for the fictional small town, Devarahalli. */
export const TOWN_LOCALITY_IDS = {
  market: asId<LocalityId>('loc-town-market'),
  station: asId<LocalityId>('loc-town-station'),
  temple: asId<LocalityId>('loc-town-temple'),
  newcolony: asId<LocalityId>('loc-town-newcolony'),
  riverside: asId<LocalityId>('loc-town-riverside'),
} as const;

const localities: Locality[] = [
  { id: TOWN_LOCALITY_IDS.market, name: 'Market Ward', center: { lat: 13.342, lng: 76.95 }, population: 9200 },
  { id: TOWN_LOCALITY_IDS.station, name: 'Station Ward', center: { lat: 13.349, lng: 76.957 }, population: 7600 },
  { id: TOWN_LOCALITY_IDS.temple, name: 'Temple Ward', center: { lat: 13.336, lng: 76.944 }, population: 8100 },
  { id: TOWN_LOCALITY_IDS.newcolony, name: 'New Colony', center: { lat: 13.353, lng: 76.948 }, population: 6400 },
  { id: TOWN_LOCALITY_IDS.riverside, name: 'Riverside', center: { lat: 13.33, lng: 76.96 }, population: 5200 },
];

const responsibleAuthorityMap: ResponsibleAuthorityMapping[] = [
  { categoryId: CATEGORY_IDS.roads, department: 'Public Works', roleTitle: 'Junior Engineer' },
  { categoryId: CATEGORY_IDS.traffic, department: 'Public Works', roleTitle: 'Junior Engineer' },
  { categoryId: CATEGORY_IDS.safety, department: 'Public Works', roleTitle: 'Junior Engineer' },
  { categoryId: CATEGORY_IDS.footpaths, department: 'Public Works', roleTitle: 'Junior Engineer' },
  { categoryId: CATEGORY_IDS.streetlights, department: 'Electrical Section', roleTitle: 'Electrical Supervisor' },
  { categoryId: CATEGORY_IDS.waste, department: 'Sanitation', roleTitle: 'Health Inspector' },
  { categoryId: CATEGORY_IDS.water, department: 'Water Supply', roleTitle: 'Water Supervisor' },
  { categoryId: CATEGORY_IDS.parks, department: 'Public Works', roleTitle: 'Junior Engineer' },
  { categoryId: CATEGORY_IDS.other, department: 'Municipal Office', roleTitle: 'Municipal Officer' },
];

export const townPlace: PlaceConfig = {
  id: TOWN_PLACE_ID,
  name: 'Devarahalli',
  type: PlaceType.Town,
  state: STATE_IDS.harithaPradesh,
  country: 'India',
  locale: 'en-IN',
  currency: 'INR',
  timezone: 'Asia/Kolkata',
  mapCenter: { lat: 13.342, lng: 76.952 },
  mapZoom: 14,
  localityLabel: 'ward',
  localities,
  issueCategories: CATEGORY_CATALOG.map((c) => ({
    id: c.id,
    labelKey: c.labelKey,
    icon: c.icon,
    defaultRoleTitle: c.defaultRoleTitle,
  })),
  civicBodyName: 'Devarahalli Town Municipal Council',
  responsibleAuthorityMap,
  defaultLanguage: LanguageCode.Kn,
  languages: [LanguageCode.En, LanguageCode.Hi, LanguageCode.Kn, LanguageCode.Ta, LanguageCode.Te],
  hierarchyStateId: STATE_IDS.harithaPradesh,
};
