import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Component as Emi } from '../../src/tools/emi/EmiCalculator';
import {
  blockNetwork,
  buttonNamed,
  captureDownloads,
  choose,
  input,
  mockClipboard,
  mount,
  readBlob,
  textOf,
  type,
  type Mounted,
} from '../helpers/page';

let page: Mounted;
beforeEach(() => {
  page = mount(<Emi />);
});
afterEach(() => {
  page.unmount();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const results = () => page.node.querySelector('[aria-label="Calculation results"]');

describe('EMI page before any input', () => {
  it('shows the formula, the RBI worked example, references and related links', () => {
    const guide = textOf(page.node.querySelector('.calculator-guide'));
    expect(guide).toContain('EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)');
    expect(guide).toContain('₹970');
    expect(guide).toContain('₹3,274');
    expect(guide).toContain('₹23,274');
    expect(guide).toContain('₹14,286');
    expect(page.node.querySelector('.calculator-guide a[href*="rbi.org.in"]')).not.toBeNull();
    expect(page.node.querySelector('.related-tools a[href="/#tools"]')).not.toBeNull();
    expect(page.node.querySelector('.empty-state')).not.toBeNull();
  });
});

describe('EMI validation', () => {
  it('explains text that is not a number and shows no result', () => {
    type(page.node, 'loan-amount', '5 lakh');
    const field = input(page.node, 'loan-amount');
    expect(field.getAttribute('aria-invalid')).toBe('true');
    expect(textOf(page.node.querySelector('#loan-amount-error'))).toBe(
      'Enter the loan amount as a number, for example 500000.'
    );
    expect(field.getAttribute('aria-describedby')).toContain('loan-amount-error');
    expect(textOf(results())).toContain('Check the highlighted field');
    expect(textOf(results())).not.toContain('Monthly EMI');
  });

  it('limits the interest rate to 50%', () => {
    type(page.node, 'loan-amount', '500000');
    type(page.node, 'annual-interest-rate', '65');
    expect(textOf(page.node.querySelector('#annual-interest-rate-error'))).toBe(
      'Enter an interest rate of 50% or less.'
    );
  });

  it('asks for whole months', () => {
    type(page.node, 'loan-amount', '500000');
    choose(page.node, 'months');
    type(page.node, 'tenure', '12.5');
    expect(textOf(page.node.querySelector('#tenure-error'))).toBe('Enter the tenure in whole months.');
    type(page.node, 'tenure', '600');
    expect(textOf(page.node.querySelector('#tenure-error'))).toBe(
      'Enter a tenure of 480 months (40 years) or less.'
    );
  });

  it('keeps the loan length when switching between years and months', () => {
    type(page.node, 'tenure', '1.5');
    choose(page.node, 'months');
    expect(input(page.node, 'tenure').value).toBe('18');
  });
});

describe('EMI results', () => {
  function enterRbiExample() {
    type(page.node, 'loan-amount', '20000');
    type(page.node, 'annual-interest-rate', '15');
    choose(page.node, 'months');
    type(page.node, 'tenure', '24');
  }

  it('shows the EMI, the chart summary and the year-wise workings', () => {
    enterRbiExample();
    const text = textOf(results());
    expect(text).toContain('₹970');
    expect(text).toContain('₹3,274');
    expect(text).toContain('₹23,274');
    expect(page.node.querySelector('.year-chart figcaption')).not.toBeNull();
    expect(page.node.querySelectorAll('.year-chart-column')).toHaveLength(2);
  });

  it('downloads the monthly schedule and copies it without any network request', async () => {
    const network = blockNetwork();
    const files = captureDownloads();
    const writeText = mockClipboard();
    enterRbiExample();

    act(() => buttonNamed(page.node, 'Download CSV').click());
    expect(files).toHaveLength(1);
    expect(files[0].name).toBe('emi-schedule-20000-at-15pct-24-months.csv');
    const lines = (await readBlob(files[0].blob)).trim().split('\r\n');
    expect(lines[0]).toBe('Month,Opening balance,EMI,Principal,Interest,Closing balance');
    expect(lines).toHaveLength(25);
    expect(lines[1]).toBe('1,20000,970,720,250,19280');
    expect(lines[24]).toBe('24,958,970,958,12,0');

    await act(async () => buttonNamed(page.node, 'Copy').click());
    expect(writeText.mock.calls[0][0]).toContain('Monthly EMI: ₹ 970');
    network.expectNoRequests();
  });
});
