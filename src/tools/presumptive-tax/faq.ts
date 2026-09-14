import { ADVANCE_TAX_SCHEDULE } from '../../lib/constants/tax-slabs';
import { PRESUMPTIVE_BUSINESS as business, PRESUMPTIVE_PROFESSION as profession } from '../../lib/constants/presumptive';
import type { Faq } from '../../seo/types';

// Direct answer and FAQ for the page, built from the verified section 58(2) constants.

export const ANSWER = `Under section 58 of the Income-tax Act, 2025 (old 44AD and 44ADA), a business declares ${business.digitalRate}% of bank and online receipts plus ${business.cashRate}% of other receipts as income, and a professional declares ${profession.rate}% of gross receipts.`;

export const FAQ: Faq[] = [
  {
    question: 'What is the presumptive income rate for a business under 44AD?',
    answer: `${business.digitalRate}% of receipts by banking or online mode and ${business.cashRate}% of other receipts, including cash. The ${business.digitalRate}% rate needs payment by banking or online mode during the tax year or before the return due date. From tax year 2026-27, section 58(2) of the Income-tax Act, 2025 replaces section 44AD.`,
  },
  {
    question: 'What is the presumptive income rate for professionals under 44ADA?',
    answer: `${profession.rate}% of gross receipts. You can declare a higher income if your actual profit is higher. From tax year 2026-27, section 58(2) of the Income-tax Act, 2025 replaces section 44ADA.`,
  },
  {
    question: 'What are the turnover limits for presumptive taxation?',
    answer: `₹2 crore of turnover for a business and ₹50 lakh of gross receipts for a profession. The limits are ₹3 crore and ₹75 lakh when cash receipts are ${business.cashSharePercent}% or less of the total. At exactly ${business.cashSharePercent}% the higher limit still applies.`,
  },
  {
    question: 'Do cheques count as cash receipts?',
    answer: 'Yes, unless they are account payee cheques or drafts (section 58(9)).',
  },
  {
    question: 'When is advance tax due on presumptive income?',
    answer: `The whole amount is due by ${ADVANCE_TAX_SCHEDULE.at(-1)!.dueDate} for tax year 2026-27, not in four instalments (section 408(2)).`,
  },
];
