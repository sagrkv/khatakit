import NumberInput from '../../components/ui/NumberInput';
import RadioGroup from '../../components/ui/RadioGroup';
import type { PresumptiveField } from './schema';
import type { PresumptiveInput, PresumptiveScheme } from './types';
import type { TaxRegime } from '../../lib/tax/types';

interface PresumptiveFormProps {
  input: PresumptiveInput;
  errors: Partial<Record<PresumptiveField, string>>;
  onChange: (input: PresumptiveInput) => void;
}

export default function PresumptiveForm({ input, errors, onChange }: PresumptiveFormProps) {
  const business = input.scheme === '44AD';
  return (
    <div className="form-stack">
      <RadioGroup
        label="Scheme"
        value={input.scheme}
        onChange={(v) => onChange({ ...input, scheme: v as PresumptiveScheme })}
        options={[
          { label: '44ADA (Professional)', value: '44ADA' },
          { label: '44AD (Business)', value: '44AD' },
        ]}
        helpText="Old section names. Both are now section 58(2) of the Income-tax Act, 2025."
      />

      <RadioGroup
        label="Tax Regime"
        value={input.regime}
        onChange={(v) => onChange({ ...input, regime: v as TaxRegime })}
        options={[
          { label: 'New Regime', value: 'new' },
          { label: 'Old Regime', value: 'old' },
        ]}
      />

      <NumberInput
        id="gross-receipts"
        label={business ? 'Gross Turnover' : 'Gross Receipts'}
        value={input.grossReceipts}
        onChange={(v) => onChange({ ...input, grossReceipts: v })}
        prefix="₹"
        reportInvalid
        error={errors.grossReceipts}
        helpText={
          business
            ? 'Total turnover or gross receipts for 1 April 2026 to 31 March 2027'
            : 'Total gross receipts from the profession for 1 April 2026 to 31 March 2027'
        }
      />

      <NumberInput
        id="cash-receipts"
        label="Cash Receipts"
        value={input.cashReceipts}
        onChange={(v) => onChange({ ...input, cashReceipts: v })}
        prefix="₹"
        reportInvalid
        error={errors.cashReceipts}
        helpText={
          business
            ? 'Part of the turnover not received by bank or online mode by the return due date. Taxed at 8% instead of 6%. At 5% or less of turnover, the limit is ₹3 crore instead of ₹2 crore.'
            : 'Part of the receipts not received by bank or online mode. At 5% or less of receipts, the limit is ₹75 lakh instead of ₹50 lakh.'
        }
      />
    </div>
  );
}
