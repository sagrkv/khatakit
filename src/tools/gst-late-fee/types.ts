export interface GstInput {
  returnType: string;
  dueDate: string;
  filingDate: string;
  taxLiability: number;
  turnoverSlab: 'upto_1_5cr' | '1_5cr_to_5cr' | 'above_5cr';
  isNilReturn: boolean;
}

export interface GstResult {
  daysLate: number;
  lateFeePerDay: number;
  rawLateFee: number;
  cappedLateFee: number;
  lateFeeCapApplied: number;
  cgstLateFee: number;
  sgstLateFee: number;
  interest: number;
  totalPenalty: number;
}
