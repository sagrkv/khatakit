/** Calendar helpers on ISO date strings (yyyy-mm-dd), free of time zones. */

const MS_PER_DAY = 86_400_000;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const pad = (value: number) => String(value).padStart(2, '0');

/** Builds an ISO date, or null when the parts are not a real date. */
export function isoFromParts(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return `${year}-${pad(month)}-${pad(day)}`;
}

function parts(iso: string): [number, number, number] {
  const [year, month, day] = iso.split('-').map(Number);
  return [year, month, day];
}

const toDayNumber = (iso: string) => {
  const [year, month, day] = parts(iso);
  return Date.UTC(year, month - 1, day) / MS_PER_DAY;
};

function fromDayNumber(dayNumber: number): string {
  const date = new Date(dayNumber * MS_PER_DAY);
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export const addDays = (iso: string, days: number) => fromDayNumber(toDayNumber(iso) + days);

export const daysBetween = (from: string, to: string) => toDayNumber(to) - toDayNumber(from);

/** Month labels ("Apr 2026") for every calendar month from `from` to `to`, inclusive. */
export function monthsSpanned(from: string, to: string): string[] {
  const [startYear, startMonth] = parts(from);
  const [endYear, endMonth] = parts(to);
  const labels: string[] = [];
  for (let index = startYear * 12 + startMonth - 1; index <= endYear * 12 + endMonth - 1; index++) {
    labels.push(`${MONTHS[index % 12]} ${Math.floor(index / 12)}`);
  }
  return labels;
}

/** 30 Apr 2026 */
export function formatDisplayDate(iso: string): string {
  const [year, month, day] = parts(iso);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/** 30/04/2026 */
export function formatSlashDate(iso: string): string {
  const [year, month, day] = parts(iso);
  return `${pad(day)}/${pad(month)}/${year}`;
}

/** "Jun, Jul, Aug 2026" - month labels grouped by year. */
export function compactMonths(labels: string[]): string {
  const groups: { year: string; months: string[] }[] = [];
  for (const label of labels) {
    const [month, year] = label.split(' ');
    const last = groups.at(-1);
    if (last && last.year === year) last.months.push(month);
    else groups.push({ year, months: [month] });
  }
  return groups.map((group) => `${group.months.join(', ')} ${group.year}`).join('; ');
}
