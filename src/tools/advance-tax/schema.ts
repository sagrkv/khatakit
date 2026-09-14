import { z } from 'zod';
import { amountField, fieldErrors, type Validation } from '../../lib/utils/validation';
import type { AdvanceTaxInput } from './types';

export type AdvanceTaxField = 'grossIncome' | 'salaryIncome' | 'deductions' | 'tdsDeducted';

/** The form always holds both optional inputs. */
export type AdvanceTaxForm = Required<AdvanceTaxInput>;

const schema = z
  .object({
    regime: z.enum(['new', 'old']),
    grossIncome: amountField('gross total income', '1800000'),
    salaryIncome: amountField('salary or pension', '1200000'),
    deductions: amountField('deductions', '150000'),
    tdsDeducted: amountField('TDS', '25000'),
    ageCategory: z.enum(['below60', '60to80', 'above80']),
    hasBusinessIncome: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (value.salaryIncome > value.grossIncome) {
      ctx.addIssue({
        code: 'custom',
        path: ['salaryIncome'],
        message: 'Salary or pension cannot be more than gross total income.',
      });
    }
    if (value.regime === 'old' && value.deductions > value.grossIncome) {
      ctx.addIssue({
        code: 'custom',
        path: ['deductions'],
        message: 'Deductions cannot be more than gross total income.',
      });
    }
  });

export function validateAdvanceTax(
  form: AdvanceTaxForm
): Validation<AdvanceTaxInput, AdvanceTaxField> {
  // Deductions only count in the old regime, so a stale value must not block the new regime.
  const checked = form.regime === 'new' ? { ...form, deductions: 0 } : form;
  const parsed = schema.safeParse(checked);
  if (!parsed.success) return { input: null, errors: fieldErrors(parsed.error) };
  return { input: parsed.data.grossIncome > 0 ? form : null, errors: {} };
}
