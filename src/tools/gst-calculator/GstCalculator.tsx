import { useMemo, useState } from 'react';
import CalculatorPage from '../../components/layout/CalculatorPage';
import { EmptyState } from '../../components/ui/Surface';
import { calculateBill } from './calc';
import { emptyLine, validateBill, type BillForm } from './schema';
import GstBillForm from './GstBillForm';
import GstGuide from './GstGuide';
import GstResults from './GstResults';

const initialForm: BillForm = { supplyType: 'intra', roundToRupee: false, lines: [emptyLine(1)] };

export function Component() {
  const [form, setForm] = useState<BillForm>(initialForm);
  const validation = useMemo(() => validateBill(form), [form]);
  const result = useMemo(
    () => (validation.input ? calculateBill(validation.input) : null),
    [validation]
  );
  const hasErrors = Object.keys(validation.errors).length > 0;

  return (
    <CalculatorPage
      title="GST Calculator"
      description="Add GST to a price or take it out, for one amount or a whole bill at different rates. CGST and SGST or IGST to the paisa."
      category="GST"
      icon="calculator"
      period="GST rates from 1 February 2026"
      formTitle="Bill details"
      form={<GstBillForm form={form} validation={validation} onChange={setForm} />}
      hasResult={result !== null && validation.input !== null}
      caveat="Check the GST rate for your goods or service."
      guide={<GstGuide />}
    >
      {result && validation.input ? (
        <GstResults result={result} roundToRupee={validation.input.roundToRupee} />
      ) : (
        <EmptyState>
          {hasErrors
            ? 'Correct the highlighted entries to see the tax.'
            : 'Enter an amount on each line to see the taxable value, CGST and SGST or IGST, and the bill total.'}
        </EmptyState>
      )}
    </CalculatorPage>
  );
}
