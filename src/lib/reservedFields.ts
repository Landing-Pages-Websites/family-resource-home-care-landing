/**
 * Keys a form field must never use, because something else writes them into the
 * same object: `element` was the MegaTag event's top-level form id before fields moved
 * under `formData` (conversionEvents.ts) and is only kept reserved conservatively;
 * the click ids and `user_agent` are written into `form_data` by the lead worker
 * (`withCanonicalClickIds`), which would silently overwrite a field of that name.
 * `event`, `form_id` and `form_provider` are the dataLayer event's own keys.
 * `qualified` and `disqualification_reason` are written by buildLeadPayload (qualification.ts).
 */
export const RESERVED_FIELD_NAMES = [
  "element",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "user_agent",
  "event",
  "form_id",
  "form_provider",
  "qualified",
  "disqualification_reason",
] as const;

export class ReservedFieldNameError extends Error {
  constructor(names: readonly string[]) {
    super(`Field name(s) ${names.join(", ")} are reserved for tracking keys; rename the field in src/site.ts.`);
    this.name = "ReservedFieldNameError";
  }
}

/** Fail closed for builders who skip the tests. */
export function assertNoReservedNames(fields: ReadonlyArray<{ name: string }>): void {
  const reserved: readonly string[] = RESERVED_FIELD_NAMES;
  const hits = fields.map((field) => field.name).filter((name) => reserved.includes(name));
  if (hits.length > 0) throw new ReservedFieldNameError(hits);
}
