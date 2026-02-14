import type { AdvanceTaxInput } from './types';
import NumberInput from '../../components/ui/NumberInput';
import RadioGroup from '../../components/ui/RadioGroup';
import Select from '../../components/ui/Select';

interface AdvanceTaxFormProps {
  input: AdvanceTaxInput;
  onChange: (input: AdvanceTaxInput) => void;
}

export default function AdvanceTaxForm({ input, onChange }: AdvanceTaxFormProps) {
  return (
    <div className="space-y-4">
      <RadioGroup
        label="Tax Regime"
        value={input.regime}
        onChange={(v) => onChange({ ...input, regime: v as 'old' | 'new' })}
        options={[
          { label: 'New Regime', value: 'new' },
          { label: 'Old Regime', value: 'old' },
        ]}
      />

      <NumberInput
        label="Gross Total Income"
        value={input.grossIncome}
        onChange={(v) => onChange({ ...input, grossIncome: v })}
        prefix="\u20B9"
        min={0}
        helpText="Total income before deductions"
      />

      {input.regime === 'old' && (
        <NumberInput
          label="Total Deductions (80C, 80D, etc.)"
          value={input.deductions}
          onChange={(v) => onChange({ ...input, deductions: v })}
          prefix="\u20B9"
          min={0}
          helpText="Sum of all Chapter VI-A deductions"
        />
      )}

      <NumberInput
        label="TDS Already Deducted"
        value={input.tdsDeducted}
        onChange={(v) => onChange({ ...input, tdsDeducted: v })}
        prefix="\u20B9"
        min={0}
      />

      <Select
        label="Age Category"
        value={input.ageCategory}
        onChange={(v) =>
          onChange({ ...input, ageCategory: v as AdvanceTaxInput['ageCategory'] })
        }
        options={[
          { value: 'below60', label: 'Below 60 years' },
          { value: '60to80', label: '60 to 80 years' },
          { value: 'above80', label: 'Above 80 years' },
        ]}
      />
    </div>
  );
}
