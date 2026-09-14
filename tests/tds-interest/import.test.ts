import { describe, expect, it } from 'vitest';
import { parseDelimited, toCsv } from '../../src/tools/tds-interest/csv';
import { tableToDrafts } from '../../src/tools/tds-interest/import';
import { parseAmount, parseDateText } from '../../src/tools/tds-interest/validate';
import { calculateDrafts } from '../../src/tools/tds-interest/sheet';

const options = {
  asOf: '2026-09-14',
  today: '2026-09-14',
  deductorType: 'non-government',
} as const;

describe('amount parsing', () => {
  it('accepts Indian and plain number formats', () => {
    expect(parseAmount('1,00,050')).toEqual({ ok: true, value: 100050 });
    expect(parseAmount('₹ 25,000.00')).toEqual({ ok: true, value: 25000 });
    expect(parseAmount('Rs. 1,000')).toEqual({ ok: true, value: 1000 });
    expect(parseAmount(' 12,34,567.50 ')).toEqual({ ok: true, value: 1234567.5 });
    expect(parseAmount('100050')).toEqual({ ok: true, value: 100050 });
  });

  it('rejects blanks, text, negatives and extra decimals', () => {
    for (const bad of ['', 'abc', '-500', '12.345', '1,00,0,50,', '1e5']) {
      expect(parseAmount(bad).ok, bad).toBe(false);
    }
  });
});

describe('date parsing', () => {
  it('accepts dd/mm/yyyy, dd-mm-yyyy, dd.mm.yyyy and yyyy-mm-dd', () => {
    expect(parseDateText('28/04/2026')).toEqual({ ok: true, value: '2026-04-28' });
    expect(parseDateText('8-5-2026')).toEqual({ ok: true, value: '2026-05-08' });
    expect(parseDateText('08.05.2026')).toEqual({ ok: true, value: '2026-05-08' });
    expect(parseDateText('2026-05-08')).toEqual({ ok: true, value: '2026-05-08' });
    expect(parseDateText('29/02/2024')).toEqual({ ok: true, value: '2024-02-29' });
    expect(parseDateText('  ')).toEqual({ ok: true, value: '' });
  });

  it('rejects impossible and month-first dates', () => {
    for (const bad of ['31/02/2026', '29/02/2025', '04/28/2026', '2026/13/01', 'May 8', '8/5/26']) {
      expect(parseDateText(bad).ok, bad).toBe(false);
    }
  });
});

describe('CSV parsing and writing', () => {
  it('handles quotes, escaped quotes, embedded newlines, CRLF and blank lines', () => {
    const text = 'a,"b, c","say ""hi"""\r\n\r\n"line\nbreak",2,3\n';
    expect(parseDelimited(text)).toEqual([
      ['a', 'b, c', 'say "hi"'],
      ['line\nbreak', '2', '3'],
    ]);
  });

  it('detects tab-separated spreadsheet paste', () => {
    expect(parseDelimited('A\t1,00,050\n B\t25,000')).toEqual([
      ['A', '1,00,050'],
      [' B', '25,000'],
    ]);
  });

  it('quotes when needed, guards formula-like text and round-trips', () => {
    const rows = [
      ['Label', 'Amount'],
      ['=SUM(A1)', 3000],
      ['Deductee, "A"', 1125.5],
      ['+91 note', -1],
    ];
    const csv = toCsv(rows);
    expect(csv).toContain("'=SUM(A1)");
    expect(csv).toContain('"Deductee, ""A"""');
    expect(csv).toContain(',-1\r\n');
    expect(parseDelimited(csv)[2]).toEqual(['Deductee, "A"', '1125.5']);
    expect(parseDelimited(csv)[3][0]).toBe("'+91 note");
  });
});

describe('table import', () => {
  it('maps headers in any order and keeps bad rows with errors', () => {
    const table = parseDelimited(
      [
        'Date deposited,TDS amount,Date deducted,Label,Date deductible',
        '08/05/2026,"1,00,050",28/04/2026,Vendor A,',
        '05/05/2026,abc,20/03/2026,Vendor B,',
        ',25000,31/02/2026,Vendor C,',
        '12/09/2026,"₹ 50,000",10/08/2026,Vendor D,15/06/2026',
      ].join('\n')
    );
    const { drafts, skipped } = tableToDrafts(table);
    expect(skipped).toBe(0);
    expect(drafts.map((draft) => draft.label)).toEqual([
      'Vendor A',
      'Vendor B',
      'Vendor C',
      'Vendor D',
    ]);
    expect(drafts[0]).toMatchObject({
      amount: '1,00,050',
      deducted: '28/04/2026',
      deposited: '08/05/2026',
    });

    const sheet = calculateDrafts(drafts, options);
    expect(sheet.errorCount).toBe(2);
    const [a, b, c, d] = sheet.outcomes;
    expect(a.status).toBe('ok');
    expect(b.status === 'error' && b.errors[0]).toContain('TDS amount');
    expect(c.status === 'error' && c.errors[0]).toContain('Date deducted');
    expect(d.status).toBe('ok');
    expect(sheet.totalCalendarPaise).toBe(600000);
    expect(sheet.totalThirtyDayPaise).toBe(400000);
  });

  it('reads rows without a header by position', () => {
    const five = tableToDrafts([['Vendor', '1000', '', '10/08/2026', '07/09/2026']]);
    expect(five.drafts[0]).toMatchObject({
      label: 'Vendor',
      amount: '1000',
      deducted: '10/08/2026',
    });
    const four = tableToDrafts([['1000', '', '10/08/2026', '07/09/2026']]);
    expect(four.drafts[0]).toMatchObject({ label: '', amount: '1000', deposited: '07/09/2026' });
  });

  it('skips empty rows and counts rows with too few columns', () => {
    const { drafts, skipped } = tableToDrafts([['', '', ''], ['only one']]);
    expect(drafts).toHaveLength(0);
    expect(skipped).toBe(1);
  });
});
