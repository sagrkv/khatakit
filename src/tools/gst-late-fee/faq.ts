import {
  ANNUAL_LATE_FEE,
  GST_INTEREST_RATE,
  PERIODIC_LATE_FEE,
} from '../../lib/constants/gst-rates';
import { formatRupeeText as rupees } from '../../lib/utils/format';
import type { Faq } from '../../seo/types';

// Direct answer and FAQ for the page, built from the verified constants. Amounts are per head,
// so the CGST plus SGST total is twice the constant.
const perDay = PERIODIC_LATE_FEE.perDay;
const caps = PERIODIC_LATE_FEE.caps;
const annual = ANNUAL_LATE_FEE;

export const ANSWER = `A late GSTR-3B or GSTR-1 costs ${rupees(perDay * 2)} a day (${rupees(perDay)} CGST plus ${rupees(perDay)} SGST), up to ${rupees(caps.upto_1_5cr * 2)} for turnover up to ₹1.5 crore, or ${rupees(PERIODIC_LATE_FEE.nilPerDay * 2)} a day up to ${rupees(PERIODIC_LATE_FEE.nilCap * 2)} for a nil return. A late GSTR-3B also carries ${GST_INTEREST_RATE}% a year interest on tax paid in cash.`;

export const FAQ: Faq[] = [
  {
    question: 'What is the late fee for GSTR-3B?',
    answer: `${rupees(perDay * 2)} a day, ${rupees(perDay)} under CGST and ${rupees(perDay)} under SGST. The total is capped at ${rupees(caps.upto_1_5cr * 2)} for aggregate turnover up to ₹1.5 crore in the previous year, ${rupees(caps['1_5cr_to_5cr'] * 2)} up to ₹5 crore, and ${rupees(caps.above_5cr * 2)} above ₹5 crore. GSTR-1 has the same late fee.`,
  },
  {
    question: 'What is the late fee for a nil GSTR-3B or GSTR-1?',
    answer: `${rupees(PERIODIC_LATE_FEE.nilPerDay * 2)} a day, ${rupees(PERIODIC_LATE_FEE.nilPerDay)} under CGST and ${rupees(PERIODIC_LATE_FEE.nilPerDay)} under SGST, up to ${rupees(PERIODIC_LATE_FEE.nilCap * 2)} in total. A nil GSTR-3B carries no interest.`,
  },
  {
    question: 'How is interest on a late GSTR-3B calculated?',
    answer: `Interest is ${GST_INTEREST_RATE}% a year on tax paid from the electronic cash ledger, for each day from the day after the due date to the date the tax is paid. Tax paid from input tax credit carries no interest, unless the return is filed after proceedings under section 73, 74 or 74A have started.`,
  },
  {
    question: 'What is the late fee for GSTR-9?',
    answer: `${rupees(annual.upto_5cr.perDay * 2)} a day in total for aggregate turnover up to ₹5 crore, ${rupees(annual['5cr_to_20cr'].perDay * 2)} a day from ₹5 crore to ₹20 crore, and ${rupees(annual.above_20cr.perDay * 2)} a day above ₹20 crore. The cap is ${annual.upto_5cr.capPercentOfStateTurnover * 2}% of turnover in the State up to ₹20 crore, and ${annual.above_20cr.capPercentOfStateTurnover * 2}% above that.`,
  },
  {
    question: 'Is there a late fee for a return filed on the due date?',
    answer: 'No. Nothing is payable for a return filed on the due date. Counting starts the next day.',
  },
];
