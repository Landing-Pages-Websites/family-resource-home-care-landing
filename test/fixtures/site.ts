// Frozen, test-only lead-form fixture. The shared unit tests run against this,
// never against the live SITE, so a customer LP can change SITE.fields (and
// delete the starter demo) without breaking them. Edit only to extend coverage.
import type { FormValues } from "@/lib/leadPayload";
import type { FieldConfig, SiteConfig } from "@/site";

/** The starter's contact fields plus one required yes/no toggle. */
export const FIXTURE_FIELDS: readonly FieldConfig[] = [
  { name: "firstName", kind: "text", label: "First name" },
  { name: "lastName", kind: "text", label: "Last name" },
  { name: "email", kind: "email", label: "Email" },
  { name: "phone", kind: "tel", label: "Phone" },
  {
    name: "budget",
    kind: "toggle",
    label: "Is that within your budget?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
];

/** Qualification rules unset: the legacy payload carries no qualification keys. */
export const FIXTURE_SITE: SiteConfig = {
  customerId: "fixture-customer-id",
  siteId: "fixture-site-id",
  siteKey: "fixture-site-key",
  sourceProvider: "fixture-landing",
  brandName: "Fixture Brand",
  phoneDisplay: "(413) 412-3123",
  phoneTel: "tel:+14134123123",
  privacyUrl: "https://lp.test/privacy",
  termsUrl: "https://lp.test/terms",
  primaryCta: "Get my free quote",
  pendingLabel: "Sending your request",
  fields: FIXTURE_FIELDS,
};

/** Passes validation against FIXTURE_FIELDS; each test patches one field to make it invalid. */
export const FIXTURE_VALID: Readonly<FormValues> = {
  firstName: "Pat",
  lastName: "Lee",
  email: "pat@example.com",
  phone: "(413) 412-3123",
  budget: "yes",
};

/** One required multi-select group with three options. */
export const FIXTURE_MULTISELECT: FieldConfig = {
  name: "serviceOfInterest",
  kind: "multiselect",
  label: "What are you interested in?",
  options: [
    { value: "Custom deck", label: "Custom deck" },
    { value: "Custom cover", label: "Custom cover" },
    { value: "Outdoor living", label: "Outdoor living" },
  ],
};

/** FIXTURE_FIELDS with the phone declared `required: false`; everything else stays required. */
export const FIXTURE_OPTIONAL_PHONE_FIELDS: readonly FieldConfig[] = FIXTURE_FIELDS.map((field) =>
  field.kind === "tel" ? { ...field, required: false } : field,
);
