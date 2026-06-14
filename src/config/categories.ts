import type { CategoryId } from '@/types';
import { asId } from '@/types';

/** Stable category ids (overridable per place config). */
export const CATEGORY_IDS = {
  roads: asId<CategoryId>('cat-roads'),
  traffic: asId<CategoryId>('cat-traffic'),
  safety: asId<CategoryId>('cat-safety'),
  footpaths: asId<CategoryId>('cat-footpaths'),
  streetlights: asId<CategoryId>('cat-streetlights'),
  waste: asId<CategoryId>('cat-waste'),
  water: asId<CategoryId>('cat-water'),
  parks: asId<CategoryId>('cat-parks'),
  other: asId<CategoryId>('cat-other'),
} as const;

export interface CategoryCatalogEntry {
  id: CategoryId;
  labelKey: string;
  icon: string;
  defaultRoleTitle: string;
}

/**
 * Shared category catalog. Places reference these (and may add/override).
 * `icon` maps to the category icon registry; `labelKey` into the i18n `issue` namespace.
 */
export const CATEGORY_CATALOG: readonly CategoryCatalogEntry[] = [
  { id: CATEGORY_IDS.roads, labelKey: 'category.roads', icon: 'road', defaultRoleTitle: 'Ward Engineer' },
  { id: CATEGORY_IDS.traffic, labelKey: 'category.traffic', icon: 'traffic', defaultRoleTitle: 'Traffic Engineer' },
  { id: CATEGORY_IDS.safety, labelKey: 'category.safety', icon: 'safety', defaultRoleTitle: 'Road Safety Officer' },
  { id: CATEGORY_IDS.footpaths, labelKey: 'category.footpaths', icon: 'footpath', defaultRoleTitle: 'Ward Engineer' },
  { id: CATEGORY_IDS.streetlights, labelKey: 'category.streetlights', icon: 'streetlight', defaultRoleTitle: 'Electrical Engineer' },
  { id: CATEGORY_IDS.waste, labelKey: 'category.waste', icon: 'waste', defaultRoleTitle: 'Sanitation Inspector' },
  { id: CATEGORY_IDS.water, labelKey: 'category.water', icon: 'water', defaultRoleTitle: 'Water Works Engineer' },
  { id: CATEGORY_IDS.parks, labelKey: 'category.parks', icon: 'park', defaultRoleTitle: 'Horticulture Officer' },
  { id: CATEGORY_IDS.other, labelKey: 'category.other', icon: 'other', defaultRoleTitle: 'Ward Officer' },
] as const;

export const getCategory = (id: CategoryId): CategoryCatalogEntry | undefined =>
  CATEGORY_CATALOG.find((c) => c.id === id);
