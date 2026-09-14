import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Component as TdsInterest } from '../../src/tools/tds-interest/TdsInterest';

let node: HTMLDivElement;
let root: Root;

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-09-14T10:00:00'));
  node = document.createElement('div');
  document.body.appendChild(node);
  root = createRoot(node);
});

afterEach(() => {
  act(() => root.unmount());
  node.remove();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function setValue(input: HTMLInputElement, value: string) {
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

function clickButton(text: string) {
  const found = Array.from(node.querySelectorAll('button')).find(
    (item) => item.textContent?.trim() === text
  );
  expect(found, text).toBeTruthy();
  act(() => found!.click());
}

it('sends no network requests while calculating, uploading a CSV and downloading workings', async () => {
  const fetchSpy = vi.fn();
  vi.stubGlobal('fetch', fetchSpy);
  const open = vi.spyOn(XMLHttpRequest.prototype, 'open');
  const send = vi.spyOn(XMLHttpRequest.prototype, 'send');
  const beacon = vi.fn(() => true);
  Object.defineProperty(navigator, 'sendBeacon', { value: beacon, configurable: true });
  const createObjectURL = vi.fn(() => 'blob:local');
  Object.assign(URL, { createObjectURL, revokeObjectURL: vi.fn() });
  const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

  act(() =>
    root.render(
      <MemoryRouter initialEntries={['/tds-interest-calculator']}>
        <TdsInterest />
      </MemoryRouter>
    )
  );

  setValue(node.querySelector('#tds-amount')!, '1,00,050');
  setValue(node.querySelector('#date-deducted')!, '2026-04-28');
  setValue(node.querySelector('#date-deposited')!, '2026-05-08');
  expect(node.querySelector('.calculator-output')!.textContent).toContain('₹ 3,000');
  clickButton('Download CSV');

  act(() => (node.querySelector('input[type=radio][value="bulk"]') as HTMLInputElement).click());
  const csv =
    'Label,TDS amount,Date deductible,Date deducted,Date deposited\nA,"1,00,050",,28/04/2026,08/05/2026\n';
  const file = new File([csv], 'rows.csv', { type: 'text/csv' });
  const input = node.querySelector<HTMLInputElement>('input[type=file]')!;
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  await act(async () => {
    input.dispatchEvent(new Event('change', { bubbles: true }));
    // FileReader finishes on a later task; state updates flush when act ends.
    await new Promise((resolve) => setTimeout(resolve, 50));
  });
  expect(node.textContent).toContain('Added 1 row from rows.csv.');
  expect(node.querySelector('.calculator-output')!.textContent).toContain('₹ 3,000');

  clickButton('Download CSV');
  clickButton('Download Excel');
  clickButton('Download CSV template');

  expect(createObjectURL).toHaveBeenCalledTimes(4);
  expect(anchorClick).toHaveBeenCalledTimes(4);
  expect(fetchSpy).not.toHaveBeenCalled();
  expect(open).not.toHaveBeenCalled();
  expect(send).not.toHaveBeenCalled();
  expect(beacon).not.toHaveBeenCalled();
});
