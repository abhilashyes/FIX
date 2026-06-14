import type { HierarchyConfig, StateId } from '@/types';
import { urbanHierarchy } from './urban.hierarchy';
import { ruralHierarchy } from './rural.hierarchy';

/** Registry: stateId → HierarchyConfig. */
export const ALL_HIERARCHIES: readonly HierarchyConfig[] = [urbanHierarchy, ruralHierarchy];

export const getHierarchy = (stateId: StateId): HierarchyConfig | undefined =>
  ALL_HIERARCHIES.find((h) => h.stateId === stateId);

export { urbanHierarchy, ruralHierarchy };
