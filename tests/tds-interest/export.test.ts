import { describe, expect, it } from 'vitest';
import { summaryText, workingsCsv, workingsTable } from '../../src/tools/tds-interest/export';
import { buildXlsx, crc32 } from '../../src/tools/tds-interest/xlsx';
import { calculateDrafts } from '../../src/tools/tds-interest/sheet';
import type { DraftRow } from '../../src/tools/tds-interest/types';

const options = {
  asOf: '2026-09-14',
  today: '2026-09-14',
  deductorType: 'non-government',
} as const;

const drafts: DraftRow[] = [
  {
    id: '1',
    label: 'T3',
    amount: '50,000',
    deductible: '15/06/2026',
    deducted: '10/08/2026',
    deposited: '12/09/2026',
  },
  { id: '2', label: '=cmd', amount: 'x', deductible: '', deducted: '10/08/2026', deposited: '' },
];

describe('workings export', () => {
  const sheet = calculateDrafts(drafts, options);
  const table = workingsTable(drafts, sheet, options);

  it('lists inputs, due date, months, both methods, provision and errors per row', () => {
    const header = table[0];
    const t3 = table[1];
    const at = (name: string) => t3[header.indexOf(name)];
    expect(at('Due date')).toBe('07/09/2026');
    expect(at('Late deduction months (calendar)')).toBe('Jun 2026, Jul 2026, Aug 2026');
    expect(at('Late deposit months (calendar)')).toBe('Aug 2026, Sep 2026');
    expect(at('Total interest (calendar months)')).toBe(3000);
    expect(at('Total interest (30-day months)')).toBe(2500);
    expect(String(at('Provision'))).toContain('398(3)(a)');
    expect(table[2][header.indexOf('Errors')]).toContain('TDS amount');
    const totals = table.at(-1)!;
    expect(totals[header.indexOf('Total interest (calendar months)')]).toBe(3000);
  });

  it('writes a CSV with guarded text and a totals row', () => {
    const csv = workingsCsv(drafts, sheet, options);
    expect(csv.startsWith('Row,Label,TDS amount')).toBe(true);
    expect(csv).toContain("'=cmd");
    expect(csv).toContain('\r\nTotal,');
  });

  it('summarises totals for copying', () => {
    expect(summaryText(sheet)).toContain('₹ 3,000');
    expect(summaryText(sheet)).toContain('₹ 2,500');
  });
});

describe('xlsx writer', () => {
  it('computes CRC-32', () => {
    const bytes = new TextEncoder().encode('The quick brown fox jumps over the lazy dog');
    expect(crc32(bytes)).toBe(0x414fa339);
  });

  it('builds a stored zip workbook with numeric and escaped text cells', () => {
    const file = buildXlsx([
      ['Label', 'Interest'],
      ['A & B <x>', 3000],
    ]);
    expect(Array.from(file.slice(0, 4))).toEqual([0x50, 0x4b, 0x03, 0x04]);
    const text = new TextDecoder().decode(file);
    expect(text).toContain('xl/worksheets/sheet1.xml');
    expect(text).toContain('[Content_Types].xml');
    expect(text).toContain('<v>3000</v>');
    expect(text).toContain('A &amp; B &lt;x&gt;');
    const end = file.length - 22;
    expect(Array.from(file.slice(end, end + 4))).toEqual([0x50, 0x4b, 0x05, 0x06]);
  });
});
