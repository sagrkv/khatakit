export type TaxRegime = 'old' | 'new';
export type AgeCategory = 'below60' | '60to80' | 'above80';

export interface AdvanceTaxInput {
  regime: TaxRegime;
  grossIncome: number;
  deductions: number; // applicable only for old regime
  tdsDeducted: number;
  ageCategory: AgeCategory;
}

export interface TaxComputation {
  grossIncome: number;
  standardDeduction: number;
  otherDeductions: number;
  taxableIncome: number;
  taxOnIncome: number;
  rebate87A: number;
  taxAfterRebate: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  tdsDeducted: number;
  netTaxPayable: number;
  isAdvanceTaxApplicable: boolean;
}

export interface QuarterlyInstallment {
  quarter: string;
  dueDate: string;
  cumulativePercent: number;
  cumulativeAmount: number;
  installmentAmount: number;
}

export interface AdvanceTaxResult {
  oldRegime: TaxComputation;
  newRegime: TaxComputation;
  selectedRegime: TaxRegime;
  schedule: QuarterlyInstallment[];
}
