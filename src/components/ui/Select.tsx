interface SelectOption {
  label: string;
  value: string;
}
interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  helpText?: string;
  id?: string;
}
export default function Select({ label, value, onChange, options, helpText, id }: SelectProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="field">
      <label className="field-label" htmlFor={inputId}>
        {label}
      </label>
      <select
        className="control"
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={helpText ? `${inputId}-help` : undefined}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {helpText && (
        <p className="field-help" id={`${inputId}-help`}>
          {helpText}
        </p>
      )}
    </div>
  );
}
