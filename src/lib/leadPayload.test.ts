import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { emptyAttribution } from "./attribution";
import {
  LeadSubmitError,
  LeadValidationError,
  buildLeadPayload,
  isLeadSuccessBody,
  normalizeFormData,
  postLead,
  validateLeadValues,
  type FormValues,
} from "./leadPayload";
import { LEAD_ENDPOINT, type SiteConfig } from "@/site";
import { FIXTURE_FIELDS, FIXTURE_SITE, FIXTURE_VALID } from "../../test/fixtures/site";

const VALID: FormValues = {
  ...FIXTURE_VALID,
  firstName: " Pat ",
  email: "  Pat.Lee@EXAMPLE.com ",
  phone: "+1 (413) 412-3123",
};

/** Rejected for exactly `field`, so a broken baseline cannot pass the case for the wrong reason. */
function assertInvalid(values: FormValues, field: string): void {
  assert.deepEqual(Object.keys(validateLeadValues(FIXTURE_FIELDS, values)), [field]);
  assert.throws(() => normalizeFormData(FIXTURE_FIELDS, values), LeadValidationError);
}

const CONTEXT = { url: "https://lp.test/?gclid=G", referrerUrl: "https://google.com", sessionId: "sess_1", visitorId: "vis_1" };

describe("normalizeFormData", () => {
  it("the baseline is valid", () => assert.deepEqual(validateLeadValues(FIXTURE_FIELDS, VALID), {}));

  it("sends the phone as 10 digits and the email normalised, each field its own key", () => {
    const data = normalizeFormData(FIXTURE_FIELDS, VALID);
    assert.deepEqual(data, {
      firstName: "Pat",
      lastName: "Lee",
      email: "Pat.Lee@example.com",
      phone: "4134123123",
      budget: "yes",
    });
  });

  const invalid: Array<[string, FormValues, string]> = [
    ["bad email", { email: "me@x" }, "email"],
    ["NANP-invalid phone", { phone: "(123) 456-7890" }, "phone"],
    ["fictional phone", { phone: "(413) 555-0123" }, "phone"],
    ["short phone", { phone: "(413) 412-31" }, "phone"],
    ["letters in phone", { phone: "+1abc4134123123" }, "phone"],
    ["empty first name", { firstName: "   " }, "firstName"],
    ["missing budget", { budget: "" }, "budget"],
    ["unknown budget option", { budget: "maybe" }, "budget"],
  ];
  for (const [label, patch, field] of invalid) {
    it(`throws on ${label}, naming only ${field}`, () => assertInvalid({ ...VALID, ...patch }, field));
  }

  it("the thrown error carries the exact email and phone copy", () => {
    assert.throws(
      () => normalizeFormData(FIXTURE_FIELDS, { ...VALID, email: "me@x", phone: "+52 55 1234 5678" }),
      /Enter a valid email address \(e\.g\. you@company\.com\); Enter a valid 10-digit US phone number/,
    );
  });

  it("treats a missing key like an empty value", () => {
    const rest: FormValues = { ...VALID };
    delete rest.email;
    assert.deepEqual(Object.keys(validateLeadValues(FIXTURE_FIELDS, rest)), ["email"]);
  });
});

describe("buildLeadPayload", () => {
  const attribution = { ...emptyAttribution(), gclid: "G", utm_source: "google", fbp: "fb.1.1.2" };
  const payload = buildLeadPayload(FIXTURE_SITE, normalizeFormData(FIXTURE_FIELDS, VALID), CONTEXT, attribution);

  it("uses the exact top-level names the worker reads", () => {
    assert.deepEqual(Object.keys(payload).sort(), [
      "customer_id", "fbc", "fbclid", "fbp", "form_data", "gbraid", "gclid", "referrer", "referrer_url", "session_id",
      "site_id", "source_provider", "url", "utm_campaign", "utm_content", "utm_medium", "utm_source",
      "utm_term", "visitor_id", "wbraid",
    ]);
  });

  it("maps identity, context and click ids", () => {
    assert.equal(payload.customer_id, FIXTURE_SITE.customerId);
    assert.equal(payload.site_id, FIXTURE_SITE.siteId);
    assert.equal(payload.source_provider, FIXTURE_SITE.sourceProvider);
    assert.equal(payload.url, CONTEXT.url);
    assert.equal(payload.referrer_url, CONTEXT.referrerUrl);
    assert.equal(payload.referrer, CONTEXT.referrerUrl);
    assert.equal(payload.session_id, "sess_1");
    assert.equal(payload.visitor_id, "vis_1");
    assert.equal(payload.gclid, "G");
    assert.equal(payload.fbp, "fb.1.1.2");
  });

  it("keeps phone at 10 digits and email normalised in form_data", () => {
    assert.equal(payload.form_data.phone, "4134123123");
    assert.equal(payload.form_data.email, "Pat.Lee@example.com");
  });

  it("includes form_key only when the site sets one", () => {
    const withKey: SiteConfig = { ...FIXTURE_SITE, formKey: "quote-form" };
    assert.equal(buildLeadPayload(withKey, {}, CONTEXT, attribution).form_key, "quote-form");
    assert.equal("form_key" in payload, false);
  });
});

describe("success detection", () => {
  const originalFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  function stubFetch(status: number, body: string): { calls: Array<[string, RequestInit | undefined]> } {
    const calls: Array<[string, RequestInit | undefined]> = [];
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push([String(input), init]);
      return new Response(body, { status });
    }) as typeof fetch;
    return { calls };
  }

  const payload = buildLeadPayload(FIXTURE_SITE, { phone: "4134123123" }, CONTEXT, emptyAttribution());

  it("only a body with ok:true counts", () => {
    assert.equal(isLeadSuccessBody({ ok: true, id: "x" }), true);
    for (const body of [{ ok: false }, { ok: "true" }, {}, null, "ok", [], undefined]) {
      assert.equal(isLeadSuccessBody(body), false);
    }
  });

  it("resolves on 200 + ok:true and posts JSON to the lead endpoint", async () => {
    const { calls } = stubFetch(200, '{"ok":true,"id":"1"}');
    await postLead(payload);
    assert.equal(calls[0][0], LEAD_ENDPOINT);
    assert.equal(calls[0][1]?.method, "POST");
    assert.equal(JSON.parse(String(calls[0][1]?.body)).form_data.phone, "4134123123");
  });

  const failures: Array<[string, number, string]> = [
    ["2xx without ok:true", 200, "{}"],
    ["2xx with ok:false", 200, '{"ok":false}'],
    ["2xx with a non-JSON body", 200, "<html>"],
    ["500", 500, '{"ok":true}'],
    ["400 with ok:true", 400, '{"ok":true}'],
    ["401", 401, '{"error":"unauthorized_customer_submission"}'],
  ];
  for (const [label, status, body] of failures) {
    it(`fails on ${label}`, async () => {
      stubFetch(status, body);
      await assert.rejects(postLead(payload), LeadSubmitError);
    });
  }

  it("propagates a network error", async () => {
    globalThis.fetch = (async () => {
      throw new TypeError("network down");
    }) as typeof fetch;
    await assert.rejects(postLead(payload), TypeError);
  });
});
