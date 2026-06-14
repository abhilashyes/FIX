import type { StateId } from '@/types';
import { asId } from '@/types';

/** Fictional states (plausible, not real) so hierarchy + language defaults are demonstrable. */
export const STATE_IDS = {
  /** Urban-style state — used by the metro and town demos. */
  harithaPradesh: asId<StateId>('state-haritha-pradesh'),
  /** Rural three-tier panchayati-raj state — used by the village demo. */
  naduValley: asId<StateId>('state-nadu-valley'),
} as const;
