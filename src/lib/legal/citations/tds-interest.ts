import type { LegalCitation } from '../types';
import {
  rule218,
  section201_1A,
  section288B,
  section398_3,
  section516,
  section536,
  taxPaymentsFaq,
  tdsComplianceFaq,
  tracesLatePaymentFaq,
} from '../sources/tds-interest';

export const tdsInterestCitations: LegalCitation[] = [
  {
    source: section398_3,
    excerpt:
      'At 1% for every month or part of a month ... at 1.5% for every month or part of a month.',
    relevance: 'Rates and periods for tax that became deductible on or after 1 April 2026.',
  },
  {
    source: section201_1A,
    excerpt:
      'At one per cent for every month or part of a month ... at one and one-half per cent for every month or part of a month.',
    relevance: 'The same rates and periods for tax that became deductible before 1 April 2026.',
  },
  {
    source: section536,
    excerpt:
      'Nothing shall affect any right, privilege, obligation or liability ... incurred under the repealed Income-tax Act.',
    relevance:
      'Keeps liabilities that began under the 1961 Act. Clause (g) applies the 2025 Act to interest for the period after 1 April 2026 in some proceedings; which section covers those months is not settled.',
  },
  {
    source: rule218,
    excerpt:
      'On or before 30th April, where the income or amount is credited or paid ... in the month of March.',
    relevance:
      'Due dates: 7th of the next month, 30 April for March, and the government office dates.',
  },
  {
    source: tracesLatePaymentFaq,
    excerpt: 'From the date of deduction+1 day till date of Deposit.',
    relevance: 'The calendar-month count used as the main answer.',
  },
  {
    source: tdsComplianceFaq,
    excerpt:
      'This delay will attract interest liability @ 1.5% per month from the date of deduction to the date of actual payment.',
    relevance: 'Confirms the 30 April 2026 due date and the Act that applies around 1 April 2026.',
  },
  {
    source: taxPaymentsFaq,
    excerpt:
      'In case of Government Deductors depositing TDS by way of challan, the due date will be 7th April, 2026.',
    relevance: 'Government office due date for March.',
  },
  {
    source: section288B,
    excerpt: 'Any amount payable ... shall be rounded off to the nearest multiple of ten rupees.',
    relevance:
      'The rounded total shown under the interest. Whether TRACES rounds TDS interest this way is not confirmed.',
  },
  {
    source: section516,
    excerpt:
      'Any amount payable or refundable under this Act, shall be rounded off to the nearest multiple of ₹10.',
    relevance: 'The 2025 Act equivalent of section 288B.',
  },
];
