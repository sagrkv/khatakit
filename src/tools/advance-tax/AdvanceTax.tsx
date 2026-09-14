import { useMemo, useState } from 'react';
import CalculatorPage from '../../components/layout/CalculatorPage';
import { TAX_YEAR_LABEL } from '../../lib/constants/tax-slabs';
import { advanceTaxCitations } from '../../lib/legal/citations/advance-tax';
import AdvanceTaxForm from './AdvanceTaxForm';
import AdvanceTaxGuide from './AdvanceTaxGuide';
import AdvanceTaxResults from './AdvanceTaxResults';
import { calculateAdvanceTax } from './calc';
import { validateAdvanceTax, type AdvanceTaxForm as FormValues } from './schema';

const defaultForm: FormValues = {
  regime: 'new',
  grossIncome: 0,
  salaryIncome: 0,
  deductions: 0,
  tdsDeducted: 0,
  ageCategory: 'below60',
  hasBusinessIncome: false,
};

export function Component() {
  const [form, setForm] = useState<FormValues>(defaultForm);
  const { input, errors } = useMemo(() => validateAdvanceTax(form), [form]);
  const result = useMemo(() => (input ? calculateAdvanceTax(input) : null), [input]);

  return (
    <CalculatorPage
      title="Advance Tax Calculator"
      description="Plan quarterly advance tax payments and compare the old and new tax regimes."
      category="Income Tax"
      icon="calendar"
      period={TAX_YEAR_LABEL}
      formTitle="Income Details"
      form={<AdvanceTaxForm form={form} errors={errors} onChange={setForm} />}
      citations={advanceTaxCitations}
      disclaimer={
        <>
          Tax calculations use the Income-tax Act, 2025 and Finance Act, 2026 rates for tax year
          2026-27, for resident individuals. The calculator does not account for capital gains,
          special incomes, AMT or interest under sections 424 and 425. For complete tax planning,
          please consult a Chartered Accountant.
        </>
      }
      guide={<AdvanceTaxGuide />}
    >
      <AdvanceTaxResults input={input} result={result} errors={errors} />
    </CalculatorPage>
  );
}
