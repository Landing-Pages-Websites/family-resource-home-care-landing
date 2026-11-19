import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PHONE_ERROR } from "./fields";
import {
  CHOICE_ERROR,
  REQUIRED_ERROR,
  isFieldRequired,
  normalizeFormData,
  validateLeadValues,
  type FormValues,
} from "./leadPayload";
import type { FieldConfig } from "@/site";
import { FIXTURE_FIELDS, FIXTURE_OPTIONAL_PHONE_FIELDS, FIXTURE_VALID } from "../../test/fixtures/site";

const OPTIONS = [{ value: "a", label: "A" }, { value: "b", label: "B" }] as const;

function errorsFor(field: FieldConfig, value: string): string[] {
  return Object.values(validateLeadValues([field], { [field.name]: value }));
}

describe("the required declaration", () => {
  it("omitted or true means required; only false means optional", () => {
    assert.equal(isFieldRequired({ name: "phone", kind: "tel", label: "Phone" }), true);
    assert.equal(isFieldRequired({ name: "phone", kind: "tel", label: "Phone", required: true }), true);
    assert.equal(isFieldRequired({ name: "phone", kind: "tel", label: "Phone", required: false }), false);
  });

  it("every existing fixture field is required by default", () => {
    assert.ok(FIXTURE_FIELDS.every(isFieldRequired));
  });
});

describe("a phone declared required: false", () => {
  const withPhone = (phone: string): FormValues => ({ ...FIXTURE_VALID, phone });

  it("accepts a blank phone and sends it as an empty string", () => {
    for (const blank of ["", "   "]) {
      assert.deepEqual(validateLeadValues(FIXTURE_OPTIONAL_PHONE_FIELDS, withPhone(blank)), {});
      assert.equal(normalizeFormData(FIXTURE_OPTIONAL_PHONE_FIELDS, withPhone(blank)).phone, "");
    }
  });

  it("treats a missing key as blank, with no undefined leaking into form_data", () => {
    const values: FormValues = { ...FIXTURE_VALID };
    delete values.phone;
    const data = normalizeFormData(FIXTURE_OPTIONAL_PHONE_FIELDS, values);
    assert.deepEqual(data, { firstName: "Pat", lastName: "Lee", email: "pat@example.com", phone: "", budget: "yes" });
  });

  it("still normalises a supplied valid phone to 10 digits", () => {
    assert.equal(normalizeFormData(FIXTURE_OPTIONAL_PHONE_FIELDS, withPhone("+1 (413) 412-3123")).phone, "4134123123");
  });

  const invalid: Array<[string, string]> = [
    ["NANP-invalid", "(123) 456-7890"],
    ["fictional", "(413) 555-0123"],
    ["short", "(413) 412-31"],
    ["foreign", "+52 55 1234 5678"],
    ["overlong", "4134123123".repeat(3)],
    ["12 digits", "141341231234"],
    ["letters only", "call me"],
  ];
  for (const [label, phone] of invalid) {
    it(`rejects a supplied ${label} phone with the canonical error, never truncating it`, () => {
      assert.deepEqual(validateLeadValues(FIXTURE_OPTIONAL_PHONE_FIELDS, withPhone(phone)), { phone: PHONE_ERROR });
      assert.throws(() => normalizeFormData(FIXTURE_OPTIONAL_PHONE_FIELDS, withPhone(phone)), /10-digit US phone/);
    });
  }

  it("leaves every other field required", () => {
    const blankOthers = { firstName: "", lastName: "", email: "", phone: "", budget: "" };
    assert.deepEqual(Object.keys(validateLeadValues(FIXTURE_OPTIONAL_PHONE_FIELDS, blankOthers)), ["firstName", "lastName", "email", "budget"]);
  });
});

describe("a phone with no required key stays required", () => {
  for (const phone of ["", "   ", "+52 55 1234 5678", "4134123123".repeat(3)]) {
    it(`rejects ${JSON.stringify(phone)}`, () => {
      assert.deepEqual(validateLeadValues(FIXTURE_FIELDS, { ...FIXTURE_VALID, phone }), { phone: PHONE_ERROR });
    });
  }
});

describe("optionality is general and never bypasses a supplied value's rule", () => {
  const text: FieldConfig = { name: "company", kind: "text", label: "Company", required: false };
  const email: FieldConfig = { name: "email", kind: "email", label: "Email", required: false, blockedDomainSuffixes: [".gov"] };
  const select: FieldConfig = { name: "service", kind: "select", label: "Service", options: OPTIONS, required: false };
  const toggle: FieldConfig = { name: "budget", kind: "toggle", label: "Budget", options: OPTIONS, required: false };

  const blanks: Array<[string, FieldConfig, string]> = [
    ["text", text, ""],
    ["text (whitespace)", text, "  \t"],
    ["email", email, ""],
    ["email (whitespace)", email, "  "],
    ["select", select, ""],
    ["toggle", toggle, ""],
  ];
  for (const [label, field, value] of blanks) {
    it(`accepts a blank optional ${label} and sends ""`, () => {
      assert.deepEqual(errorsFor(field, value), []);
      assert.deepEqual(normalizeFormData([field], { [field.name]: value }), { [field.name]: "" });
    });
  }

  const rejected: Array<[string, FieldConfig, string]> = [
    ["text: over-long", text, "x".repeat(201)],
    ["email: malformed", email, "me@x"],
    ["email: blocked domain", email, "a@agency.gov"],
    ["select: unknown option", select, "maybe"],
    ["select: whitespace is not blank for a choice", select, " "],
    ["select: wrong case", select, "A"],
    ["toggle: option label instead of value", toggle, "Yes"],
  ];
  for (const [label, field, value] of rejected) {
    it(`rejects ${label}`, () => {
      assert.equal(errorsFor(field, value).length, 1);
      assert.throws(() => normalizeFormData([field], { [field.name]: value }));
    });
  }

  it("normalises supplied optional values exactly like required ones", () => {
    assert.deepEqual(normalizeFormData([text, email, select], { company: "  Acme  ", email: " Pat@EXAMPLE.com ", service: "b" }), {
      company: "Acme",
      email: "Pat@example.com",
      service: "b",
    });
  });

  it("required: true behaves exactly like an omitted key", () => {
    assert.deepEqual(errorsFor({ ...text, required: true }, " "), [REQUIRED_ERROR]);
    assert.deepEqual(errorsFor({ ...select, required: true }, ""), [CHOICE_ERROR]);
    assert.deepEqual(errorsFor({ ...toggle, required: true }, ""), [CHOICE_ERROR]);
    assert.equal(errorsFor({ ...email, required: true }, "").length, 1);
  });
});
