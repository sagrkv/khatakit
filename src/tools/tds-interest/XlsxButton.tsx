import { useState } from 'react';
import ToolIcon from '../../components/ui/ToolIcon';
import type { Cell } from './csv';
import { downloadFile, XLSX_TYPE } from './download';
import { buildXlsx } from './xlsx';

interface Props {
  /** Builds the rows when clicked, so the workbook is not built on every render. */
  getRows: () => Cell[][];
  filename: string;
  label: string;
}

/** Saves an .xlsx workbook built in the browser. Nothing is uploaded. */
export default function XlsxButton({ getRows, filename, label }: Props) {
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle');

  function handleDownload() {
    try {
      downloadFile(filename, buildXlsx(getRows()), XLSX_TYPE);
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
            ? 'Could not create the file. Download the CSV or copy the results instead.'
            : ''}
      </span>
    </span>
  );
}
