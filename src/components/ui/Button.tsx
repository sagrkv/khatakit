import ToolIcon from './ToolIcon';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  loading = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      aria-busy={loading}
      disabled={disabled || loading}
      className={`button action-button button-${variant} ${className}`}
      {...props}
    >
      {loading && <ToolIcon name="loader" className="button-spinner h-4 w-4" />}
      {loading && <span className="sr-only">Working… </span>}
      {children}
    </button>
  );
}
