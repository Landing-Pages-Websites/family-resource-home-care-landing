import type { FormValues } from "@/lib/leadPayload";

/** A site's opt-in, synchronous cleanup of the values just before they are sent. */
export type PrepareValues = (values: FormValues) => FormValues;

/**
 * Without a callback the values pass through untouched (the same object). With one,
 * it runs exactly once on a shallow copy, so it can never mutate the form's state.
 */
export function prepareSubmissionValues(values: FormValues, prepare?: PrepareValues): FormValues {
  return prepare ? prepare({ ...values }) : values;
}
