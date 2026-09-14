import type { TaxRegime } from '../../lib/tax/types';

/** Old section labels kept as values; both now sit in section 58(2) of the Income-tax Act, 2025. */
export type PresumptiveScheme = '44AD' | '44ADA';

export interface PresumptiveInput {
  scheme: PresumptiveScheme;
  grossReceipts: number;
  cashReceipts: number;
  regime: TaxRegime;
}

export interface PresumptiveResult {
  scheme: PresumptiveScheme;
  grossReceipts: number;
  /** Receipts other than by specified banking or online mode. */
  cashReceipts: number;
  digitalReceipts: number;
  /** Cash receipts as a percentage of gross receipts, to two decimals. */
  cashSharePercent: number;
  /** Business only: 8% of cash receipts. */
  cashIncome: number;
  /** Business only: 6% of bank and online receipts. */
  digitalIncome: number;
  presumptiveIncome: number;
  presumptiveRate: number;
  taxableIncome: number;
  taxOnIncome: number;
  rebate: number;
  /** Tax after rebate, before surcharge and cess. */
  taxLiability: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  isWithinLimit: boolean;
  applicableLimit: number;
}
