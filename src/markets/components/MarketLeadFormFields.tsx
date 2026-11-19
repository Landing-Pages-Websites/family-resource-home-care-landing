import type { ReactElement, ReactNode } from "react";
import type { FieldErrors, FormValues } from "@/lib/leadPayload";
import type { FieldConfig } from "@/site";
import { FormInputRows } from "./FormInputRows";
import { HeardFromSelect } from "./HeardFromSelect";
import { ReadyToggle } from "./ReadyToggle";

interface MarketLeadFormFieldsProps {
  formId: string;
  fields: readonly FieldConfig[];
  values: FormValues;
  errors: FieldErrors;
  compact: boolean;
  onValue: (field: FieldConfig, raw: string) => void;
  /** The submit control: before the optional question when compact, after it otherwise. */
  submit: ReactNode;
}

/** The seven fields in template order, with the submit placed per the placement. */
export function MarketLeadFormFields({ formId, fields, values, errors, compact, onValue, submit }: MarketLeadFormFieldsProps): ReactElement {
  const ready = fields.find((field) => field.name === "ready");
  const heardFrom = fields.find((field) => field.name === "heardFrom");
  const gap = compact ? "mt-2.5" : "mt-4";
  const shared = { formId, onValue };
  return (
    <>
      <FormInputRows {...shared} fields={fields} values={values} errors={errors} compact={compact} />
      {ready ? <div className={gap}><ReadyToggle {...shared} field={ready} value={values.ready ?? ""} error={errors.ready} /></div> : null}
      {compact ? submit : null}
      {heardFrom ? (
        <div className={gap}>
          <HeardFromSelect {...shared} field={heardFrom} value={values.heardFrom ?? ""} error={errors.heardFrom} compact={compact} />
        </div>
      ) : null}
      {compact ? null : submit}
    </>
  );
}
