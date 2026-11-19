/** The fixed cap for a `kind: "textarea"` field, measured on the trimmed value; text fields keep their 200. */
export const TEXTAREA_MAX_LENGTH = 1000;
const LIMIT_DISPLAY = TEXTAREA_MAX_LENGTH.toLocaleString("en-US");
export const TEXTAREA_TOO_LONG_ERROR = `Use ${LIMIT_DISPLAY} characters or fewer`;
/** Visible lines: room for a short multi-sentence problem description without scrolling. */
export const TEXTAREA_ROWS = 5;

/** The counter under the textarea; counts the trimmed value, exactly what the shared validator caps. */
export function textareaCount(value: string): string {
  return `${value.trim().length.toLocaleString("en-US")} of ${LIMIT_DISPLAY} characters`;
}
