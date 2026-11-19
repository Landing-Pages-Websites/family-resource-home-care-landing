// A text field's `waivedBy` names a checkbox field; while that box is checked the
// field is cleared, disabled, skipped by validation and sent as "". Inert unless declared.
import type { FormValues } from "@/lib/leadPayload";
import type { FieldConfig } from "@/site";

/** The one value a checked checkbox field holds and sends; unchecked is "" and its key is omitted. */
export const CHECKBOX_CHECKED_VALUE = "yes";

/** True while the checkbox named by `field.waivedBy` is checked; a name that is not a declared checkbox never waives. */
export function isWaived(fields: readonly FieldConfig[], field: FieldConfig, values: Readonly<FormValues>): boolean {
  if (field.kind !== "text" || !field.waivedBy) return false;
  const waiver = fields.find((candidate) => candidate.name === field.waivedBy);
  return waiver?.kind === "checkbox" && values[waiver.name] === CHECKBOX_CHECKED_VALUE;
}

/** Names of the fields a checkbox waives. */
export function waivedFieldNames(fields: readonly FieldConfig[], checkboxName: string): string[] {
  return fields.filter((field) => field.kind === "text" && field.waivedBy === checkboxName).map((field) => field.name);
}

/** `values` with every currently waived field emptied. */
export function clearWaived(fields: readonly FieldConfig[], values: Readonly<FormValues>): FormValues {
  const cleared: FormValues = { ...values };
  for (const field of fields) if (isWaived(fields, field, values)) cleared[field.name] = "";
  return cleared;
}
