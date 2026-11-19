// The single implementation of the website-domain rule for `format: "domain"` text fields.
// It only checks the shape (labels, at least one dot, no spaces); the value is sent as typed, trimmed.

export const DOMAIN_ERROR = "Enter a valid website (e.g. yourbusiness.com)";

/** Optional http(s) scheme, dot-separated labels, a letters-only or punycode TLD, then an optional path/query/fragment. */
const DOMAIN =
  /^(?:https?:\/\/)?(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})(?:[/?#]\S*)?$/i;

export function isValidDomain(raw: string): boolean {
  return DOMAIN.test(raw.trim());
}
