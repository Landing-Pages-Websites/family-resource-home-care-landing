// The single implementation of the `kind: "multiselect"` value rule. The form holds the
// selection as one canonical string, "" for none (FormValues stay strings); form_data gets the
// selected option values as a string array, in configured option order. Anything that is
// not exactly a set of configured option values is rejected, never repaired.
import type { FieldConfig, FieldOption } from "@/site";

export const MULTISELECT_REQUIRED_ERROR = "Choose at least one option";
export const MULTISELECT_CHOICE_ERROR = "Choose only from the listed options";

/** `selected` filtered to configured values, in option order; unknown values are dropped, never invented. */
function inOptionOrder(options: readonly FieldOption[], selected: readonly string[]): string[] {
  return options.map((option) => option.value).filter((value) => selected.includes(value));
}

/**
 * The selection in option order, or null when `raw` is not "" or the compact, nonempty JSON array of
 * distinct configured option values. Exact match only: no trimming, case folding, escapes, padding or "[]".
 */
export function parseMultiSelect(options: readonly FieldOption[], raw: string): string[] | null {
  if (raw === "") return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(parsed) || parsed.length === 0 || JSON.stringify(parsed) !== raw) return null;
  if (!parsed.every((item): item is string => typeof item === "string")) return null;
  const ordered = inOptionOrder(options, parsed);
  return ordered.length === parsed.length ? ordered : null;
}

/** The canonical raw form value: "" for no selection, else the compact JSON array in option order. */
export function encodeMultiSelect(options: readonly FieldOption[], selected: readonly string[]): string {
  const ordered = inOptionOrder(options, selected);
  return ordered.length === 0 ? "" : JSON.stringify(ordered);
}

/** The raw value after one box changes; a malformed current value starts from no selection. */
export function toggleMultiSelect(options: readonly FieldOption[], raw: string, value: string, checked: boolean): string {
  const current = parseMultiSelect(options, raw) ?? [];
  const next = checked ? [...current, value] : current.filter((item) => item !== value);
  return encodeMultiSelect(options, next);
}

function groupErrors(field: FieldConfig): string[] {
  const values = (field.options ?? []).map((option) => option.value);
  if (values.length === 0) return [`multiselect "${field.name}" lists no options`];
  return new Set(values).size === values.length ? [] : [`multiselect "${field.name}" repeats an option value`];
}

/**
 * Test-time guard (multiSelect.test.ts runs it on SITE): a group with no options can never be
 * submitted, repeated values toggle together, and a `showWhen` reading a group would compare its raw
 * JSON, so it would silently never show. Not thrown at submit time, where it would lose the lead.
 */
export function multiSelectConfigErrors(fields: readonly FieldConfig[]): string[] {
  const groups = fields.filter((field) => field.kind === "multiselect");
  const names = groups.map((field) => field.name);
  const conditions = fields
    .filter((field) => field.showWhen !== undefined && names.includes(field.showWhen.field))
    .map((field) => `"${field.name}" cannot use multiselect "${field.showWhen?.field}" as its showWhen field`);
  return [...groups.flatMap(groupErrors), ...conditions];
}
