import type { LocalityId, Locality, PlaceConfig, PlaceId, ResponsibleAuthorityMapping } from '@/types';
import { LanguageCode, PlaceType, asId } from '@/types';
import { CATEGORY_CATALOG, CATEGORY_IDS } from '@/config/categories';
import { STATE_IDS } from '@/config/states';

export const VILLAGE_PLACE_ID = asId<PlaceId>('place-village-hosakere');

/** Gram panchayat wards/hamlets for the fictional village, Hosakere. */
export const VILLAGE_LOCALITY_IDS = {
  mainvillage: asId<LocalityId>('loc-village-main'),
  tankarea: asId<LocalityId>('loc-village-tank'),
  hillside: asId<LocalityId>('loc-village-hillside'),
  fields: asId<LocalityId>('loc-village-fields'),
} as const;

const localities: Locality[] = [
  { id: VILLAGE_LOCALITY_IDS.mainvillage, name: 'Main Village', center: { lat: 11.412, lng: 78.21 }, population: 1800 },
  { id: VILLAGE_LOCALITY_IDS.tankarea, name: 'Tank Area', center: { lat: 11.418, lng: 78.216 }, population: 950 },
  { id: VILLAGE_LOCALITY_IDS.hillside, name: 'Hillside Hamlet', center: { lat: 11.405, lng: 78.203 }, population: 620 },
  { id: VILLAGE_LOCALITY_IDS.fields, name: 'Field Colony', center: { lat: 11.421, lng: 78.198 }, population: 540 },
];

const responsibleAuthorityMap: ResponsibleAuthorityMapping[] = [
  { categoryId: CATEGORY_IDS.roads, department: 'Gram Panchayat', roleTitle: 'Panchayat Secretary' },
  { categoryId: CATEGORY_IDS.traffic, department: 'Gram Panchayat', roleTitle: 'Panchayat Secretary' },
  { categoryId: CATEGORY_IDS.safety, department: 'Gram Panchayat', roleTitle: 'Panchayat Secretary' },
  { categoryId: CATEGORY_IDS.footpaths, department: 'Gram Panchayat', roleTitle: 'Panchayat Secretary' },
  { categoryId: CATEGORY_IDS.streetlights, department: 'Gram Panchayat', roleTitle: 'Panchayat Secretary' },
  { categoryId: CATEGORY_IDS.waste, department: 'Gram Panchayat', roleTitle: 'Sanitation Worker Lead' },
  { categoryId: CATEGORY_IDS.water, department: 'Rural Water Supply', roleTitle: 'Panchayat Development Officer' },
  { categoryId: CATEGORY_IDS.parks, department: 'Gram Panchayat', roleTitle: 'Panchayat Secretary' },
  { categoryId: CATEGORY_IDS.other, department: 'Gram Panchayat', roleTitle: 'Panchayat Secretary' },
];

export const villagePlace: PlaceConfig = {
  id: VILLAGE_PLACE_ID,
  name: 'Hosakere',
  type: PlaceType.Village,
  state: STATE_IDS.naduValley,
  country: 'India',
  locale: 'en-IN',
  currency: 'INR',
  timezone: 'Asia/Kolkata',
  mapCenter: { lat: 11.413, lng: 78.208 },
  mapZoom: 14,
  localityLabel: 'ward',
  localities,
  issueCategories: CATEGORY_CATALOG.map((c) => ({
    id: c.id,
    labelKey: c.labelKey,
    icon: c.icon,
    defaultRoleTitle: c.defaultRoleTitle,
  })),
  civicBodyName: 'Hosakere Gram Panchayat',
  responsibleAuthorityMap,
  defaultLanguage: LanguageCode.Ta,
  languages: [LanguageCode.En, LanguageCode.Hi, LanguageCode.Kn, LanguageCode.Ta, LanguageCode.Te],
  hierarchyStateId: STATE_IDS.naduValley,
};
