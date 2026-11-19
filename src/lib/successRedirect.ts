/** How long the success message stays up before the browser leaves for the configured site. */
export const SUCCESS_REDIRECT_DELAY_MS = 1000;

// The prefix check is what rejects `https:host` and `https:/host`, which the URL parser would otherwise accept.
const ABSOLUTE_HTTPS = /^https:\/\//i;
const WHITESPACE_OR_CONTROL = /[\s\u0000-\u001f\u007f]/;

export interface SuccessRedirect {
  /** The parsed href: the link and the navigation use this one string. */
  href: string;
  /** For the fallback link's text. */
  host: string;
}

/**
 * The validated destination for `SITE.successRedirectUrl`, or null when the
 * handoff is off. Only an absolute `https://` URL with a host and no
 * credentials passes; `javascript:`, `data:`, `http:`, protocol-relative
 * (`//host`), relative, whitespace-bearing and malformed values are rejected.
 */
export function safeRedirectUrl(raw: string | undefined): SuccessRedirect | null {
  if (!raw || !ABSOLUTE_HTTPS.test(raw) || WHITESPACE_OR_CONTROL.test(raw)) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.username || url.password) return null;
  return { href: url.href, host: url.host };
}

/** Navigates to `href` once, after the fixed delay. Returns the cleanup that cancels a pending navigation. */
export function scheduleRedirect(href: string, navigate: (href: string) => void): () => void {
  const id = setTimeout(() => navigate(href), SUCCESS_REDIRECT_DELAY_MS);
  return () => clearTimeout(id);
}
