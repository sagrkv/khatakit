import { useState, useMemo } from 'react';
import { SEO } from '../../lib/utils/seo';
import { calculatePresumptive } from './calc';
import type { PresumptiveInput } from './types';
import PresumptiveForm from './PresumptiveForm';
import PresumptiveResults from './PresumptiveResults';
import Disclaimer from '../../components/ui/Disclaimer';

const defaultInput: PresumptiveInput = {
  scheme: '44ADA',
  grossReceipts: 0,
  cashReceipts: 0,
  regime: 'new',
};

export function Component() {
  const [input, setInput] = useState<PresumptiveInput>(defaultInput);

  const result = useMemo(() => calculatePresumptive(input), [input]);

  return (
    <>
      <SEO
        title="Presumptive Tax Calculator - Section 44ADA & 44AD - Khatakit"
        description="Calculate presumptive income under Section 44ADA (professionals) and 44AD (businesses). Free presumptive tax calculator for India."
        path="/presumptive-income-calculator"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Presumptive Tax Calculator',
          url: 'https://khatakit.in/presumptive-income-calculator',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800">Presumptive Tax Calculator</h1>
          <p className="mt-2 text-neutral-600">
            Calculate presumptive income under Section 44ADA (professionals) and 44AD (businesses)
            for FY 2025-26.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="sticky top-24 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6">
              <h2 className="mb-4 text-lg font-semibold text-neutral-800">
                {input.scheme === '44ADA' ? 'Professional Details' : 'Business Details'}
              </h2>
              <PresumptiveForm input={input} onChange={setInput} />
            </div>
          </div>

          <div className="md:col-span-3">
            <PresumptiveResults result={result} />

            <div className="mt-6">
              <Disclaimer>
                Calculations are based on presumptive taxation rules for FY 2025-26. Section 44ADA
                applies to specified professions with gross receipts up to Rs. 50 lakh (Rs. 75 lakh
                with digital receipts). Section 44AD applies to eligible businesses with turnover up
                to Rs. 2 crore (Rs. 3 crore with digital receipts). Consult a CA for your specific
                situation.
              </Disclaimer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
