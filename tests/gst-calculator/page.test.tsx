import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Component as GstCalculator } from '../../src/tools/gst-calculator/GstCalculator';

let node: HTMLDivElement;
let root: Root;

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  node = document.createElement('div');
  document.body.appendChild(node);
  root = createRoot(node);
  act(() =>
    root.render(
      <MemoryRouter initialEntries={['/gst-calculator']}>
        <GstCalculator />
      </MemoryRouter>
    )
  );
});

afterEach(() => {
  act(() => root.unmount());
  node.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const $ = <T extends Element>(selector: string) => node.querySelector<T>(selector);
const output = () => $('.calculator-output')!.textContent ?? '';
const results = () => $('[aria-label="Calculation results"]')!;
const sectionTitles = () =>
  Array.from(results().querySelectorAll('h3.section-title'), (heading) => heading.textContent);

function type(selector: string, value: string) {
  const input = $<HTMLInputElement>(selector)!;
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
function choose(selector: string, value: string) {
  const select = $<HTMLSelectElement>(selector)!;
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')!.set!.call(select, value);
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
}
function click(element: Element | null) {
  expect(element).not.toBeNull();
  act(() => (element as HTMLElement).click());
}
const button = (label: string) =>
  Array.from(node.querySelectorAll('button')).find(
    (item) => item.getAttribute('aria-label') === label || item.textContent?.trim() === label
  ) ?? null;
const lines = () => node.querySelectorAll('fieldset.bill-line');

describe('GST calculator page', () => {
  it('shows the method, examples and links before anything is entered', () => {
    expect($('h1')!.textContent).toBe('GST Calculator');
    expect($('.empty-state')).not.toBeNull();
    const guide = $('.calculator-guide')!;
    expect(guide.querySelector('h2')!.textContent).toBe('How GST is worked out');
    expect(Array.from(guide.querySelectorAll('h3'), (heading) => heading.textContent)).toEqual([
      'How do you add or remove GST?',
      'How is GST rounded to the paisa?',
      'Worked example',
      'Edge cases',
      'Assumptions',
      'Supported period',
      'References',
      'Related calculators',
    ]);
    const text = guide.textContent ?? '';
    expect(text).toContain('Taxable value ≈ amount ÷ (1 + rate)');
    expect(text).toContain('5,547.56');
    expect(text).toContain('Section 170');
    expect(text).toContain('1 February 2026');
    expect(guide.querySelectorAll('.guide-references a')).toHaveLength(4);
    for (const href of [
      '/gst-late-fee-interest-calculator',
      '/tds-interest-calculator',
      '/advance-tax-calculator',
    ]) {
      expect(guide.querySelector(`.related-tools a[href="${href}"]`)).not.toBeNull();
    }
  });

  it('calculates a line as soon as an amount is entered and switches supply type', () => {
    type('#gst-line-1-amount', '12345.67');
    expect($('.empty-state')).toBeNull();
    expect(output()).toContain('14,567.89');
    expect(output()).toContain('CGST = 12,345.67 × 9% = 1,111.1103, rounded to 1,111.11.');

    click($('input[type=radio][value="inter"]'));
    expect(output()).toContain('IGST = 12,345.67 × 18% = 2,222.2206, rounded to 2,222.22.');
    expect(output()).not.toContain('CGST');
  });

  it('shows the lines and rate tables only when they add something', () => {
    type('#gst-line-1-amount', '1000');
    expect(sectionTitles()).toEqual(['Bill totals', 'Workings']);
    expect(results().querySelectorAll('details')).toHaveLength(0);

    click(button('Add line'));
    type('#gst-line-2-amount', '500');
    expect(sectionTitles()).toEqual(['Bill totals', 'Lines', 'Workings']);
    expect(
      Array.from(
        results().querySelectorAll('[aria-label="Tax on each line, in rupees"] th'),
        (heading) => heading.textContent
      )
    ).toEqual(['Line', 'Taxable value', 'CGST', 'SGST', 'Line total']);
    expect(results().querySelectorAll('details.workings-details')).toHaveLength(2);

    choose('#gst-line-2-rate', '5');
    expect(sectionTitles()).toEqual(['Bill totals', 'Lines', 'By rate', 'Workings']);
    expect(output()).toContain('Line 2, 5%');

    click(button('Remove line 2'));
    expect(sectionTitles()).toEqual(['Bill totals', 'Workings']);
  });

  it('adds and removes lines, moving focus and announcing the change', () => {
    type('#gst-line-1-amount', '1234.50');
    choose('#gst-line-1-rate', '5');

    click(button('Add line'));
    expect(lines()).toHaveLength(2);
    expect(document.activeElement).toBe($('#gst-line-2-amount'));
    expect($('[role="status"]')!.textContent).toBe('Line 2 added.');
    type('#gst-line-2-amount', '2599.99');

    click(button('Add line'));
    type('#gst-line-3-amount', '845.25');
    choose('#gst-line-3-rate', '40');
    click($('#gst-round-help')!.closest('label')!.querySelector('input'));
    expect(output()).toContain('5,548.00');
    expect(output()).toContain('+0.44');

    click(button('Remove line 2'));
    expect(lines()).toHaveLength(2);
    expect($('#gst-line-2-amount')).toBeNull();
    expect(document.activeElement).toBe($('#gst-line-3-amount'));
    expect($('[role="status"]')!.textContent).toBe('Line 2 removed. 2 lines left.');

    click(button('Remove line 2'));
    expect(lines()).toHaveLength(1);
    expect(document.activeElement).toBe($('#gst-line-1-amount'));
    expect(button('Remove line 1')).toBeNull();
  });

  it('shows validation messages tied to the field and hides results', () => {
    type('#gst-line-1-amount', '12.345');
    const amount = $<HTMLInputElement>('#gst-line-1-amount')!;
    expect(amount.getAttribute('aria-invalid')).toBe('true');
    const errorId = amount.getAttribute('aria-describedby')!;
    expect(node.querySelector(`#${errorId}`)!.textContent).toBe(
      'Enter an amount with at most 2 decimal places.'
    );
    expect(output()).toContain('Correct the highlighted entries');

    type('#gst-line-1-amount', '999');
    expect(amount.hasAttribute('aria-invalid')).toBe(false);
    click($('#gst-line-1-amount')!.closest('fieldset')!.querySelector('input[type=radio][value="inclusive"]'));
    choose('#gst-line-1-rate', '5');
    expect(output()).toContain('951.42');

    click(button('Add line'));
    act(() => $<HTMLInputElement>('#gst-line-2-amount')!.blur());
    expect(node.textContent).toContain('Enter the amount.');

    choose('#gst-line-2-rate', 'custom');
    type('#gst-line-2-amount', '100');
    type('#gst-line-2-customRate', '150');
    expect(node.textContent).toContain('Enter a rate of 100% or less.');
    type('#gst-line-2-customRate', '12');
    expect(output()).toContain('112.00');
  });

  it('copies and downloads the results without any network request', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const xhrOpen = vi.spyOn(XMLHttpRequest.prototype, 'open');
    const xhrSend = vi.spyOn(XMLHttpRequest.prototype, 'send');
    const beacon = vi.fn(() => true);
    Object.defineProperty(navigator, 'sendBeacon', { value: beacon, configurable: true });
    const socket = vi.fn();
    vi.stubGlobal('WebSocket', socket);
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    let blob: Blob | undefined;
    Object.defineProperty(URL, 'createObjectURL', {
      value: vi.fn((value: Blob) => ((blob = value), 'blob:local')),
      configurable: true,
    });
    Object.defineProperty(URL, 'revokeObjectURL', { value: vi.fn(), configurable: true });
    const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    type('#gst-line-1-description', 'Tiles');
    type('#gst-line-1-amount', '100.10');
    click($('input[type=radio][value="inclusive"]'));
    click(button('Add line'));
    type('#gst-line-2-amount', '500');
    choose('#gst-line-2-rate', '0');
    click($('input[type=radio][value="inter"]'));
    click(button('Remove line 2'));

    await act(async () => button('Copy results')!.click());
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Line 1 Tiles'));

    click(button('Download CSV'));
    expect(anchorClick).toHaveBeenCalledTimes(1);
    expect((anchorClick.mock.contexts[0] as HTMLAnchorElement).download).toBe('gst-bill.csv');
    const csv = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.readAsText(blob!);
    });
    expect(csv).toContain('Bill total,100.10');
    expect(output()).toContain('gst-bill.csv downloaded.');

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(xhrOpen).not.toHaveBeenCalled();
    expect(xhrSend).not.toHaveBeenCalled();
    expect(beacon).not.toHaveBeenCalled();
    expect(socket).not.toHaveBeenCalled();
  });
});
