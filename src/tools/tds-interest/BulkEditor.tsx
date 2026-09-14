import type { ClipboardEvent } from 'react';
import Button from '../../components/ui/Button';
import ToolIcon from '../../components/ui/ToolIcon';
import { formatPaise } from './format';
import { DRAFT_FIELD_NAMES, DRAFT_FIELDS, MAX_ROWS } from './sheet';
import type { CaseOutcome, DraftField, DraftRow } from './types';

interface Props {
  drafts: DraftRow[];
  outcomes: CaseOutcome[] | null;
  onChange: (id: string, field: DraftField, value: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  /** Cells copied from a spreadsheet, pasted into one cell. */
  onPaste: (rowIndex: number, fieldIndex: number, text: string) => void;
}

const PLACEHOLDERS: Record<DraftField, string> = {
  label: 'Vendor A - 194C',
  amount: '1,00,050',
  deductible: 'dd/mm/yyyy',
  deducted: 'dd/mm/yyyy',
  deposited: 'dd/mm/yyyy',
};

function RowStatus({ outcome, id }: { outcome: CaseOutcome | undefined; id: string }) {
  return (
    <td className="row-status" id={id}>
      {outcome?.status === 'error' && (
        <ul className="row-errors">
          {outcome.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      {outcome?.status === 'ok' && (
        <>
          <span className="cell-number">{formatPaise(outcome.totalCalendarPaise)}</span>
          {outcome.estimate && <span className="cell-sub">Estimate to the as-of date</span>}
        </>
      )}
    </td>
  );
}

export default function BulkEditor({
  drafts,
  outcomes,
  onChange,
  onAdd,
  onRemove,
  onPaste,
}: Props) {
  function handlePaste(
    event: ClipboardEvent<HTMLInputElement>,
    rowIndex: number,
    fieldIndex: number
  ) {
    const text = event.clipboardData.getData('text/plain');
    if (!/[\t\r\n]/.test(text)) return;
    event.preventDefault();
    onPaste(rowIndex, fieldIndex, text);
  }

  return (
    <div>
      <div className="section-heading">
        <h3 className="section-title">Rows</h3>
        <Button variant="secondary" onClick={onAdd} disabled={drafts.length >= MAX_ROWS}>
          <ToolIcon name="plus" />
          Add row
        </Button>
      </div>
      <div
        className="breakdown-scroll row-editor-scroll"
        role="region"
        aria-label="Rows to calculate"
        tabIndex={0}
      >
        <table className="breakdown-table row-editor">
          <thead>
            <tr>
              <th scope="col" className="cell-right">
                #
              </th>
              {DRAFT_FIELDS.map((field) => (
                <th key={field} scope="col" className="cell-left">
                  {DRAFT_FIELD_NAMES[field]}
                </th>
              ))}
              <th scope="col" className="cell-left">
                Interest or errors
              </th>
              <th scope="col">
                <span className="sr-only">Remove</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {drafts.map((draft, rowIndex) => {
              const outcome = outcomes?.[rowIndex];
              const errors = outcome?.status === 'error' ? outcome.errors : [];
              const statusId = `row-status-${draft.id}`;
              return (
                <tr key={draft.id}>
                  <td className="row-number">{rowIndex + 1}</td>
                  {DRAFT_FIELDS.map((field, fieldIndex) => (
                    <td key={field}>
                      <input
                        className="control row-cell"
                        data-field={field}
                        type="text"
                        inputMode={
                          field === 'amount' ? 'decimal' : field === 'label' ? 'text' : 'numeric'
                        }
                        autoComplete="off"
                        aria-label={`Row ${rowIndex + 1} ${field === 'label' ? 'label' : DRAFT_FIELD_NAMES[field]}`}
                        aria-invalid={errors.some((error) =>
                          error.startsWith(DRAFT_FIELD_NAMES[field])
                        )}
                        aria-describedby={statusId}
                        placeholder={PLACEHOLDERS[field]}
                        value={draft[field]}
                        onChange={(event) => onChange(draft.id, field, event.target.value)}
                        onPaste={(event) => handlePaste(event, rowIndex, fieldIndex)}
                      />
                    </td>
                  ))}
                  <RowStatus outcome={outcome} id={statusId} />
                  <td>
                    <button
                      type="button"
                      className="row-remove"
                      aria-label={`Remove row ${rowIndex + 1}`}
                      onClick={() => onRemove(draft.id)}
                    >
                      <ToolIcon name="trash" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="editor-help">
        Type rows, or copy cells from Excel or Google Sheets and paste them into any box. Columns go
        in the order shown. Dates as dd/mm/yyyy. Up to {MAX_ROWS.toLocaleString('en-IN')} rows.
      </p>
    </div>
  );
}
