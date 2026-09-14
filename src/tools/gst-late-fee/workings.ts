import { formatIndianNumber } from '../../lib/utils/format';
import {
  ANNUAL_LATE_FEE,
  ANNUAL_TURNOVER_SLABS,
  PERIODIC_TURNOVER_SLABS,
} from '../../lib/constants/gst-rates';
import type { AnnualTurnoverSlab, GstInput, GstResult } from './types';

const rupees = (amount: number) => `₹${formatIndianNumber(amount)}`;

export function turnoverLabel(input: GstInput): string {
  const slabs = input.returnType === 'GSTR-9' ? ANNUAL_TURNOVER_SLABS : PERIODIC_TURNOVER_SLABS;
  return slabs.find((slab) => slab.value === input.turnoverSlab)?.label ?? input.turnoverSlab;
}

function capRule(input: GstInput, result: GstResult): string {
  const notification = input.returnType === 'GSTR-1' ? 'Notification 20/2021' : 'Notification 19/2021';
  const perHead = `${rupees(result.capPerHead)} per head (${rupees(result.lateFeeCapApplied)} total)`;
  switch (result.capBasis) {
    case 'nil':
      return `${notification} limits the fee on a nil return to ${perHead}.`;
    case 'turnover':
      return `${notification} limits the fee for aggregate turnover ${turnoverLabel(input).toLowerCase()} to ${perHead}.`;
    case 'section47':
      return `No notification lowers the cap above ₹5 crore, so section 47(1) limits the fee to ${perHead}.`;
    case 'stateTurnover': {
      const slab = input.turnoverSlab as AnnualTurnoverSlab;
      const percent = ANNUAL_LATE_FEE[slab]?.capPercentOfStateTurnover ?? 0;
      const source = slab === 'above_20cr' ? 'Section 47(2)' : 'Notification 07/2023';
      return `${source} limits the fee to ${percent}% of turnover in this State (${rupees(input.stateTurnover ?? 0)}) per head, which is ${perHead}.`;
    }
  }
}

/** Whether the cap was reached, and the rule that sets it. */
export function capExplanation(input: GstInput, result: GstResult): {
  title: string;
  detail: string;
} {
  const rule = capRule(input, result);
  return result.capReached
    ? {
        title: 'Maximum late fee applied',
        detail: `${rupees(result.lateFeePerDayPerHead)} a day for ${result.daysLate} days is ${rupees(result.rawLateFeePerHead)} per head. ${rule}`,
      }
    : {
        title: 'Below the maximum late fee',
        detail: `${rupees(result.rawLateFeePerHead)} per head is within the cap. ${rule}`,
      };
}

/** Why no interest is charged, or null when interest applies. */
export function noInterestReason(input: GstInput, result: GstResult): string | null {
  if (result.interestApplies) return null;
  if (input.returnType === 'GSTR-3B') {
    return 'No interest. A nil return has no tax to pay. Section 50 interest does not arise.';
  }
  return `No interest. ${input.returnType} has no tax payment. Section 50 interest does not arise.`;
}

/** 1479.45 as "₹ 1,479.45". */
export function formatWithPaise(amount: number): string {
  const paise = Math.round(amount * 100);
  return `₹ ${formatIndianNumber(Math.floor(paise / 100))}.${String(paise % 100).padStart(2, '0')}`;
}

export function filedAsLabel(input: GstInput): string {
  if (input.returnType === 'GSTR-9') return 'Annual return';
  return input.isNilReturn ? 'Nil return' : 'Regular';
}
