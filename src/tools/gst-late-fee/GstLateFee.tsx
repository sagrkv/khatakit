import { useState, useMemo } from 'react';
import { SEO } from '../../lib/utils/seo';
import { calculateGstPenalty } from './calc';
import type { GstInput } from './types';
import GstForm from './GstForm';
import GstResults from './GstResults';
import Disclaimer from '../../components/ui/Disclaimer';
import { toInputDateString } from '../../lib/utils/date';

const today = toInputDateString(new Date());

const defaultInput: GstInput = {
  returnType: 'GSTR-3B',
  dueDate: '',
  filingDate: today,
  taxLiability: 0,
  turnoverSlab: 'upto_1_5cr',
  isNilReturn: false,
};

export function Component() {
  const [input, setInput] = useState<GstInput>(defaultInput);

  const result = useMemo(() => {
    if (!input.dueDate || !input.filingDate) return null;
    return calculateGstPenalty(input);
  }, [input]);

  return (
    <>
      <SEO
        title="GST Late Fee & Interest Calculator 2025-26 - Khatakit"
        description="Calculate GST late filing fees (Section 47) and interest (Section 50) with turnover-based caps. Free, instant, no signup required."
        path="/gst-late-fee-interest-calculator"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'GST Late Fee & Interest Calculator',
          url: 'https://khatakit.in/gst-late-fee-interest-calculator',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800">
            GST Late Fee & Interest Calculator
          </h1>
          <p className="mt-2 text-neutral-600">
            Calculate late filing fees (Section 47) and interest (Section 50) for GST returns with
            turnover-based caps for FY 2025-26.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="sticky top-24 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6">
              <h2 className="mb-4 text-lg font-semibold text-neutral-800">Input Details</h2>
              <GstForm input={input} onChange={setInput} />
            </div>
          </div>

          <div className="md:col-span-3">
            {result ? (
              <GstResults result={result} />
            ) : (
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-center">
                <p className="text-neutral-600">
                  Enter the due date and filing date to see the calculation.
                </p>
              </div>
            )}

            <div className="mt-6">
              <Disclaimer>
                This calculator is based on GST late fee and interest provisions as per the CGST Act
                (Sections 47 and 50) for FY 2025-26. Actual penalties may vary based on
                notifications and amendments. Please consult a qualified CA or tax professional for
                accurate assessment.
              </Disclaimer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
