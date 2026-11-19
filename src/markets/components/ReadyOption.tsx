import type { ReactElement } from "react";
import type { FieldConfig, FieldOption } from "@/site";
import { fieldInputId } from "./fieldIds";

interface ReadyOptionProps {
  formId: string;
  field: FieldConfig;
  option: FieldOption;
  checked: boolean;
  error?: string;
  describedBy?: string;
  onValue: (field: FieldConfig, raw: string) => void;
}

const HINTS: Record<string, string> = { yes: "Ready to start", no: "Just researching" };

/** One radio-backed Yes/No box in the template's toggle style. */
export function ReadyOption({ formId, field, option, checked, error, describedBy, onValue }: ReadyOptionProps): ReactElement {
  const border = error ? "border-[var(--market-error)]" : "border-[var(--market-input-border)]";
  return (
    <label className="cursor-pointer">
      <input
        id={fieldInputId(formId, `${field.name}-${option.value}`)}
        name={field.name}
        type="radio"
        value={option.value}
        required
        checked={checked}
        aria-describedby={describedBy}
        className="peer sr-only"
        onChange={(event) => onValue(field, event.target.value)}
      />
      <span
        className={`flex min-h-11 flex-col items-center justify-center rounded-lg border-2 px-3 py-2 text-center text-base font-bold leading-tight text-[var(--color-text)] transition peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary)] peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--color-accent-dark)] hover:border-[var(--color-primary)] ${border}`}
      >
        {option.label}
        <span className="mt-0.5 block text-sm font-medium opacity-80">{HINTS[option.value]}</span>
      </span>
    </label>
  );
}
