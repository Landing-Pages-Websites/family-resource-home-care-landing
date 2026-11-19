import type { ReactElement } from "react";

interface FieldErrorProps {
  id: string;
  /** "" or undefined renders nothing. */
  error?: string;
}

/** The inline message an invalid field's aria-describedby points at. */
export function FieldError({ id, error }: FieldErrorProps): ReactElement | null {
  return error ? (
    <p id={id} className="lp-field-error">
      {error}
    </p>
  ) : null;
}
