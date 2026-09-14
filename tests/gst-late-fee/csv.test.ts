import { describe, expect, it } from 'vitest';
import { calculateGstPenalty } from '../../src/tools/gst-late-fee/calc';
import { resultToCsv, resultToText } from '../../src/tools/gst-late-fee/csv';
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

const rowsFor = (input: GstInput) =>
  resultToCsv(input, calculateGstPenalty(input)!).trim().split('\r\n');

describe('CSV workings', () => {
  const rows = rowsFor(base);

  it('lists the inputs and dates used', () => {
    expect(rows).toContain('Return type,GSTR-3B');
    expect(rows).toContain('Filed as,Regular');
    expect(rows).toContain('Aggregate turnover (previous year),Up to ₹1.5 crore');
    expect(rows).toContain('Due date,2026-05-20');
    expect(rows).toContain('Filing date,2026-06-19');
    expect(rows).toContain('Days late,30');
    expect(rows).toContain('Last date to file (three years from the due date),2029-05-20');
  });

  it('gives the late fee per head with plain numbers', () => {
    expect(rows).toContain('Head,Per day,Days late,Before cap,Cap,Payable');
    expect(rows).toContain('CGST,25,30,750,1000,750');
    expect(rows).toContain('SGST/UTGST,25,30,750,1000,750');
    expect(rows).toContain('Total,50,30,1500,2000,1500');
  });

  it('quotes the cap explanation, which contains commas', () => {
    expect(rows.some((row) => /^Cap,".*₹1,000 per head.*"$/.test(row))).toBe(true);
  });

  it('gives the interest working and total', () => {
    expect(rows).toContain('Tax paid in cash,100000');
    expect(rows).toContain('Rate (% a year),18');
    expect(rows).toContain('Interest from,2026-05-21');
    expect(rows).toContain('Interest to,2026-06-19');
    expect(rows).toContain('Interest days,30');
    expect(rows).toContain('Calculation,100000 x 18% x 30 / 365');
    expect(rows).toContain('Interest (exact),1479.45');
    expect(rows).toContain('Interest (rounded to the rupee),1479');
    expect(rows).toContain('Total late fee and interest,2979');
  });

  it('says why no interest is charged on GSTR-1', () => {
    const gstr1 = rowsFor({ ...base, returnType: 'GSTR-1', taxLiability: 0 });
    expect(gstr1.some((row) => row.startsWith('Interest,Not charged'))).toBe(true);
    expect(gstr1.some((row) => row.startsWith('Tax paid in cash'))).toBe(false);
  });

  it('includes State turnover for GSTR-9', () => {
    const annual = rowsFor({
      ...base,
      returnType: 'GSTR-9',
      dueDate: '2025-12-31',
      filingDate: '2026-03-01',
      turnoverSlab: 'upto_5cr',
      stateTurnover: 4000000,
      taxLiability: 0,
    });
    expect(annual).toContain('Aggregate turnover (financial year),Up to ₹5 crore');
    expect(annual).toContain('Turnover in this State,4000000');
    expect(annual).toContain('CGST,25,60,1500,800,800');
  });
});

describe('copied text', () => {
  it('summarises the late fee, interest and total', () => {
    const text = resultToText(base, calculateGstPenalty(base)!);
    expect(text).toContain('GSTR-3B due 20 May 2026, filed 19 Jun 2026: 30 days late');
    expect(text).toContain('Late fee: ₹ 1,500 (CGST ₹ 750 + SGST/UTGST ₹ 750)');
    expect(text).toContain('Interest: ₹ 1,00,000 x 18% x 30 / 365 = ₹ 1,479');
    expect(text).toContain('Total: ₹ 2,979');
  });
});
