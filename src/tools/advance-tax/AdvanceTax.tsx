import { useState, useMemo } from 'react';
import { SEO } from '../../lib/utils/seo';
import { calculateAdvanceTax } from './calc';
import type { AdvanceTaxInput } from './types';
import AdvanceTaxForm from './AdvanceTaxForm';
import AdvanceTaxResults from './AdvanceTaxResults';
import Disclaimer from '../../components/ui/Disclaimer';

const defaultInput: AdvanceTaxInput = {
  regime: 'new',
  grossIncome: 0,
  deductions: 0,
  tdsDeducted: 0,
  ageCategory: 'below60',
};

export function Component() {
  const [input, setInput] = useState<AdvanceTaxInput>(defaultInput);

  const result = useMemo(() => calculateAdvanceTax(input), [input]);

  return (
    <>
      <SEO
        title="Advance Tax Calculator FY 2025-26 - Old & New Regime - Khatakit"
        description="Calculate advance tax installments for FY 2025-26. Compare old vs new regime. Quarterly schedule with due dates. Free and private."
        path="/advance-tax-calculator"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Advance Tax Calculator',
          url: 'https://khatakit.in/advance-tax-calculator',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800">Advance Tax Calculator</h1>
          <p className="mt-2 text-neutral-600">
            Calculate quarterly advance tax installments for FY 2025-26. Compare old vs new regime
            side by side.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="sticky top-24 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6">
              <h2 className="mb-4 text-lg font-semibold text-neutral-800">Income Details</h2>
              <AdvanceTaxForm input={input} onChange={setInput} />
            </div>
          </div>

          <div className="md:col-span-3">
            <AdvanceTaxResults result={result} />

            <div className="mt-6">
              <Disclaimer>
                Tax calculations are based on FY 2025-26 (AY 2026-27) tax slabs and rules. The
                calculator does not account for capital gains, special incomes, or AMT. For
                complete tax planning, please consult a Chartered Accountant.
              </Disclaimer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
