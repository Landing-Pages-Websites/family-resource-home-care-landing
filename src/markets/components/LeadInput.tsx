import type { InputHTMLAttributes, ReactElement } from "react";
import { EMAIL_ERROR, EMAIL_MAX_LENGTH, EMAIL_PATTERN, PHONE_ERROR, PHONE_PATTERN } from "@/lib/fields";
import { ZIP_ERROR, ZIP_PATTERN } from "@/lib/zip";
import type { FieldConfig } from "@/site";
import { FieldError } from "./FieldError";
import { fieldErrorId, fieldInputId } from "./fieldIds";

interface LeadInputProps {
  formId: string;
  field: FieldConfig;
  value: string;
  error?: string;
  compact: boolean;
  onValue: (field: FieldConfig, raw: string) => void;
}

type InputAttrs = InputHTMLAttributes<HTMLInputElement>;

// lp-starter field attributes (PhoneField, EmailField, TextField): they drive mobile keyboards
// and autofill; the canonical validator, not the browser, decides (the form is noValidate).
function attributesFor(field: FieldConfig): InputAttrs {
  if (field.kind === "tel") {
    return { type: "tel", autoComplete: "tel-national", inputMode: "numeric", pattern: PHONE_PATTERN, title: PHONE_ERROR };
  }
  if (field.kind === "email") {
    return {
      type: "email",
      autoComplete: "email",
      inputMode: "email",
      pattern: EMAIL_PATTERN,
      maxLength: EMAIL_MAX_LENGTH,
      spellCheck: false,
      autoCapitalize: "none",
      title: EMAIL_ERROR,
    };
  }
  if (field.kind === "text" && field.format === "zip") {
    return { type: "text", autoComplete: "postal-code", inputMode: "numeric", pattern: ZIP_PATTERN, title: ZIP_ERROR };
  }
  return { type: "text", autoComplete: field.autoComplete };
}

/** A required single-line field with a screen-reader label, the template placeholder and an inline error. */
export function LeadInput({ formId, field, value, error, compact, onValue }: LeadInputProps): ReactElement {
  const inputId = fieldInputId(formId, field.name);
  const errorId = fieldErrorId(inputId);
  return (
    <div>
      <label htmlFor={inputId} className="sr-only">
        {field.label}
      </label>
      <input
        id={inputId}
        name={field.name}
        required
        {...attributesFor(field)}
        placeholder={field.placeholder}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`lp-input ${compact ? "lp-input-compact" : ""} ${error ? "lp-input-error" : ""}`}
        onChange={(event) => onValue(field, event.target.value)}
      />
      <FieldError id={errorId} error={error} />
    </div>
  );
}
