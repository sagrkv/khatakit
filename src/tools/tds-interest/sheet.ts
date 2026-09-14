import { calculateCase, summarise } from './calc';
import { parseAmount, parseDateText } from './validate';
import type {
  CaseOutcome,
  DraftField,
  DraftRow,
  SheetOptions,
  SheetResult,
  TdsCase,
} from './types';

export const DRAFT_FIELDS: DraftField[] = [
  'label',
  'amount',
  'deductible',
  'deducted',
  'deposited',
];

export const DRAFT_FIELD_NAMES: Record<DraftField, string> = {
  label: 'Label',
  amount: 'TDS amount',
  deductible: 'Date deductible',
  deducted: 'Date deducted',
  deposited: 'Date deposited',
};

/** Largest number of rows accepted from a paste or file. */
export const MAX_ROWS = 1000;

export const emptyDraft = (id: string): DraftRow => ({
  id,
  label: '',
  amount: '',
  deductible: '',
  deducted: '',
  deposited: '',
});

export const isBlankDraft = (draft: DraftRow) =>
  DRAFT_FIELDS.every((field) => draft[field].trim() === '');

/** Turns raw row text into a case, or plain-word errors naming each bad field. */
function draftToCase(draft: DraftRow): { case: TdsCase } | { errors: string[] } {
  const errors: string[] = [];
  const amount = parseAmount(draft.amount);
  if (!amount.ok) errors.push(`TDS amount ${amount.error}`);
  const dates = (['deductible', 'deducted', 'deposited'] as const).map((field) => {
    const parsed = parseDateText(draft[field]);
    if (!parsed.ok) errors.push(`${DRAFT_FIELD_NAMES[field]} ${parsed.error}`);
    return parsed.ok ? parsed.value : '';
  });
  if (errors.length > 0 || !amount.ok) return { errors };
  const [deductibleOn, deductedOn, depositedOn] = dates;
  return {
    case: {
      label: draft.label.trim(),
      amount: amount.value,
      deductibleOn,
      deductedOn,
      depositedOn,
    },
  };
}

export function draftOutcome(draft: DraftRow, options: SheetOptions): CaseOutcome {
  const label = draft.label.trim();
  if (isBlankDraft(draft)) return { status: 'blank', label };
  const parsed = draftToCase(draft);
  return 'errors' in parsed
    ? { status: 'error', label, errors: parsed.errors }
    : calculateCase(parsed.case, options);
}

export function calculateDrafts(drafts: DraftRow[], options: SheetOptions): SheetResult {
  return summarise(drafts.map((draft) => draftOutcome(draft, options)));
}
