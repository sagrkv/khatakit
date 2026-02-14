import type {
  AdvanceTaxInput,
  AdvanceTaxResult,
  TaxComputation,
  TaxRegime,
  AgeCategory,
  QuarterlyInstallment,
} from './types';
import type { TaxSlab } from '../../lib/constants/tax-slabs';
import {
  NEW_REGIME_SLABS,
  OLD_REGIME_SLABS,
  OLD_REGIME_SENIOR_SLABS,
  OLD_REGIME_SUPER_SENIOR_SLABS,
  SURCHARGE_SLABS,
  CESS_RATE,
  NEW_REGIME_STANDARD_DEDUCTION,
  OLD_REGIME_STANDARD_DEDUCTION,
  NEW_REGIME_87A_LIMIT,
  NEW_REGIME_87A_MAX_REBATE,
  NEW_REGIME_87A_MARGINAL_LIMIT,
  OLD_REGIME_87A_LIMIT,
  OLD_REGIME_87A_MAX_REBATE,
  ADVANCE_TAX_THRESHOLD,
  ADVANCE_TAX_SCHEDULE,
} from '../../lib/constants/tax-slabs';

function getSlabs(regime: TaxRegime, age: AgeCategory): TaxSlab[] {
  if (regime === 'new') return NEW_REGIME_SLABS;
  if (age === 'above80') return OLD_REGIME_SUPER_SENIOR_SLABS;
  if (age === '60to80') return OLD_REGIME_SENIOR_SLABS;
  return OLD_REGIME_SLABS;
}

function computeTaxOnSlabs(taxableIncome: number, slabs: TaxSlab[]): number {
  let tax = 0;
  for (const slab of slabs) {
    if (taxableIncome <= 0) break;
    const taxableInSlab = Math.min(taxableIncome, slab.max - slab.min + 1);
    tax += (taxableInSlab * slab.rate) / 100;
    taxableIncome -= taxableInSlab;
  }
  return Math.round(tax);
}

function computeSurcharge(tax: number, totalIncome: number, regime: TaxRegime): number {
  for (let i = SURCHARGE_SLABS.length - 1; i >= 0; i--) {
    const slab = SURCHARGE_SLABS[i];
    if (totalIncome >= slab.min) {
      const rate = slab.rateOld !== undefined
        ? (regime === 'old' ? slab.rateOld : slab.rateNew!)
        : slab.rate!;
      return Math.round((tax * rate) / 100);
    }
  }
  return 0;
}

function computeRebate(
  regime: TaxRegime,
  taxableIncome: number,
  taxOnIncome: number
): number {
  if (regime === 'new') {
    if (taxableIncome <= NEW_REGIME_87A_LIMIT) {
      return Math.min(taxOnIncome, NEW_REGIME_87A_MAX_REBATE);
    }
    // Marginal relief
    if (taxableIncome <= NEW_REGIME_87A_MARGINAL_LIMIT) {
      const excessIncome = taxableIncome - NEW_REGIME_87A_LIMIT;
      const rebateWithoutMarginal = Math.min(taxOnIncome, NEW_REGIME_87A_MAX_REBATE);
      const taxAfterMarginal = excessIncome;
      if (taxOnIncome - rebateWithoutMarginal > taxAfterMarginal) {
        return taxOnIncome - taxAfterMarginal;
      }
      return rebateWithoutMarginal;
    }
    return 0;
  }
  // Old regime
  if (taxableIncome <= OLD_REGIME_87A_LIMIT) {
    return Math.min(taxOnIncome, OLD_REGIME_87A_MAX_REBATE);
  }
  return 0;
}

function computeForRegime(
  input: AdvanceTaxInput,
  regime: TaxRegime
): TaxComputation {
  const standardDeduction =
    regime === 'new' ? NEW_REGIME_STANDARD_DEDUCTION : OLD_REGIME_STANDARD_DEDUCTION;
  const otherDeductions = regime === 'new' ? 0 : input.deductions;
  const taxableIncome = Math.max(
    0,
    input.grossIncome - standardDeduction - otherDeductions
  );

  const slabs = getSlabs(regime, input.ageCategory);
  const taxOnIncome = computeTaxOnSlabs(taxableIncome, slabs);

  const rebate87A = computeRebate(regime, taxableIncome, taxOnIncome);
  const taxAfterRebate = Math.max(0, taxOnIncome - rebate87A);

  const surcharge = computeSurcharge(taxAfterRebate, taxableIncome, regime);
  const cess = Math.round(((taxAfterRebate + surcharge) * CESS_RATE) / 100);
  const totalTax = taxAfterRebate + surcharge + cess;

  const netTaxPayable = Math.max(0, totalTax - input.tdsDeducted);
  const isAdvanceTaxApplicable = netTaxPayable > ADVANCE_TAX_THRESHOLD;

  return {
    grossIncome: input.grossIncome,
    standardDeduction,
    otherDeductions,
    taxableIncome,
    taxOnIncome,
    rebate87A,
    taxAfterRebate,
    surcharge,
    cess,
    totalTax,
    tdsDeducted: input.tdsDeducted,
    netTaxPayable,
    isAdvanceTaxApplicable,
  };
}

function computeSchedule(netTaxPayable: number): QuarterlyInstallment[] {
  let prevCumulative = 0;
  return ADVANCE_TAX_SCHEDULE.map((q) => {
    const cumulativeAmount = Math.round(
      (netTaxPayable * q.cumulativePercent) / 100
    );
    const installmentAmount = cumulativeAmount - prevCumulative;
    prevCumulative = cumulativeAmount;
    return {
      quarter: q.label,
      dueDate: q.dueDate,
      cumulativePercent: q.cumulativePercent,
      cumulativeAmount,
      installmentAmount,
    };
  });
}

export function calculateAdvanceTax(input: AdvanceTaxInput): AdvanceTaxResult {
  const oldRegime = computeForRegime(input, 'old');
  const newRegime = computeForRegime(input, 'new');

  const selected = input.regime === 'old' ? oldRegime : newRegime;
  const schedule = selected.isAdvanceTaxApplicable
    ? computeSchedule(selected.netTaxPayable)
    : [];

  return {
    oldRegime,
    newRegime,
    selectedRegime: input.regime,
    schedule,
  };
}
