/**
 * GST rates on goods from Notification 9/2025-Central Tax (Rate) and
 * 9/2025-Integrated Tax (Rate), both dated 17 September 2025, in force from
 * 22 September 2025. Schedule VII (28%) was omitted from 1 February 2026 by
 * Notification 19/2025-Central Tax (Rate) and 19/2025-Integrated Tax (Rate).
 * Values are total GST; CGST and SGST are each half.
 */
export interface RateOption {
  /** Form value. */
  value: string;
  label: string;
  /** Thousandths of a percent; null for a rate the user types. */
  rateMilli: number | null;
  group: 'standard' | 'special' | 'other';
}

export const CUSTOM_RATE = 'custom';

export const RATE_OPTIONS: RateOption[] = [
  { value: '0', label: '0% (nil rated or exempt)', rateMilli: 0, group: 'standard' },
  { value: '5', label: '5%', rateMilli: 5000, group: 'standard' },
  { value: '18', label: '18%', rateMilli: 18000, group: 'standard' },
  { value: '40', label: '40%', rateMilli: 40000, group: 'standard' },
  {
    value: '3',
    label: '3% (gold, silver, jewellery, pearls, coins)',
    rateMilli: 3000,
    group: 'special',
  },
  {
    value: '1.5',
    label: '1.5% (cut diamonds, synthetic diamonds)',
    rateMilli: 1500,
    group: 'special',
  },
  {
    value: '0.25',
    label: '0.25% (rough diamonds, precious stones)',
    rateMilli: 250,
    group: 'special',
  },
  { value: CUSTOM_RATE, label: 'Other rate', rateMilli: null, group: 'other' },
];

export const DEFAULT_RATE = '18';

export function presetRateMilli(value: string): number | undefined {
  const option = RATE_OPTIONS.find((item) => item.value === value);
  return option?.rateMilli ?? undefined;
}
