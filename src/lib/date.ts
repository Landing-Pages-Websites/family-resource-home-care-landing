// A `kind: "date"` field holds the native date input's value: a real calendar date
// written exactly YYYY-MM-DD. No range, time zone or reformatting is applied.

export const DATE_ERROR = "Enter a valid date";

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;
const FEBRUARY = 2;
const LEAP_FEBRUARY_DAYS = 29;

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysInMonth(year: number, month: number): number {
  return month === FEBRUARY && isLeapYear(year) ? LEAP_FEBRUARY_DAYS : DAYS_IN_MONTH[month - 1];
}

/** True only for an exact `YYYY-MM-DD` string naming a day that exists (leap years included). */
export function isValidIsoDate(value: string): boolean {
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const [year, month, day] = match.slice(1).map(Number);
  if (month < 1 || month > DAYS_IN_MONTH.length) return false;
  return day >= 1 && day <= daysInMonth(year, month);
}
