import { useEffect, useRef, useState } from 'react';
import ToolIcon from '../ui/ToolIcon';

interface CopyButtonProps {
  text: string;
  label?: string;
}
export default function CopyButton({ text, label = 'Copy' }: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function handleCopy() {
    if (timer.current) clearTimeout(timer.current);
    setStatus('copying');
    let success = false;
    try {
      await navigator.clipboard.writeText(text);
      success = true;
    } catch {
      const focused = document.activeElement as HTMLElement | null;
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(textarea);
      try {
        textarea.select();
        success = document.execCommand('copy');
      } catch {
        success = false;
      } finally {
        textarea.remove();
        focused?.focus({ preventScroll: true });
      }
    }
    if (!mounted.current) return;
    setStatus(success ? 'copied' : 'error');
    if (success) timer.current = setTimeout(() => setStatus('idle'), 2200);
  }
  return (
    <span className="copy-control">
      <button
        type="button"
        onClick={handleCopy}
        disabled={status === 'copying'}
        className="copy-button"
        data-state={status}
        aria-label={label === 'Copy' ? 'Copy results' : `Copy ${label}`}
        aria-busy={status === 'copying'}
      >
        <ToolIcon name={status === 'copied' ? 'check' : status === 'error' ? 'alert' : 'copy'} />
        <span>
          {status === 'copied'
            ? 'Copied'
            : status === 'copying'
              ? 'Copying…'
              : status === 'error'
                ? 'Try again'
                : label}
        </span>
      </button>
      <span className={status === 'error' ? 'copy-error' : 'sr-only'} role="status">
        {status === 'copied'
          ? 'Results copied to clipboard.'
          : status === 'error'
            ? 'Could not copy. Select the results and copy manually, or try again.'
            : ''}
      </span>
    </span>
  );
}
