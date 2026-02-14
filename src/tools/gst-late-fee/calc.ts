import type { GstInput, GstResult } from './types';
import {
  GST_LATE_FEE_PER_DAY_NON_NIL,
  GST_LATE_FEE_PER_DAY_NIL,
  GST_INTEREST_RATE,
  GST_LATE_FEE_CAPS,
  GST_NIL_RETURN_CAP,
} from '../../lib/constants/gst-rates';
import { daysBetween } from '../../lib/utils/date';

function getTurnoverCap(slab: GstInput['turnoverSlab']): number {
  const slabMap: Record<string, number> = {
    upto_1_5cr: GST_LATE_FEE_CAPS[0].cap,
    '1_5cr_to_5cr': GST_LATE_FEE_CAPS[1].cap,
    above_5cr: GST_LATE_FEE_CAPS[2].cap,
  };
  return slabMap[slab] ?? GST_LATE_FEE_CAPS[2].cap;
}

export function calculateGstPenalty(input: GstInput): GstResult {
  const dueDate = new Date(input.dueDate);
  const filingDate = new Date(input.filingDate);
  const daysLate = daysBetween(dueDate, filingDate);

  if (daysLate <= 0) {
    return {
      daysLate: 0,
      lateFeePerDay: 0,
      rawLateFee: 0,
      cappedLateFee: 0,
      lateFeeCapApplied: 0,
      cgstLateFee: 0,
      sgstLateFee: 0,
      interest: 0,
      totalPenalty: 0,
    };
  }

  const lateFeePerDay = input.isNilReturn
    ? GST_LATE_FEE_PER_DAY_NIL
    : GST_LATE_FEE_PER_DAY_NON_NIL;

  const rawLateFee = daysLate * lateFeePerDay;

  const cap = input.isNilReturn ? GST_NIL_RETURN_CAP : getTurnoverCap(input.turnoverSlab);

  const cappedLateFee = Math.min(rawLateFee, cap);

  const cgstLateFee = Math.round(cappedLateFee / 2);
  const sgstLateFee = cappedLateFee - cgstLateFee;

  // Interest: 18% p.a. on net tax liability
  const interest = input.isNilReturn
    ? 0
    : Math.round((input.taxLiability * GST_INTEREST_RATE * daysLate) / (100 * 365));

  const totalPenalty = cappedLateFee + interest;

  return {
    daysLate,
    lateFeePerDay,
    rawLateFee,
    cappedLateFee,
    lateFeeCapApplied: cap,
    cgstLateFee,
    sgstLateFee,
    interest,
    totalPenalty,
  };
}
