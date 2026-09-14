import { describe, expect, it } from 'vitest';
import { MARCH, ONE_DAY_LATE, WORKED } from '../../src/tools/tds-interest/example';

describe('guide examples', () => {
  it('worked example: late deduction 1,500 (1,000) plus late deposit 1,500 (1,500)', () => {
    expect(WORKED.result.dueDate).toBe('2026-09-07');
    expect(WORKED.result.lateDeduction).toMatchObject({
      days: 56,
      thirtyDayMonths: 2,
      calendarPaise: 150000,
      thirtyDayPaise: 100000,
    });
    expect(WORKED.result.lateDeposit).toMatchObject({
      days: 33,
      thirtyDayMonths: 2,
      calendarPaise: 150000,
      thirtyDayPaise: 150000,
    });
    expect(WORKED.result.totalCalendarPaise).toBe(300000);
    expect(WORKED.result.totalThirtyDayPaise).toBe(250000);
  });

  it('one day late: 3,000 in calendar months, 1,500 in 30-day months', () => {
    expect(ONE_DAY_LATE.result.base).toBe(100000);
    expect(ONE_DAY_LATE.result.totalCalendarPaise).toBe(300000);
    expect(ONE_DAY_LATE.result.totalThirtyDayPaise).toBe(150000);
  });

  it('March deduction: 1,125 (750) under section 201(1A)', () => {
    expect(MARCH.result.totalCalendarPaise).toBe(112500);
    expect(MARCH.result.totalThirtyDayPaise).toBe(75000);
    expect(MARCH.result.provision.act).toBe('1961');
    expect(MARCH.result.straddles).toBe(true);
  });
});
