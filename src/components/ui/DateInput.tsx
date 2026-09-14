interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  helpText?: string;
  id?: string;
  /** Validation message. Marks the field invalid and is announced with it. */
  error?: string;
}
export default function DateInput({
  label,
  value,
  onChange,
  min,
  max,
  helpText,
  id,
  error,
}: DateInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  const describedBy =
    [helpText ? `${inputId}-help` : '', error ? `${inputId}-error` : ''].filter(Boolean).join(' ') ||
    undefined;
  return (
    <div className="field">
      <label className="field-label" htmlFor={inputId}>
        {label}
      </label>
      <input
        className="control"
        id={inputId}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
      />
      {helpText && (
        <p className="field-help" id={`${inputId}-help`}>
          {helpText}
        </p>
      )}
      {error && (
        <p className="field-error" id={`${inputId}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
