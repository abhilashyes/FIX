import type { PlaceConfig, PlaceId } from '@/types';
import { metroPlace, METRO_PLACE_ID } from './metro';
import { townPlace, TOWN_PLACE_ID } from './town';
import { villagePlace, VILLAGE_PLACE_ID } from './village';

/** Registry of all demo places, in switcher order. */
export const ALL_PLACES: readonly PlaceConfig[] = [metroPlace, townPlace, villagePlace];

/** Default place the app boots into. */
export const DEFAULT_PLACE_ID: PlaceId = METRO_PLACE_ID;

export const getPlace = (id: PlaceId): PlaceConfig | undefined =>
  ALL_PLACES.find((p) => p.id === id);

export { METRO_PLACE_ID, TOWN_PLACE_ID, VILLAGE_PLACE_ID };
export { metroPlace, townPlace, villagePlace };
