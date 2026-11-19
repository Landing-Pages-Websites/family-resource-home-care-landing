import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { emptyAttribution } from "./attribution";
import { LeadValidationError, buildLeadPayload, normalizeFormData, validateLeadValues, type FormValues } from "./leadPayload";
import { qualificationConfigErrors, qualify } from "./qualification";
import { ReservedFieldNameError } from "./reservedFields";
import { SITE, type FieldConfig, type SiteConfig } from "@/site";
import { FIXTURE_FIELDS, FIXTURE_SITE, FIXTURE_VALID } from "../../test/fixtures/site";

const CONTEXT = { url: "https://lp.test/", referrerUrl: null, sessionId: "sess_1", visitorId: "vis_1" };

const QUALIFYING_FIELDS: readonly FieldConfig[] = [
  ...FIXTURE_FIELDS,
  {
    name: "revenue",
    kind: "select",
    label: "Annual revenue",
    options: [
      { value: "Under $1M", label: "Under $1M" },
      { value: "$1M+", label: "$1M+" },
    ],
  },
  {
    name: "role",
    kind: "select",
    label: "Role",
    options: [
      { value: "Owner", label: "Owner" },
      { value: "Staff", label: "Staff" },
    ],
  },
];

const QUALIFYING_SITE: SiteConfig = {
  ...FIXTURE_SITE,
  fields: QUALIFYING_FIELDS,
  qualificationRules: [
    { field: "revenue", disqualifyingValues: ["Under $1M"], reason: "revenue_too_low" },
    { field: "role", disqualifyingValues: ["Staff"], reason: "not_decision_maker" },
  ],
};

const VALID: FormValues = { ...FIXTURE_VALID, revenue: "$1M+", role: "Owner" };
const QUALIFIED = { qualified: true, disqualification_reason: null };

function formDataFor(patch: FormValues, site: SiteConfig = QUALIFYING_SITE): Record<string, unknown> {
  const formData = normalizeFormData(site.fields, { ...VALID, ...patch });
  return buildLeadPayload(site, formData, CONTEXT, emptyAttribution()).form_data;
}

describe("qualification in form_data", () => {
  it("the baseline is valid", () => assert.deepEqual(validateLeadValues(QUALIFYING_FIELDS, VALID), {}));

  it("a lead passing every rule is qualified with a null reason", () => {
    const data = formDataFor({});
    assert.equal(data.qualified, true);
    assert.equal(data.disqualification_reason, null);
  });

  const single: Array<[string, FormValues, string]> = [
    ["revenue", { revenue: "Under $1M" }, "revenue_too_low"],
    ["role", { role: "Staff" }, "not_decision_maker"],
  ];
  for (const [label, patch, reason] of single) {
    it(`the ${label} disqualifier is recorded and the lead is still built`, () => {
      const data = formDataFor(patch);
      assert.equal(data.qualified, false);
      assert.equal(data.disqualification_reason, reason);
    });
  }

  it("both disqualifiers are kept, in rule order", () => {
    const data = formDataFor({ revenue: "Under $1M", role: "Staff" });
    assert.equal(data.qualified, false);
    assert.equal(data.disqualification_reason, "revenue_too_low,not_decision_maker");
  });

  it("keeps each actual field as its own key beside the two qualification keys", () => {
    const data = formDataFor({ role: "Staff" });
    assert.deepEqual(Object.keys(data).sort(), [
      "budget", "disqualification_reason", "email", "firstName", "lastName", "phone", "qualified", "revenue", "role",
    ]);
    assert.equal(data.role, "Staff");
    assert.equal(data.phone, "4134123123");
  });

  it("ignores submitted qualification keys: only configured fields are read", () => {
    const data = formDataFor({ role: "Staff", qualified: "true", disqualification_reason: "" });
    assert.equal(data.qualified, false);
    assert.equal(data.disqualification_reason, "not_decision_maker");
  });

  const invalidRequired: Array<[string, FormValues]> = [
    ["revenue", { revenue: "" }],
    ["role", { role: "CEO" }],
  ];
  for (const [field, patch] of invalidRequired) {
    it(`an invalid ${field} throws, naming only ${field}, before any payload exists`, () => {
      assert.deepEqual(Object.keys(validateLeadValues(QUALIFYING_FIELDS, { ...VALID, ...patch })), [field]);
      assert.throws(() => formDataFor(patch), LeadValidationError);
    });
  }

  it("with rules unset form_data is exactly the normalized fields (legacy payload)", () => {
    assert.equal(FIXTURE_SITE.qualificationRules, undefined);
    assert.deepEqual(formDataFor({}, FIXTURE_SITE), normalizeFormData(FIXTURE_FIELDS, VALID));
  });

  it("with rules [] every lead is explicitly qualified", () => {
    const allQualified: SiteConfig = { ...FIXTURE_SITE, qualificationRules: [] };
    for (const budget of ["yes", "no"]) {
      const expected = { ...normalizeFormData(FIXTURE_FIELDS, { ...VALID, budget }), ...QUALIFIED };
      assert.deepEqual(formDataFor({ budget }, allQualified), expected);
    }
  });

  it("with rules [] submitted qualification keys are still ignored", () => {
    const allQualified: SiteConfig = { ...QUALIFYING_SITE, qualificationRules: [] };
    const data = formDataFor({ qualified: "false", disqualification_reason: "forged" }, allQualified);
    assert.equal(data.qualified, true);
    assert.equal(data.disqualification_reason, null);
  });

  it("the same reason from two rules is reported once", () => {
    const rules = [
      { field: "revenue", disqualifyingValues: ["Under $1M"], reason: "unfit" },
      { field: "role", disqualifyingValues: ["Staff"], reason: "unfit" },
    ];
    assert.deepEqual(qualify(rules, { revenue: "Under $1M", role: "Staff" }), { qualified: false, disqualification_reason: "unfit" });
  });
});

describe("qualify", () => {
  const rules = QUALIFYING_SITE.qualificationRules;

  it("unset rules add no keys", () => assert.deepEqual(qualify(undefined, { revenue: "Under $1M" }), {}));

  it("[] is the empty conjunction: qualified with a null reason", () => {
    assert.deepEqual(qualify([], {}), QUALIFIED);
    assert.deepEqual(qualify([], { revenue: "Under $1M", role: "Staff" }), QUALIFIED);
  });

  it("non-empty rules that do not match qualify", () => assert.deepEqual(qualify(rules, { revenue: "$1M+", role: "Owner" }), QUALIFIED));

  it("a matching rule disqualifies with its reason", () => {
    assert.deepEqual(qualify(rules, { revenue: "Under $1M", role: "Owner" }), { qualified: false, disqualification_reason: "revenue_too_low" });
  });
});

describe("qualificationConfigErrors", () => {
  it("accepts the live SITE config", () => {
    assert.deepEqual(qualificationConfigErrors(SITE.fields, SITE.qualificationRules), []);
  });

  it("accepts the example config, unset rules and []", () => {
    assert.deepEqual(qualificationConfigErrors(QUALIFYING_FIELDS, QUALIFYING_SITE.qualificationRules), []);
    assert.deepEqual(qualificationConfigErrors(QUALIFYING_FIELDS, undefined), []);
    assert.deepEqual(qualificationConfigErrors(QUALIFYING_FIELDS, []), []);
  });

  const broken: Array<[string, SiteConfig["qualificationRules"], RegExp]> = [
    ["an unknown field", [{ field: "revnue", disqualifyingValues: ["Under $1M"], reason: "low" }], /unknown field "revnue"/],
    ["a non-option value", [{ field: "revenue", disqualifyingValues: ["under $1m"], reason: "low" }], /non-option value/],
    ["a non-snake_case reason", [{ field: "revenue", disqualifyingValues: ["Under $1M"], reason: "Too low" }], /snake_case/],
    ["no values", [{ field: "revenue", disqualifyingValues: [], reason: "low" }], /lists no values/],
    ["a free-text field", [{ field: "firstName", disqualifyingValues: ["Test"], reason: "test_lead" }], /select or toggle/],
  ];
  for (const [label, rules, pattern] of broken) {
    it(`rejects ${label}`, () => {
      assert.match(qualificationConfigErrors(QUALIFYING_FIELDS, rules).join("\n"), pattern);
    });
  }

  it("a field cannot take a qualification key's name", () => {
    const fields: FieldConfig[] = [...QUALIFYING_FIELDS, { name: "qualified", kind: "text", label: "Qualified" }];
    assert.throws(() => buildLeadPayload({ ...QUALIFYING_SITE, fields }, {}, CONTEXT, emptyAttribution()), ReservedFieldNameError);
  });
});
