export interface TaxSlab {
  min: number;
  max: number;
  rate: number;
}

// FY 2025-26 New Regime
export const NEW_REGIME_SLABS: TaxSlab[] = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400001, max: 800000, rate: 5 },
  { min: 800001, max: 1200000, rate: 10 },
  { min: 1200001, max: 1600000, rate: 15 },
  { min: 1600001, max: 2000000, rate: 20 },
  { min: 2000001, max: 2400000, rate: 25 },
  { min: 2400001, max: Infinity, rate: 30 },
];

// FY 2025-26 Old Regime (below 60)
export const OLD_REGIME_SLABS: TaxSlab[] = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250001, max: 500000, rate: 5 },
  { min: 500001, max: 1000000, rate: 20 },
  { min: 1000001, max: Infinity, rate: 30 },
];

// Old Regime for Senior Citizens (60-80)
export const OLD_REGIME_SENIOR_SLABS: TaxSlab[] = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300001, max: 500000, rate: 5 },
  { min: 500001, max: 1000000, rate: 20 },
  { min: 1000001, max: Infinity, rate: 30 },
];

// Old Regime for Super Senior Citizens (above 80)
export const OLD_REGIME_SUPER_SENIOR_SLABS: TaxSlab[] = [
  { min: 0, max: 500000, rate: 0 },
  { min: 500001, max: 1000000, rate: 20 },
  { min: 1000001, max: Infinity, rate: 30 },
];

export const SURCHARGE_SLABS = [
  { min: 5000001, max: 10000000, rate: 10 },
  { min: 10000001, max: 20000000, rate: 15 },
  { min: 20000001, max: 50000000, rate: 25 },
  { min: 50000001, max: Infinity, rateOld: 37, rateNew: 25 },
];

export const CESS_RATE = 4; // Health & Education Cess

export const NEW_REGIME_STANDARD_DEDUCTION = 75000;
export const OLD_REGIME_STANDARD_DEDUCTION = 50000;

// Section 87A rebate
export const NEW_REGIME_87A_LIMIT = 1200000;
export const NEW_REGIME_87A_MAX_REBATE = 60000;
export const NEW_REGIME_87A_MARGINAL_LIMIT = 1275000;
export const OLD_REGIME_87A_LIMIT = 500000;
export const OLD_REGIME_87A_MAX_REBATE = 12500;

export const ADVANCE_TAX_THRESHOLD = 10000;

export const ADVANCE_TAX_SCHEDULE = [
  { dueDate: 'June 15', cumulativePercent: 15, label: 'Q1' },
  { dueDate: 'September 15', cumulativePercent: 45, label: 'Q2' },
  { dueDate: 'December 15', cumulativePercent: 75, label: 'Q3' },
  { dueDate: 'March 15', cumulativePercent: 100, label: 'Q4' },
];
