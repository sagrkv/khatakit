/** Within one state or union territory (CGST plus SGST or UTGST), or between states (IGST). */
export type SupplyType = 'intra' | 'inter';

/** Whether the amount entered already includes GST. */
export type PriceType = 'exclusive' | 'inclusive';

export interface BillLineInput {
  id: number;
  description: string;
  /** Amount entered, in paise. */
  amountPaise: number;
  priceType: PriceType;
  /** Total GST rate in thousandths of a percent: 18% is 18000, 0.25% is 250. */
  rateMilli: number;
}

export interface BillInput {
  supplyType: SupplyType;
  roundToRupee: boolean;
  lines: BillLineInput[];
}

/** Amounts in paise. For intra-state supplies SGST also stands for UTGST. */
export interface TaxHeads {
  taxablePaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  taxPaise: number;
  /** Paise left over on an inclusive price that no paise taxable value reaches exactly. */
  roundOffPaise: number;
  totalPaise: number;
}

export interface LineResult extends TaxHeads {
  id: number;
  description: string;
  priceType: PriceType;
  rateMilli: number;
  amountPaise: number;
}

export interface RateSummary extends TaxHeads {
  rateMilli: number;
}

export interface BillResult extends TaxHeads {
  supplyType: SupplyType;
  lines: LineResult[];
  byRate: RateSummary[];
  /** Sum of the round-off on inclusive lines. */
  lineRoundOffPaise: number;
  /** Sum of the line totals, before rounding to the rupee. */
  subtotalPaise: number;
  /** Added to reach the nearest rupee; 0 when rounding is off. */
  rupeeRoundOffPaise: number;
  /** Total tax as a percentage of the taxable value; null when the taxable value is 0. */
  effectiveRatePercent: number | null;
}
