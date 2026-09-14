import { act, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { expect, vi } from 'vitest';

export interface Mounted {
  node: HTMLDivElement;
  unmount: () => void;
}

export function mount(element: ReactElement): Mounted {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  const node = document.createElement('div');
  document.body.appendChild(node);
  const root: Root = createRoot(node);
  act(() => root.render(<MemoryRouter>{element}</MemoryRouter>));
  return {
    node,
    unmount: () => {
      act(() => root.unmount());
      node.remove();
    },
  };
}

export function input(node: HTMLElement, id: string): HTMLInputElement {
  const field = node.querySelector<HTMLInputElement>(`[id="${id}"]`);
  expect(field, `#${id}`).not.toBeNull();
  return field!;
}

/** Types into a field the way React sees a user edit. */
export function type(node: HTMLElement, id: string, value: string) {
  const field = input(node, id);
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(field, value);
    field.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

export function choose(node: HTMLElement, value: string) {
  const radio = node.querySelector<HTMLInputElement>(`input[type=radio][value="${value}"]`);
  expect(radio, value).not.toBeNull();
  act(() => radio!.click());
}

export function select(node: HTMLElement, id: string, value: string) {
  const field = node.querySelector<HTMLSelectElement>(`[id="${id}"]`)!;
  act(() => {
    field.value = value;
    field.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

export function buttonNamed(node: HTMLElement, text: string): HTMLButtonElement {
  const button = Array.from(node.querySelectorAll('button')).find((item) =>
    item.textContent?.includes(text)
  );
  expect(button, text).toBeTruthy();
  return button!;
}

/** Text with "₹ 1,000" and "₹1,000" written the same way. */
export function textOf(element: Element | null): string {
  return (element?.textContent ?? '').replace(/₹\s/g, '₹');
}

/** Fails the test if anything tries to reach the network. */
export function blockNetwork() {
  const fetchSpy = vi.fn(() => Promise.reject(new Error('Network blocked in test')));
  vi.stubGlobal('fetch', fetchSpy);
  const open = vi.spyOn(XMLHttpRequest.prototype, 'open').mockImplementation(() => {});
  const send = vi.spyOn(XMLHttpRequest.prototype, 'send').mockImplementation(() => {});
  const beacon = vi.fn(() => true);
  Object.defineProperty(navigator, 'sendBeacon', { value: beacon, configurable: true });
  return {
    expectNoRequests() {
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(open).not.toHaveBeenCalled();
      expect(send).not.toHaveBeenCalled();
      expect(beacon).not.toHaveBeenCalled();
    },
  };
}

/** Records files the page saves instead of letting jsdom navigate. */
export function captureDownloads() {
  const files: { name: string; blob: Blob }[] = [];
  const blobs = new Map<string, Blob>();
  Object.defineProperty(URL, 'createObjectURL', {
    value: vi.fn((blob: Blob) => {
      const url = `blob:khatakit/${blobs.size}`;
      blobs.set(url, blob);
      return url;
    }),
    configurable: true,
  });
  Object.defineProperty(URL, 'revokeObjectURL', { value: vi.fn(), configurable: true });
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
    this: HTMLAnchorElement
  ) {
    files.push({ name: this.download, blob: blobs.get(this.href)! });
  });
  return files;
}

export function readBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).replace(/^\uFEFF/, ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
}

export function mockClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  return writeText;
}
