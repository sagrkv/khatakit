import type { LegalSource } from '../types';

// TDS interest sources, checked 14 September 2026. Findings and gaps: docs/TDS-RULES.md.
const ACT_2025_PDF =
  'https://www.incometaxindia.gov.in/documents/d/guest/income_tax_act_2025_as_amended_by_fa_act_2026-pdf';

export const section201_1A: LegalSource = {
  id: 'ita-1961-s201-1a',
  type: 'act',
  authority: 'Parliament of India',
  reference: 'Section 201(1A), Income-tax Act, 1961',
  title: 'Consequences of failure to deduct or pay: interest',
  text:
    'Simple interest (i) at one per cent for every month or part of a month on the amount of such tax from ' +
    'the date on which such tax was deductible to the date on which such tax is deducted; and (ii) at one and ' +
    'one-half per cent for every month or part of a month on the amount of such tax from the date on which ' +
    'such tax was deducted to the date on which such tax is actually paid.',
  url: 'https://www.incometaxindia.gov.in/w/section-201-1',
};

export const section398_3: LegalSource = {
  id: 'ita-2025-s398-3',
  type: 'act',
  authority: 'Parliament of India',
  reference: 'Section 398(3)(a), Income-tax Act, 2025',
  title: 'Consequences of failure to deduct or pay, or collect or pay',
  text:
    'Interest at 1% for every month or part of a month from the date tax was deductible to the date it is ' +
    'deducted, and at 1.5% for every month or part of a month from the date it was deducted to the date it is ' +
    'actually paid.',
  url: ACT_2025_PDF,
  effectiveDate: '2026-04-01',
};

export const section536: LegalSource = {
  id: 'ita-2025-s536',
  type: 'act',
  authority: 'Parliament of India',
  reference: 'Section 536(2), Income-tax Act, 2025',
  title: 'Repeal and savings',
  text:
    '(b) nothing shall affect any right, privilege, obligation or liability acquired, accrued or incurred ' +
    'under the repealed Income-tax Act; (g) for proceedings for tax years beginning before 1 April 2026, where ' +
    'default is made after commencement, the provisions of this Act relating to interest payable by the ' +
    'assessee for default shall apply for the period after commencement.',
  url: ACT_2025_PDF,
  effectiveDate: '2026-04-01',
};

export const section516: LegalSource = {
  id: 'ita-2025-s516',
  type: 'act',
  authority: 'Parliament of India',
  reference: 'Section 516, Income-tax Act, 2025',
  title: 'Rounding off of amount of total income, or amount payable or refundable',
  text:
    'Any amount payable or refundable under this Act shall be rounded off to the nearest multiple of ₹10, ' +
    'ignoring paise; 5 or more goes up and less than 5 goes down.',
  url: ACT_2025_PDF,
  effectiveDate: '2026-04-01',
};

export const section288B: LegalSource = {
  id: 'ita-1961-s288b',
  type: 'act',
  authority: 'Parliament of India',
  reference: 'Section 288B, Income-tax Act, 1961',
  title: 'Rounding off amount payable and refund due',
  text:
    'Any amount payable, and the amount of refund due, under the provisions of this Act shall be rounded off ' +
    'to the nearest multiple of ten rupees.',
  url: 'https://www.incometaxindia.gov.in/w/section-288b-59',
};

export const rule218: LegalSource = {
  id: 'itr-2026-r218',
  type: 'notification',
  authority: 'Central Board of Direct Taxes',
  reference: 'Rule 218, Income-tax Rules, 2026',
  title: 'Time and mode of payment to Government account of tax deducted or collected at source',
  text:
    'Government office: same day without a challan, or within seven days from the end of the month with a ' +
    'challan. Other deductors: by 30 April for amounts credited or paid in March, otherwise within seven days ' +
    'from the end of the month of deduction. Replaces Rule 30 of the Income-tax Rules, 1962.',
  url: 'https://www.incometaxindia.gov.in/w/rule-218-1',
  effectiveDate: '2026-04-01',
};

export const tracesLatePaymentFaq: LegalSource = {
  id: 'traces-faq-late-payment',
  type: 'guideline',
  authority: 'CPC-TDS (TRACES)',
  reference: 'TRACES FAQ: Late payment',
  title: 'Interest on late payment of TDS',
  text:
    'Interest @ 1.5% per month or part of the month from the date of deduction + 1 day till date of deposit. ' +
    'Example: deducted 10 June 2023, deposited 8 August 2023, delay 3 months. If tax is deducted on the last ' +
    'date of a month, that month is not considered.',
  url: 'https://traces61contents.tdscpc.gov.in/en/faq-dedu-default-lp.html',
};

export const tdsComplianceFaq: LegalSource = {
  id: 'itd-tds-compliance-faq',
  type: 'guideline',
  authority: 'Income Tax Department',
  reference: 'TDS compliance FAQs',
  title: 'TDS compliance under the Income-tax Act, 2025',
  text:
    'The 1961 Act applies where the earlier of credit or payment is on or before 31 March 2026. Tax deducted ' +
    'in March 2026 is due by 30 April 2026; a deposit in May 2026 attracts interest at 1.5% per month from the ' +
    'date of deduction to the date of actual payment.',
  url: 'https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/%20tds%20compliance-faq',
};

export const taxPaymentsFaq: LegalSource = {
  id: 'itd-tax-payments-faq',
  type: 'guideline',
  authority: 'Income Tax Department',
  reference: 'Tax payments FAQs',
  title: 'Due dates for depositing TDS',
  text:
    'Tax deducted in March 2026 is to be deposited by 30 April 2026 by non-government deductors, and by ' +
    '7 April 2026 by government deductors paying by challan.',
  url: 'https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/tax-payments-faq',
};

/** Read on Indian Kanoon; not linked as official sources. */
export const INDIAN_KANOON = {
  rule30: 'https://indiankanoon.org/doc/106635308/',
  rule119A: 'https://indiankanoon.org/doc/105253759/',
} as const;
