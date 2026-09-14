import type {
  AnnualTurnoverSlab,
  CapBasis,
  GstInput,
  GstResult,
  PeriodicTurnoverSlab,
} from './types';
import {
  ANNUAL_LATE_FEE,
  GST_INTEREST_RATE,
  PERIODIC_LATE_FEE,
  RETURN_FILING_LIMIT_YEARS,
} from '../../lib/constants/gst-rates';
import { addDays, addYears, daysFrom, parseIsoDate, toIsoDate } from './dates';

/** Per-head (CGST) daily fee and cap for the return, and why the cap is what it is. */
function lateFeeRule(input: GstInput): { perDay: number; cap: number; basis: CapBasis } {
  if (input.returnType === 'GSTR-9') {
    const rule =
      ANNUAL_LATE_FEE[input.turnoverSlab as AnnualTurnoverSlab] ?? ANNUAL_LATE_FEE.upto_5cr;
    const stateTurnover = Math.max(0, input.stateTurnover ?? 0);
    return {
      perDay: rule.perDay,
      cap: Math.round((stateTurnover * rule.capPercentOfStateTurnover) / 100),
      basis: 'stateTurnover',
    };
  }
  if (input.isNilReturn) {
    return { perDay: PERIODIC_LATE_FEE.nilPerDay, cap: PERIODIC_LATE_FEE.nilCap, basis: 'nil' };
  }
  const slab = input.turnoverSlab as PeriodicTurnoverSlab;
  const cap = PERIODIC_LATE_FEE.caps[slab] ?? PERIODIC_LATE_FEE.caps.above_5cr;
  return {
    perDay: PERIODIC_LATE_FEE.perDay,
    cap,
    basis: slab === 'above_5cr' || !(slab in PERIODIC_LATE_FEE.caps) ? 'section47' : 'turnover',
  };
}

export function calculateGstPenalty(input: GstInput): GstResult | null {
  const due = parseIsoDate(input.dueDate);
  const filed = parseIsoDate(input.filingDate);
  if (due === null || filed === null) return null;

  const lastFilingTimestamp = addYears(due, RETURN_FILING_LIMIT_YEARS);
  const daysLate = Math.max(0, daysFrom(due, filed));
  // Interest is due only on GSTR-3B tax paid in cash (section 50(1) proviso),
  // from the day after the due date (section 50(2)).
  const interestApplies = input.returnType === 'GSTR-3B' && !input.isNilReturn;
  const cashTax = interestApplies ? Math.max(0, input.taxLiability) : 0;

  const { perDay, cap, basis } = lateFeeRule(input);
  const rawPerHead = perDay * daysLate;
  const feePerHead = Math.min(rawPerHead, cap);
  const cappedLateFee = feePerHead * 2;
  const exactInterest = (cashTax * GST_INTEREST_RATE * daysLate) / (100 * 365);
  const interestPaise = Math.round(exactInterest * 100);
  const interest = Math.round(exactInterest);

  return {
    dueDate: input.dueDate,
    filingDate: input.filingDate,
    daysLate,
    filedOnDueDate: due === filed,
    lateFeePerDayPerHead: perDay,
    lateFeePerDay: perDay * 2,
    rawLateFeePerHead: rawPerHead,
    rawLateFee: rawPerHead * 2,
    capPerHead: cap,
    lateFeeCapApplied: cap * 2,
    capBasis: basis,
    capReached: rawPerHead > cap,
    cgstLateFee: feePerHead,
    sgstLateFee: feePerHead,
    cappedLateFee,
    interestApplies,
    cashTax,
    interestRate: GST_INTEREST_RATE,
    interestFrom: toIsoDate(addDays(due, 1)),
    interestTo: input.filingDate,
    interestDays: interestApplies ? daysLate : 0,
    interestExact: interestPaise / 100,
    interest,
    totalPenalty: cappedLateFee + interest,
    isTimeBarred: filed > lastFilingTimestamp,
    lastFilingDate: toIsoDate(lastFilingTimestamp),
  };
}
