export type GstReturnType = 'GSTR-3B' | 'GSTR-1' | 'GSTR-9';

/** Aggregate turnover in the preceding financial year (GSTR-3B and GSTR-1). */
export type PeriodicTurnoverSlab = 'upto_1_5cr' | '1_5cr_to_5cr' | 'above_5cr';

/** Aggregate turnover in the financial year of the return (GSTR-9). */
export type AnnualTurnoverSlab = 'upto_5cr' | '5cr_to_20cr' | 'above_20cr';

export interface GstInput {
  returnType: GstReturnType;
  dueDate: string;
  filingDate: string;
  /** Tax paid by debiting the electronic cash ledger (GSTR-3B only). */
  taxLiability: number;
  turnoverSlab: PeriodicTurnoverSlab | AnnualTurnoverSlab;
  isNilReturn: boolean;
  /** Turnover in the State or Union territory of the registration (GSTR-9 only). */
  stateTurnover?: number;
}

/**
 * Why the maximum late fee is what it is:
 * nil - nil return concession; turnover - notification cap by turnover band;
 * section47 - no notification cap, so section 47(1); stateTurnover - GSTR-9 share of State turnover.
 */
export type CapBasis = 'nil' | 'turnover' | 'section47' | 'stateTurnover';

/** Amounts in rupees. "Per head" means CGST, and again SGST or UTGST. Dates are YYYY-MM-DD. */
export interface GstResult {
  dueDate: string;
  filingDate: string;
  daysLate: number;
  /** True only when the filing date is the due date itself. */
  filedOnDueDate: boolean;
  lateFeePerDayPerHead: number;
  lateFeePerDay: number;
  rawLateFeePerHead: number;
  rawLateFee: number;
  capPerHead: number;
  lateFeeCapApplied: number;
  capBasis: CapBasis;
  /** The fee before the cap is more than the cap. */
  capReached: boolean;
  cgstLateFee: number;
  sgstLateFee: number;
  cappedLateFee: number;
  interestApplies: boolean;
  /** Tax paid in cash that interest is charged on; 0 when interest does not apply. */
  cashTax: number;
  interestRate: number;
  /** Day after the due date. */
  interestFrom: string;
  /** Filing date, taken as the date the tax was paid. */
  interestTo: string;
  interestDays: number;
  /** Interest to the paisa, before rounding to the rupee. */
  interestExact: number;
  interest: number;
  totalPenalty: number;
  isTimeBarred: boolean;
  /** Last date the portal accepts the return, three years from the due date. */
  lastFilingDate: string;
}
