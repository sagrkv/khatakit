import { useMemo, useState } from 'react';
import CalculatorPage from '../../components/layout/CalculatorPage';
import { emiCitations } from '../../lib/legal/citations/emi';
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
      title="EMI Calculator"
      description="Calculate monthly EMI, total interest and the loan repayment schedule."
      category="Loans"
      icon="banknotes"
      formTitle="Loan Details"
      form={<EmiForm form={form} errors={errors} onChange={setForm} />}
      citations={emiCitations}
      disclaimer={
        <>
          EMI is calculated using the standard reducing balance method. Actual EMIs may vary
          slightly due to rounding, processing fees, or lender-specific calculations. Amounts are
          rounded to the nearest rupee, as in RBI&apos;s Key Facts Statement example. This
          calculator is for estimation purposes only.
        </>
      }
      guide={<EmiGuide />}
    >
      <EmiResults input={input} result={result} errors={errors} />
    </CalculatorPage>
  );
}
