import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  STORAGE_KEYS,
  getCookie,
  getSessionId,
  getVisitorId,
  resolveAttribution,
  type AttributionEnv,
  type StorageLike,
} from "./attribution";

function memoryStorage(initial: Record<string, string> = {}): StorageLike & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => {
      data[key] = value;
    },
  };
}

function makeEnv(overrides: Partial<AttributionEnv> = {}): AttributionEnv {
  let counter = 0;
  return {
    search: "",
    cookie: "",
    local: memoryStorage(),
    session: memoryStorage(),
    now: () => 1_700_000_000_000,
    uuid: () => `uuid-${++counter}`,
    ...overrides,
  };
}

describe("ids", () => {
  it("persists the visitor id in localStorage and reuses it", () => {
    const env = makeEnv();
    const first = getVisitorId(env);
    assert.equal(first, "vis_uuid-1");
    assert.equal(getVisitorId(env), first);
    assert.equal((env.local as ReturnType<typeof memoryStorage>).data[STORAGE_KEYS.visitorId], first);
  });

  it("persists the session id in sessionStorage, not localStorage", () => {
    const env = makeEnv();
    const sid = getSessionId(env);
    assert.match(sid, /^sess_/);
    assert.equal(getSessionId(env), sid);
    assert.equal((env.local as ReturnType<typeof memoryStorage>).data[STORAGE_KEYS.sessionId], undefined);
    assert.equal((env.session as ReturnType<typeof memoryStorage>).data[STORAGE_KEYS.sessionId], sid);
  });

  it("still returns an id when storage throws", () => {
    const broken: StorageLike = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    assert.match(getVisitorId(makeEnv({ local: broken })), /^vis_/);
  });
});

describe("attribution from the URL", () => {
  const search = "?utm_source=google&utm_medium=cpc&utm_campaign=c&utm_term=t&utm_content=x&gclid=G1&gbraid=B1&wbraid=W1&fbclid=F1";

  it("takes every UTM and click id", () => {
    const attr = resolveAttribution(makeEnv({ search }));
    assert.deepEqual(
      [attr.utm_source, attr.utm_medium, attr.utm_campaign, attr.utm_term, attr.utm_content],
      ["google", "cpc", "c", "t", "x"],
    );
    assert.deepEqual([attr.gclid, attr.gbraid, attr.wbraid, attr.fbclid], ["G1", "B1", "W1", "F1"]);
  });

  it("reads the _fbp and _fbc cookies", () => {
    const attr = resolveAttribution(makeEnv({ search: "?gclid=G", cookie: "a=1; _fbp=fb.1.1.2; _fbc=fb.1.3.4" }));
    assert.equal(attr.fbp, "fb.1.1.2");
    assert.equal(attr.fbc, "fb.1.3.4");
  });

  it("derives fbc from fbclid when the cookie is absent", () => {
    const attr = resolveAttribution(makeEnv({ search: "?fbclid=ABC" }));
    assert.equal(attr.fbc, "fb.1.1700000000000.ABC");
  });

  it("returns nulls for a direct visit", () => {
    const attr = resolveAttribution(makeEnv());
    assert.equal(attr.gclid, null);
    assert.equal(attr.utm_source, null);
  });
});

describe("attribution from persisted params", () => {
  it("reuses the first tracked click on a later page without params", () => {
    const local = memoryStorage();
    resolveAttribution(makeEnv({ search: "?gclid=FIRST&utm_source=google", local }));
    const later = resolveAttribution(makeEnv({ search: "", local }));
    assert.equal(later.gclid, "FIRST");
    assert.equal(later.utm_source, "google");
  });

  it("falls back to the session's landing_params when the URL lost its query", () => {
    const session = memoryStorage({ [STORAGE_KEYS.landingParams]: "?gclid=KEPT&utm_campaign=spring" });
    const attr = resolveAttribution(makeEnv({ session }));
    assert.equal(attr.gclid, "KEPT");
    assert.equal(attr.utm_campaign, "spring");
  });

  it("a new tracked click replaces the stored one", () => {
    const local = memoryStorage();
    resolveAttribution(makeEnv({ search: "?gclid=OLD", local }));
    assert.equal(resolveAttribution(makeEnv({ search: "?gclid=NEW", local })).gclid, "NEW");
  });

  it("survives corrupt stored attribution", () => {
    const local = memoryStorage({ [STORAGE_KEYS.attribution]: "{not json" });
    assert.equal(resolveAttribution(makeEnv({ local })).gclid, null);
  });
});

describe("getCookie", () => {
  it("handles values containing '=' and missing names", () => {
    assert.equal(getCookie("a=1; _fbc=fb.1.2.x=y", "_fbc"), "fb.1.2.x=y");
    assert.equal(getCookie("a=1", "_fbp"), null);
    assert.equal(getCookie("", "_fbp"), null);
  });
});
