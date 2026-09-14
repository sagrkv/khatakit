import BreakdownTable from '../../components/calculator/BreakdownTable';
import CopyButton from '../../components/calculator/CopyButton';
import ResultCard from '../../components/calculator/ResultCard';
import ToolIcon from '../../components/ui/ToolIcon';
import { billToCsv, billToText } from './csv';
import { formatPaise, formatRate, formatRupees, formatSignedPaise } from './format';
import GstWorkings from './GstWorkings';
import type { BillResult, TaxHeads } from './types';

interface Props {
  result: BillResult;
  roundToRupee: boolean;
}

function downloadCsv(result: BillResult) {
  // The byte order mark lets spreadsheet apps read the file as UTF-8.
  const blob = new Blob(['\uFEFF', billToCsv(result)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gst-bill.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

const money = (key: string, label: string) => ({ key, label, align: 'right' as const, mono: true });

export default function GstResults({ result, roundToRupee }: Props) {
  const intra = result.supplyType === 'intra';
  const headColumns = intra ? [money('cgst', 'CGST'), money('sgst', 'SGST')] : [money('igst', 'IGST')];
  const headCells = (heads: TaxHeads): Record<string, string> =>
    intra
      ? { cgst: formatPaise(heads.cgstPaise), sgst: formatPaise(heads.sgstPaise) }
      : { igst: formatPaise(heads.igstPaise) };
  const hasLineRoundOff = result.lines.some((line) => line.roundOffPaise !== 0);
  const roundOffColumn = hasLineRoundOff ? [money('roundOff', 'Round-off')] : [];

  const lineRows = result.lines.map((line, index) => ({
    line: line.description ? `${index + 1}. ${line.description}` : `Line ${index + 1}`,
    rate: formatRate(line.rateMilli),
    taxable: formatPaise(line.taxablePaise),
    ...headCells(line),
    roundOff: formatSignedPaise(line.roundOffPaise),
    total: formatPaise(line.totalPaise),
  }));

  const rateRows = result.byRate.map((rate) => ({
    rate: formatRate(rate.rateMilli),
    taxable: formatPaise(rate.taxablePaise),
    ...headCells(rate),
    roundOff: formatSignedPaise(rate.roundOffPaise),
    total: formatPaise(rate.totalPaise),
  }));

  const billRows = [
    { item: 'Taxable value', amount: formatPaise(result.taxablePaise) },
    ...(intra
      ? [
          { item: 'CGST', amount: formatPaise(result.cgstPaise) },
          { item: 'SGST', amount: formatPaise(result.sgstPaise) },
        ]
      : [{ item: 'IGST', amount: formatPaise(result.igstPaise) }]),
    ...(hasLineRoundOff
      ? [{ item: 'Round-off on lines including GST', amount: formatSignedPaise(result.lineRoundOffPaise) }]
      : []),
    ...(roundToRupee
      ? [{ item: 'Round-off to nearest rupee', amount: formatSignedPaise(result.rupeeRoundOffPaise) }]
      : []),
  ];

  const roundOff = result.roundOffPaise;
  const check = [
    `${formatPaise(result.taxablePaise)} taxable`,
    `+ ${formatPaise(result.taxPaise)} GST`,
    ...(roundOff === 0 ? [] : [`${roundOff > 0 ? '+' : '-'} ${formatPaise(Math.abs(roundOff))} round-off`]),
    `= ${formatPaise(result.totalPaise)}`,
  ].join(' ');

  return (
    <div className="result-stack">
      <div className="result-grid result-grid-three">
        <ResultCard label="Taxable value" value={formatRupees(result.taxablePaise)} variant="neutral" />
        <ResultCard
          label="Total GST"
          value={formatRupees(result.taxPaise)}
          variant="neutral"
          subtext={
            result.effectiveRatePercent === null
              ? 'No taxable value'
              : `${result.effectiveRatePercent.toFixed(2)}% of the taxable value`
          }
        />
        <ResultCard
          label="Bill total"
          value={formatRupees(result.totalPaise)}
          subtext={roundOff === 0 ? undefined : `Includes round-off of ${formatSignedPaise(roundOff)}`}
        />
      </div>

      <div>
        <div className="section-heading">
          <h3 className="section-title">Bill totals</h3>
          <div className="result-actions">
            <CopyButton text={billToText(result)} label="Copy" />
            <button type="button" className="copy-button" onClick={() => downloadCsv(result)}>
              <ToolIcon name="download" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>
        <BreakdownTable
          caption="Bill totals"
          columns={[
            { key: 'item', label: 'Component', align: 'left' },
            money('amount', 'Amount (₹)'),
          ]}
          rows={billRows}
          footer={{ item: 'Bill total', amount: formatPaise(result.totalPaise) }}
        />
        <p className="bill-check">{check}</p>
      </div>

      <div>
        <h3 className="section-title">Lines</h3>
        <BreakdownTable
          caption="Tax on each line, in rupees"
          columns={[
            { key: 'line', label: 'Line', align: 'left' },
            { key: 'rate', label: 'Rate', align: 'right', mono: true },
            money('taxable', 'Taxable value'),
            ...headColumns,
            ...roundOffColumn,
            money('total', 'Line total'),
          ]}
          rows={lineRows}
          footer={{
            line: 'Total',
            rate: '',
            taxable: formatPaise(result.taxablePaise),
            ...headCells(result),
            roundOff: formatSignedPaise(result.lineRoundOffPaise),
            total: formatPaise(result.subtotalPaise),
          }}
        />
      </div>

      <div>
        <h3 className="section-title">By rate</h3>
        <BreakdownTable
          caption="Tax by rate, in rupees"
          columns={[
            { key: 'rate', label: 'Rate', align: 'left' },
            money('taxable', 'Taxable value'),
            ...headColumns,
            ...roundOffColumn,
            money('total', 'Total'),
          ]}
          rows={rateRows}
        />
      </div>

      <GstWorkings result={result} roundToRupee={roundToRupee} />
    </div>
  );
}
