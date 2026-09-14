import BreakdownTable from '../../components/calculator/BreakdownTable';
import { incomeTaxRows } from '../../lib/tax/slab-breakdown';
import { formatCurrency } from '../../lib/utils/format';
import type { AgeCategory, TaxComputation, TaxRegime } from './types';

interface TaxSheetProps {
  regime: TaxRegime;
  age: AgeCategory;
  comp: TaxComputation;
  selected: boolean;
}

export default function TaxSheet({ regime, age, comp, selected }: TaxSheetProps) {
  const label = regime === 'new' ? 'New regime' : 'Old regime';
  const rows = [
    { item: 'Gross total income', amount: formatCurrency(comp.grossIncome) },
    {
      item: 'Less: standard deduction (salary or pension)',
      amount: formatCurrency(-comp.standardDeduction),
    },
    ...(comp.otherDeductions > 0
      ? [{ item: 'Less: deductions (Chapter VI-A)', amount: formatCurrency(-comp.otherDeductions) }]
      : []),
    { item: 'Taxable income', amount: formatCurrency(comp.taxableIncome) },
    ...incomeTaxRows(comp.taxableIncome, regime, age, comp),
    { item: 'Total tax', amount: formatCurrency(comp.totalTax) },
    { item: 'Less: TDS deducted', amount: formatCurrency(-comp.tdsDeducted) },
  ];

  return (
    <div>
      <h3 className="section-title">
        {label}
        {selected ? ' (selected)' : ''}
      </h3>
      <BreakdownTable
        columns={[
          { key: 'item', label: 'Particulars', align: 'left' },
          { key: 'amount', label: 'Amount', align: 'right', mono: true },
        ]}
        rows={rows}
        footer={{ item: 'Net tax payable', amount: formatCurrency(comp.netTaxPayable) }}
        caption={`Tax computation - ${label}`}
      />
    </div>
  );
}
