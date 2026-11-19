// The single implementation of the US ZIP rule for `format: "zip"` text fields: exactly
// five ASCII digits, after trimming. The value is sent as that string, so a leading zero
// survives; ZIP+4, spaces inside, other digit scripts and anything longer are rejected.

export const ZIP_ERROR = "Enter a valid 5-digit ZIP code";

/** Un-anchored, like the other input patterns: the browser anchors `<input pattern>` itself. */
export const ZIP_PATTERN = "[0-9]{5}";
const ZIP_REGEX = new RegExp(`^${ZIP_PATTERN}$`);

/** Exact, untrimmed: callers trim a typed value first; a configured allowlist value must already be exact. */
export function isZipCode(value: string): boolean {
  return ZIP_REGEX.test(value);
}
