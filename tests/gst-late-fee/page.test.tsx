import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Component } from '../../src/tools/gst-late-fee/GstLateFee';

function renderPage() {
  render(
    <MemoryRouter initialEntries={['/gst-late-fee-interest-calculator']}>
      <Component />
    </MemoryRouter>
  );
}

const results = () => screen.getByRole('region', { name: 'Calculation results' });
const change = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });

function fillReturn({ due = '2026-05-20', filed = '2026-06-19', cash = '100000' } = {}) {
  change('Due Date', due);
  change('Actual Filing Date', filed);
  if (cash) change('Tax Paid in Cash', cash);
}

describe('validation', () => {
  it('asks for the due date before showing results', () => {
    renderPage();
    expect(results()).toHaveTextContent('Enter the due date');
  });

  it('explains a GSTR-9 due date outside the supported years', () => {
    renderPage();
    change('Return Type', 'GSTR-9');
    change('Due Date', '2022-12-31');
    const due = screen.getByLabelText('Due Date');
    expect(due).toHaveAttribute('aria-invalid', 'true');
    expect(due).toHaveAccessibleDescription(expect.stringContaining('FY 2022-23'));
    expect(results()).toHaveTextContent('Fix the highlighted field');
  });

  it('asks for turnover in the State for GSTR-9 and checks it against the band', () => {
    renderPage();
    change('Return Type', 'GSTR-9');
    change('Due Date', '2025-12-31');
    change('Actual Filing Date', '2026-03-01');
    expect(results()).toHaveTextContent('Enter turnover in this State');
    change('Turnover in This State', '60000000');
    expect(screen.getByLabelText('Turnover in This State')).toHaveAccessibleDescription(
      expect.stringContaining('₹5 crore')
    );
  });
});

describe('results', () => {
  it('shows the late fee per head and the interest working with dates', () => {
    renderPage();
    fillReturn();
    const output = results();
    expect(screen.getByRole('table', { name: 'Late fee per head' })).toHaveTextContent(
      /CGST₹ 25.*30.*₹ 750.*₹ 1,000.*₹ 750/
    );
    expect(output).toHaveTextContent('Below the maximum');
    const interest = screen.getByRole('table', { name: 'Interest working' });
    expect(interest).toHaveTextContent('21 May 2026');
    expect(interest).toHaveTextContent('19 Jun 2026');
    expect(interest).toHaveTextContent('₹ 1,00,000 × 18% × 30 ÷ 365 = ₹ 1,479.45');
    expect(output).toHaveTextContent('₹ 2,979');
    expect(output).toHaveTextContent('20 May 2029');
  });

  it('explains the cap and no interest on a nil return', () => {
    renderPage();
    fireEvent.click(screen.getByLabelText('Nil Return'));
    fillReturn({ due: '2026-01-20', filed: '2026-04-20', cash: '' });
    const output = results();
    expect(output).toHaveTextContent('Maximum late fee applied');
    expect(output).toHaveTextContent('₹250 per head');
    expect(output).toHaveTextContent('No interest');
    expect(output).toHaveTextContent('₹ 500');
  });

  it('shows nothing payable when filed on the due date', () => {
    renderPage();
    fillReturn({ filed: '2026-05-20' });
    expect(results()).toHaveTextContent('Filed on the due date');
    expect(screen.queryByRole('button', { name: /Download/ })).toBeNull();
  });

  it('warns when the return is past the three-year limit', () => {
    renderPage();
    fillReturn({ due: '2022-01-20', filed: '2026-09-14' });
    expect(results()).toHaveTextContent('Return can no longer be filed');
    expect(results()).toHaveTextContent('20 Jan 2025');
  });
});
