import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { buildLeadPayload, normalizeFormData, validateLeadValues, type FormValues } from "@/lib/leadPayload";
import { emptyAttribution } from "@/lib/attribution";
import { qualificationConfigErrors } from "@/lib/qualification";
import { RESERVED_FIELD_NAMES } from "@/lib/reservedFields";
import { HEARD_FROM_OPTIONS } from "@/components/Brand";
import { SITE } from "@/site";
import { MARKETS, cityList, marketFormDataDefaults, marketFormId } from "./markets";
import { fireQualifiedLeadEvents, isQualifiedLead } from "./formEvents";

const CONTEXT = { url: "https://call.familyresourcehomecare.com/salem", referrerUrl: null, sessionId: "s", visitorId: "v" };
const VALID: FormValues = {
  firstName: " Test ",
  lastName: "MEGA QA",
  email: "qatest+1@GoMega.AI",
  phone: "+1 (555) 555-0100",
  zip: "97301",
  ready: "yes",
  heardFrom: "",
};

describe("market config", () => {
  it("has exactly the four task routes with their authorized office numbers", () => {
    assert.deepEqual(Object.keys(MARKETS).sort(), ["grants-pass", "medford", "olympia", "salem"]);
    const tels = Object.values(MARKETS).map((m) => m.phoneHref);
    assert.deepEqual(tels, ["tel:+15039906380", "tel:+15412041451", "tel:+15413928665", "tel:+13605224024"]);
  });

  it("joins cities as one plain phrase", () => {
    assert.equal(cityList(MARKETS.olympia), "Olympia, Lacey and Tumwater");
    assert.equal(cityList(MARKETS.salem), "Salem, Keizer, Woodburn, Independence and Dallas");
  });

  it("uses the full first-party Olympia office address in Tumwater", () => {
    assert.equal(MARKETS.olympia.address, "2620 RW Johnson Blvd Southwest, Suite 104, Tumwater, WA 98512");
  });

  it("tags leads with plain-space territory keys", () => {
    assert.deepEqual(marketFormDataDefaults(MARKETS["grants-pass"]), {
      territory: "grants-pass",
      territoryName: "Grants Pass",
      territoryPhone: "(541) 204-1451",
    });
  });

  it("names each placement's form id per market", () => {
    assert.equal(marketFormId("hero", MARKETS.medford), "form-hero-medford");
    assert.equal(marketFormId("contact", MARKETS.medford), "form-contact-medford");
  });
});

describe("SITE form contract", () => {
  it("declares the seven task fields in order, only heardFrom optional", () => {
    assert.deepEqual(SITE.fields.map((f) => f.name), ["firstName", "lastName", "email", "phone", "zip", "ready", "heardFrom"]);
    assert.deepEqual(SITE.fields.filter((f) => f.required === false).map((f) => f.name), ["heardFrom"]);
  });

  it("keeps the legacy ready and heardFrom option values", () => {
    const ready = SITE.fields.find((f) => f.name === "ready");
    assert.deepEqual(ready?.options?.map((o) => o.value), ["yes", "no"]);
    const heard = SITE.fields.find((f) => f.name === "heardFrom");
    assert.deepEqual(heard?.options?.map((o) => o.value), HEARD_FROM_OPTIONS.map((o) => o.value).filter(Boolean));
  });

  it("has valid qualification rules and no reserved or territory-colliding names", () => {
    assert.deepEqual(qualificationConfigErrors(SITE.fields, SITE.qualificationRules), []);
    const names = SITE.fields.map((f) => f.name);
    const reserved: readonly string[] = RESERVED_FIELD_NAMES;
    assert.equal(names.filter((n) => reserved.includes(n)).length, 0);
    assert.equal(names.filter((n) => n in marketFormDataDefaults(MARKETS.salem)).length, 0);
  });

  it("rejects an empty form on every required field and accepts a blank heardFrom", () => {
    const errors = validateLeadValues(SITE.fields, {});
    assert.deepEqual(Object.keys(errors), ["firstName", "lastName", "email", "phone", "zip", "ready"]);
    assert.deepEqual(validateLeadValues(SITE.fields, VALID), {});
  });

  it("rejects ZIP+4, fictional 555-01XX numbers and foreign numbers", () => {
    assert.ok(validateLeadValues(SITE.fields, { ...VALID, zip: "97301-1234" }).zip);
    assert.ok(validateLeadValues(SITE.fields, { ...VALID, phone: "(503) 555-0123" }).phone);
    assert.ok(validateLeadValues(SITE.fields, { ...VALID, phone: "+52 55 1234 5678" }).phone);
    assert.ok(validateLeadValues(SITE.fields, { ...VALID, ready: "maybe" }).ready);
  });
});

describe("market lead payload", () => {
  const payloadFor = (values: FormValues) => {
    const site = { ...SITE, formDataDefaults: marketFormDataDefaults(MARKETS.salem) };
    return buildLeadPayload(site, normalizeFormData(SITE.fields, values), CONTEXT, emptyAttribution());
  };

  it("sends each field as its own normalized key plus the territory keys", () => {
    const { form_data: data, site_id: siteId, customer_id: customerId } = payloadFor(VALID);
    assert.equal(siteId, "bc581877-3414-42e7-a11e-a499c8292999");
    assert.equal(customerId, "af6bf9ba-151a-4d28-9786-6a585c237ead");
    assert.deepEqual(data, {
      territory: "salem",
      territoryName: "Salem",
      territoryPhone: "(503) 990-6380",
      firstName: "Test",
      lastName: "MEGA QA",
      email: "qatest+1@gomega.ai",
      phone: "5555550100",
      zip: "97301",
      ready: "yes",
      heardFrom: "",
      qualified: true,
      disqualification_reason: null,
    });
  });

  it("still submits a not-ready lead, marked unqualified", () => {
    const { form_data: data } = payloadFor({ ...VALID, ready: "no", heardFrom: "google_search" });
    assert.equal(data.qualified, false);
    assert.equal(data.disqualification_reason, "not_ready_to_start_care");
    assert.equal(data.heardFrom, "google_search");
  });
});

describe("qualified-only signal", () => {
  let tracked: Array<{ name: string; payload: unknown }>;
  let dataLayer: Record<string, unknown>[];
  const originalWindow = globalThis.window;
  const install = (trackEvent: (name: string, payload?: Record<string, unknown>) => void): void => {
    globalThis.window = { MegaTag: { trackEvent }, dataLayer } as unknown as Window & typeof globalThis;
  };

  beforeEach(() => {
    tracked = [];
    dataLayer = [];
    install((name, payload) => void tracked.push({ name, payload }));
  });
  afterEach(() => {
    globalThis.window = originalWindow;
  });

  it("qualifies only a yes answer", () => {
    assert.equal(isQualifiedLead({ ready: "yes" }), true);
    assert.equal(isQualifiedLead({ ready: "no" }), false);
  });

  it("fires one MegaTag qualified_lead with elementId/formData and one dataLayer push for yes", () => {
    const formData = { firstName: "Test", ready: "yes" };
    fireQualifiedLeadEvents("form-hero-salem", formData, MARKETS.salem);
    assert.deepEqual(tracked, [{ name: "qualified_lead", payload: { elementId: "form-hero-salem", formData } }]);
    assert.deepEqual(dataLayer, [{ event: "qualified_lead", form_id: "form-hero-salem", territory: "salem" }]);
  });

  it("fires nothing for a not-ready lead", () => {
    fireQualifiedLeadEvents("form-hero-salem", { ready: "no" }, MARKETS.salem);
    assert.equal(tracked.length + dataLayer.length, 0);
  });

  it("never throws when the tag throws, and still pushes to the dataLayer", () => {
    install(() => {
      throw new Error("tag down");
    });
    assert.doesNotThrow(() => fireQualifiedLeadEvents("form-contact-salem", { ready: "yes" }, MARKETS.salem));
    assert.equal(dataLayer.length, 1);
  });
});
