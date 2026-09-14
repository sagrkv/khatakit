import { z } from 'zod';
import { CUSTOM_RATE, DEFAULT_RATE, presetRateMilli } from './rates';
import type { BillInput, BillLineInput, PriceType, SupplyType } from './types';

/** What the form holds while the user types. */
export interface LineForm {
  id: number;
  description: string;
  amount: string;
  priceType: PriceType;
  /** A preset rate value from RATE_OPTIONS, or CUSTOM_RATE. */
  rate: string;
  customRate: string;
}

export interface BillForm {
  supplyType: SupplyType;
  roundToRupee: boolean;
  lines: LineForm[];
}

export type LineField = 'amount' | 'customRate';

export interface BillValidation {
  /** Present only when every line is complete and valid. */
  input: BillInput | null;
  /** Invalid values, shown straight away. Keyed by fieldKey. */
  errors: Record<string, string>;
  /** Empty required values, shown once the user leaves the field. Keyed by fieldKey. */
  missing: Record<string, string>;
}

export const MAX_LINES = 50;
export const MAX_DESCRIPTION = 120;
/** ₹1,000 crore per line. */
const MAX_LINE_PAISE = 1_000_00_00_000_00;

export const fieldKey = (id: number, field: LineField) => `${id}-${field}`;

export function emptyLine(id: number): LineForm {
  return { id, description: '', amount: '', priceType: 'exclusive', rate: DEFAULT_RATE, customRate: '' };
}

const MISSING = 'missing';

/** A decimal string with at most `decimals` places, as an integer scaled by 10^decimals. */
function scaledDecimal(label: string, example: string, decimals: number) {
  return z.string().transform((raw, ctx) => {
    const fail = (message: string) => {
      ctx.addIssue({ code: 'custom', message });
      return z.NEVER;
    };
    const text = raw.replace(/[\s,₹%]/g, '');
    if (text === '') return fail(MISSING);
    if (text.startsWith('-')) return fail(`Enter ${label} of zero or more.`);
    const match = /^(\d*)(?:\.(\d*))?$/.exec(text);
    if (!match || (match[1] === '' && !match[2])) {
      return fail(`Enter ${label} as a number, for example ${example}.`);
    }
    const fraction = match[2] ?? '';
    if (fraction.length > decimals) {
      return fail(`Enter ${label} with at most ${decimals} decimal places.`);
    }
    const whole = match[1].replace(/^0+/, '');
    if (whole.length > 12) return fail(`Enter a smaller ${label.replace(/^an? /, '')}.`);
    return Number(whole || '0') * 10 ** decimals + Number(fraction.padEnd(decimals, '0'));
  });
}

const amountSchema = scaledDecimal('an amount', '1250.50', 2).refine(
  (paise) => paise <= MAX_LINE_PAISE,
  'Enter an amount up to ₹1,000 crore per line.'
);

const customRateSchema = scaledDecimal('a rate', '12', 3).refine(
  (rateMilli) => rateMilli <= 100_000,
  'Enter a rate of 100% or less.'
);

const billSchema = z.object({
  supplyType: z.enum(['intra', 'inter']),
  roundToRupee: z.boolean(),
  lines: z
    .array(
      z.object({
        id: z.number().int().nonnegative(),
        description: z.string().max(MAX_DESCRIPTION),
        amount: z.string(),
        priceType: z.enum(['exclusive', 'inclusive']),
        rate: z.string(),
        customRate: z.string(),
      })
    )
    .min(1)
    .max(MAX_LINES),
});

const MISSING_MESSAGES: Record<LineField, string> = {
  amount: 'Enter the amount.',
  customRate: 'Enter the GST rate.',
};

export function validateBill(form: BillForm): BillValidation {
  const shape = billSchema.safeParse(form);
  if (!shape.success) return { input: null, errors: { form: 'The bill could not be read.' }, missing: {} };

  const errors: Record<string, string> = {};
  const missing: Record<string, string> = {};
  const lines: BillLineInput[] = [];

  const check = (id: number, field: LineField, result: z.ZodSafeParseResult<number>) => {
    if (result.success) return result.data;
    const message = result.error.issues[0].message;
    if (message === MISSING) missing[fieldKey(id, field)] = MISSING_MESSAGES[field];
    else errors[fieldKey(id, field)] = message;
    return null;
  };

  for (const line of shape.data.lines) {
    const amountPaise = check(line.id, 'amount', amountSchema.safeParse(line.amount));
    const rateMilli =
      line.rate === CUSTOM_RATE
        ? check(line.id, 'customRate', customRateSchema.safeParse(line.customRate))
        : (presetRateMilli(line.rate) ?? null);
    if (amountPaise === null || rateMilli === null) continue;
    lines.push({
      id: line.id,
      description: line.description.trim(),
      amountPaise,
      priceType: line.priceType,
      rateMilli,
    });
  }

  const complete = lines.length === shape.data.lines.length;
  return {
    input: complete
      ? { supplyType: shape.data.supplyType, roundToRupee: shape.data.roundToRupee, lines }
      : null,
    errors,
    missing,
  };
}
