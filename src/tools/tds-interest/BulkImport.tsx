import type { ChangeEvent } from 'react';
import DownloadButton from '../../components/calculator/DownloadButton';
import ToolIcon from '../../components/ui/ToolIcon';
import { TEMPLATE_CSV } from './export';

/** Files larger than this are almost certainly not a TDS sheet. */
const MAX_FILE_BYTES = 2 * 1024 * 1024;

interface Props {
  status: { tone: 'success' | 'error'; message: string } | null;
  onFile: (text: string, name: string) => void;
  onError: (message: string) => void;
}

function readText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export default function BulkImport({ status, onFile, onError }: Props) {
  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    try {
      if (file.size > MAX_FILE_BYTES) {
        onError(`${file.name} is larger than 2 MB. Split it into smaller files.`);
        return;
      }
      onFile(await readText(file), file.name);
    } catch {
      onError(`${file.name} could not be read. Save it as CSV and try again.`);
    } finally {
      input.value = '';
    }
  }

  return (
    <div className="field form-span">
      <p className="field-label">Import rows</p>
      <div className="result-actions">
        <label className="button button-secondary upload-button">
          <ToolIcon name="upload" />
          Upload CSV
          <input
            type="file"
            accept=".csv,.txt,text/csv,text/plain"
            className="sr-only"
            onChange={handleFile}
            aria-describedby="import-help"
          />
        </label>
        <DownloadButton
          label="Download CSV template"
          filename="tds-interest-template.csv"
          getContent={() => TEMPLATE_CSV}
        />
      </div>
      <p className="field-help" id="import-help">
        Columns: Label, TDS amount, Date deductible, Date deducted, Date deposited. Amounts like
        1,00,050 and dates as dd/mm/yyyy or yyyy-mm-dd. The file is read in your browser.
      </p>
      <p className="import-status" data-tone={status?.tone} role="status">
        {status?.message ?? ''}
      </p>
    </div>
  );
}
