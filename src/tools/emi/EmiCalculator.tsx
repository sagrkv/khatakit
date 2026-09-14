import { useMemo, useState } from 'react';
import CalculatorPage from '../../components/layout/CalculatorPage';
import { calculateEmi } from './calc';
import EmiForm from './EmiForm';
import EmiGuide from './EmiGuide';
import EmiResults from './EmiResults';
import { validateEmi, type EmiFormValues } from './schema';

const defaultForm: EmiFormValues = {
  principal: 0,
  annualRate: 8.5,
  tenure: 20,
  tenureUnit: 'years',
};

export function Component() {
  const [form, setForm] = useState<EmiFormValues>(defaultForm);
  const { input, errors } = useMemo(() => validateEmi(form), [form]);
  const result = useMemo(() => (input ? calculateEmi(input) : null), [input]);

  return (
    <CalculatorPage
      slug="emi"
      formTitle="Loan details"
      form={<EmiForm form={form} errors={errors} onChange={setForm} />}
      hasResult={result !== null && Object.keys(errors).length === 0}
      caveat="Your lender's figures can differ by a few rupees because of rounding and fees."
      guide={<EmiGuide />}
    >
      <EmiResults input={input} result={result} errors={errors} />
    </CalculatorPage>
  );
}
