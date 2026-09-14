import { useId } from 'react';
interface RadioGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  helpText?: string;
}
export default function RadioGroup({ label, value, onChange, options, helpText }: RadioGroupProps) {
  const name = useId();
  return (
    <fieldset className="field" aria-describedby={helpText ? `${name}-help` : undefined}>
      <legend className="field-label">{label}</legend>
      <div className="segmented">
        {options.map((opt) => (
          <label className="segmented-option" key={opt.value}>
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
      {helpText && (
        <p className="field-help" id={`${name}-help`}>
          {helpText}
        </p>
      )}
    </fieldset>
  );
}
