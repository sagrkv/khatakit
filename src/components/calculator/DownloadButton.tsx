import { useState } from 'react';
import ToolIcon from '../ui/ToolIcon';

interface DownloadButtonProps {
  /** Builds the file content when clicked, so large files are not built on every render. */
  getContent: () => string;
  filename: string;
  label: string;
  mimeType?: string;
}

/** Saves a file built in the browser. Nothing is uploaded. */
export default function DownloadButton({
  getContent,
  filename,
  label,
  mimeType = 'text/csv;charset=utf-8',
}: DownloadButtonProps) {
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle');

  function handleDownload() {
    try {
      // A byte order mark lets spreadsheet apps read the rupee sign and other UTF-8 text.
      const blob = new Blob(['\uFEFF', getContent()], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.hidden = true;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 0);
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  return (
    <span className="copy-control">
      <button type="button" className="copy-button" data-state={status} onClick={handleDownload}>
        <ToolIcon name={status === 'error' ? 'alert' : 'download'} />
        <span>{status === 'error' ? 'Try again' : label}</span>
      </button>
      <span className={status === 'error' ? 'copy-error' : 'sr-only'} role="status">
        {status === 'done'
          ? `${filename} downloaded.`
          : status === 'error'
            ? 'Could not create the file. Copy the results instead, or try again.'
            : ''}
      </span>
    </span>
  );
}
