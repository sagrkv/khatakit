import { z } from 'zod';
import { parseIsoDate } from './dates';
import type { GstInput } from './types';

export type GstField = 'dueDate' | 'filingDate' | 'taxLiability' | 'stateTurnover';

export interface GstValidation {
  /** Present only when every field is complete and valid. */
  input: GstInput | null;
  /** Invalid values, shown on the field straight away. */
  errors: Partial<Record<GstField, string>>;
  /** Required values still empty, in form order. */
  missing: GstField[];
}

/** ₹1 lakh crore. */
const MAX_AMOUNT = 1e12;

/** GSTR-3B and GSTR-1 caps apply from the June 2021 tax period (Notifications 19 and 20/2021). */
const FIRST_PERIODIC_DUE_DATE = Date.UTC(2021, 6, 1);
/** GSTR-9 fees apply from FY 2022-23 (Notification 07/2023), due 31 December 2023. */
const FIRST_ANNUAL_DUE_DATE = Date.UTC(2023, 11, 31);

/** Most turnover in this State can be, for each aggregate turnover band. */
const STATE_TURNOVER_LIMITS: Record<string, { max: number; label: string }> = {
  upto_5cr: { max: 5e7, label: '₹5 crore' },
  '5cr_to_20cr': { max: 2e8, label: '₹20 crore' },
};

const MISSING = 'missing';

const formSchema = z.object({
  returnType: z.enum(['GSTR-3B', 'GSTR-1', 'GSTR-9']),
  dueDate: z.string(),
  filingDate: z.string(),
  // NaN is text that is not a number; the amount checks below explain it.
  taxLiability: z.number().or(z.nan()),
  turnoverSlab: z.enum(['upto_1_5cr', '1_5cr_to_5cr', 'above_5cr', 'upto_5cr', '5cr_to_20cr', 'above_20cr']),
  isNilReturn: z.boolean(),
  stateTurnover: z.number().or(z.nan()).optional(),
});

function amountSchema(label: string) {
  return z
    .number()
    .or(z.nan())
    .refine((value) => !Number.isNaN(value), `Enter ${label} as a number, for example 125000.`)
    .refine((value) => Number.isNaN(value) || value >= 0, `Enter ${label} of zero or more.`)
    .refine(
      (value) => Number.isNaN(value) || value <= MAX_AMOUNT,
      `Enter ${label} up to ₹1,00,000 crore.`
    );
}

const cashTaxSchema = amountSchema('tax paid in cash');
const stateTurnoverSchema = amountSchema('turnover in this State');

function dateIssue(value: string, label: string): string | null {
  if (value === '') return MISSING;
  return parseIsoDate(value) === null ? `Enter the ${label} as a full date.` : null;
}

export function validateGstInput(form: GstInput): GstValidation {
  const shape = formSchema.safeParse(form);
  if (!shape.success) return { input: null, errors: {}, missing: ['dueDate'] };
  const data = shape.data;
  const annual = data.returnType === 'GSTR-9';
  const interestApplies = data.returnType === 'GSTR-3B' && !data.isNilReturn;

  const errors: GstValidation['errors'] = {};
  const missing: GstField[] = [];
  const record = (field: GstField, issue: string | null) => {
    if (issue === MISSING) missing.push(field);
    else if (issue) errors[field] = issue;
  };

  const dueIssue = dateIssue(data.dueDate, 'due date');
  const due = parseIsoDate(data.dueDate);
  if (dueIssue === null && due !== null && !annual && due < FIRST_PERIODIC_DUE_DATE) {
    record(
      'dueDate',
      'Enter a due date from 1 July 2021. The caps used here apply to tax periods from June 2021.'
    );
  } else if (dueIssue === null && due !== null && annual && due < FIRST_ANNUAL_DUE_DATE) {
    record(
      'dueDate',
      'GSTR-9 fees here apply from FY 2022-23, due 31 December 2023. Enter that date or a later one.'
    );
  } else {
    record('dueDate', dueIssue);
  }
  record('filingDate', dateIssue(data.filingDate, 'filing date'));

  if (interestApplies) {
    const cash = cashTaxSchema.safeParse(data.taxLiability);
    if (!cash.success) record('taxLiability', cash.error.issues[0].message);
  }

  if (annual) {
    const turnover = data.stateTurnover ?? 0;
    const parsed = stateTurnoverSchema.safeParse(turnover);
    const limit = STATE_TURNOVER_LIMITS[data.turnoverSlab];
    if (!parsed.success) record('stateTurnover', parsed.error.issues[0].message);
    else if (turnover === 0) record('stateTurnover', MISSING);
    else if (limit && turnover > limit.max) {
      record(
        'stateTurnover',
        `Turnover in this State cannot be more than aggregate turnover, which you chose as up to ${limit.label}.`
      );
    }
  }

  const valid = missing.length === 0 && Object.keys(errors).length === 0;
  return {
    input: valid
      ? {
          ...data,
          isNilReturn: annual ? false : data.isNilReturn,
          taxLiability: interestApplies ? data.taxLiability : 0,
          stateTurnover: annual ? (data.stateTurnover ?? 0) : 0,
        }
      : null,
    errors,
    missing,
  };
}
