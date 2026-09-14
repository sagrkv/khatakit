import { EmptyState } from '../../components/ui/Surface';
import CalculatorPage from '../../components/layout/CalculatorPage';
import { useState, useMemo, useSyncExternalStore } from 'react';
import { calculateGstPenalty } from './calc';
import { validateGstInput, type GstField, type GstValidation } from './schema';
import type { GstInput } from './types';
import GstForm from './GstForm';
import GstResults from './GstResults';
import GstGuide from './GstGuide';
import { gstLateFeeCitations } from '../../lib/legal/citations/gst-late-fee';
import { toInputDateString } from '../../lib/utils/date';

const defaultInput: GstInput = {
  returnType: 'GSTR-3B',
  dueDate: '',
  filingDate: '',
  taxLiability: 0,
  turnoverSlab: 'upto_1_5cr',
  isNilReturn: false,
  stateTurnover: 0,
};

const MISSING_LABELS: Record<GstField, string> = {
  dueDate: 'the due date',
  filingDate: 'the filing date',
  taxLiability: 'tax paid in cash',
  stateTurnover: 'turnover in this State',
};

function emptyMessage({ errors, missing }: GstValidation): string {
  if (Object.keys(errors).length > 0) {
    return 'Fix the highlighted field to see the late fee and interest.';
  }
  const names = missing.map((field) => MISSING_LABELS[field]).join(' and ');
  return `Enter ${names} to see the late fee and interest.`;
}

// Today's date is read in the browser only. The prerendered HTML and the
// hydration pass use an empty date, then React re-renders with today.
const subscribeToNothing = () => () => {};
const readToday = () => toInputDateString(new Date());
const noDateOnServer = () => '';

export function Component() {
  const [stored, setStored] = useState<GstInput>(defaultInput);
  const [filingDateEdited, setFilingDateEdited] = useState(false);
  const today = useSyncExternalStore(subscribeToNothing, readToday, noDateOnServer);
  const input = useMemo(
    () => (filingDateEdited ? stored : { ...stored, filingDate: today }),
    [stored, filingDateEdited, today]
  );

  function setInput(next: GstInput) {
    if (next.filingDate !== input.filingDate) setFilingDateEdited(true);
    setStored(next);
  }

  const validation = useMemo(() => validateGstInput(input), [input]);
  const result = useMemo(
    () => (validation.input ? calculateGstPenalty(validation.input) : null),
    [validation]
  );

  return (
    <CalculatorPage
      title="GST Late Fee & Interest Calculator"
      description="Work out the late fee and interest on a late GSTR-3B, GSTR-1 or GSTR-9, with the dates used, the caps and the CGST and SGST split."
      category="GST"
      icon="receipt"
      period="Rules as at September 2026"
      formTitle="Return Details"
      form={<GstForm input={input} errors={validation.errors} onChange={setInput} />}
      citations={gstLateFeeCitations}
      disclaimer={
        <>
          Figures follow sections 47 and 50 of the CGST Act and Notifications 76/2018, 19/2021,
          20/2021 and 07/2023, as in force in September 2026. GSTR-9 is optional for aggregate
          turnover up to ₹2 crore. Returns cannot be filed more than three years after the due
          date. One-off waivers and amnesty schemes are not applied. Check the amount on the GST
          portal before paying.
        </>
      }
      guide={<GstGuide />}
    >
      {result && validation.input ? (
        <GstResults input={validation.input} result={result} />
      ) : (
        <EmptyState>{emptyMessage(validation)}</EmptyState>
      )}
    </CalculatorPage>
  );
}
