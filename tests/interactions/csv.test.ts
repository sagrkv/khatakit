import { describe, expect, it } from 'vitest';
import { toCsv } from '../../src/lib/utils/csv';

describe('toCsv', () => {
  it('quotes commas, quotes and line breaks and uses CRLF', () => {
    expect(toCsv([['a,b', 'say "hi"', 'two\nlines'], [1, 2.5]])).toBe(
      '"a,b","say ""hi""","two\nlines"\r\n1,2.5\r\n'
    );
  });

  it('stops text starting with a formula character from running in a spreadsheet', () => {
    expect(toCsv([['=SUM(A1)', '+1', '@x', 'plain'], [-5]])).toBe("'=SUM(A1),'+1,'@x,plain\r\n-5\r\n");
  });
});
