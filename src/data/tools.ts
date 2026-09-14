import type { PageLoader } from '../seo/types';

/**
 * Tool catalogue. Each entry is also the registry entry for its calculator
 * page (see src/seo/pages.ts): add a tool here plus its page module.
 */
export interface Tool {
  name: string;
  slug: string;
  path: string;
  description: string;
  /** One sentence for the homepage tile and the About page list. */
  summary: string;
  seoTitle: string;
  seoDescription: string;
  /** Page module exporting `Component`. */
  load: PageLoader;
  icon: string;
  tags: string[];
  category: 'gst' | 'income-tax' | 'loans';
  keywords: string[];
  /** What the tool produces, shown at the foot of its homepage tile. */
  output: string;
}

export const tools: Tool[] = [
  {
    name: 'GST Late Fee & Interest Calculator',
    slug: 'gst-late-fee',
    path: '/gst-late-fee-interest-calculator',
    description:
      'Late fee under section 47 and interest under section 50 for GSTR-3B, GSTR-1 and GSTR-9, with turnover caps and the three-year filing limit.',
    summary: 'Work out the late fee and interest on a GSTR-3B, GSTR-1 or GSTR-9 filed late.',
    seoTitle: 'GST Late Fee & Interest Calculator 2026 - GSTR-3B, GSTR-1, GSTR-9 - Khatakit',
    seoDescription:
      'GST late fee and interest for GSTR-3B, GSTR-1 and GSTR-9. Turnover caps, nil returns, CGST and SGST split, dated workings and CSV download.',
    load: () => import('../tools/gst-late-fee/GstLateFee'),
    icon: 'receipt',
    category: 'gst',
    keywords: [
      'gstr 3b',
      'gstr 1',
      'gstr 9',
      'annual return',
      'nil return',
      'late filing',
      'penalty',
      'interest',
      'section 47',
      'section 50',
      'goods and services tax',
    ],
    output: 'Late fee, interest and CGST/SGST split',
    tags: ['GST', 'Penalty', 'Interest'],
  },
  {
    name: 'GST Calculator',
    slug: 'gst-calculator',
    path: '/gst-calculator',
    description:
      'Add or remove GST on one amount or a whole bill with lines at different rates. CGST, SGST or IGST to the paisa, with any round-off shown.',
    summary: 'Add or remove GST on one amount or a whole bill with lines at different rates.',
    seoTitle: 'GST Calculator - Add or Remove GST, Multiple Rates - Khatakit',
    seoDescription:
      'Add or remove GST on one amount or a whole bill with lines at 5%, 18% and 40%. CGST, SGST or IGST to the paisa, round-off shown, CSV download.',
    load: () => import('../tools/gst-calculator/GstCalculator'),
    icon: 'calculator',
    category: 'gst',
    keywords: [
      'reverse gst',
      'inclusive',
      'exclusive',
      'cgst',
      'sgst',
      'igst',
      'multiple items',
      'invoice',
      'goods and services tax',
    ],
    output: 'CGST, SGST or IGST by line and rate',
    tags: ['GST', 'Inclusive', 'Exclusive'],
  },
  {
    name: 'Advance Tax Calculator',
    slug: 'advance-tax',
    path: '/advance-tax-calculator',
    description:
      'Compute quarterly advance tax instalments for tax year 2026-27. Compare old vs new regime side by side, with slab-wise workings.',
    summary: 'Plan quarterly advance tax for tax year 2026-27 and compare the old and new regimes.',
    seoTitle: 'Advance Tax Calculator Tax Year 2026-27 - Old & New Regime - Khatakit',
    seoDescription:
      'Calculate advance tax instalments for tax year 2026-27 (FY 2026-27). Old vs new regime, rebate near ₹12 lakh, due dates and CSV download.',
    load: () => import('../tools/advance-tax/AdvanceTax'),
    icon: 'calendar',
    category: 'income-tax',
    keywords: [
      'income tax',
      'instalments',
      'installments',
      'quarterly',
      'tax regime',
      'fy 2026-27',
      'section 408',
    ],
    output: 'Instalments by due date',
    tags: ['Income Tax', 'Quarterly', 'Old vs New'],
  },
  {
    name: 'EMI Calculator',
    slug: 'emi',
    path: '/emi-calculator',
    description:
      'Calculate loan EMI using the reducing balance method. Year-wise amortisation, principal and interest chart, and monthly schedule download.',
    summary: 'Calculate the monthly EMI, total interest and repayment schedule for a loan.',
    seoTitle: 'EMI Calculator - Loan EMI Calculator with Amortization - Khatakit',
    seoDescription:
      'Calculate loan EMI with the reducing balance method. Matches the RBI Key Facts Statement example. Amortisation schedule and CSV download.',
    load: () => import('../tools/emi/EmiCalculator'),
    icon: 'banknotes',
    category: 'loans',
    keywords: ['loan repayment', 'monthly payment', 'home loan', 'car loan', 'amortisation'],
    output: 'Monthly EMI and repayment schedule',
    tags: ['Loan', 'EMI', 'Amortization'],
  },
  {
    name: 'Presumptive Tax Calculator',
    slug: 'presumptive-tax',
    path: '/presumptive-income-calculator',
    description:
      'Calculate presumptive income under section 58 (old 44AD for business, 44ADA for professionals). Turnover limits and tax estimate.',
    summary: 'Estimate income and tax under section 58 (old 44AD and 44ADA) for tax year 2026-27.',
    seoTitle: 'Presumptive Tax Calculator - Section 58 (old 44ADA & 44AD) - Khatakit',
    seoDescription:
      'Calculate presumptive income under section 58 of the Income-tax Act, 2025 (old 44ADA for professionals and 44AD for businesses). 5% cash test and limits.',
    load: () => import('../tools/presumptive-tax/PresumptiveTax'),
    icon: 'briefcase',
    category: 'income-tax',
    keywords: ['44ad', '44ada', 'section 58', 'freelancer', 'professional', 'small business'],
    output: 'Presumptive income and tax estimate',
    tags: ['44AD', '44ADA', 'Presumptive'],
  },
  {
    name: 'TDS Interest Calculator',
    slug: 'tds-interest',
    path: '/tds-interest-calculator',
    description:
      'Interest on TDS deducted late (1%) or deposited late (1.5%), for one case or many rows. Due dates, months counted and a CSV or Excel download.',
    summary: 'Work out interest on TDS deducted or deposited late, for one case or many rows.',
    seoTitle: 'TDS Interest Calculator - Late Deduction & Late Deposit, Bulk Rows - Khatakit',
    seoDescription:
      'Calculate TDS interest under section 201(1A) and section 398: 1% for late deduction, 1.5% for late deposit. Due dates, months by name, calendar and 30-day counts, CSV and Excel download.',
    load: () => import('../tools/tds-interest/TdsInterest'),
    icon: 'clock',
    category: 'income-tax',
    keywords: ['tds', '201(1a)', 'section 398', 'late payment', 'late deduction', 'traces', 'challan', 'bulk', 'interest'],
    output: 'Interest with due dates and months counted',
    tags: ['TDS', 'Interest', 'Bulk'],
  },
];

export const toolCategories = [
  {
    id: 'gst',
    label: 'GST',
    icon: 'receipt',
    description: 'Filing fees and interest, with the workings.',
  },
  {
    id: 'income-tax',
    label: 'Income Tax',
    icon: 'briefcase',
    description: 'Plan tax payments for your income or business.',
  },
  {
    id: 'loans',
    label: 'Loans',
    icon: 'banknotes',
    description: 'Understand monthly payments and the cost of borrowing.',
  },
] as const;

export function matchesTool(tool: Tool, query: string): boolean {
  const normalise = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  const haystack = normalise(
    [tool.name, tool.description, tool.summary, tool.output, ...tool.tags, ...tool.keywords].join(
      ' '
    )
  );
  return normalise(query)
    .split(/\s+/)
    .every((word) => haystack.includes(word));
}
