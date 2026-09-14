import { useMemo, useRef, useState, useSyncExternalStore } from 'react';
import CalculatorPage from '../../components/layout/CalculatorPage';
import { EmptyState, Notice } from '../../components/ui/Surface';
import { tdsInterestCitations } from '../../lib/legal/citations/tds-interest';
import { toInputDateString } from '../../lib/utils/date';
import BulkEditor from './BulkEditor';
import BulkImport from './BulkImport';
import BulkResults from './BulkResults';
import { parseDelimited } from './csv';
import { plural } from './format';
import { pasteIntoDrafts, tableToDrafts } from './import';
import { calculateDrafts, draftOutcome, emptyDraft, isBlankDraft, MAX_ROWS } from './sheet';
import { EMPTY_SINGLE, isSingleReady, singleToDraft, type SingleInput } from './single';
import SingleResult from './SingleResult';
import TdsForm, { type Mode } from './TdsForm';
import TdsGuide from './TdsGuide';
import type { DeductorType, DraftField, DraftRow, SheetOptions } from './types';

// Today is read in the browser only. Prerendered HTML and hydration use '', then React
// re-renders with today's date.
const subscribeToNothing = () => () => {};
const readToday = () => toInputDateString(new Date());
const noDateOnServer = () => '';

type ImportStatus = { tone: 'success' | 'error'; message: string } | null;

export function Component() {
  const today = useSyncExternalStore(subscribeToNothing, readToday, noDateOnServer);
  const [mode, setMode] = useState<Mode>('single');
  const [deductorType, setDeductorType] = useState<DeductorType>('non-government');
  const [asOfEntered, setAsOfEntered] = useState<string | null>(null);
  const [single, setSingle] = useState<SingleInput>(EMPTY_SINGLE);
  const [drafts, setDrafts] = useState<DraftRow[]>([emptyDraft('1')]);
  const [importStatus, setImportStatus] = useState<ImportStatus>(null);
  const nextId = useRef(2);

  const asOf = asOfEntered ?? today;
  const options = useMemo<SheetOptions>(
    () => ({ asOf, today, deductorType }),
    [asOf, today, deductorType]
  );

  const singleDraft = useMemo(() => singleToDraft(single), [single]);
  const singleOutcome = useMemo(
    () => (today && isSingleReady(single) ? draftOutcome(singleDraft, options) : null),
    [today, single, singleDraft, options]
  );
  const sheet = useMemo(
    () => (today ? calculateDrafts(drafts, options) : null),
    [today, drafts, options]
  );

  const makeId = () => String(nextId.current++);

  function addRow() {
    setDrafts((current) =>
      current.length >= MAX_ROWS ? current : [...current, emptyDraft(makeId())]
    );
  }

  function removeRow(id: string) {
    const remaining = drafts.filter((draft) => draft.id !== id);
    setDrafts(remaining.length > 0 ? remaining : [emptyDraft(makeId())]);
  }

  function changeCell(id: string, field: DraftField, value: string) {
    setDrafts((current) =>
      current.map((draft) => (draft.id === id ? { ...draft, [field]: value } : draft))
    );
  }

  function pasteCells(rowIndex: number, fieldIndex: number, text: string) {
    setDrafts(pasteIntoDrafts(drafts, rowIndex, fieldIndex, parseDelimited(text, '\t'), makeId));
  }

  function importFile(text: string, name: string) {
    const { drafts: imported, skipped } = tableToDrafts(parseDelimited(text));
    if (imported.length === 0) {
      setImportStatus({
        tone: 'error',
        message: `No rows found in ${name}. Use the columns in the CSV template.`,
      });
      return;
    }
    const kept = drafts.filter((draft) => !isBlankDraft(draft));
    const room = Math.max(0, MAX_ROWS - kept.length);
    const added = imported.slice(0, room).map((row) => ({ id: makeId(), ...row }));
    const dropped = skipped + imported.length - added.length;
    setDrafts([...kept, ...added]);
    setImportStatus({
      tone: 'success',
      message: `Added ${plural(added.length, 'row', 'rows')} from ${name}.${
        dropped > 0
          ? ` ${plural(dropped, 'row was', 'rows were')} skipped (too few columns or over ${MAX_ROWS} rows).`
          : ''
      }`,
    });
  }

  const singleContent =
    singleOutcome === null ? (
      <EmptyState>
        Enter the TDS amount and the date tax was deducted to see the interest, the due date and
        each month counted.
      </EmptyState>
    ) : singleOutcome.status === 'error' ? (
      <Notice title="Check these entries" tone="warning">
        <ul className="notice-list">
          {singleOutcome.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </Notice>
    ) : singleOutcome.status === 'ok' ? (
      <SingleResult result={singleOutcome} draft={singleDraft} options={options} />
    ) : null;

  return (
    <CalculatorPage
      title="TDS Interest Calculator"
      description="Work out interest on TDS deducted late (1% a month) or deposited late (1.5% a month), for one case or a sheet of rows. Shows the due date, each month counted, and the answer under both ways of counting months."
      category="Income Tax"
      icon="clock"
      period="Dates from 1 April 2021"
      formTitle={mode === 'single' ? 'TDS details' : 'Sheet settings'}
      form={
        <TdsForm
          mode={mode}
          onModeChange={setMode}
          deductorType={deductorType}
          onDeductorTypeChange={setDeductorType}
          asOf={asOf}
          onAsOfChange={setAsOfEntered}
          today={today}
          single={single}
          onSingleChange={setSingle}
          bulkImport={
            <BulkImport
              status={importStatus}
              onFile={importFile}
              onError={(message) => setImportStatus({ tone: 'error', message })}
            />
          }
        />
      }
      citations={tdsInterestCitations}
      disclaimer={
        <>
          Calendar months are counted the way the TRACES help pages describe. Several tribunal
          rulings count 30-day months instead, so both answers are shown. Covers TDS deposited by
          challan by the monthly due dates, for dates from 1 April 2021. Not covered: deductions
          paid with a challan-cum-statement (rent, property, and contract or professional payments
          by individuals, and crypto assets), quarterly deposits allowed by the Assessing Officer,
          TCS, late filing fees and penalties. Check any TRACES demand against its own workings
          before paying.
        </>
      }
      guide={<TdsGuide />}
    >
      {mode === 'single' ? (
        singleContent
      ) : (
        <>
          <BulkEditor
            drafts={drafts}
            outcomes={sheet?.outcomes ?? null}
            onChange={changeCell}
            onAdd={addRow}
            onRemove={removeRow}
            onPaste={pasteCells}
          />
          {sheet && <BulkResults sheet={sheet} drafts={drafts} options={options} />}
        </>
      )}
    </CalculatorPage>
  );
}
