// Provenance: types, endpoints and constants are lp-starter e8e8d9b src/site.ts, verbatim.
// Only SITE is FRHC-specific. It configures the canonical form modules (src/lib/*,
// src/hooks/useLeadFormFlow.ts) used by the /salem, /grants-pass, /medford and /olympia
// routes. The pre-starter root and Portland routes do not read this file; their identifiers
// stay in src/components/Brand.ts, which SITE reads so the two can never disagree.
import { CUSTOMER_ID, GTM_ID, HEARD_FROM_OPTIONS, SITE_ID, SITE_KEY, SOURCE_PROVIDER, BUSINESS_NAME } from "@/components/Brand";

/** `textarea`: multi-line free text, required unless `required: false`, capped at 1000 trimmed characters (see README). */
export type FieldKind =
  | "text"
  | "email"
  | "tel"
  | "select"
  | "toggle"
  | "currency"
  | "checkbox"
  | "date"
  | "multiselect"
  | "textarea";

export interface FieldOption {
  value: string;
  label: string;
}

/** Shows a field only while the field named `field` holds exactly `equals` (see README). */
export interface FieldCondition {
  field: string;
  equals: string;
}

interface BaseFieldConfig {
  label: string;
  placeholder?: string;
  autoComplete?: string;
  options?: readonly FieldOption[];
  /**
   * Omitted or `true`: the field must be filled. `false`: a blank value passes and is
   * sent as `""` (a multiselect as `[]`), but anything supplied is still held to the kind's exact rule (see README).
   */
  required?: boolean;
  /**
   * Optional. Hidden while the condition fails: not rendered, validated or sent, and
   * cleared, so it is empty when shown again. Shown, `required` applies as usual.
   */
  showWhen?: FieldCondition;
}

/**
 * Optional, email field only; omit them all for the default email rules (see README).
 * `blockedDomainSuffixes` rejects a valid address whose domain is, or ends in, a
 * suffix (".gov" blocks `a@x.agency.gov`, not `a@example.gov.com`);
 * `blockedDomainPrefixes` rejects one whose domain starts with a prefix ("yahoo." blocks `a@yahoo.co.uk`);
 * `blockedDomainMessage` is either error's copy; `helperText` always shows under the input.
 */
interface EmailFieldOptions {
  blockedDomainSuffixes?: readonly string[];
  blockedDomainPrefixes?: readonly string[];
  blockedDomainMessage?: string;
  helperText?: string;
}

/**
 * Optional, currency field only. A currency field takes a whole-US-dollar amount and
 * sends it as a JSON number, e.g. 245000 (see README); `helperText` as for email.
 */
type CurrencyFieldOptions = Pick<EmailFieldOptions, "helperText">;

/**
 * Optional, text field only (see README). `format: "domain"` accepts a website domain,
 * with or without `http(s)://`; `format: "zip"` accepts exactly five digits, sent as a
 * string (leading zeros kept). `waivedBy` names a checkbox field: while it is checked
 * this input is cleared, disabled, not required, and sent as `""`. `minLength` (1–200) rejects
 * a nonblank value shorter than that many characters once trimmed (ignored by `format: "zip"`).
 */
interface TextFieldOptions {
  format?: "domain" | "zip";
  waivedBy?: string;
  minLength?: number;
}

/**
 * `name` is both the input name and the `form_data` key; one key per field, never
 * combined. Email and phone names are fixed: the lead worker reads exactly
 * `form_data.email` and `form_data.phone` for Google Ads / Meta conversion
 * matching, so a renamed contact field would silently stop matching.
 */
export type FieldConfig = BaseFieldConfig &
  (
    | ({ name: "email"; kind: "email" } & EmailFieldOptions)
    | { name: "phone"; kind: "tel" }
    | ({ name: string; kind: "currency" } & CurrencyFieldOptions)
    | ({ name: string; kind: "text" } & TextFieldOptions)
    /** Never required (`required` is ignored): checked sends `"yes"`, unchecked omits the key (see README). */
    | { name: string; kind: "checkbox" }
    /**
     * A checkbox group: required (at least one choice) unless `required: false`; sends the
     * selected option values as one string array, in option order (see README).
     */
    | { name: string; kind: "multiselect"; options: readonly FieldOption[] }
    | { name: string; kind: Exclude<FieldKind, "email" | "tel" | "currency" | "text" | "checkbox" | "multiselect"> }
  );

interface QualificationRuleBase {
  /** A configured select or toggle field name, or a `format: "zip"` text field name. */
  field: string;
  /** snake_case, so a comma-joined list stays unambiguous. */
  reason: string;
}

/**
 * One declarative rule, read against the normalized submitted value of `field`, in
 * exactly one mode: `disqualifyingValues` (a denylist: any listed value fails the rule)
 * or `qualifyingValues` (an allowlist: any other submitted value fails it). A blank or
 * absent value (optional, waived or hidden) never fails an allowlist. A lead is
 * qualified only when no rule fails (every rule passes). Qualification never blocks a
 * lead: it is still posted, with `form_data.qualified` and
 * `form_data.disqualification_reason` (failing reasons in rule order, each once,
 * comma-joined, or null) added by buildLeadPayload. e.g.
 *   { field: "budget", disqualifyingValues: ["no"], reason: "budget_below_minimum" }
 *   { field: "zip", qualifyingValues: ["33602", "33606"], reason: "outside_service_area" }
 */
export type QualificationRule = QualificationRuleBase &
  (
    /** Option values (or five-digit ZIPs) that disqualify. */
    | { disqualifyingValues: readonly string[]; qualifyingValues?: never }
    /** The only option values (or five-digit ZIPs) that qualify. */
    | { qualifyingValues: readonly string[]; disqualifyingValues?: never }
  );

/** A static `form_data` value: never rendered, never validated, never read as consent. */
export type FormDataDefaultValue = string | boolean | null;

export interface SiteConfig {
  customerId: string;
  siteId: string;
  siteKey: string;
  gtmId?: string;
  pixelId?: string;
  sourceProvider: string;
  /** Only read by the worker for `website-` providers; leave unset on LPs. */
  formKey?: string;
  brandName: string;
  phoneDisplay: string;
  phoneTel: string;
  privacyUrl: string;
  termsUrl: string;
  primaryCta: string;
  pendingLabel: string;
  fields: readonly FieldConfig[];
  /** Leave unset to send `form_data` without qualification keys; `[]` marks every lead qualified. */
  qualificationRules?: readonly QualificationRule[];
  /**
   * Optional handoff after an accepted lead: an absolute `https://` URL the
   * thank-you message sends the visitor to after a short delay, with a manual
   * link. Unset or empty keeps the plain thank-you. Other schemes are rejected.
   */
  successRedirectUrl?: string;
  /** Static `form_data` keys sent with every lead, e.g. `{ smsConsent: false }`; never consent (see README). */
  formDataDefaults?: Readonly<Record<string, FormDataDefaultValue>>;
  /**
   * Optional SMS opt-in: the approved disclosure, rendered as the label of one unchecked,
   * optional checkbox above the submit button. Set, every lead carries `form_data.smsConsent`
   * as the visitor's actual boolean selection (false unless checked). Unset or blank: no
   * checkbox and the payload is unchanged (see README).
   */
  smsConsentLabel?: string;
  /**
   * Optional `form_data` key and input name for that checkbox, when a downstream system needs
   * another key (e.g. `marketingOptIn`). Unset or blank keeps `smsConsent`. Must not be a
   * reserved key or a field name (see README).
   */
  smsConsentKey?: string;
}

/** A form's complete field/rule pair; omitted rules mean no qualification, not SITE inheritance. */
export type LeadFormProfile = Pick<SiteConfig, "fields" | "qualificationRules">;

export const SITE: SiteConfig = {
  customerId: CUSTOMER_ID,
  siteId: SITE_ID,
  siteKey: SITE_KEY,
  gtmId: GTM_ID,
  sourceProvider: SOURCE_PROVIDER,
  brandName: BUSINESS_NAME,
  // Each market route passes its own office number; the site has no single shared line.
  phoneDisplay: "",
  phoneTel: "",
  privacyUrl: "https://www.familyresourcehomecare.com/privacy/",
  termsUrl: "",
  primaryCta: "Request My Free In-Home Assessment",
  pendingLabel: "Sending your request…",
  fields: [
    { name: "firstName", kind: "text", label: "First Name", placeholder: "First name *", autoComplete: "given-name" },
    { name: "lastName", kind: "text", label: "Last Name", placeholder: "Last name *", autoComplete: "family-name" },
    { name: "email", kind: "email", label: "Email Address", placeholder: "Email address *" },
    { name: "phone", kind: "tel", label: "Phone Number", placeholder: "Phone *" },
    { name: "zip", kind: "text", format: "zip", label: "Home ZIP Code", placeholder: "Home ZIP *", autoComplete: "postal-code" },
    {
      name: "ready",
      kind: "toggle",
      label: "Are you or your loved one ready to receive care?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      name: "heardFrom",
      kind: "select",
      label: "How did you hear about us?",
      required: false,
      options: HEARD_FROM_OPTIONS.filter((option) => option.value !== ""),
    },
  ],
  // Both answers submit; only "yes" is a qualified lead.
  qualificationRules: [{ field: "ready", disqualifyingValues: ["no"], reason: "not_ready_to_start_care" }],
};

export const LEAD_ENDPOINT = "https://analytics.gomega.ai/submission/submit";
export const OPTIMIZER_ID = "optimizer-script";
export const OPTIMIZER_SRC = "https://cdn.gomega.ai/scripts/optimizer.min.js";
export const OPTIMIZER_API = "https://optimizer.gomega.ai";
export const TRACKING_API = "https://events-api.gomega.ai";
export const FORM_ANCHOR = "#form";
