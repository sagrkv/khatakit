import type { PresumptiveInput } from './types';
import NumberInput from '../../components/ui/NumberInput';
import RadioGroup from '../../components/ui/RadioGroup';

interface PresumptiveFormProps {
  input: PresumptiveInput;
  onChange: (input: PresumptiveInput) => void;
}

export default function PresumptiveForm({ input, onChange }: PresumptiveFormProps) {
  return (
    <div className="space-y-4">
      <RadioGroup
        label="Scheme"
        value={input.scheme}
        onChange={(v) => onChange({ ...input, scheme: v as '44AD' | '44ADA' })}
        options={[
          { label: '44ADA (Professional)', value: '44ADA' },
          { label: '44AD (Business)', value: '44AD' },
        ]}
      />

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
        label={input.scheme === '44AD' ? 'Gross Turnover' : 'Gross Receipts'}
        value={input.grossReceipts}
        onChange={(v) => onChange({ ...input, grossReceipts: v })}
        prefix="\u20B9"
        min={0}
        helpText={
          input.scheme === '44AD'
            ? 'Total turnover/gross receipts for the financial year'
            : 'Total gross receipts from profession'
        }
      />

      {input.scheme === '44AD' && (
        <NumberInput
          label="Cash Receipts"
          value={input.cashReceipts}
          onChange={(v) =>
            onChange({
              ...input,
              cashReceipts: Math.min(v, input.grossReceipts),
            })
          }
          prefix="\u20B9"
          min={0}
          max={input.grossReceipts}
          helpText="Receipts received in cash (not via bank/digital)"
        />
      )}
    </div>
  );
}
