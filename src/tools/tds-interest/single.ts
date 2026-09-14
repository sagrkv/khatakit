import type { DraftRow } from './types';

/** Single-case form values. Dates are ISO from native date inputs. */
export interface SingleInput {
  amount: number;
  deductible: string;
  deducted: string;
  deposited: string;
}

export const EMPTY_SINGLE: SingleInput = { amount: 0, deductible: '', deducted: '', deposited: '' };

export const singleToDraft = (input: SingleInput): DraftRow => ({
  id: 'single',
  label: '',
  amount: input.amount > 0 ? String(input.amount) : '',
  deductible: input.deductible,
  deducted: input.deducted,
  deposited: input.deposited,
});

/** Enough has been entered to show a result or specific errors. */
export const isSingleReady = (input: SingleInput) =>
  input.amount > 0 && (input.deducted !== '' || input.deductible !== '');
