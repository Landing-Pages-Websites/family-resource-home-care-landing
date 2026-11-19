import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { coversLane, floatingLane } from "./floatingCta";

// The bar shown at 760-820px, and the same bar hidden (24px lower) or mid-fade.
const SHOWN = { top: 760, bottom: 820, left: 12, right: 378 };
const shifted = (y: number) => ({ ...SHOWN, top: SHOWN.top + y, bottom: SHOWN.bottom + y });

describe("floating CTA lane", () => {
  it("is the same lane whether the bar is shown, hidden or mid-fade", () => {
    const expected = floatingLane(SHOWN, 0);
    assert.deepEqual(floatingLane(shifted(24), 24), expected);
    assert.deepEqual(floatingLane(shifted(9.5), 9.5), expected);
    assert.deepEqual(expected, { top: 760, bottom: 844, left: 12, right: 378 });
  });

  it("gives one stable answer for a control resting just above the shown bar", () => {
    const link = { top: 705, bottom: 740, left: 40, right: 200 }; // 740 + 32 reaches the lane top (760)
    const shownAnswer = coversLane(floatingLane(SHOWN, 0), link);
    const hiddenAnswer = coversLane(floatingLane(shifted(24), 24), link);
    assert.equal(shownAnswer, hiddenAnswer);
    assert.equal(shownAnswer, true, "within Reveal's 32px travel of the lane");
  });

  it("ignores controls well clear of the lane", () => {
    assert.equal(coversLane(floatingLane(SHOWN, 0), { top: 400, bottom: 450, left: 40, right: 200 }), false);
    assert.equal(coversLane(floatingLane(SHOWN, 0), { top: 770, bottom: 800, left: 420, right: 500 }), false);
  });
});
