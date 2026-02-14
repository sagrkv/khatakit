interface ResultCardProps {
  label: string;
  value: string;
  variant?: 'primary' | 'success' | 'error' | 'neutral';
  subtext?: string;
}

const bgMap = {
  primary: 'bg-primary-50 border-primary-200',
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  neutral: 'bg-neutral-100 border-neutral-200',
};

const textMap = {
  primary: 'text-primary-900',
  success: 'text-green-900',
  error: 'text-red-900',
  neutral: 'text-neutral-800',
};

export default function ResultCard({
  label,
  value,
  variant = 'primary',
  subtext,
}: ResultCardProps) {
  return (
    <div className={`rounded-xl border p-5 ${bgMap[variant]}`}>
      <p className="text-sm font-medium uppercase tracking-wide text-neutral-600">{label}</p>
      <p
        className={`mt-1 font-mono text-2xl font-semibold md:text-3xl ${textMap[variant]}`}
        aria-live="polite"
      >
        {value}
      </p>
      {subtext && <p className="mt-1 text-xs text-neutral-500">{subtext}</p>}
    </div>
  );
}
