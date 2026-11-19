import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isZipCode } from "./zip";

describe("isZipCode", () => {
  it("accepts exactly five ASCII digits, leading zeros included", () => {
    for (const zip of ["33510", "00501", "01234", "00000", "99999"]) assert.equal(isZipCode(zip), true, zip);
  });

  it("rejects anything else, untrimmed: the caller trims first", () => {
    const rejected = [
      "", "3351", "335100", "33510-1234", "335101234", "3351a", "abcde", " 33510", "33510 ", "33 510",
      "<b>33510</b>", "３３５１０", "٣٣٥١٠", "33510\n", "-3351", "+3351", "3.510",
    ];
    for (const zip of rejected) assert.equal(isZipCode(zip), false, JSON.stringify(zip));
  });
});
