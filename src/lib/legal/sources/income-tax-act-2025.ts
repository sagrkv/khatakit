import type { LegalSource } from '../types';

// Income-tax Act, 2025 (No. 30 of 2025) as published in the Gazette of India, 21 August 2025.
// In force from 1 April 2026 (section 1(3)); tax year 2026-27 is FY 2026-27.
const URL = 'https://egazette.gov.in/WriteReadData/2025/265620.pdf';
const AUTHORITY = 'Parliament of India';
const EFFECTIVE = '2026-04-01';

const act = (section: string, title: string, text: string): LegalSource => ({
  id: `ita-2025-s${section.replace(/[^0-9a-z]/gi, '').toLowerCase()}`,
  type: 'act',
  authority: AUTHORITY,
  reference: `Section ${section}, Income-tax Act, 2025`,
  title,
  text,
  url: URL,
  effectiveDate: EFFECTIVE,
});

export const section19 = act(
  '19(1)',
  'Deductions from salaries',
  'Standard deduction: (a) ₹ 75000 or the salary, whichever is less, where income-tax is ' +
    'computed under section 202(1); (b) ₹ 50000 or the salary, whichever is less, in any other case.'
);

export const section58 = act(
  '58(2)',
  'Special provision for computing profits and gains of business or profession on presumptive basis in case of certain residents',
  'Table serial 1 - any business other than goods carriages, eligible assessee, turnover that ' +
    'does not exceed two crore rupees, or three crore rupees where the amount received in cash ' +
    'does not exceed 5% of the total turnover or gross receipts: 6% of turnover received by ' +
    'specified banking or online mode during the tax year or before the due date in section ' +
    '263(1), and 8% of the rest, or profit actually earned, whichever is higher. Table serial 3 - ' +
    'specified profession referred to in section 62(4), gross receipts that do not exceed fifty ' +
    'lakh rupees, or seventy-five lakh rupees where cash receipts do not exceed 5%: 50% of the ' +
    'gross receipts or profit actually earned, whichever is higher.'
);

export const section156 = act(
  '156',
  'Rebate of income-tax in case of certain individuals',
  '(1) A resident individual gets a deduction of 100% of income-tax payable or ₹ 12500, ' +
    'whichever is less, if total income does not exceed ₹ 500000. (2) Where total income is ' +
    'chargeable under section 202(1): (a) if income does not exceed twelve lakh rupees, 100% of ' +
    'the income-tax payable or ₹ 60000, whichever is less; (b) if total income exceeds twelve ' +
    'lakh rupees and the tax exceeds the amount by which income exceeds twelve lakh rupees, a ' +
    'deduction equal to that difference.'
);

export const section202 = act(
  '202(1)',
  'New tax regime for individuals, Hindu undivided family and others',
  'Upto ₹400000 - Nil; ₹400001 to ₹800000 - 5%; ₹800001 to ₹1200000 - 10%; ₹1200001 to ' +
    '₹1600000 - 15%; ₹1600001 to ₹2000000 - 20%; ₹2000001 to ₹2400000 - 25%; above ₹2400000 - 30%. ' +
    'Applies unless the person opts out under section 202(4).'
);

export const section403 = act(
  '403',
  'Liability for payment of advance tax',
  '(1) Advance tax shall be payable during any Financial year in respect of the current income ' +
    'of the assessee. (3) Sub-section (1) shall not apply to an individual resident in India who ' +
    '(a) does not have any income chargeable under the head "Profits and gains of business or ' +
    'profession"; and (b) is of the age of sixty years or more at any time during the tax year.'
);

export const section404 = act(
  '404',
  'Conditions of liability to pay advance tax',
  'Advance tax shall be payable by the assessee during a Financial year, where the amount of ' +
    'such tax payable during that year, as computed under this Part, is ₹10000 or more.'
);

export const section408 = act(
  '408',
  'Instalments of advance tax and due dates',
  '(1) On or before the 15th June - not less than 15%; 15th September - not less than 45%; ' +
    '15th December - not less than 75%; 15th March - the whole amount, each as reduced by ' +
    'earlier instalments. (2) An assessee who declares profits under section 58(2) (Table: Sl. ' +
    'No. 1 or 3) shall pay the whole amount of advance tax on or before the 15th March.'
);
