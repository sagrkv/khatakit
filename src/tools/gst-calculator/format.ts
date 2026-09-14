import { formatIndianNumber } from '../../lib/utils/format';
import type { PriceType, SupplyType } from './types';

/** 1234567 paise as "12,345.67". */
export function formatPaise(paise: number): string {
  const sign = paise < 0 ? '-' : '';
  const abs = Math.abs(paise);
  const rupees = Math.floor(abs / 100);
  return `${sign}${formatIndianNumber(rupees)}.${String(abs % 100).padStart(2, '0')}`;
}

/** 1234567 paise as "₹ 12,345.67". */
export function formatRupees(paise: number): string {
  return `₹ ${formatPaise(paise)}`;
}

/** Round-off with an explicit sign: "+0.44", "-0.30", "0.00". */
export function formatSignedPaise(paise: number): string {
  return paise > 0 ? `+${formatPaise(paise)}` : formatPaise(paise);
}

/** Plain decimal for spreadsheets: 1234567 paise as "12345.67". */
export function plainPaise(paise: number): string {
  const sign = paise < 0 ? '-' : '';
  const abs = Math.abs(paise);
  return `${sign}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, '0')}`;
}

/** 18000 as "18%", 250 as "0.25%". */
export function formatRate(rateMilli: number): string {
  return `${rateMilli / 1000}%`;
}

/** Each of CGST and SGST is half the rate: 18000 as "9%", 250 as "0.125%". */
export function formatHeadRate(rateMilli: number): string {
  return `${rateMilli / 2000}%`;
}

export const SUPPLY_LABELS: Record<SupplyType, string> = {
  intra: 'Within the state (CGST + SGST)',
  inter: 'Between states (IGST)',
};

export const PRICE_TYPE_LABELS: Record<PriceType, string> = {
  exclusive: 'Excluding GST',
  inclusive: 'Including GST',
};

/** The same labels for use inside a sentence. */
export const PRICE_TYPE_PHRASES: Record<PriceType, string> = {
  exclusive: 'excluding GST',
  inclusive: 'including GST',
};
