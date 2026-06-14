import type { CategoryId, LocalityId, PlaceId, StateId } from './ids';
import type { GeoPoint } from './common';
import { LanguageCode, PlaceType } from './enums';

export interface Locality {
  id: LocalityId;
  name: string;
  center: GeoPoint;
  /** Optional polygon for heatmap bucketing. */
  bounds?: GeoPoint[];
  /** Feeds affected-population estimate defaults. */
  population?: number;
}

export interface IssueCategoryDef {
  id: CategoryId;
  labelKey: string;
  /** Icon id resolved by the category icon registry. */
  icon: string;
  /** Default administrative responsible role. */
  defaultRoleTitle: string;
}

export interface ResponsibleAuthorityMapping {
  categoryId: CategoryId;
  department: string;
  /** Designation responsible for this category. */
  roleTitle: string;
}

/** Everything about a "place" is configuration — nothing hardcoded into components. */
export interface PlaceConfig {
  id: PlaceId;
  name: string;
  type: PlaceType;
  state: StateId;
  country: string;
  /** e.g. "en-IN". */
  locale: string;
  /** ISO 4217, e.g. "INR". */
  currency: string;
  /** e.g. "Asia/Kolkata". */
  timezone: string;

  mapCenter: GeoPoint;
  mapZoom: number;

  /** e.g. "ward" | "mohalla" | "panchayat" | "borough". */
  localityLabel: string;
  localities: Locality[];

  issueCategories: IssueCategoryDef[];
  civicBodyName: string;
  responsibleAuthorityMap: ResponsibleAuthorityMapping[];

  defaultLanguage: LanguageCode;
  languages: LanguageCode[];

  /** → HierarchyConfig registry. */
  hierarchyStateId: StateId;
}
