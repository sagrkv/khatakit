import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../src/pages/Home';
import { tools } from '../../src/data/tools';

let container: HTMLDivElement;
let root: Root;
function search(value: string) {
  const input = container.querySelector('input')!;
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  return input;
}
function click(text: string) {
  const button = Array.from(container.querySelectorAll('button')).find((item) =>
    item.textContent?.startsWith(text)
  );
  expect(button).toBeTruthy();
  act(() => button!.click());
}
function toolLinks() {
  return container.querySelectorAll('#tools a');
}
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() =>
    root.render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
  );
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('tool discovery', () => {
  it('combines task search with category filters and recovers from no results', () => {
    const input = search('loan repayment');
    expect(toolLinks()).toHaveLength(1);
    expect(toolLinks()[0].getAttribute('href')).toBe('/emi-calculator');
    click('GST');
    expect(toolLinks()).toHaveLength(0);
    expect(container.textContent).toContain('No tools match this search');
    click('Show all tools');
    expect(input.value).toBe('');
    expect(document.activeElement).toBe(input);
    expect(toolLinks()).toHaveLength(tools.length);
    expect(container.querySelector('[role="status"]')?.textContent).toBe(`${tools.length} tools available`);
  });
  it('finds section numbers with punctuation and preserves real tool destinations', () => {
    expect(toolLinks()).toHaveLength(tools.length);
    search(' 44ADA! ');
    expect(toolLinks()).toHaveLength(1);
    expect(toolLinks()[0].getAttribute('href')).toBe('/presumptive-income-calculator');
  });
});
