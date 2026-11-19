import type { ReactElement } from "react";
import type { FieldConfig } from "@/site";
import { FieldError } from "./FieldError";
import { fieldErrorId, fieldInputId } from "./fieldIds";
import { ReadyOption } from "./ReadyOption";

interface ReadyToggleProps {
  formId: string;
  field: FieldConfig;
  value: string;
  error?: string;
  onValue: (field: FieldConfig, raw: string) => void;
}

/** The required readiness question. Both answers submit. */
export function ReadyToggle({ formId, field, value, error, onValue }: ReadyToggleProps): ReactElement {
  const errorId = fieldErrorId(fieldInputId(formId, field.name));
  const describedBy = error ? errorId : undefined;
  return (
    <fieldset aria-describedby={describedBy}>
      <legend className="mb-1.5 text-sm font-bold text-[var(--color-primary)] leading-snug">
        {field.label} <span className="text-[var(--market-error)]" aria-hidden="true">*</span>
      </legend>
      <div className="grid grid-cols-2 gap-2.5">
        {(field.options ?? []).map((option) => (
          <ReadyOption key={option.value} {...{ formId, field, option, error, describedBy, onValue }} checked={value === option.value} />
        ))}
      </div>
      <FieldError id={errorId} error={error} />
    </fieldset>
  );
}
