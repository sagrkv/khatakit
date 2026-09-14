import { z } from 'zod';
import { MAX_AMOUNT } from '../../lib/utils/validation';
import { isoFromParts } from './dates';

export type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

// 1,00,050 (Indian grouping), 100,050 (international grouping) or 100050, with up to 2 decimals.
const AMOUNT = /^(?:\d{1,3}(?:,\d{2})*,\d{3}|\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{1,2})?$/;

/** Amount text as typed or pasted. Messages complete the sentence "TDS amount ...". */
const amountSchema = z.string().transform((raw, ctx) => {
  const fail = (message: string) => {
    ctx.addIssue({ code: 'custom', message });
    return z.NEVER;
  };
  const text = raw
    .trim()
    .replace(/^(?:₹|rs\.?|inr)\s*/i, '')
    .trim();
  if (text === '') return fail('is missing.');
  if (text.startsWith('-')) return fail('cannot be negative.');
  if (!AMOUNT.test(text)) return fail('must be a number, like 1,00,050.');
  const value = Number(text.replace(/,/g, ''));
  if (value > MAX_AMOUNT) return fail('must be ₹1,000 crore or less.');
  return value;
});

/** dd/mm/yyyy (also - or . separators) or yyyy-mm-dd. Blank gives ''. */
const dateSchema = z.string().transform((raw, ctx) => {
  const text = raw.trim();
  if (text === '') return '';
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(text);
  const dayFirst = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(text);
  const date = iso
    ? isoFromParts(+iso[1], +iso[2], +iso[3])
    : dayFirst
      ? isoFromParts(+dayFirst[3], +dayFirst[2], +dayFirst[1])
      : null;
  if (date) return date;
  ctx.addIssue({ code: 'custom', message: 'must be a real date, like 28/04/2026.' });
  return z.NEVER;
});

function toParsed<T>(result: z.ZodSafeParseResult<T>): Parsed<T> {
  return result.success
    ? { ok: true, value: result.data }
    : { ok: false, error: result.error.issues[0].message };
}

export const parseAmount = (text: string) => toParsed(amountSchema.safeParse(text));

export const parseDateText = (text: string) => toParsed(dateSchema.safeParse(text));
