import type { ReactElement } from "react";
import type { FieldErrors, FormValues } from "@/lib/leadPayload";
import type { FieldConfig } from "@/site";
import { LeadInput } from "./LeadInput";

interface FormInputRowsProps {
  formId: string;
  fields: readonly FieldConfig[];
  values: FormValues;
  errors: FieldErrors;
  compact: boolean;
  onValue: (field: FieldConfig, raw: string) => void;
}

// The template's text-field layout: names paired, email alone, phone and ZIP paired. The roomier
// final form stacks its pairs below 360px so placeholders like "First name *" are never cut; the
// compact hero keeps them paired (its slimmer padding fits) so the submit stays on the first screen.
const INPUT_ROWS: readonly (readonly string[])[] = [["firstName", "lastName"], ["email"], ["phone", "zip"]];
const PAIR_COLUMNS = { compact: "grid-cols-2", standard: "grid-cols-1 min-[360px]:grid-cols-2" } as const;

export function FormInputRows({ formId, fields, values, errors, compact, onValue }: FormInputRowsProps): ReactElement {
  return (
    <>
      {INPUT_ROWS.map((row, index) => (
        <div key={row.join("-")} className={`grid gap-2.5 ${row.length > 1 ? PAIR_COLUMNS[compact ? "compact" : "standard"] : ""} ${index > 0 ? "mt-2.5" : ""}`}>
          {row.map((name) => {
            const field = fields.find((candidate) => candidate.name === name);
            if (!field) return null;
            const error = errors[name];
            return (
              <LeadInput key={name} formId={formId} field={field} value={values[name] ?? ""} error={error} compact={compact} onValue={onValue} />
            );
          })}
        </div>
      ))}
    </>
  );
}
