interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  helpText?: string;
  id?: string;
}

export default function DateInput({
  label,
  value,
  onChange,
  min,
  max,
  helpText,
  id,
}: DateInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <input
        id={inputId}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
      />
      {helpText && <p className="mt-1 text-xs text-neutral-500">{helpText}</p>}
    </div>
  );
}
