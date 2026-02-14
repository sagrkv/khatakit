export interface EmiInput {
  principal: number;
  annualRate: number;
  tenureMonths: number;
}

export interface EmiResult {
  emi: number;
  totalInterest: number;
  totalPayable: number;
  schedule: AmortizationEntry[];
}

export interface AmortizationEntry {
  year: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
}
