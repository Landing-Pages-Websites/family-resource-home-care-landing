const SEND_FAILED = "We could not send your request.";

/**
 * The failed-submit alert copy as [prose, phoneRun]: prose may wrap, the phone plus its period must not.
 * The call fallback is offered only when the site has a phone to call (phoneRun is "" otherwise).
 */
export function formErrorParts(phoneDisplay: string): readonly [prose: string, phoneRun: string] {
  if (phoneDisplay.trim() === "") return [`${SEND_FAILED} Please try again.`, ""];
  return [`${SEND_FAILED} Please try again, or call `, `${phoneDisplay}.`];
}
