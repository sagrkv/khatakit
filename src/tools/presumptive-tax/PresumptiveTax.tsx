import { useMemo, useState } from 'react';
import CalculatorPage from '../../components/layout/CalculatorPage';
import { TAX_YEAR_LABEL } from '../../lib/constants/tax-slabs';
import { presumptiveTaxCitations } from '../../lib/legal/citations/presumptive-tax';
import { calculatePresumptive } from './calc';
import PresumptiveForm from './PresumptiveForm';
import PresumptiveGuide from './PresumptiveGuide';
import PresumptiveResults from './PresumptiveResults';
import { validatePresumptive } from './schema';
import type { PresumptiveInput } from './types';

const defaultInput: PresumptiveInput = {
  scheme: '44ADA',
  grossReceipts: 0,
  cashReceipts: 0,
  regime: 'new',
};

export function Component() {
  const [form, setForm] = useState<PresumptiveInput>(defaultInput);
  const { input, errors } = useMemo(() => validatePresumptive(form), [form]);
  const result = useMemo(() => (input ? calculatePresumptive(input) : null), [input]);

  return (
    <CalculatorPage
      title="Presumptive Tax Calculator"
      description="Estimate presumptive income for professionals and businesses under section 58 (old 44ADA and 44AD)."
      category="Income Tax"
      icon="briefcase"
      period={TAX_YEAR_LABEL}
      formTitle={form.scheme === '44ADA' ? 'Professional Details' : 'Business Details'}
      form={<PresumptiveForm input={form} errors={errors} onChange={setForm} />}
      citations={presumptiveTaxCitations}
      disclaimer={
        <>
          Calculations use section 58(2) of the Income-tax Act, 2025 for tax year 2026-27.
          Professionals qualify with gross receipts up to ₹50 lakh, or ₹75 lakh if cash receipts
          are 5% or less. Businesses qualify with turnover up to ₹2 crore, or ₹3 crore if cash
          receipts are 5% or less. Old regime tax uses the below-60 slabs. Consult a CA for your
          specific situation.
        </>
      }
      guide={<PresumptiveGuide />}
    >
      <PresumptiveResults result={result} regime={form.regime} errors={errors} />
    </CalculatorPage>
  );
}
