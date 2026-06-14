import type { ISODateString, Money, PlaceConfig } from '@/types';

/** Format money using the place's locale + currency. */
export function formatMoney(money: Money, locale = 'en-IN'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: money.currency,
      maximumFractionDigits: 0,
    }).format(money.amount);
  } catch {
    return `${money.currency} ${money.amount}`;
  }
}

/** Format a date in the place's timezone + locale. */
export function formatDate(
  iso: ISODateString,
  place?: Pick<PlaceConfig, 'locale' | 'timezone'>,
): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(place?.locale ?? 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: place?.timezone ?? 'Asia/Kolkata',
  }).format(d);
}

/** Whole days between an ISO date and now (>= 0). */
export function daysSince(iso: ISODateString): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / (24 * 60 * 60 * 1000)));
}

/** Compact relative time, e.g. "3d ago", "just now". */
export function relativeTime(iso: ISODateString): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
