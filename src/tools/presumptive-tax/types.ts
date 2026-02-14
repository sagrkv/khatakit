import type { TaxRegime } from '../advance-tax/types';

export type PresumptiveScheme = '44AD' | '44ADA';

export interface PresumptiveInput {
  scheme: PresumptiveScheme;
  grossReceipts: number;
  cashReceipts: number; // Only for 44AD
  regime: TaxRegime;
}

export interface PresumptiveResult {
  scheme: PresumptiveScheme;
  grossReceipts: number;
  presumptiveIncome: number;
  presumptiveRate: number;
  taxableIncome: number;
  taxLiability: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  isWithinLimit: boolean;
  applicableLimit: number;
}
