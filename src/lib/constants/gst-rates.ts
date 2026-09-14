import type {
  AnnualTurnoverSlab,
  GstReturnType,
  PeriodicTurnoverSlab,
} from '../../tools/gst-late-fee/types';

// Section 50(1) CGST Act read with Notification 13/2017-Central Tax.
export const GST_INTEREST_RATE = 18;

// Returns cannot be filed after three years from the due date.
export const RETURN_FILING_LIMIT_YEARS = 3;

/**
 * GSTR-3B (Notifications 76/2018 and 19/2021) and GSTR-1 (Notification 20/2021).
 * Amounts are per head: the same amount is due again under SGST or UTGST.
 * Above Rs 5 crore the notifications give no cap, so section 47(1) caps at Rs 5,000.
 */
export const PERIODIC_LATE_FEE = {
  perDay: 25,
  nilPerDay: 10,
  nilCap: 250,
  caps: { upto_1_5cr: 1000, '1_5cr_to_5cr': 2500, above_5cr: 5000 } satisfies Record<
    PeriodicTurnoverSlab,
    number
  >,
} as const;

/**
 * GSTR-9 (Notification 07/2023, FY 2022-23 onwards; above Rs 20 crore section 47(2)).
 * Per head. The cap is a percentage of turnover in the State or Union territory.
 */
export const ANNUAL_LATE_FEE: Readonly<
  Record<AnnualTurnoverSlab, { perDay: number; capPercentOfStateTurnover: number }>
> = {
  upto_5cr: { perDay: 25, capPercentOfStateTurnover: 0.02 },
  '5cr_to_20cr': { perDay: 50, capPercentOfStateTurnover: 0.02 },
  above_20cr: { perDay: 100, capPercentOfStateTurnover: 0.25 },
};

export const GST_RETURN_TYPES: { value: GstReturnType; label: string }[] = [
  { value: 'GSTR-3B', label: 'GSTR-3B' },
  { value: 'GSTR-1', label: 'GSTR-1 / IFF' },
  { value: 'GSTR-9', label: 'GSTR-9 (Annual)' },
];

export const PERIODIC_TURNOVER_SLABS: { value: PeriodicTurnoverSlab; label: string }[] = [
  { value: 'upto_1_5cr', label: 'Up to ₹1.5 crore' },
  { value: '1_5cr_to_5cr', label: '₹1.5 crore to ₹5 crore' },
  { value: 'above_5cr', label: 'Above ₹5 crore' },
];

export const ANNUAL_TURNOVER_SLABS: { value: AnnualTurnoverSlab; label: string }[] = [
  { value: 'upto_5cr', label: 'Up to ₹5 crore' },
  { value: '5cr_to_20cr', label: '₹5 crore to ₹20 crore' },
  { value: 'above_20cr', label: 'Above ₹20 crore' },
];
