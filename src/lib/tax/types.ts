export type TaxRegime = 'old' | 'new';
export type AgeCategory = 'below60' | '60to80' | 'above80';

export interface IncomeTaxBreakdown {
  taxOnIncome: number;
  rebate: number;
  taxAfterRebate: number;
  surcharge: number;
  cess: number;
  totalTax: number;
}
