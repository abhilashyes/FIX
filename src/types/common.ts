import type { ISODateString } from './ids';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Money {
  /** Whole-currency amount (e.g. 500 = ₹500). */
  amount: number;
  /** ISO 4217 code, sourced from PlaceConfig.currency. */
  currency: string;
}

/** Mock contact channels, always clearly labelled as sample data. */
export interface MockContact {
  email?: string;
  phone?: string;
  note: 'Sample data — not a real person/contact';
}

export interface IssuePhoto {
  url: string;
  caption?: string;
  takenAt?: ISODateString;
}
