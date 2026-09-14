import { useMemo, useState } from 'react';
import CalculatorPage from '../../components/layout/CalculatorPage';
import { EmptyState } from '../../components/ui/Surface';
import { gstCalculatorCitations } from '../../lib/legal/citations/gst-calculator';
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
      description="Add GST to a price, or take GST out of a price that includes it. Enter one amount or a whole bill with lines at different rates, and get CGST and SGST or IGST to the paisa, adding up exactly to the bill total."
      category="GST"
      icon="calculator"
      period="GST rates from 1 February 2026"
      formTitle="Bill details"
      form={<GstBillForm form={form} validation={validation} onChange={setForm} />}
      citations={gstCalculatorCitations}
      disclaimer={
        <>
          The rate list covers GST rates on goods notified from 22 September 2025, after the 28%
          rate was removed on 1 February 2026. Check the rate for your goods or service, and use
          Other rate for anything not listed. Compensation cess, reverse charge, discounts, the
          composition scheme and special valuation rules are not covered. Paise are rounded by the
          method described on this page, which is Khatakit&apos;s method, not a rule in the law.
        </>
      }
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
