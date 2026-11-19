import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, it, mock } from "node:test";
import { fireConversionEvents, type MegaTagApi } from "./conversionEvents";
import { buildLeadPayload, normalizeFormData, postLead, validateLeadValues, type FormValues, type SubmittedFormData } from "./leadPayload";
import { emptyAttribution } from "./attribution";
import { runSubmission, type SubmissionStatus } from "./managedSubmit";
import { SITE, type FieldConfig } from "@/site";
import { FIXTURE_FIELDS, FIXTURE_OPTIONAL_PHONE_FIELDS, FIXTURE_SITE, FIXTURE_VALID } from "../../test/fixtures/site";

const FORM_ID = "form-hero";
const API_DELAY_MS = 1500;
const FICTIONAL_PHONE = "+15555550101";
const VALID = FIXTURE_VALID;

interface Emitted {
  name: string;
  payload: Record<string, unknown>;
}

/** The controller's handleClick: validate first, then send directly. Nothing here can raise a native submit. */
function mountLeadForm(values: FormValues, send: () => Promise<SubmittedFormData>, fields: readonly FieldConfig[] = FIXTURE_FIELDS) {
  const lock = { current: false };
  const statuses: SubmissionStatus[] = [];
  const click = (): void => {
    if (Object.keys(validateLeadValues(fields, values)).length > 0) return;
    void runSubmission(lock, { send, onAccepted: (sent) => fireConversionEvents(FORM_ID, sent), onStatus: (s) => statuses.push(s) });
  };
  return { statuses, click };
}

const flush = (): Promise<void> => new Promise((resolve) => setImmediate(resolve));

describe("validate-first direct submission", () => {
  let megaTag: Emitted[];
  let dataLayer: Record<string, unknown>[];
  let posts: number;
  const originalWindow = globalThis.window;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    megaTag = [];
    dataLayer = [];
    posts = 0;
    mock.timers.enable({ apis: ["setTimeout"] });
    const trackEvent: MegaTagApi["trackEvent"] = (name, payload) => {
      megaTag.push({ name, payload: { ...payload } });
    };
    globalThis.window = { MegaTag: { trackEvent }, dataLayer } as unknown as Window & typeof globalThis;
  });

  afterEach(() => {
    mock.timers.reset();
    globalThis.window = originalWindow;
    globalThis.fetch = originalFetch;
  });

  const slowSend = (values: FormValues, outcome: "accept" | "reject" = "accept") => (): Promise<SubmittedFormData> => {
    posts += 1;
    return new Promise((resolve, reject) => {
      setTimeout(() => (outcome === "accept" ? resolve(normalizeFormData(FIXTURE_FIELDS, values)) : reject(new Error("500"))), API_DELAY_MS);
    });
  };
  const formSubmits = (): Emitted[] => megaTag.filter((event) => event.name === "form_submit");
  const settle = async (): Promise<void> => {
    mock.timers.tick(API_DELAY_MS);
    await flush();
  };

  it("the baseline is valid and the fictional phone invalidates only the phone", () => {
    assert.deepEqual(validateLeadValues(FIXTURE_FIELDS, VALID), {});
    assert.deepEqual(Object.keys(validateLeadValues(FIXTURE_FIELDS, { ...VALID, phone: FICTIONAL_PHONE })), ["phone"]);
  });

  it("an accepted lead behind a >1s API delay yields exactly one success-gated form_submit", async () => {
    const lead = mountLeadForm(VALID, slowSend(VALID));
    lead.click();
    assert.equal(formSubmits().length, 0, "nothing before the API answers");
    await settle();
    assert.deepEqual(formSubmits().map((event) => event.payload), [{ elementId: FORM_ID, formData: normalizeFormData(FIXTURE_FIELDS, VALID) }]);
    // Live SITE on purpose: fireConversionEvents reads SITE.sourceProvider, not the fixture.
    assert.deepEqual(dataLayer, [{ event: "form_submission", form_id: FORM_ID, form_provider: SITE.sourceProvider }]);
    assert.deepEqual(lead.statuses, ["submitting", "success"]);
    assert.equal(posts, 1);
  });

  it("a failed submit emits nothing and a retry on the same form converts once", async () => {
    const outcomes = ["reject", "accept"] as const;
    const lead = mountLeadForm(VALID, () => slowSend(VALID, outcomes[posts] ?? "accept")());
    lead.click();
    await settle();
    assert.equal(formSubmits().length, 0);
    assert.equal(dataLayer.length, 0);
    assert.deepEqual(lead.statuses, ["submitting", "error"]);
    lead.click();
    await settle();
    assert.equal(posts, 2);
    assert.deepEqual(lead.statuses, ["submitting", "error", "submitting", "success"]);
    assert.equal(formSubmits().length, 1);
  });

  it("invalid fields (fictional phone) never post or convert", async () => {
    const lead = mountLeadForm({ ...VALID, phone: FICTIONAL_PHONE }, slowSend(VALID));
    lead.click();
    await settle();
    assert.equal(posts, 0);
    assert.equal(formSubmits().length, 0);
    assert.deepEqual(lead.statuses, []);
  });

  it("an optional blank phone passes the click gate and is posted as phone: \"\"", async () => {
    const values = { ...VALID, phone: "" };
    const site = { ...FIXTURE_SITE, fields: FIXTURE_OPTIONAL_PHONE_FIELDS };
    const bodies: string[] = [];
    globalThis.fetch = (async (_url: RequestInfo | URL, init?: RequestInit) => {
      bodies.push(String(init?.body));
      return new Response('{"ok":true}', { status: 200 });
    }) as typeof fetch;
    const send = async (): Promise<SubmittedFormData> => {
      const data = normalizeFormData(site.fields, values);
      await postLead(buildLeadPayload(site, data, { url: "https://lp.test/", referrerUrl: null, sessionId: "s", visitorId: "v" }, emptyAttribution()));
      return data;
    };
    const lead = mountLeadForm(values, send, site.fields);
    lead.click();
    await flush();
    assert.equal(bodies.length, 1);
    assert.equal(JSON.parse(bodies[0]).form_data.phone, "");
    assert.deepEqual(lead.statuses, ["submitting", "success"]);
    assert.equal(formSubmits().length, 1);
  });

  it("the same blank phone is blocked when the phone has no required key", async () => {
    const lead = mountLeadForm({ ...VALID, phone: "" }, slowSend(VALID));
    lead.click();
    await settle();
    assert.equal(posts, 0);
    assert.deepEqual(lead.statuses, []);
  });

  it("five same-tick clicks post once, convert once, and a click after success sends nothing", async () => {
    const lead = mountLeadForm(VALID, slowSend(VALID));
    for (let i = 0; i < 5; i += 1) lead.click();
    await settle();
    lead.click();
    await settle();
    assert.equal(posts, 1);
    assert.equal(formSubmits().length, 1);
    assert.equal(dataLayer.length, 1);
  });
});

describe("runSubmission", () => {
  it("keeps the lock once the lead is saved, even if a conversion hook throws", async () => {
    const lock = { current: false };
    const statuses: SubmissionStatus[] = [];
    const steps = {
      send: async () => VALID,
      onAccepted: () => {
        throw new Error("tag failure");
      },
      onStatus: (status: SubmissionStatus) => statuses.push(status),
    };
    await assert.rejects(runSubmission(lock, steps), /tag failure/);
    assert.equal(lock.current, true, "a retry must not post the saved lead again");
    assert.deepEqual(statuses, ["submitting", "success"]);
  });
});

// Provenance: lp-starter e8e8d9b. This repo predates lp-starter, so src/components/LeadForm.tsx is
// the legacy Portland form; the wiring checks target the market controller and form instead.
describe("lead form wiring", () => {
  const read = (path: string): string => readFileSync(join(process.cwd(), path), "utf8");

  it("the controller sends directly and never dispatches or intercepts a native submit", () => {
    const controller = read("src/markets/useMarketLeadController.ts");
    assert.doesNotMatch(controller, /requestSubmit|\.submit\(\)|dispatchEvent|addEventListener|gateManagedSubmit/);
    assert.doesNotMatch(read("src/lib/managedSubmit.ts"), /addEventListener|stopImmediatePropagation/);
  });

  it("the form wires the keydown boundary and the onSubmit backstop, with a type=button submit control", () => {
    const form = read("src/markets/components/MarketLeadForm.tsx");
    assert.match(form, /<form ref=\{formRef\} noValidate onKeyDown=\{handleKeyDown\} onSubmit=\{handleSubmit\}/);
    const button = read("src/markets/components/SubmitControl.tsx");
    assert.match(button, /<button\s+type="button"\s+onClick=\{onSend\}/);
    assert.doesNotMatch(button + form, /type="submit"|requestSubmit\(/);
  });
});
