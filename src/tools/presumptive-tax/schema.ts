import { z } from 'zod';
import { amountField, fieldErrors, type Validation } from '../../lib/utils/validation';
import type { PresumptiveInput } from './types';

export type PresumptiveField = 'grossReceipts' | 'cashReceipts';

const schema = z
  .object({
    scheme: z.enum(['44AD', '44ADA']),
    regime: z.enum(['new', 'old']),
    grossReceipts: amountField('gross receipts', '4000000'),
    cashReceipts: amountField('cash receipts', '100000'),
  })
  .superRefine((value, ctx) => {
    if (value.cashReceipts > value.grossReceipts) {
      ctx.addIssue({
        code: 'custom',
        path: ['cashReceipts'],
        message: 'Cash receipts cannot be more than gross receipts.',
      });
    }
  });

export function validatePresumptive(
  form: PresumptiveInput
): Validation<PresumptiveInput, PresumptiveField> {
  const parsed = schema.safeParse(form);
  if (!parsed.success) return { input: null, errors: fieldErrors(parsed.error) };
  return { input: parsed.data.grossReceipts > 0 ? parsed.data : null, errors: {} };
}
