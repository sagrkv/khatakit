import NumberInput from '../../components/ui/NumberInput';
import RadioGroup from '../../components/ui/RadioGroup';
import { tenureInMonths, type EmiField, type EmiFormValues, type TenureUnit } from './schema';

interface EmiFormProps {
  form: EmiFormValues;
  errors: Partial<Record<EmiField, string>>;
  onChange: (form: EmiFormValues) => void;
}

export default function EmiForm({ form, errors, onChange }: EmiFormProps) {
  function changeUnit(unit: TenureUnit) {
    if (unit === form.tenureUnit) return;
    // Keep the same loan length: 1.5 years becomes 18 months and back.
    const months = tenureInMonths(form);
    const tenure = Number.isNaN(months) ? form.tenure : unit === 'years' ? months / 12 : months;
    onChange({ ...form, tenureUnit: unit, tenure });
  }

  return (
    <div className="form-stack">
      <NumberInput
        id="loan-amount"
        label="Loan Amount"
        value={form.principal}
        onChange={(v) => onChange({ ...form, principal: v })}
        prefix="₹"
        reportInvalid
        error={errors.principal}
      />

      <NumberInput
        id="annual-interest-rate"
        label="Annual Interest Rate"
        value={form.annualRate}
        onChange={(v) => onChange({ ...form, annualRate: v })}
        suffix="%"
        step={0.05}
        reportInvalid
        error={errors.annualRate}
        helpText="Fixed for the whole loan, up to 50%."
      />

      <div>
        <RadioGroup
          label="Loan Tenure"
          value={form.tenureUnit}
          onChange={(v) => changeUnit(v as TenureUnit)}
          options={[
            { label: 'Years', value: 'years' },
            { label: 'Months', value: 'months' },
          ]}
        />
        <div className="form-followup">
          <NumberInput
            id="tenure"
            label={form.tenureUnit === 'years' ? 'Tenure (Years)' : 'Tenure (Months)'}
            value={form.tenure}
            onChange={(v) => onChange({ ...form, tenure: v })}
            reportInvalid
            error={errors.tenure}
            helpText={
              form.tenureUnit === 'years'
                ? 'Up to 40 years. Part years work too: 1.5 years is 18 months.'
                : 'Up to 480 months.'
            }
          />
        </div>
      </div>
    </div>
  );
}
