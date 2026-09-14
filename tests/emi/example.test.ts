import { describe, expect, it } from 'vitest';
import { buildMonthlySchedule, calculateEmi } from '../../src/tools/emi/calc';
import { RBI_EXAMPLE, ZERO_RATE_EXAMPLE } from '../../src/tools/emi/example';

describe('EMI guide figures match the calculator', () => {
  it('RBI example totals', () => {
    const result = calculateEmi(RBI_EXAMPLE.input);
    expect(result.emi).toBe(RBI_EXAMPLE.emi);
    expect(result.totalInterest).toBe(RBI_EXAMPLE.totalInterest);
    expect(result.totalPayable).toBe(RBI_EXAMPLE.totalPayable);
    expect(RBI_EXAMPLE.input.annualRate / 12).toBe(RBI_EXAMPLE.monthlyRatePercent);
  });

  it('RBI example rows', () => {
    const rows = buildMonthlySchedule(
      RBI_EXAMPLE.input.principal,
      RBI_EXAMPLE.input.annualRate,
      RBI_EXAMPLE.input.tenureMonths
    );
    expect(rows[0]).toMatchObject(RBI_EXAMPLE.firstMonth);
    expect(rows[1]).toMatchObject(RBI_EXAMPLE.secondMonth);
    expect(rows[rows.length - 1]).toMatchObject(RBI_EXAMPLE.lastMonth);
  });

  it('zero-rate example', () => {
    const { principal, tenureMonths } = ZERO_RATE_EXAMPLE.input;
    const result = calculateEmi(ZERO_RATE_EXAMPLE.input);
    expect(result.emi).toBe(ZERO_RATE_EXAMPLE.emi);
    expect(result.totalPayable).toBe(ZERO_RATE_EXAMPLE.totalPayable);
    expect(ZERO_RATE_EXAMPLE.emi * tenureMonths).toBe(ZERO_RATE_EXAMPLE.sumOfRoundedEmis);
    expect(principal).toBe(ZERO_RATE_EXAMPLE.totalPayable);
  });
});
