import { formatRupeeText as rupees } from '../../lib/utils/format';
import type { Faq } from '../../seo/types';
import { RBI_EXAMPLE as rbi } from './example';

// Direct answer and FAQ for the page. Figures come from the RBI example, which tests check against calc.

const FORMULA = 'EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)';
const loan = `${rupees(rbi.input.principal)} at ${rbi.input.annualRate}% for ${rbi.input.tenureMonths} months`;

export const ANSWER = `${FORMULA}, where P is the loan amount, r is the monthly interest rate and n is the number of monthly instalments. A loan of ${loan} has an EMI of ${rupees(rbi.emi)}.`;

export const FAQ: Faq[] = [
  {
    question: 'What is the formula for EMI?',
    answer: `${FORMULA}. P is the loan amount, r is the monthly rate (annual rate ÷ 12 ÷ 100) and n is the number of monthly instalments. At 0% interest, EMI = P ÷ n.`,
  },
  {
    question: 'What is the reducing balance method?',
    answer: 'Each month, interest is charged on the balance still owed. The rest of the EMI repays principal, so the interest part falls and the principal part rises over the loan.',
  },
  {
    question: `What is the EMI on ${loan}?`,
    answer: `${rupees(rbi.emi)} a month. Total interest is ${rupees(rbi.totalInterest)} and the total payable is ${rupees(rbi.totalPayable)}. This is the worked example in RBI's Key Facts Statement.`,
  },
  {
    question: "Why can a lender's EMI differ from this one?",
    answer: 'Lenders may round the EMI up and adjust the last instalment, so their figures can differ by a few rupees. Processing fees, broken-period interest, insurance, prepayments and rate changes are not included, and they change the real cost of the loan.',
  },
];
