import { useState, useMemo } from 'react';
import { SEO } from '../../lib/utils/seo';
import { calculateEmi } from './calc';
import type { EmiInput } from './types';
import EmiForm from './EmiForm';
import EmiResults from './EmiResults';
import Disclaimer from '../../components/ui/Disclaimer';

const defaultInput: EmiInput = {
  principal: 0,
  annualRate: 8.5,
  tenureMonths: 240,
};

export function Component() {
  const [input, setInput] = useState<EmiInput>(defaultInput);

  const result = useMemo(() => calculateEmi(input), [input]);

  return (
    <>
      <SEO
        title="EMI Calculator - Loan EMI Calculator with Amortization - Khatakit"
        description="Calculate loan EMI with reducing balance method. View full amortization schedule, interest breakdown, and monthly payment details."
        path="/emi-calculator"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'EMI Calculator',
          url: 'https://khatakit.in/emi-calculator',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800">EMI Calculator</h1>
          <p className="mt-2 text-neutral-600">
            Calculate your loan EMI using the reducing balance method. View the full amortization
            schedule and interest breakdown.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="sticky top-24 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6">
              <h2 className="mb-4 text-lg font-semibold text-neutral-800">Loan Details</h2>
              <EmiForm input={input} onChange={setInput} />
            </div>
          </div>

          <div className="md:col-span-3">
            <EmiResults result={result} principal={input.principal} />

            <div className="mt-6">
              <Disclaimer>
                EMI is calculated using the standard reducing balance method. Actual EMIs may vary
                slightly due to rounding, processing fees, or lender-specific calculations. This
                calculator is for estimation purposes only.
              </Disclaimer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
