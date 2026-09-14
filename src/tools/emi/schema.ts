import { z } from 'zod';
import { amountField, fieldErrors, type Validation } from '../../lib/utils/validation';
import type { EmiInput } from './types';

export type TenureUnit = 'years' | 'months';

export interface EmiFormValues {
  principal: number;
  annualRate: number;
  tenure: number;
  tenureUnit: TenureUnit;
}

export type EmiField = 'principal' | 'annualRate' | 'tenure';

const MAX_TENURE_MONTHS = 480;

const isWhole = (value: number) => Math.abs(value - Math.round(value)) < 1e-9;

export function tenureInMonths(form: Pick<EmiFormValues, 'tenure' | 'tenureUnit'>): number {
  return form.tenureUnit === 'years' ? form.tenure * 12 : form.tenure;
}

const schema = z
  .object({
    principal: amountField('the loan amount', '500000'),
    annualRate: z
      .number({ error: 'Enter the interest rate as a number, for example 8.5.' })
      .min(0, 'Enter an interest rate of zero or more.')
      .max(50, 'Enter an interest rate of 50% or less.'),
    tenure: z
      .number({ error: 'Enter the tenure as a number, for example 20.' })
      .min(0, 'Enter a tenure of zero or more.'),
    tenureUnit: z.enum(['years', 'months']),
  })
  .superRefine((value, ctx) => {
    const months = tenureInMonths(value);
    const issue = (message: string) => ctx.addIssue({ code: 'custom', path: ['tenure'], message });
    if (months > MAX_TENURE_MONTHS) {
      issue(
        value.tenureUnit === 'years'
          ? 'Enter a tenure of 40 years or less.'
          : 'Enter a tenure of 480 months (40 years) or less.'
      );
    } else if (!isWhole(months)) {
      issue(
        value.tenureUnit === 'years'
          ? 'Enter years that make whole months, for example 1.5 years is 18 months.'
          : 'Enter the tenure in whole months.'
      );
    }
  });

export function validateEmi(form: EmiFormValues): Validation<EmiInput, EmiField> {
  const parsed = schema.safeParse(form);
  if (!parsed.success) return { input: null, errors: fieldErrors(parsed.error) };
  const tenureMonths = Math.round(tenureInMonths(parsed.data));
  if (parsed.data.principal === 0 || tenureMonths === 0) return { input: null, errors: {} };
  return {
    input: { principal: parsed.data.principal, annualRate: parsed.data.annualRate, tenureMonths },
    errors: {},
  };
}
