import { asId, asISODate } from '@/types';
import type { ISODateString } from '@/types';

let counter = 0;

/** Monotonic, collision-resistant id generator for newly created entities. */
export function genId<T extends string>(prefix: string): T {
  counter += 1;
  const rand = Math.random().toString(36).slice(2, 8);
  return asId<T>(`${prefix}-${Date.now().toString(36)}-${counter.toString(36)}-${rand}`);
}

/** Current time as a branded ISODateString. */
export const nowISO = (): ISODateString => asISODate(new Date());

/** A date `days` in the past (negative for future), as a branded ISODateString. */
export const daysAgoISO = (days: number): ISODateString =>
  asISODate(new Date(Date.now() - days * 24 * 60 * 60 * 1000));
