import { z } from 'zod';

/** ₹1,000 crore. Larger amounts are almost certainly typing mistakes. */
export const MAX_AMOUNT = 1_000_00_00_000;

/**
 * A rupee amount from a number field. NaN means the text was not a number.
 * `name` reads inside a sentence, for example "the loan amount".
 */
export function amountField(name: string, example: string) {
  return z
    .number({ error: `Enter ${name} as a number, for example ${example}.` })
    .min(0, `Enter ${name} of zero or more.`)
    .max(MAX_AMOUNT, `Enter ${name} up to ₹1,000 crore.`);
}

/** The first message for each top-level field. */
export function fieldErrors<K extends string>(error: z.ZodError): Partial<Record<K, string>> {
  const errors: Partial<Record<K, string>> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form') as K;
    if (!(key in errors)) errors[key] = issue.message;
  }
  return errors;
}

export interface Validation<Input, Field extends string> {
  /** Present only when every field is valid and there is something to calculate. */
  input: Input | null;
  errors: Partial<Record<Field, string>>;
}
