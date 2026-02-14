import type { EmiInput, EmiResult, AmortizationEntry } from './types';

export function calculateEmi(input: EmiInput): EmiResult {
  const { principal, annualRate, tenureMonths } = input;

  if (principal <= 0 || tenureMonths <= 0) {
    return { emi: 0, totalInterest: 0, totalPayable: 0, schedule: [] };
  }

  // Handle zero interest rate
  if (annualRate <= 0) {
    const emi = Math.round(principal / tenureMonths);
    return {
      emi,
      totalInterest: 0,
      totalPayable: principal,
      schedule: generateSchedule(principal, 0, tenureMonths, emi),
    };
  }

  const r = annualRate / 12 / 100;
  const n = tenureMonths;
  const factor = Math.pow(1 + r, n);
  const emi = Math.round((principal * r * factor) / (factor - 1));
  const totalPayable = emi * n;
  const totalInterest = totalPayable - principal;

  const schedule = generateSchedule(principal, r, n, emi);

  return { emi, totalInterest, totalPayable, schedule };
}

function generateSchedule(
  principal: number,
  monthlyRate: number,
  tenureMonths: number,
  emi: number
): AmortizationEntry[] {
  const schedule: AmortizationEntry[] = [];
  let balance = principal;
  let yearPrincipal = 0;
  let yearInterest = 0;

  for (let month = 1; month <= tenureMonths; month++) {
    const interestForMonth = Math.round(balance * monthlyRate);
    const principalForMonth = Math.min(emi - interestForMonth, balance);

    yearPrincipal += principalForMonth;
    yearInterest += interestForMonth;
    balance = Math.max(0, balance - principalForMonth);

    // End of year or last month
    if (month % 12 === 0 || month === tenureMonths) {
      schedule.push({
        year: Math.ceil(month / 12),
        principalPaid: yearPrincipal,
        interestPaid: yearInterest,
        balance,
      });
      yearPrincipal = 0;
      yearInterest = 0;
    }
  }

  return schedule;
}
