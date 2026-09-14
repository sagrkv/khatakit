export type DeductorType = 'non-government' | 'government-challan' | 'government-book-entry';

/** One TDS default. Dates are ISO (yyyy-mm-dd) or '' when not entered. */
export interface TdsCase {
  label: string;
  amount: number;
  deductibleOn: string;
  deductedOn: string;
  depositedOn: string;
}

export interface SheetOptions {
  /** Interest runs to this date when a deduction or deposit date is blank. */
  asOf: string;
  today: string;
  deductorType: DeductorType;
}

/** A counted interest period, with both month-counting methods. Money in paise. */
export interface Period {
  from: string;
  to: string;
  days: number;
  months: string[];
  thirtyDayMonths: number;
  ratePercent: number;
  calendarPaise: number;
  thirtyDayPaise: number;
}

export interface Provision {
  act: '1961' | '2025';
  section: string;
  actName: string;
  rule: string;
}

export interface CaseResult {
  status: 'ok';
  label: string;
  amount: number;
  /** Amount rounded down to a multiple of Rs 100. */
  base: number;
  dueDate: string | null;
  dueDateBasis: string;
  provision: Provision;
  lateDeduction: Period | null;
  lateDeposit: Period | null;
  totalCalendarPaise: number;
  totalThirtyDayPaise: number;
  estimate: boolean;
  straddles: boolean;
  notes: string[];
}

interface CaseError {
  status: 'error';
  label: string;
  errors: string[];
}

interface CaseBlank {
  status: 'blank';
  label: string;
}

export type CaseOutcome = CaseResult | CaseError | CaseBlank;

export interface SheetResult {
  outcomes: CaseOutcome[];
  totalCalendarPaise: number;
  totalThirtyDayPaise: number;
  roundedCalendarRupees: number;
  roundedThirtyDayRupees: number;
  calculatedCount: number;
  errorCount: number;
  estimateCount: number;
}

/** A bulk row as typed, pasted or imported. All fields are raw text. */
export interface DraftRow {
  id: string;
  label: string;
  amount: string;
  deductible: string;
  deducted: string;
  deposited: string;
}

export type DraftField = Exclude<keyof DraftRow, 'id'>;
