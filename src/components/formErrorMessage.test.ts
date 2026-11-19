import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formErrorParts } from "./formErrorMessage";

describe("formErrorParts", () => {
  it("keeps the call fallback, phone and period together, when a phone is configured", () => {
    assert.deepEqual(formErrorParts("(555) 010-0100"), [
      "We could not send your request. Please try again, or call ",
      "(555) 010-0100.",
    ]);
  });

  for (const blank of ["", " ", "\t\n"]) {
    it(`drops the call fallback for phoneDisplay ${JSON.stringify(blank)}`, () => {
      assert.deepEqual(formErrorParts(blank), ["We could not send your request. Please try again.", ""]);
    });
  }
});
