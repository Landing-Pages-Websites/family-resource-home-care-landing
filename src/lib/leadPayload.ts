import type { Attribution } from "@/lib/attribution";
import { isFieldShown } from "@/lib/conditions";
import { CURRENCY_ERROR, parseWholeDollars } from "@/lib/currency";
import { DATE_ERROR, isValidIsoDate } from "@/lib/date";
import { DOMAIN_ERROR, isValidDomain } from "@/lib/domain";
import { EMAIL_ERROR, PHONE_ERROR, isValidEmail, normalizeEmail, phoneDigits, isValidPhone } from "@/lib/fields";
import { MULTISELECT_CHOICE_ERROR, MULTISELECT_REQUIRED_ERROR, parseMultiSelect } from "@/lib/multiSelect";
import { qualify } from "@/lib/qualification";
import { assertNoReservedNames } from "@/lib/reservedFields";
import { TEXTAREA_MAX_LENGTH, TEXTAREA_TOO_LONG_ERROR } from "@/lib/textarea";
import { CHECKBOX_CHECKED_VALUE, isWaived } from "@/lib/waivers";
import { ZIP_ERROR, isZipCode } from "@/lib/zip";
import { LEAD_ENDPOINT, type FieldConfig, type SiteConfig } from "@/site";

/** Raw input as typed, one string per field; the form and the validator only ever see these. */
export type FormValues = Record<string, string>;
export type FieldErrors = Record<string, string>;
/**
 * A normalized submitted value: a string for every kind, except an accepted currency amount, a number,
 * and a multiselect's selected option values, a string array.
 */
export type SubmittedValue = string | number | readonly string[];
/** The validated, normalized fields that are sent as `form_data` and to conversion events. */
export type SubmittedFormData = Record<string, SubmittedValue>;
/** The submitted fields, plus `qualified` / `disqualification_reason` when the site configures qualification rules. */
export type LeadFormData = Record<string, SubmittedValue | boolean | null>;

export const REQUIRED_ERROR = "This field is required";
export const CHOICE_ERROR = "Choose one of the options";
export const TEXT_MAX_LENGTH = 200;
export const TEXT_TOO_LONG_ERROR = `Use ${TEXT_MAX_LENGTH} characters or fewer`;
/** The inline error for a text field's declared `minLength`. */
export function textTooShortError(minLength: number): string {
  return `Use at least ${minLength} characters`;
}
export const BLOCKED_EMAIL_DOMAIN_ERROR = "Use a different email address";

export interface PageContext {
  url: string;
  referrerUrl: string | null;
  sessionId: string;
  visitorId: string;
}

export interface LeadPayload extends Attribution {
  customer_id: string;
  site_id: string;
  source_provider: string;
  form_key?: string;
  form_data: LeadFormData;
  url: string;
  referrer_url: string | null;
  /** The worker's follow-up CRM path reads `referrer`; `referrer_url` is the lead column. */
  referrer: string | null;
  session_id: string;
  visitor_id: string;
}

export class LeadValidationError extends Error {
  readonly errors: FieldErrors;

  constructor(errors: FieldErrors) {
    super(Object.values(errors).join("; "));
    this.name = "LeadValidationError";
    this.errors = errors;
  }
}

function validateChoice(field: FieldConfig, value: string): string | null {
  const allowed = (field.options ?? []).map((option) => option.value);
  return allowed.includes(value) ? null : CHOICE_ERROR;
}

type TextFieldConfig = Extract<FieldConfig, { kind: "text" }>;

/** A ZIP of any wrong length or content gets the one ZIP error, never the generic length error. */
function validateText(field: TextFieldConfig, value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return REQUIRED_ERROR;
  if (field.format === "zip") return isZipCode(trimmed) ? null : ZIP_ERROR;
  if (trimmed.length > TEXT_MAX_LENGTH) return TEXT_TOO_LONG_ERROR;
  if (field.minLength !== undefined && trimmed.length < field.minLength) return textTooShortError(field.minLength);
  return field.format === "domain" && !isValidDomain(trimmed) ? DOMAIN_ERROR : null;
}

/** Newlines are content: only the ends are trimmed, and inner line breaks count toward the cap. */
function validateTextarea(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return REQUIRED_ERROR;
  return trimmed.length > TEXTAREA_MAX_LENGTH ? TEXTAREA_TOO_LONG_ERROR : null;
}

/** Blank (unchecked) is handled as an optional blank before this; anything else must be the checked value. */
function validateCheckbox(value: string): string | null {
  return value === CHECKBOX_CHECKED_VALUE ? null : CHOICE_ERROR;
}

type EmailFieldConfig = Extract<FieldConfig, { kind: "email" }>;

function emailDomain(email: string): string {
  const normalized = normalizeEmail(email);
  return normalized.slice(normalized.indexOf("@") + 1);
}

/**
 * True when the domain is, or ends in, a configured suffix (`.gov` never matches `example.gov.com`),
 * or starts with a configured prefix (`yahoo.` matches `yahoo.co.uk`, never `myyahoo.com`).
 */
export function hasBlockedEmailDomain(email: string, suffixes: readonly string[] = [], prefixes: readonly string[] = []): boolean {
  const domain = emailDomain(email);
  const bySuffix = suffixes.some((raw) => {
    const suffix = raw.trim().toLowerCase().replace(/^\.+/, "");
    return suffix.length > 0 && (domain === suffix || domain.endsWith(`.${suffix}`));
  });
  return bySuffix || prefixes.some((raw) => {
    const prefix = raw.trim().toLowerCase();
    return prefix.length > 0 && domain.startsWith(prefix);
  });
}

/** Syntax first, so a malformed address always gets EMAIL_ERROR; only then the site's domain blocklist. */
function validateEmail(field: EmailFieldConfig, value: string): string | null {
  if (!isValidEmail(value)) return EMAIL_ERROR;
  if (!hasBlockedEmailDomain(value, field.blockedDomainSuffixes, field.blockedDomainPrefixes)) return null;
  return field.blockedDomainMessage || BLOCKED_EMAIL_DOMAIN_ERROR;
}

/** Blank first, so an empty required date asks for a value; then the exact calendar check, untrimmed. */
function validateDate(value: string): string | null {
  if (value.trim().length === 0) return REQUIRED_ERROR;
  return isValidIsoDate(value) ? null : DATE_ERROR;
}

function validateCurrency(value: string): string | null {
  if (value.trim().length === 0) return REQUIRED_ERROR;
  return parseWholeDollars(value) === null ? CURRENCY_ERROR : null;
}

type MultiSelectFieldConfig = Extract<FieldConfig, { kind: "multiselect" }>;

/** Malformed or tampered gets the choice error; "" reaches here only when required (optional blanks pass earlier). */
function validateMultiSelect(field: MultiSelectFieldConfig, value: string): string | null {
  const selected = parseMultiSelect(field.options, value);
  if (selected === null) return MULTISELECT_CHOICE_ERROR;
  return selected.length === 0 ? MULTISELECT_REQUIRED_ERROR : null;
}

/** Every kind is checked against its own declaration; an unrecognised kind fails closed. */
function validateField(field: FieldConfig, value: string): string | null {
  switch (field.kind) {
    case "email":
      return validateEmail(field, value);
    case "tel":
      return isValidPhone(value) ? null : PHONE_ERROR;
    case "select":
    case "toggle":
      return validateChoice(field, value);
    case "text":
      return validateText(field, value);
    case "textarea":
      return validateTextarea(value);
    case "currency":
      return validateCurrency(value);
    case "checkbox":
      return validateCheckbox(value);
    case "date":
      return validateDate(value);
    case "multiselect":
      return validateMultiSelect(field, value);
    default:
      return REQUIRED_ERROR;
  }
}

/** Omitted means required; only an explicit `required: false` makes a field optional. A checkbox is never required. */
export function isFieldRequired(field: FieldConfig): boolean {
  return field.kind !== "checkbox" && field.required !== false;
}

const EXACT_VALUE_KINDS: readonly FieldConfig["kind"][] = ["select", "toggle", "checkbox", "multiselect"];

/** Choice and checkbox values are exact, so only "" is blank there; whitespace stays an invalid value. */
function isBlank(field: FieldConfig, value: string): boolean {
  return EXACT_VALUE_KINDS.includes(field.kind) ? value === "" : value.trim() === "";
}

/** An optional field may be left blank; anything supplied gets the kind's full rule. */
function validateDeclaredField(field: FieldConfig, value: string): string | null {
  if (!isFieldRequired(field) && isBlank(field, value)) return null;
  return validateField(field, value);
}

/** The one validation entry point: the canSubmit gate and `submit()` both call it. */
export function validateLeadValues(fields: readonly FieldConfig[], values: FormValues): FieldErrors {
  assertNoReservedNames(fields);
  const errors: FieldErrors = {};
  for (const field of fields) {
    if (!isFieldShown(fields, field, values) || isWaived(fields, field, values)) continue;
    const error = validateDeclaredField(field, values[field.name] ?? "");
    if (error) errors[field.name] = error;
  }
  return errors;
}

/** Already validated; fails closed rather than ever sending a different or blank amount. */
function normalizeCurrency(field: FieldConfig, value: string): number {
  const amount = parseWholeDollars(value);
  if (amount === null) throw new LeadValidationError({ [field.name]: CURRENCY_ERROR });
  return amount;
}

/** Already validated; fails closed rather than ever sending a different or invented selection. */
function normalizeMultiSelect(field: MultiSelectFieldConfig, value: string): string[] {
  const selected = parseMultiSelect(field.options, value);
  if (selected === null) throw new LeadValidationError({ [field.name]: MULTISELECT_CHOICE_ERROR });
  return selected;
}

/**
 * Runs after validation, so a blank here is always an optional field left empty: sent as "" (a
 * multiselect as []), never a fabricated value.
 */
function normalizeValue(field: FieldConfig, value: string): SubmittedValue {
  if (field.kind === "multiselect") return normalizeMultiSelect(field, value);
  if (isBlank(field, value)) return "";
  if (field.kind === "currency") return normalizeCurrency(field, value);
  if (field.kind === "email") return normalizeEmail(value);
  if (field.kind === "tel") return phoneDigits(value);
  if (field.kind === "text" || field.kind === "textarea") return value.trim();
  return value;
}

/**
 * Throws on invalid input; returns exactly what is sent as `form_data`. A waived field is sent as ""
 * whatever it holds; an unchecked checkbox and a hidden `showWhen` field send no key at all.
 */
export function normalizeFormData(fields: readonly FieldConfig[], values: FormValues): SubmittedFormData {
  const errors = validateLeadValues(fields, values);
  if (Object.keys(errors).length > 0) throw new LeadValidationError(errors);
  const formData: SubmittedFormData = {};
  for (const field of fields) {
    if (!isFieldShown(fields, field, values)) continue;
    const value = isWaived(fields, field, values) ? "" : values[field.name] ?? "";
    if (field.kind === "checkbox" && value === "") continue;
    formData[field.name] = normalizeValue(field, value);
  }
  return formData;
}

/** The default `form_data` key and input name of the optional SMS opt-in checkbox. */
export const SMS_CONSENT_KEY = "smsConsent";

/** The opt-in's `form_data` key and input name: the configured key, trimmed; unset or blank means `smsConsent`. */
export function smsConsentKey(site: SiteConfig): string {
  return site.smsConsentKey?.trim() || SMS_CONSENT_KEY;
}

/** The disclosure that opts a site in to the SMS checkbox, or null: unset or blank means no checkbox. */
export function smsConsentLabel(site: SiteConfig): string | null {
  return site.smsConsentLabel?.trim() || null;
}

/** An opted-in consent key equal to a field name: thrown rather than overwrite that field's value. */
export class SmsConsentKeyCollisionError extends Error {
  constructor(key: string) {
    super(`smsConsentKey ${key} is already a form field; rename the key or the field in src/site.ts.`);
    this.name = "SmsConsentKeyCollisionError";
  }
}

/** Opted in: one boolean under the site's key, `true` only for an actual `true`. Not opted in: no key at all. */
function smsConsentData(site: SiteConfig, smsConsent?: boolean): LeadFormData {
  return smsConsentLabel(site) === null ? {} : { [smsConsentKey(site)]: smsConsent === true };
}

/**
 * `formKey` overrides `site.formKey` for one form instance; an empty override falls back to the site's.
 * `smsConsent` is the visitor's selection, sent only when the site opts in; it wins over any default.
 * A reserved default or consent key throws rather than overwrite a tracking or qualification key,
 * and an opted-in consent key equal to a field name throws rather than overwrite that field.
 */
export function buildLeadPayload(
  site: SiteConfig,
  formData: SubmittedFormData,
  context: PageContext,
  attribution: Attribution,
  formKey?: string,
  smsConsent?: boolean,
): LeadPayload {
  const defaults = site.formDataDefaults ?? {};
  const consent = smsConsentData(site, smsConsent);
  assertNoReservedNames([...site.fields, ...[...Object.keys(defaults), ...Object.keys(consent)].map((name) => ({ name }))]);
  const collision = site.fields.find((field) => Object.hasOwn(consent, field.name));
  if (collision) throw new SmsConsentKeyCollisionError(collision.name);
  const resolvedFormKey = formKey || site.formKey;
  return {
    customer_id: site.customerId,
    site_id: site.siteId,
    source_provider: site.sourceProvider,
    ...(resolvedFormKey ? { form_key: resolvedFormKey } : {}),
    form_data: { ...defaults, ...formData, ...consent, ...qualify(site.qualificationRules, formData) },
    url: context.url,
    referrer_url: context.referrerUrl,
    referrer: context.referrerUrl,
    session_id: context.sessionId,
    visitor_id: context.visitorId,
    ...attribution,
  };
}

export class LeadSubmitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LeadSubmitError";
  }
}

export function isLeadSuccessBody(body: unknown): boolean {
  return typeof body === "object" && body !== null && (body as { ok?: unknown }).ok === true;
}

/** Success needs a 2xx AND `ok: true`; anything else, including a 2xx without it, is a failure. */
export async function postLead(payload: LeadPayload): Promise<void> {
  const response = await fetch(LEAD_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new LeadSubmitError(`Lead API responded ${response.status}`);
  const body: unknown = await response.json().catch(() => null);
  if (!isLeadSuccessBody(body)) throw new LeadSubmitError("Lead API 2xx without ok:true");
}
