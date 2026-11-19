import type { ReactElement } from "react";
import { HEARD_FROM_OPTIONS } from "@/components/Brand";
import type { FieldConfig } from "@/site";
import { ChevronSelect } from "./ChevronSelect";
import { FieldError } from "./FieldError";
import { fieldErrorId, fieldInputId } from "./fieldIds";

interface HeardFromSelectProps {
  formId: string;
  field: FieldConfig;
  value: string;
  error?: string;
  compact: boolean;
  onValue: (field: FieldConfig, raw: string) => void;
}

/** The optional referral question: blank is accepted, so the empty choice stays selectable. */
export function HeardFromSelect({ formId, field, value, error, compact, onValue }: HeardFromSelectProps): ReactElement {
  const inputId = fieldInputId(formId, field.name);
  const errorId = fieldErrorId(inputId);
  const tone = `${value ? "" : "text-[var(--market-placeholder)]"} ${error ? "lp-input-error" : ""}`;
  return (
    <div>
      <label htmlFor={inputId} className="block mb-1.5 text-sm font-bold text-[var(--color-primary)]">
        {field.label} <span className="font-medium text-[var(--color-text-muted)]">(optional)</span>
      </label>
      <ChevronSelect
        id={inputId}
        name={field.name}
        value={value}
        placeholder={HEARD_FROM_OPTIONS[0].label}
        options={field.options ?? []}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`lp-input ${compact ? "lp-input-compact" : ""} appearance-none pr-10 ${tone}`}
        onChange={(event) => onValue(field, event.target.value)}
      />
      <FieldError id={errorId} error={error} />
    </div>
  );
}
