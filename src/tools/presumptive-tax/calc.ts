import type { PresumptiveInput, PresumptiveResult } from './types';
import type { TaxRegime } from '../advance-tax/types';
import type { TaxSlab } from '../../lib/constants/tax-slabs';
import { PRESUMPTIVE_44AD, PRESUMPTIVE_44ADA } from '../../lib/constants/presumptive';
import {
  NEW_REGIME_SLABS,
  OLD_REGIME_SLABS,
  NEW_REGIME_STANDARD_DEDUCTION,
  OLD_REGIME_STANDARD_DEDUCTION,
  SURCHARGE_SLABS,
  CESS_RATE,
  NEW_REGIME_87A_LIMIT,
  NEW_REGIME_87A_MAX_REBATE,
  OLD_REGIME_87A_LIMIT,
  OLD_REGIME_87A_MAX_REBATE,
} from '../../lib/constants/tax-slabs';

function computeTaxOnSlabs(taxableIncome: number, slabs: TaxSlab[]): number {
  let tax = 0;
  let remaining = taxableIncome;
  for (const slab of slabs) {
    if (remaining <= 0) break;
    const taxableInSlab = Math.min(remaining, slab.max - slab.min + 1);
    tax += (taxableInSlab * slab.rate) / 100;
    remaining -= taxableInSlab;
  }
  return Math.round(tax);
}

function computeSurcharge(tax: number, income: number, regime: TaxRegime): number {
  for (let i = SURCHARGE_SLABS.length - 1; i >= 0; i--) {
    const slab = SURCHARGE_SLABS[i];
    if (income >= slab.min) {
      const rate = slab.rateOld !== undefined
        ? (regime === 'old' ? slab.rateOld : slab.rateNew!)
        : slab.rate!;
      return Math.round((tax * rate) / 100);
    }
  }
  return 0;
}

export function calculatePresumptive(input: PresumptiveInput): PresumptiveResult {
  const { scheme, grossReceipts, cashReceipts, regime } = input;

  let presumptiveIncome: number;
  let presumptiveRate: number;
  let isWithinLimit: boolean;
  let applicableLimit: number;

  if (scheme === '44AD') {
    const digitalReceipts = grossReceipts - cashReceipts;
    const cashIncome = (cashReceipts * PRESUMPTIVE_44AD.cashRate) / 100;
    const digitalIncome = (digitalReceipts * PRESUMPTIVE_44AD.digitalRate) / 100;
    presumptiveIncome = Math.round(cashIncome + digitalIncome);
    presumptiveRate =
      grossReceipts > 0
        ? Math.round((presumptiveIncome / grossReceipts) * 10000) / 100
        : 0;

    const cashPercent = grossReceipts > 0 ? (cashReceipts / grossReceipts) * 100 : 0;
    applicableLimit =
      cashPercent <= PRESUMPTIVE_44AD.cashThresholdPercent
        ? PRESUMPTIVE_44AD.turnoverLimitExtended
        : PRESUMPTIVE_44AD.turnoverLimit;
    isWithinLimit = grossReceipts <= applicableLimit;
  } else {
    presumptiveIncome = Math.round((grossReceipts * PRESUMPTIVE_44ADA.rate) / 100);
    presumptiveRate = PRESUMPTIVE_44ADA.rate;

    const cashPercent = grossReceipts > 0 ? (cashReceipts / grossReceipts) * 100 : 0;
    applicableLimit =
      cashPercent <= PRESUMPTIVE_44ADA.cashThresholdPercent
        ? PRESUMPTIVE_44ADA.grossReceiptsLimitExtended
        : PRESUMPTIVE_44ADA.grossReceiptsLimit;
    isWithinLimit = grossReceipts <= applicableLimit;
  }

  const standardDeduction =
    regime === 'new' ? NEW_REGIME_STANDARD_DEDUCTION : OLD_REGIME_STANDARD_DEDUCTION;
  const taxableIncome = Math.max(0, presumptiveIncome - standardDeduction);

  const slabs = regime === 'new' ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;
  let taxOnIncome = computeTaxOnSlabs(taxableIncome, slabs);

  // Apply 87A rebate
  if (regime === 'new' && taxableIncome <= NEW_REGIME_87A_LIMIT) {
    taxOnIncome = Math.max(0, taxOnIncome - Math.min(taxOnIncome, NEW_REGIME_87A_MAX_REBATE));
  } else if (regime === 'old' && taxableIncome <= OLD_REGIME_87A_LIMIT) {
    taxOnIncome = Math.max(0, taxOnIncome - Math.min(taxOnIncome, OLD_REGIME_87A_MAX_REBATE));
  }

  const surcharge = computeSurcharge(taxOnIncome, taxableIncome, regime);
  const cess = Math.round(((taxOnIncome + surcharge) * CESS_RATE) / 100);
  const totalTax = taxOnIncome + surcharge + cess;

  const effectiveRate =
    grossReceipts > 0 ? Math.round((totalTax / grossReceipts) * 10000) / 100 : 0;

  return {
    scheme,
    grossReceipts,
    presumptiveIncome,
    presumptiveRate,
    taxableIncome,
    taxLiability: taxOnIncome,
    surcharge,
    cess,
    totalTax,
    effectiveRate,
    isWithinLimit,
    applicableLimit,
  };
}
