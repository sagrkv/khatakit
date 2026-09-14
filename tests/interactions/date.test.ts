import { expect, it } from 'vitest';
import { formatLongDate } from '../../src/lib/utils/date';

it('writes an ISO date as day, month name and year', () => {
  expect(formatLongDate('2026-09-14')).toBe('14 September 2026');
  expect(formatLongDate('2027-01-05')).toBe('5 January 2027');
  expect(formatLongDate('2026-12-31')).toBe('31 December 2026');
});
