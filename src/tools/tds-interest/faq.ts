import type { Faq } from '../../seo/types';
import { LATE_DEDUCTION_RATE as deduction, LATE_DEPOSIT_RATE as deposit } from './rules';

// Direct answer and FAQ for the page, from the rules verified in docs/TDS-RULES.md.

export const ANSWER = `TDS interest is ${deduction}% a month from the date tax was deductible to the date it was deducted, and ${deposit}% a month from deduction to deposit when the deposit is after the due date. Part of a month counts as a full month.`;

export const FAQ: Faq[] = [
  {
    question: 'What is the interest rate for late deduction of TDS?',
    answer: `${deduction}% a month on the TDS amount, from the date tax was deductible to the date it was deducted. Tax is deductible on the date of credit or payment, whichever was earlier. This is section 201(1A) of the Income-tax Act, 1961 and section 398(3)(a) of the Income-tax Act, 2025.`,
  },
  {
    question: 'What is the interest rate for late deposit of TDS?',
    answer: `${deposit}% a month on the TDS amount, from the date tax was deducted to the date it was deposited. It is charged only when the deposit is after the due date. The due date is the 7th of the next month, or 30 April for tax deducted in March by a deductor that is not a government office.`,
  },
  {
    question: 'Does part of a month count as a full month for TDS interest?',
    answer: 'Yes. Every month or part of a month counts as a full month. One day into a new month counts that whole month.',
  },
  {
    question: 'Can late deduction and late deposit interest both apply?',
    answer: 'Yes. When tax is deducted late and then deposited after the due date, both kinds of interest apply to the same amount. They are added together.',
  },
  {
    question: 'Is the TDS amount rounded before interest is worked out?',
    answer: 'Yes. The TDS amount is rounded down to a multiple of ₹100, under Rule 119A(c) of the Income-tax Rules, 1962. An amount below ₹100 rounds down to 0, so its interest is 0.',
  },
];
