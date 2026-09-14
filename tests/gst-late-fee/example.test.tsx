import '@testing-library/jest-dom/vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { calculateGstPenalty } from '../../src/tools/gst-late-fee/calc';
import { CAP_EXAMPLE, WORKED_EXAMPLE } from '../../src/tools/gst-late-fee/example';
import { Component } from '../../src/tools/gst-late-fee/GstLateFee';
import { formatCurrency } from '../../src/lib/utils/format';

describe('worked examples match the calculator', () => {
  it('regular GSTR-3B example', () => {
    const result = calculateGstPenalty(WORKED_EXAMPLE.input)!;
    expect(result.daysLate).toBe(WORKED_EXAMPLE.daysLate);
    expect(result.rawLateFeePerHead).toBe(WORKED_EXAMPLE.feePerHead);
    expect(result.capPerHead).toBe(WORKED_EXAMPLE.capPerHead);
    expect(result.cappedLateFee).toBe(WORKED_EXAMPLE.lateFee);
    expect(result.interestExact).toBe(WORKED_EXAMPLE.interestExact);
    expect(result.interest).toBe(WORKED_EXAMPLE.interest);
    expect(result.totalPenalty).toBe(WORKED_EXAMPLE.total);
  });

  it('nil return cap example', () => {
    const result = calculateGstPenalty(CAP_EXAMPLE.input)!;
    expect(result.daysLate).toBe(CAP_EXAMPLE.daysLate);
    expect(result.rawLateFeePerHead).toBe(CAP_EXAMPLE.feePerHead);
    expect(result.capPerHead).toBe(CAP_EXAMPLE.capPerHead);
    expect(result.cappedLateFee).toBe(CAP_EXAMPLE.lateFee);
    expect(result.totalPenalty).toBe(CAP_EXAMPLE.lateFee);
  });
});

describe('page content without any input', () => {
  const renderPage = () =>
    render(
      <MemoryRouter initialEntries={['/gst-late-fee-interest-calculator']}>
        <Component />
      </MemoryRouter>
    );

  it('shows the worked example with the calculator figures', () => {
    renderPage();
    const example = screen.getByRole('region', { name: 'Worked example' });
    const text = example.textContent!;
    expect(text).toContain('20 May 2026');
    expect(text).toContain('19 Jun 2026');
    expect(text).toContain(`${WORKED_EXAMPLE.daysLate} days`);
    expect(text).toContain(formatCurrency(WORKED_EXAMPLE.feePerHead));
    expect(text).toContain(formatCurrency(WORKED_EXAMPLE.lateFee));
    expect(text).toContain('₹ 1,479.45');
    expect(text).toContain(formatCurrency(WORKED_EXAMPLE.interest));
    expect(text).toContain(formatCurrency(WORKED_EXAMPLE.total));
    expect(text).toContain(formatCurrency(CAP_EXAMPLE.lateFee));
  });

  it('shows the formula, rate table, edge cases and supported period', () => {
    renderPage();
    const formula = screen.getByRole('region', { name: 'How the late fee and interest are calculated' });
    expect(formula).toHaveTextContent('÷ 365');
    const rates = within(formula).getByRole('table');
    expect(rates).toHaveTextContent('0.04% of turnover in the State');
    expect(rates).toHaveTextContent('₹ 10,000');
    const edges = screen.getByRole('region', { name: 'Edge cases' });
    for (const phrase of ['Nil return', 'on the due date', 'Turnover in This State', 'electronic cash ledger', 'three years']) {
      expect(edges).toHaveTextContent(phrase);
    }
    expect(screen.getByRole('region', { name: 'Supported period and assumptions' })).toHaveTextContent(
      'June 2021'
    );
  });

  it('links to the official sources and related calculators', () => {
    renderPage();
    const refs = screen.getByRole('region', { name: 'References' });
    const hrefs = within(refs)
      .getAllByRole('link')
      .map((link) => link.getAttribute('href'));
    expect(hrefs).toContain(
      'https://cbic-gst.gov.in/pdf/central-tax/notfctn-19-central-tax-english-2021.pdf'
    );
    expect(hrefs).toContain('https://gstcouncil.gov.in/sites/default/files/2024-05/07_eng.pdf');
    const related = screen.getByRole('region', { name: 'Related calculators' });
    expect(within(related).getByRole('link', { name: /Advance Tax Calculator/ })).toHaveAttribute(
      'href',
      '/advance-tax-calculator'
    );
  });
});
