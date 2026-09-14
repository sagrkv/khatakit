import {
  ADVANCE_TAX_SCHEDULE,
  ADVANCE_TAX_THRESHOLD,
  REBATE,
  STANDARD_DEDUCTION,
} from '../../lib/constants/tax-slabs';
import { formatRupeeText as rupees } from '../../lib/utils/format';
import type { Faq } from '../../seo/types';

// Direct answer and FAQ for the page, built from the verified constants.

const instalments = ADVANCE_TAX_SCHEDULE.map((q) => `${q.cumulativePercent}% by ${q.dueDate}`);

/** "15% by 15 June 2026, 45% by ... and 100% by 15 March 2027". */
export const SCHEDULE_TEXT = `${instalments.slice(0, -1).join(', ')} and ${instalments.at(-1)}`;

const lastDueDate = ADVANCE_TAX_SCHEDULE.at(-1)!.dueDate;

export const ANSWER = `Advance tax is due when your tax for the year, after TDS, is ${rupees(ADVANCE_TAX_THRESHOLD)} or more. For tax year 2026-27, pay a total of ${SCHEDULE_TEXT}.`;

export const FAQ: Faq[] = [
  {
    question: 'Who has to pay advance tax?',
    answer: `Anyone whose tax for the year, after TDS, is ${rupees(ADVANCE_TAX_THRESHOLD)} or more (section 404 of the Income-tax Act, 2025). A resident aged 60 or more with no business or professional income does not pay advance tax (section 403(3)).`,
  },
  {
    question: 'What are the advance tax due dates for tax year 2026-27?',
    answer: `Pay a total of ${SCHEDULE_TEXT} (section 408(1)). If you declare presumptive income under section 58(2), pay the whole amount by ${lastDueDate} instead.`,
  },
  {
    question: 'Is income up to ₹12 lakh tax-free in the new regime?',
    answer: `Yes, for a resident individual whose income is taxed at slab rates. Taxable income up to ${rupees(REBATE.new.incomeLimit)} pays no tax, because the rebate covers up to ${rupees(REBATE.new.maxRebate)}. With the ${rupees(STANDARD_DEDUCTION.new)} standard deduction, a salary of ${rupees(REBATE.new.incomeLimit + STANDARD_DEDUCTION.new)} also pays no tax.`,
  },
  {
    question: 'What is the standard deduction for tax year 2026-27?',
    answer: `${rupees(STANDARD_DEDUCTION.new)} in the new regime and ${rupees(STANDARD_DEDUCTION.old)} in the old regime, and never more than the salary or pension. Business and other income get no standard deduction.`,
  },
];
