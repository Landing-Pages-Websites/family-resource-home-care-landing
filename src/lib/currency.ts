// The single implementation of the whole-US-dollar rule for `kind: "currency"` fields.
// What this accepts is exactly the JSON number sent as `form_data`, so it never
// strips or repairs input: anything not unambiguously one amount is rejected.

export const CURRENCY_ERROR = "Enter a whole-dollar amount, like 245000 or 245,000";

/** Optional leading $, then plain digits or correctly grouped thousands; no leading zeros, sign, decimals or exponent. */
const WHOLE_DOLLARS = /^\$?(0|[1-9]\d*|[1-9]\d{0,2}(?:,\d{3})+)$/;

/** The amount as a nonnegative safe integer, or null when the input is not exactly one whole-dollar amount. */
export function parseWholeDollars(raw: string): number | null {
  const match = WHOLE_DOLLARS.exec(raw.trim());
  if (!match) return null;
  const amount = Number(match[1].replaceAll(",", ""));
  return Number.isSafeInteger(amount) ? amount : null;
}
