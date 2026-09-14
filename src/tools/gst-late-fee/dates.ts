const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 86400000;

/** Parses a YYYY-MM-DD string to a UTC timestamp, rejecting impossible dates. */
export function parseIsoDate(value: string): number | null {
  const match = ISO_DATE.exec(value);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]) - 1, Number(match[3])];
  const date = new Date(Date.UTC(year, month, day));
  const valid =
    date.getUTCFullYear() === year && date.getUTCMonth() === month && date.getUTCDate() === day;
  return valid ? date.getTime() : null;
}

export function toIsoDate(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

export function addDays(timestamp: number, days: number): number {
  return timestamp + days * MS_PER_DAY;
}

export function addYears(timestamp: number, years: number): number {
  const date = new Date(timestamp);
  return Date.UTC(date.getUTCFullYear() + years, date.getUTCMonth(), date.getUTCDate());
}

export function daysFrom(from: number, to: number): number {
  return Math.round((to - from) / MS_PER_DAY);
}

/** "20 May 2026", independent of the viewer's time zone. */
export function displayDate(iso: string): string {
  const timestamp = parseIsoDate(iso);
  if (timestamp === null) return iso;
  return new Date(timestamp).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
