// A field's `showWhen` names another field and one exact value; the field is shown
// only while that field holds exactly that value. Hidden, it is not rendered,
// validated or sent, and its value is cleared. Inert unless declared.
import type { FormValues } from "@/lib/leadPayload";
import type { FieldConfig } from "@/site";

/**
 * True with no `showWhen`; otherwise only while the named, declared field is itself shown and holds
 * exactly `equals`. `seen` breaks a `showWhen` cycle, which never shows its fields.
 */
export function isFieldShown(
  fields: readonly FieldConfig[],
  field: FieldConfig,
  values: Readonly<FormValues>,
  seen: ReadonlySet<string> = new Set(),
): boolean {
  if (!field.showWhen) return true;
  const { field: controlName, equals } = field.showWhen;
  const control = fields.find((candidate) => candidate.name === controlName);
  if (!control || seen.has(control.name) || values[controlName] !== equals) return false;
  return isFieldShown(fields, control, values, new Set(seen).add(field.name));
}

/** The fields to render, in declared order. */
export function shownFields(fields: readonly FieldConfig[], values: Readonly<FormValues>): FieldConfig[] {
  return fields.filter((field) => isFieldShown(fields, field, values));
}

/** Names of the fields whose `showWhen` reads `controlName`. */
export function dependentFieldNames(fields: readonly FieldConfig[], controlName: string): string[] {
  return fields.filter((field) => field.showWhen?.field === controlName).map((field) => field.name);
}

/** `values` with every currently hidden field emptied, so a re-shown field starts blank. */
export function clearHidden(fields: readonly FieldConfig[], values: Readonly<FormValues>): FormValues {
  const cleared: FormValues = { ...values };
  for (const field of fields) if (!isFieldShown(fields, field, values)) cleared[field.name] = "";
  return cleared;
}
