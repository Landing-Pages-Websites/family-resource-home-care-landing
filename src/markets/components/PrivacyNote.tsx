import type { ReactElement } from "react";
import { PRIVACY_NOTE, PRIVACY_URL } from "../content";

/** The form-side privacy line: the customer's own policy, opened in a new tab. */
export function PrivacyNote(): ReactElement {
  return (
    <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)] text-center">
      {PRIVACY_NOTE}{" "}
      <a
        href={PRIVACY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-[var(--color-primary)] underline underline-offset-2 hover:text-[var(--color-primary-dark)]"
      >
        Privacy Policy
      </a>
      .
    </p>
  );
}
