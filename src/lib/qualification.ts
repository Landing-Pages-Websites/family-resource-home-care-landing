import type { SubmittedFormData } from "@/lib/leadPayload";
import { isZipCode } from "@/lib/zip";
import type { FieldConfig, FieldKind, QualificationRule } from "@/site";

const REASON_SEPARATOR = ",";
const REASON_PATTERN = /^[a-z][a-z0-9_]*$/;
const CHOICE_KINDS: readonly FieldKind[] = ["select", "toggle"];
const RULE_MODES = ["disqualifyingValues", "qualifyingValues"] as const;

type SubmittedValues = Readonly<SubmittedFormData>;

/** Both keys are in RESERVED_FIELD_NAMES, so no field can collide with them. */
export interface QualificationKeys {
  qualified: boolean;
  disqualification_reason: string | null;
}

/**
 * A denylist fails on a listed value, exactly as it always has. An allowlist fails only on a
 * present, nonblank value it does not list: a field left blank, waived or hidden fails nothing.
 */
function ruleFails(rule: QualificationRule, formData: SubmittedValues): boolean {
  const value = formData[rule.field];
  if (typeof value !== "string") return false;
  if (rule.qualifyingValues === undefined) return rule.disqualifyingValues.includes(value);
  return value !== "" && !rule.qualifyingValues.includes(value);
}

/**
 * Derived only from the normalized, configured-field values, so a submitter cannot supply or forge it.
 * Rules unset: no keys (legacy payload). `[]`: configured with nothing to fail, so every lead is qualified.
 * Otherwise every failing rule's reason, in rule order, each once.
 */
export function qualify(rules: readonly QualificationRule[] | undefined, formData: SubmittedValues): QualificationKeys | Record<string, never> {
  if (!rules) return {};
  const failed = rules.filter((rule) => ruleFails(rule, formData));
  const reasons = [...new Set(failed.map((rule) => rule.reason))];
  return { qualified: reasons.length === 0, disqualification_reason: reasons.length === 0 ? null : reasons.join(REASON_SEPARATOR) };
}

/**
 * Which configured values the field's normalized value can equal exactly, or null when it has no such
 * contract: free text is only trimmed, so an exact-match rule on it could silently never match.
 */
function exactValueCheck(field: FieldConfig): { label: string; accepts: (value: string) => boolean } | null {
  if (field.kind === "text" && field.format === "zip") return { label: "non-ZIP", accepts: isZipCode };
  if (!CHOICE_KINDS.includes(field.kind)) return null;
  const options = (field.options ?? []).map((option) => option.value);
  return { label: "non-option", accepts: (value) => options.includes(value) };
}

/** The rule's one value list, or why it has none: zero or both modes set, or a non-list. */
function ruleValues(rule: QualificationRule): readonly unknown[] | string {
  const modes = RULE_MODES.filter((mode) => rule[mode] !== undefined);
  if (modes.length !== 1) return `qualification rule "${rule.reason}" must set exactly one of ${RULE_MODES.join(" or ")}`;
  const values: unknown = rule[modes[0]];
  return Array.isArray(values) ? values : `qualification rule "${rule.reason}" values must be a list`;
}

function ruleErrors(fields: readonly FieldConfig[], rule: QualificationRule): string[] {
  const field = fields.find((candidate) => candidate.name === rule.field);
  if (!field) return [`qualification rule "${rule.reason}" reads unknown field "${rule.field}"`];
  const check = exactValueCheck(field);
  if (!check) return [`qualification rule "${rule.reason}" must read a select or toggle field`];
  const errors: string[] = [];
  if (!REASON_PATTERN.test(rule.reason)) errors.push(`qualification reason "${rule.reason}" must be snake_case`);
  const values = ruleValues(rule);
  if (typeof values === "string") return [...errors, values];
  if (values.length === 0) errors.push(`qualification rule "${rule.reason}" lists no values`);
  const unknown = values.filter((value) => typeof value !== "string" || !check.accepts(value));
  if (unknown.length > 0) errors.push(`qualification rule "${rule.reason}" uses ${check.label} value(s) ${unknown.join(", ")}`);
  return errors;
}

/**
 * Test-time guard (qualification.test.ts runs it on SITE): a typo'd rule would otherwise never match and
 * silently mark every lead qualified. Not thrown at submit time, where it would lose the lead instead.
 */
export function qualificationConfigErrors(
  fields: readonly FieldConfig[],
  rules: readonly QualificationRule[] | undefined,
): string[] {
  return (rules ?? []).flatMap((rule) => ruleErrors(fields, rule));
}
