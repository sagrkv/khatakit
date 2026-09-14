import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Component } from '../../src/tools/gst-late-fee/GstLateFee';

let blobs: Blob[];

beforeEach(() => {
  blobs = [];
  vi.stubGlobal('fetch', vi.fn());
  vi.spyOn(XMLHttpRequest.prototype, 'open');
  vi.spyOn(XMLHttpRequest.prototype, 'send');
  Object.defineProperty(navigator, 'sendBeacon', { value: vi.fn(), configurable: true });
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    configurable: true,
  });
  Object.assign(URL, {
    createObjectURL: vi.fn((blob: Blob) => {
      blobs.push(blob);
      return 'blob:local';
    }),
    revokeObjectURL: vi.fn(),
  });
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it('calculates, copies and downloads without any network request', async () => {
  render(
    <MemoryRouter initialEntries={['/gst-late-fee-interest-calculator']}>
      <Component />
    </MemoryRouter>
  );
  fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2026-05-20' } });
  fireEvent.change(screen.getByLabelText('Actual Filing Date'), { target: { value: '2026-06-19' } });
  fireEvent.change(screen.getByLabelText('Tax Paid in Cash'), { target: { value: '100000' } });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Copy results' }));
  });
  fireEvent.click(screen.getByRole('button', { name: 'Download CSV'}));

  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('Total: ₹ 2,979'));
  expect(blobs).toHaveLength(1);
  const csv = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.readAsText(blobs[0]);
  });
  expect(csv).toContain('Total late fee and interest,2979');
  expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled();

  expect(fetch).not.toHaveBeenCalled();
  expect(XMLHttpRequest.prototype.open).not.toHaveBeenCalled();
  expect(XMLHttpRequest.prototype.send).not.toHaveBeenCalled();
  expect(navigator.sendBeacon).not.toHaveBeenCalled();
});
