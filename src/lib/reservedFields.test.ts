import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { emptyAttribution } from "./attribution";
import { buildLeadPayload, normalizeFormData } from "./leadPayload";
import { RESERVED_FIELD_NAMES, ReservedFieldNameError } from "./reservedFields";
import { SITE, type FieldConfig } from "@/site";

const CONTEXT = { url: "https://lp.test/", referrerUrl: null, sessionId: "s", visitorId: "v" };

describe("reserved field names", () => {
  it("lists every key we or the worker own", () => {
    for (const name of ["element", "gclid", "gbraid", "wbraid", "fbclid", "user_agent"]) {
      assert.ok((RESERVED_FIELD_NAMES as readonly string[]).includes(name), name);
    }
  });

  for (const name of RESERVED_FIELD_NAMES) {
    const colliding: FieldConfig = { name, kind: "text", label: name };
    const site = { ...SITE, fields: [...SITE.fields, colliding] };

    it(`normalizeFormData rejects a field named ${name}`, () => {
      assert.throws(() => normalizeFormData(site.fields, { ...Object.fromEntries(site.fields.map((f) => [f.name, "x"])) }), ReservedFieldNameError);
    });

    it(`buildLeadPayload rejects a field named ${name}`, () => {
      assert.throws(() => buildLeadPayload(site, {}, CONTEXT, emptyAttribution()), ReservedFieldNameError);
    });
  }

  it("the starter's own fields use none of them", () => {
    assert.doesNotThrow(() => buildLeadPayload(SITE, {}, CONTEXT, emptyAttribution()));
  });
});
