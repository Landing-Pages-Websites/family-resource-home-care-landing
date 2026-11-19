import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { fireConversionEvents, type MegaTagApi } from "./conversionEvents";
import type { SubmittedFormData } from "./leadPayload";
import { SITE } from "@/site";

const FORM_ID = "form-hero";

interface Tracked {
  name: string;
  payload: unknown;
}

describe("fireConversionEvents", () => {
  let tracked: Tracked[];
  let dataLayer: Record<string, unknown>[];
  const originalWindow = globalThis.window;

  const installWindow = (trackEvent?: MegaTagApi["trackEvent"]): void => {
    globalThis.window = { MegaTag: trackEvent ? { trackEvent } : undefined, dataLayer } as unknown as Window & typeof globalThis;
  };

  beforeEach(() => {
    tracked = [];
    dataLayer = [];
    installWindow((name, payload) => void tracked.push({ name, payload }));
  });

  afterEach(() => {
    globalThis.window = originalWindow;
  });

  const expectedDataLayer = [{ event: "form_submission", form_id: FORM_ID, form_provider: SITE.sourceProvider }];

  const shapes: Array<[string, SubmittedFormData]> = [
    ["contact fields", { firstName: "Ada", email: "ada@x.com", phone: "+15125550123", budget: 250 }],
    ["no contact values", { serviceType: "weekly", zip: "78701", poolSize: "" }],
    ["keys named like ours", { element: "attacker", elementId: "attacker", email: "a@x.com" }],
  ];
  for (const [label, formData] of shapes) {
    it(`sends one form_submit as { elementId, formData }, every field its own key under formData (${label})`, () => {
      fireConversionEvents(FORM_ID, formData);
      assert.deepEqual(tracked, [{ name: "form_submit", payload: { elementId: FORM_ID, formData } }]);
      assert.deepEqual(dataLayer, expectedDataLayer);
    });
  }

  const brokenTags: Array<[string, MegaTagApi["trackEvent"]]> = [
    ["throwing", () => {
      throw new Error("sdk down");
    }],
    ["missing", undefined],
  ];
  for (const [label, trackEvent] of brokenTags) {
    it(`a ${label} MegaTag still pushes the dataLayer event without throwing`, () => {
      installWindow(trackEvent);
      assert.doesNotThrow(() => fireConversionEvents(FORM_ID, { email: "a@x.com" }));
      assert.deepEqual(dataLayer, expectedDataLayer);
    });
  }
});
