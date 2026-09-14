import { describe, expect, it } from 'vitest';
import { calculateAdvanceTax } from '../../src/tools/advance-tax/calc';
import {
  REBATE_EXAMPLE,
  SALARY_EXAMPLE,
  WORKED_EXAMPLE,
} from '../../src/tools/advance-tax/example';
import { slabBreakdown } from '../../src/lib/tax/slab-breakdown';

describe('advance tax guide figures match the calculator', () => {
  it('worked example', () => {
    const { input } = WORKED_EXAMPLE;
    const result = calculateAdvanceTax(input);
    const comp = result.newRegime;
    expect(input.grossIncome - input.salaryIncome).toBe(WORKED_EXAMPLE.otherIncome);
    expect(comp.standardDeduction).toBe(WORKED_EXAMPLE.standardDeduction);
    expect(comp.taxableIncome).toBe(WORKED_EXAMPLE.taxableIncome);
    expect(comp.taxOnIncome).toBe(WORKED_EXAMPLE.taxOnIncome);
    expect(comp.rebate).toBe(0);
    expect(comp.cess).toBe(WORKED_EXAMPLE.cess);
    expect(comp.totalTax).toBe(WORKED_EXAMPLE.totalTax);
    expect(comp.netTaxPayable).toBe(WORKED_EXAMPLE.netTaxPayable);
    expect(result.schedule.map((q) => q.installmentAmount)).toEqual(WORKED_EXAMPLE.instalments);
    expect(result.schedule.map((q) => q.cumulativeAmount)).toEqual(WORKED_EXAMPLE.cumulative);
    expect(result.oldRegime.totalTax).toBe(WORKED_EXAMPLE.oldRegimeTotalTax);
  });

  it('worked example slabs', () => {
    const slabs = slabBreakdown(WORKED_EXAMPLE.taxableIncome, 'new', 'below60')
      .filter((row) => row.rate > 0)
      .map(({ from, to, rate, tax }) => ({ from, to, rate, tax }));
    expect(slabs).toEqual(WORKED_EXAMPLE.slabs);
  });

  it('rebate marginal relief example', () => {
    const comp = calculateAdvanceTax(REBATE_EXAMPLE.input).newRegime;
    expect(comp.taxableIncome).toBe(REBATE_EXAMPLE.taxableIncome);
    expect(comp.taxOnIncome).toBe(REBATE_EXAMPLE.taxOnIncome);
    expect(comp.rebate).toBe(REBATE_EXAMPLE.relief);
    expect(comp.totalTax).toBe(REBATE_EXAMPLE.totalTax);
  });

  it('salary standard deduction example', () => {
    const income = SALARY_EXAMPLE.income;
    const base = { ...WORKED_EXAMPLE.input, grossIncome: income, tdsDeducted: 0 };
    expect(calculateAdvanceTax({ ...base, salaryIncome: income }).newRegime.totalTax).toBe(
      SALARY_EXAMPLE.salariedTax
    );
    expect(calculateAdvanceTax({ ...base, salaryIncome: 0 }).newRegime.totalTax).toBe(
      SALARY_EXAMPLE.nonSalaryTax
    );
  });
});

describe('slabBreakdown', () => {
  it('adds up to the tax on income for every regime and age', () => {
    for (const income of [0, 250000, 725000, 1210000, 3000000, 60000000]) {
      for (const regime of ['new', 'old'] as const) {
        for (const age of ['below60', '60to80', 'above80'] as const) {
          const sum = slabBreakdown(income, regime, age).reduce((total, row) => total + row.tax, 0);
          const input = { ...WORKED_EXAMPLE.input, regime, ageCategory: age };
          const result = calculateAdvanceTax({ ...input, grossIncome: income, salaryIncome: 0 });
          expect(Math.round(sum)).toBe(result[regime === 'new' ? 'newRegime' : 'oldRegime'].taxOnIncome);
        }
      }
    }
  });

  it('ends the top slab at the income', () => {
    const rows = slabBreakdown(3000000, 'new', 'below60');
    expect(rows[rows.length - 1]).toMatchObject({ from: 2400000, to: 3000000, rate: 30, tax: 180000 });
  });
});
