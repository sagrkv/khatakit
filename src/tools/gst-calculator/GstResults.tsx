import BreakdownTable from '../../components/calculator/BreakdownTable';
import CopyButton from '../../components/calculator/CopyButton';
import DownloadButton from '../../components/calculator/DownloadButton';
import ResultCard from '../../components/calculator/ResultCard';
import { billToCsv, billToText } from './csv';
import { formatPaise, formatRate, formatRupees, formatSignedPaise } from './format';
import GstWorkings from './GstWorkings';
import type { BillResult, TaxHeads } from './types';

interface Props {
  result: BillResult;
  roundToRupee: boolean;
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
  const roundOff = result.roundOffPaise;

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

  const check = [
    `${formatPaise(result.taxablePaise)} taxable`,
    `+ ${formatPaise(result.taxPaise)} GST`,
    ...(roundOff === 0 ? [] : [`${roundOff > 0 ? '+' : '-'} ${formatPaise(Math.abs(roundOff))} round-off`]),
    `= ${formatPaise(result.totalPaise)}`,
  ].join(' ');

  return (
    <div className="result-stack">
      <div className="result-grid result-grid-three">
        <ResultCard
          label="Bill total"
          value={formatRupees(result.totalPaise)}
          subtext={roundOff === 0 ? undefined : `Includes round-off of ${formatSignedPaise(roundOff)}`}
        />
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
      </div>

      <div>
        <div className="section-heading">
          <h3 className="section-title">Bill totals</h3>
          <div className="result-actions">
            <CopyButton text={billToText(result)} label="Copy" />
            <DownloadButton
              label="Download CSV"
              filename="gst-bill.csv"
              getContent={() => billToCsv(result)}
            />
          </div>
        </div>
        <BreakdownTable
          caption="Bill totals"
          columns={[{ key: 'item', label: 'Component', align: 'left' }, money('amount', 'Amount (₹)')]}
          rows={billRows}
          footer={{ item: 'Bill total', amount: formatPaise(result.totalPaise) }}
        />
        <p className="bill-check">{check}</p>
      </div>

      {result.lines.length > 1 && (
        <div className="table-nowrap-head">
          <h3 className="section-title">Lines</h3>
          <BreakdownTable
            caption="Tax on each line, in rupees"
            columns={[
              { key: 'line', label: 'Line', align: 'left' },
              money('taxable', 'Taxable value'),
              ...headColumns,
              money('total', 'Line total'),
            ]}
            rows={result.lines.map((line, index) => ({
              line: `${line.description || `Line ${index + 1}`}, ${formatRate(line.rateMilli)}`,
              taxable: formatPaise(line.taxablePaise),
              ...headCells(line),
              total: formatPaise(line.totalPaise),
            }))}
            footer={{
              line: 'Total',
              taxable: formatPaise(result.taxablePaise),
              ...headCells(result),
              total: formatPaise(result.subtotalPaise),
            }}
          />
          {hasLineRoundOff && (
            <p className="field-help">
              Line totals include the round-off on lines including GST. The workings show it for
              each line.
            </p>
          )}
        </div>
      )}

      {result.byRate.length > 1 && (
        <div className="table-nowrap-head">
          <h3 className="section-title">By rate</h3>
          <BreakdownTable
            caption="Tax by rate, in rupees"
            columns={[
              { key: 'rate', label: 'Rate', align: 'left' },
              money('taxable', 'Taxable value'),
              ...headColumns,
              money('total', 'Total'),
            ]}
            rows={result.byRate.map((rate) => ({
              rate: formatRate(rate.rateMilli),
              taxable: formatPaise(rate.taxablePaise),
              ...headCells(rate),
              total: formatPaise(rate.totalPaise),
            }))}
          />
        </div>
      )}

      <GstWorkings result={result} roundToRupee={roundToRupee} />
    </div>
  );
}
