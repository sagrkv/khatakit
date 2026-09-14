import { useEffect, useRef, useState } from 'react';
import Button from '../../components/ui/Button';
import RadioGroup from '../../components/ui/RadioGroup';
import ToolIcon from '../../components/ui/ToolIcon';
import GstLineFields from './GstLineFields';
import { lineFieldId } from './ids';
import {
  emptyLine,
  fieldKey,
  MAX_LINES,
  type BillForm,
  type BillValidation,
  type LineField,
  type LineForm,
} from './schema';
import type { SupplyType } from './types';

const ADD_BUTTON_ID = 'gst-add-line';
const ROUND_HELP_ID = 'gst-round-help';

interface Props {
  form: BillForm;
  validation: BillValidation;
  onChange: (form: BillForm) => void;
}

export default function GstBillForm({ form, validation, onChange }: Props) {
  const [touched, setTouched] = useState<ReadonlySet<string>>(() => new Set());
  const [announcement, setAnnouncement] = useState('');
  // Focus moves after the lines re-render: to a new line, or to a neighbour of a removed one.
  const pendingFocus = useRef<string | null>(null);

  useEffect(() => {
    if (!pendingFocus.current) return;
    document.getElementById(pendingFocus.current)?.focus();
    pendingFocus.current = null;
  });

  const updateLine = (id: number, patch: Partial<LineForm>) =>
    onChange({
      ...form,
      lines: form.lines.map((line) => (line.id === id ? { ...line, ...patch } : line)),
    });

  const addLine = () => {
    const id = Math.max(0, ...form.lines.map((line) => line.id)) + 1;
    pendingFocus.current = lineFieldId(id, 'amount');
    onChange({ ...form, lines: [...form.lines, emptyLine(id)] });
    setAnnouncement(`Line ${form.lines.length + 1} added.`);
  };

  const removeLine = (id: number) => {
    const index = form.lines.findIndex((line) => line.id === id);
    const lines = form.lines.filter((line) => line.id !== id);
    const neighbour = lines[index] ?? lines[index - 1];
    pendingFocus.current = neighbour ? lineFieldId(neighbour.id, 'amount') : ADD_BUTTON_ID;
    onChange({ ...form, lines });
    setAnnouncement(
      `Line ${index + 1} removed. ${lines.length} ${lines.length === 1 ? 'line' : 'lines'} left.`
    );
  };

  const markTouched = (id: number, field: LineField) => {
    const key = fieldKey(id, field);
    if (!touched.has(key)) setTouched(new Set([...touched, key]));
  };

  const errorFor = (id: number, field: LineField) => {
    const key = fieldKey(id, field);
    return validation.errors[key] ?? (touched.has(key) ? validation.missing[key] : undefined);
  };

  const atLimit = form.lines.length >= MAX_LINES;

  return (
    <div className="form-stack">
      <RadioGroup
        label="Supply"
        value={form.supplyType}
        onChange={(value) => onChange({ ...form, supplyType: value as SupplyType })}
        options={[
          { label: 'Within the state', value: 'intra' },
          { label: 'Between states', value: 'inter' },
        ]}
        helpText="Within the state: CGST and SGST (or UTGST). Between states: IGST."
      />

      <ol className="bill-lines" aria-label="Bill lines">
        {form.lines.map((line, index) => (
          <li key={line.id}>
            <GstLineFields
              line={line}
              index={index}
              canRemove={form.lines.length > 1}
              amountError={errorFor(line.id, 'amount')}
              rateError={errorFor(line.id, 'customRate')}
              onChange={(patch) => updateLine(line.id, patch)}
              onRemove={() => removeLine(line.id)}
              onBlurField={(field) => markTouched(line.id, field)}
            />
          </li>
        ))}
      </ol>

      <div className="bill-add">
        <Button id={ADD_BUTTON_ID} variant="secondary" onClick={addLine} disabled={atLimit}>
          <ToolIcon name="plus" /> Add line
        </Button>
        {atLimit && <p className="field-help">A bill can have up to {MAX_LINES} lines.</p>}
      </div>

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={form.roundToRupee}
          onChange={(event) => onChange({ ...form, roundToRupee: event.target.checked })}
          aria-describedby={ROUND_HELP_ID}
        />
        <span>
          <span className="field-label">Round the bill total to the nearest rupee</span>
          <span className="field-help" id={ROUND_HELP_ID}>
            Adds a round-off line. 50 paise or more rounds up.
          </span>
        </span>
      </label>

      <p className="sr-only" role="status">
        {announcement}
      </p>
    </div>
  );
}
