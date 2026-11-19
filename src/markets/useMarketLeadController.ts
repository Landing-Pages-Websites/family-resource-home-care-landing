"use client";

// Provenance: lp-starter e8e8d9b src/hooks/useLeadFormController.ts. Same validate-first gate,
// direct send (never a native submit), keydown Enter boundary, onSubmit backstop and shared
// synchronous lock. It differs only in sending through useMarketLeadForm (territory keys),
// firing the qualified-only signal after an accepted ready lead, and having no SMS opt-in.

import { useRef, type FormEvent, type KeyboardEvent, type RefObject } from "react";
import { useLeadFormState, type LeadFormFlow } from "@/hooks/useLeadFormFlow";
import { clearHidden, dependentFieldNames } from "@/lib/conditions";
import { fireConversionEvents } from "@/lib/conversionEvents";
import { formatPhone } from "@/lib/fields";
import { runSubmission, type SubmissionStatus } from "@/lib/managedSubmit";
import { validateLeadValues, type FieldErrors, type FormValues, type SubmittedFormData } from "@/lib/leadPayload";
import { prepareSubmissionValues, type PrepareValues } from "@/lib/prepareSubmissionValues";
import { clearWaived, waivedFieldNames } from "@/lib/waivers";
import type { FieldConfig, LeadFormProfile } from "@/site";
import { fireQualifiedLeadEvents } from "./formEvents";
import type { Market } from "./markets";
import { useMarketLeadForm } from "./useMarketLeadForm";

export type FormStatus = "idle" | SubmissionStatus;

interface MarketLeadController {
  formRef: RefObject<HTMLFormElement | null>;
  fields: readonly FieldConfig[];
  values: FormValues;
  errors: FieldErrors;
  status: FormStatus;
  setValue: (field: FieldConfig, raw: string) => void;
  handleClick: () => void;
  /** `<form onKeyDown>`: stops implicit submission before the browser dispatches a native submit. */
  handleKeyDown: (event: KeyboardEvent<HTMLFormElement>) => void;
  /** `<form onSubmit>` backstop only: the optimizer has already seen any native submit that reaches it. */
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

// Enter on these input types activates them (a click), never an implicit submit.
const BUTTON_INPUT_TYPES: ReadonlySet<string> = new Set(["button", "submit", "reset", "image"]);
// Safari ends composition before the committing Enter keydown, which then reports only this keyCode.
const IME_PROCESS_KEY_CODE = 229;

type FlowState = ReturnType<typeof useLeadFormState>["state"];

interface SendContext {
  formId: string;
  market: Market;
  state: FlowState;
  profile: LeadFormProfile;
  form: HTMLFormElement | null;
  send: (values: FormValues) => Promise<SubmittedFormData>;
  prepare?: PrepareValues;
  /** Called once a send actually starts (validation passed and the shared lock was free). */
  onSendStart?: () => void;
}

/** Both placements on a market page share `flow`, so one inquiry, one lock and one success state. */
export function useMarketLeadController(formId: string, market: Market, flow: LeadFormFlow, onSendStart?: () => void): MarketLeadController {
  const { state, snapshot, profile, prepareValues: prepare, assertConfiguration } = useLeadFormState(undefined, undefined, flow);
  const formRef = useRef<HTMLFormElement>(null);
  const { submit } = useMarketLeadForm(market, profile);
  const setValue = (field: FieldConfig, raw: string): void => {
    assertConfiguration();
    state.update(valuePatch(profile.fields, state.getSnapshot(), field, raw));
  };
  const handleClick = (): void => {
    assertConfiguration();
    validateThenSend({ formId, market, state, profile, form: formRef.current, send: submit, prepare, onSendStart });
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>): void => {
    if (preventImplicitSubmit(event)) handleClick();
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    handleClick();
  };
  const { values, errors, status } = snapshot;
  return { formRef, fields: profile.fields, values, errors, status, setValue, handleClick, handleKeyDown, handleSubmit };
}

/** The new value (phones formatted as typed) and cleared errors for it and any field it waives or hides. */
function valuePatch(
  fields: readonly FieldConfig[],
  current: { values: FormValues; errors: FieldErrors },
  field: FieldConfig,
  raw: string,
): { values: FormValues; errors: FieldErrors } {
  const value = field.kind === "tel" ? formatPhone(raw) : raw;
  const affected = [field.name, ...waivedFieldNames(fields, field.name), ...dependentFieldNames(fields, field.name)];
  return {
    values: clearHidden(fields, clearWaived(fields, { ...current.values, [field.name]: value })),
    errors: { ...current.errors, ...Object.fromEntries(affected.map((name) => [name, ""])) },
  };
}

// Validate once, then send directly: the form never dispatches a native submit the optimizer would count.
function validateThenSend({ formId, market, state, profile, form, send, prepare, onSendStart }: SendContext): void {
  if (state.lock.current) return;
  const current = state.getSnapshot();
  const found = validateLeadValues(profile.fields, current.values);
  state.update({ errors: found });
  const firstBad = profile.fields.find((field) => found[field.name]);
  if (firstBad) return focusField(form, firstBad.name);
  onSendStart?.();
  void runSubmission(state.lock, {
    send: () => send(prepareSubmissionValues(current.values, prepare)),
    onAccepted: (sent) => {
      fireConversionEvents(formId, sent);
      fireQualifiedLeadEvents(formId, sent, market, profile.qualificationRules);
    },
    onStatus: (next) => state.update({ status: next }),
  });
}

/** Textareas (newline), selects, buttons, links, IME composition and an Enter a widget already consumed keep their own behavior. */
function preventImplicitSubmit(event: KeyboardEvent<HTMLFormElement>): boolean {
  if (event.key !== "Enter" || event.defaultPrevented) return false;
  if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === IME_PROCESS_KEY_CODE) return false;
  const { target } = event;
  if (!(target instanceof HTMLInputElement) || BUTTON_INPUT_TYPES.has(target.type)) return false;
  event.preventDefault();
  return true;
}

function focusField(form: HTMLFormElement | null, name: string): void {
  form?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();
}
