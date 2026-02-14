export interface Tool {
  name: string;
  slug: string;
  path: string;
  description: string;
  icon: string;
  tags: string[];
}

export const tools: Tool[] = [
  {
    name: 'GST Late Fee & Interest Calculator',
    slug: 'gst-late-fee',
    path: '/gst-late-fee-interest-calculator',
    description:
      'Calculate late filing fees under Section 47 and interest under Section 50 of the CGST Act. Supports turnover-based caps.',
    icon: 'receipt',
    tags: ['GST', 'Penalty', 'Interest'],
  },
  {
    name: 'Advance Tax Calculator',
    slug: 'advance-tax',
    path: '/advance-tax-calculator',
    description:
      'Compute quarterly advance tax installments for FY 2025-26. Compare old vs new regime side by side.',
    icon: 'calendar',
    tags: ['Income Tax', 'Quarterly', 'Old vs New'],
  },
  {
    name: 'EMI Calculator',
    slug: 'emi',
    path: '/emi-calculator',
    description:
      'Calculate loan EMI using reducing balance method. View full amortization schedule and interest breakdown.',
    icon: 'banknotes',
    tags: ['Loan', 'EMI', 'Amortization'],
  },
  {
    name: 'Presumptive Tax Calculator',
    slug: 'presumptive-tax',
    path: '/presumptive-income-calculator',
    description:
      'Calculate presumptive income under Section 44AD (business) and 44ADA (professionals). Quick tax estimate.',
    icon: 'briefcase',
    tags: ['44AD', '44ADA', 'Presumptive'],
  },
];
