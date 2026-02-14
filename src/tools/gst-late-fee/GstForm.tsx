import type { GstInput } from './types';
import NumberInput from '../../components/ui/NumberInput';
import DateInput from '../../components/ui/DateInput';
import Select from '../../components/ui/Select';
import RadioGroup from '../../components/ui/RadioGroup';
import { GST_RETURN_TYPES, TURNOVER_SLABS } from '../../lib/constants/gst-rates';

interface GstFormProps {
  input: GstInput;
  onChange: (input: GstInput) => void;
}

export default function GstForm({ input, onChange }: GstFormProps) {
  return (
    <div className="space-y-4">
      <Select
        label="Return Type"
        value={input.returnType}
        onChange={(v) => onChange({ ...input, returnType: v })}
        options={GST_RETURN_TYPES}
      />

      <DateInput
        label="Due Date"
        value={input.dueDate}
        onChange={(v) => onChange({ ...input, dueDate: v })}
      />

      <DateInput
        label="Actual Filing Date"
        value={input.filingDate}
        onChange={(v) => onChange({ ...input, filingDate: v })}
        min={input.dueDate}
      />

      <RadioGroup
        label="Return Type"
        value={input.isNilReturn ? 'nil' : 'non-nil'}
        onChange={(v) => onChange({ ...input, isNilReturn: v === 'nil' })}
        options={[
          { label: 'Regular', value: 'non-nil' },
          { label: 'Nil Return', value: 'nil' },
        ]}
      />

      {!input.isNilReturn && (
        <>
          <NumberInput
            label="Net Tax Liability"
            value={input.taxLiability}
            onChange={(v) => onChange({ ...input, taxLiability: v })}
            prefix="\u20B9"
            min={0}
            helpText="Tax liability after ITC (Input Tax Credit)"
          />

          <Select
            label="Annual Aggregate Turnover"
            value={input.turnoverSlab}
            onChange={(v) =>
              onChange({
                ...input,
                turnoverSlab: v as GstInput['turnoverSlab'],
              })
            }
            options={TURNOVER_SLABS}
          />
        </>
      )}
    </div>
  );
}
