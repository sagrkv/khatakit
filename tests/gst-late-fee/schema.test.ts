import { describe, expect, it } from 'vitest';
import { validateGstInput } from '../../src/tools/gst-late-fee/schema';
import type { GstInput } from '../../src/tools/gst-late-fee/types';

const base: GstInput = {
  returnType: 'GSTR-3B',
  dueDate: '2026-05-20',
  filingDate: '2026-06-19',
  taxLiability: 100000,
  turnoverSlab: 'upto_1_5cr',
  isNilReturn: false,
  stateTurnover: 0,
};

const annual: GstInput = {
  ...base,
  returnType: 'GSTR-9',
  dueDate: '2025-12-31',
  turnoverSlab: 'upto_5cr',
  stateTurnover: 20000000,
};

const check = (input: Partial<GstInput>, from: GstInput = base) =>
  validateGstInput({ ...from, ...input });

describe('validateGstInput', () => {
  it('accepts a complete GSTR-3B', () => {
    const result = check({});
    expect(result.errors).toEqual({});
    expect(result.missing).toEqual([]);
    expect(result.input).toEqual(base);
  });

  it('lists empty dates as missing, not as errors', () => {
    const result = check({ dueDate: '', filingDate: '' });
    expect(result.input).toBeNull();
    expect(result.errors).toEqual({});
    expect(result.missing).toEqual(['dueDate', 'filingDate']);
  });

  it('rejects impossible dates', () => {
    const result = check({ dueDate: '2026-02-30' });
    expect(result.input).toBeNull();
    expect(result.errors.dueDate).toMatch(/full date/);
  });

  it('rejects GSTR-3B and GSTR-1 due dates before July 2021', () => {
    expect(check({ dueDate: '2021-06-20' }).errors.dueDate).toMatch(/1 July 2021/);
    expect(check({ returnType: 'GSTR-1', dueDate: '2021-07-11' }).errors).toEqual({});
  });

  it('rejects GSTR-9 due dates before FY 2022-23', () => {
    expect(check({ dueDate: '2022-12-31' }, annual).errors.dueDate).toMatch(/FY 2022-23/);
    expect(check({ dueDate: '2023-12-31' }, annual).errors).toEqual({});
  });

  it('needs turnover in the State for GSTR-9', () => {
    const result = check({ stateTurnover: 0 }, annual);
    expect(result.input).toBeNull();
    expect(result.missing).toEqual(['stateTurnover']);
  });

  it('rejects State turnover above the aggregate turnover band', () => {
    const result = check({ stateTurnover: 60000000 }, annual);
    expect(result.errors.stateTurnover).toMatch(/₹5 crore/);
    expect(check({ turnoverSlab: '5cr_to_20cr', stateTurnover: 60000000 }, annual).errors).toEqual(
      {}
    );
  });

  it('rejects tax paid in cash that is negative, not a number or too large', () => {
    expect(check({ taxLiability: -1 }).errors.taxLiability).toMatch(/zero or more/);
    expect(check({ taxLiability: Number.NaN }).errors.taxLiability).toMatch(/number/);
    expect(check({ taxLiability: 2e12 }).errors.taxLiability).toMatch(/up to/);
  });

  it('ignores amounts that do not apply to the return', () => {
    const gstr1 = check({ returnType: 'GSTR-1', taxLiability: -5, stateTurnover: 10 });
    expect(gstr1.errors).toEqual({});
    expect(gstr1.input).toMatchObject({ taxLiability: 0, stateTurnover: 0 });
    const nil = check({ isNilReturn: true, taxLiability: 5000 });
    expect(nil.input).toMatchObject({ taxLiability: 0 });
    expect(check({ isNilReturn: true }, annual).input).toMatchObject({ isNilReturn: false });
  });
});
