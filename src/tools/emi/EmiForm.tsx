import type { EmiInput } from './types';
import NumberInput from '../../components/ui/NumberInput';
import RadioGroup from '../../components/ui/RadioGroup';
import { useState } from 'react';

interface EmiFormProps {
  input: EmiInput;
  onChange: (input: EmiInput) => void;
}

export default function EmiForm({ input, onChange }: EmiFormProps) {
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');
  const tenureYears = Math.round(input.tenureMonths / 12);

  return (
    <div className="space-y-4">
      <NumberInput
        label="Loan Amount"
        value={input.principal}
        onChange={(v) => onChange({ ...input, principal: v })}
        prefix="\u20B9"
        min={0}
      />

      <NumberInput
        label="Annual Interest Rate"
        value={input.annualRate}
        onChange={(v) => onChange({ ...input, annualRate: v })}
        suffix="%"
        min={0}
        max={50}
        step={0.1}
      />

      <div>
        <RadioGroup
          label="Loan Tenure"
          value={tenureUnit}
          onChange={(v) => {
            const unit = v as 'years' | 'months';
            setTenureUnit(unit);
          }}
          options={[
            { label: 'Years', value: 'years' },
            { label: 'Months', value: 'months' },
          ]}
        />
        <div className="mt-2">
          <NumberInput
            label={tenureUnit === 'years' ? 'Tenure (Years)' : 'Tenure (Months)'}
            value={tenureUnit === 'years' ? tenureYears : input.tenureMonths}
            onChange={(v) => {
              const months = tenureUnit === 'years' ? v * 12 : v;
              onChange({ ...input, tenureMonths: months });
            }}
            min={1}
            max={tenureUnit === 'years' ? 40 : 480}
          />
        </div>
      </div>
    </div>
  );
}
