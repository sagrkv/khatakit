import { describe, expect, it } from 'vitest';
import {
  calculateCase,
  calculateSheet,
  countPeriod,
  dueDateFor,
  roundToTen,
} from '../../src/tools/tds-interest/calc';
import type { CaseResult, SheetOptions, TdsCase } from '../../src/tools/tds-interest/types';

const options: SheetOptions = {
  asOf: '2026-09-14',
  today: '2026-09-14',
  deductorType: 'non-government',
};

function tdsCase(overrides: Partial<TdsCase>): TdsCase {
  return { label: '', amount: 0, deductibleOn: '', deductedOn: '', depositedOn: '', ...overrides };
}

function ok(input: Partial<TdsCase>, opts: Partial<SheetOptions> = {}): CaseResult {
  const outcome = calculateCase(tdsCase(input), { ...options, ...opts });
  if (outcome.status !== 'ok')
    throw new Error(`Expected a result, got ${outcome.errors.join('; ')}`);
  return outcome;
}

function errors(input: Partial<TdsCase>, opts: Partial<SheetOptions> = {}): string[] {
  const outcome = calculateCase(tdsCase(input), { ...options, ...opts });
  if (outcome.status !== 'error') throw new Error('Expected a row error');
  return outcome.errors;
}

describe('research test cases (calendar months, 30-day months)', () => {
  it('T1: late deposit, amount rounded down to Rs 100', () => {
    const r = ok({ amount: 100050, deductedOn: '2026-04-28', depositedOn: '2026-05-08' });
    expect(r.base).toBe(100000);
    expect(r.dueDate).toBe('2026-05-07');
    expect(r.lateDeduction).toBeNull();
    expect(r.lateDeposit?.months).toEqual(['Apr 2026', 'May 2026']);
    expect(r.lateDeposit?.days).toBe(10);
    expect(r.totalCalendarPaise).toBe(300000);
    expect(r.totalThirtyDayPaise).toBe(150000);
    expect(r.provision.act).toBe('2025');
    expect(r.provision.section).toBe('Section 398(3)(a)(ii)');
  });

  it('T2: March deduction uses 30 April and the 1961 Act', () => {
    const r = ok({ amount: 25000, deductedOn: '2026-03-20', depositedOn: '2026-05-05' });
    expect(r.dueDate).toBe('2026-04-30');
    expect(r.lateDeposit?.months).toEqual(['Mar 2026', 'Apr 2026', 'May 2026']);
    expect(r.lateDeposit?.days).toBe(46);
    expect(r.totalCalendarPaise).toBe(112500);
    expect(r.totalThirtyDayPaise).toBe(75000);
    expect(r.provision.act).toBe('1961');
    expect(r.provision.section).toBe('Section 201(1A)(ii)');
    expect(r.straddles).toBe(true);
  });

  it('T3: late deduction and late deposit both count the deduction month', () => {
    const r = ok({
      amount: 50000,
      deductibleOn: '2026-06-15',
      deductedOn: '2026-08-10',
      depositedOn: '2026-09-12',
    });
    expect(r.dueDate).toBe('2026-09-07');
    expect(r.lateDeduction?.months).toEqual(['Jun 2026', 'Jul 2026', 'Aug 2026']);
    expect(r.lateDeduction?.days).toBe(56);
    expect(r.lateDeduction?.calendarPaise).toBe(150000);
    expect(r.lateDeduction?.thirtyDayPaise).toBe(100000);
    expect(r.lateDeposit?.months).toEqual(['Aug 2026', 'Sep 2026']);
    expect(r.lateDeposit?.days).toBe(33);
    expect(r.lateDeposit?.calendarPaise).toBe(150000);
    expect(r.lateDeposit?.thirtyDayPaise).toBe(150000);
    expect(r.totalCalendarPaise).toBe(300000);
    expect(r.totalThirtyDayPaise).toBe(250000);
    expect(r.provision.section).toBe('Section 398(3)(a)');
  });

  it('T4: deposit on the due date gives no interest', () => {
    const r = ok({ amount: 50000, deductedOn: '2026-08-10', depositedOn: '2026-09-07' });
    expect(r.dueDate).toBe('2026-09-07');
    expect(r.lateDeposit).toBeNull();
    expect(r.totalCalendarPaise).toBe(0);
    expect(r.totalThirtyDayPaise).toBe(0);
  });

  it('T5: earlier study case', () => {
    const r = ok({ amount: 100000, deductedOn: '2026-04-15', depositedOn: '2026-05-10' });
    expect(r.totalCalendarPaise).toBe(300000);
    expect(r.totalThirtyDayPaise).toBe(150000);
  });
});

describe('month counting', () => {
  it('starts the day after the start date, so a last-day deduction skips that month', () => {
    const period = countPeriod('2026-06-30', '2026-08-08');
    expect(period.months).toEqual(['Jul 2026', 'Aug 2026']);
    expect(period.days).toBe(39);
    expect(period.thirtyDayMonths).toBe(2);
  });

  it('matches the TRACES FAQ example (10 June to 8 August 2023 is 3 months)', () => {
    expect(countPeriod('2023-06-10', '2023-08-08').months).toHaveLength(3);
  });

  it('handles leap years and year boundaries', () => {
    const leap = ok({ amount: 10000, deductedOn: '2024-02-29', depositedOn: '2024-04-01' });
    expect(leap.dueDate).toBe('2024-03-07');
    expect(leap.lateDeposit?.months).toEqual(['Mar 2024', 'Apr 2024']);
    expect(leap.lateDeposit?.days).toBe(32);
    expect(leap.lateDeposit?.thirtyDayMonths).toBe(2);

    const year = ok({ amount: 10000, deductedOn: '2025-12-15', depositedOn: '2026-01-10' });
    expect(year.dueDate).toBe('2026-01-07');
    expect(year.lateDeposit?.months).toEqual(['Dec 2025', 'Jan 2026']);
    expect(year.lateDeposit?.thirtyDayMonths).toBe(1);
  });

  it('counts nothing for an empty period', () => {
    expect(countPeriod('2026-05-01', '2026-05-01')).toMatchObject({
      days: 0,
      months: [],
      thirtyDayMonths: 0,
    });
  });
});

describe('due dates', () => {
  it('uses the 7th of the next month, 30 April for March, and government rules', () => {
    expect(dueDateFor('2026-08-10', 'non-government').date).toBe('2026-09-07');
    expect(dueDateFor('2026-12-31', 'non-government').date).toBe('2027-01-07');
    expect(dueDateFor('2026-03-31', 'non-government').date).toBe('2026-04-30');
    expect(dueDateFor('2026-03-20', 'government-challan').date).toBe('2026-04-07');
    expect(dueDateFor('2026-08-10', 'government-book-entry').date).toBe('2026-08-10');
  });

  it('charges a government book-entry deductor from the day after deduction', () => {
    const r = ok(
      { amount: 10000, deductedOn: '2026-08-10', depositedOn: '2026-08-11' },
      { deductorType: 'government-book-entry' }
    );
    expect(r.lateDeposit?.months).toEqual(['Aug 2026']);
    expect(r.totalCalendarPaise).toBe(15000);
  });

  it('gives 0 for a March deduction deposited on 30 April', () => {
    const r = ok({ amount: 25000, deductedOn: '2026-03-20', depositedOn: '2026-04-30' });
    expect(r.totalCalendarPaise).toBe(0);
  });
});

describe('edge cases', () => {
  it('runs an undeposited amount to the as-of date and marks it an estimate', () => {
    const r = ok({ amount: 50000, deductedOn: '2026-08-10' });
    expect(r.estimate).toBe(true);
    expect(r.lateDeposit?.to).toBe('2026-09-14');
    expect(r.lateDeposit?.months).toEqual(['Aug 2026', 'Sep 2026']);

    const notDue = ok({ amount: 50000, deductedOn: '2026-08-10' }, { asOf: '2026-09-05' });
    expect(notDue.lateDeposit).toBeNull();
    expect(notDue.notes.join(' ')).toContain('not yet due');
  });

  it('runs tax not yet deducted from the deductible date to the as-of date at 1%', () => {
    const r = ok({ amount: 50000, deductibleOn: '2026-07-15' });
    expect(r.estimate).toBe(true);
    expect(r.lateDeduction?.months).toEqual(['Jul 2026', 'Aug 2026', 'Sep 2026']);
    expect(r.lateDeduction?.ratePercent).toBe(1);
    expect(r.lateDeposit).toBeNull();
    expect(r.totalCalendarPaise).toBe(150000);
  });

  it('gives no late-deduction interest when deducted before the deductible date', () => {
    const r = ok({
      amount: 50000,
      deductibleOn: '2026-08-15',
      deductedOn: '2026-08-10',
      depositedOn: '2026-09-07',
    });
    expect(r.lateDeduction).toBeNull();
    expect(r.totalCalendarPaise).toBe(0);
  });

  it('flags an amount below Rs 100 as rounding to 0', () => {
    const r = ok({ amount: 99, deductedOn: '2026-04-10', depositedOn: '2026-06-10' });
    expect(r.base).toBe(0);
    expect(r.totalCalendarPaise).toBe(0);
    expect(r.notes.join(' ')).toContain('below');
  });

  it('keeps paise and rounds the payable total to the nearest Rs 10', () => {
    const r = ok({ amount: 150, deductedOn: '2026-04-30', depositedOn: '2026-05-08' });
    expect(r.totalCalendarPaise).toBe(150);
    expect(roundToTen(112500)).toBe(1130);
    expect(roundToTen(112450)).toBe(1120);
    expect(roundToTen(150)).toBe(0);
  });

  it('returns plain-word row errors', () => {
    expect(errors({ amount: 0, deductedOn: '2026-08-10' })[0]).toContain('TDS amount');
    expect(errors({ amount: 1000 })[0]).toContain('date');
    expect(errors({ amount: 1000, depositedOn: '2026-08-10' })[0]).toContain('deducted');
    expect(
      errors({ amount: 1000, deductedOn: '2026-08-10', depositedOn: '2026-08-01' })[0]
    ).toContain('before');
    expect(
      errors({ amount: 1000, deductedOn: '2026-08-10', depositedOn: '2026-09-20' })[0]
    ).toContain('future');
    expect(
      errors({ amount: 1000, deductedOn: '2021-03-10', depositedOn: '2021-05-10' })[0]
    ).toContain('1 April 2021');
    expect(errors({ amount: 1000, deductedOn: '2026-08-10' }, { asOf: '2026-08-01' })[0]).toContain(
      'as-of'
    );
  });
});

describe('sheet totals', () => {
  it('adds valid rows and counts errors without blocking them', () => {
    const sheet = calculateSheet(
      [
        tdsCase({ amount: 100050, deductedOn: '2026-04-28', depositedOn: '2026-05-08' }),
        tdsCase({ amount: -5, deductedOn: '2026-04-28' }),
        tdsCase({ amount: 25000, deductedOn: '2026-03-20', depositedOn: '2026-05-05' }),
      ],
      options
    );
    expect(sheet.errorCount).toBe(1);
    expect(sheet.totalCalendarPaise).toBe(412500);
    expect(sheet.totalThirtyDayPaise).toBe(225000);
    expect(sheet.roundedCalendarRupees).toBe(4130);
    expect(sheet.roundedThirtyDayRupees).toBe(2250);
  });
});
