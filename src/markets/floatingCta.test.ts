import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { chatClearance, coversLane, floatingLane } from "./floatingCta";

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

// Chat geometry measured on production (Salem, 390x844): the 58px launcher at right 20 / bottom 20.
const PHONE_BAR = { left: 12, right: 378 };
const LAUNCHER = { top: 766, bottom: 824, left: 312, right: 370 };
const PROMPT = { top: 656, bottom: 756, left: 70, right: 370 };
const PANEL = { top: 129, bottom: 754, left: 30, right: 370 };

describe("floating CTA chat clearance", () => {
  it("keeps the resting position when no chat is painted", () => {
    assert.equal(chatClearance(PHONE_BAR, [], 844), 0);
  });

  it("lifts the bar 12px above the launcher bubble", () => {
    const offset = chatClearance(PHONE_BAR, [LAUNCHER], 844);
    assert.equal(offset, 90);
    assert.equal(844 - Number(offset), LAUNCHER.top - 12, "bar bottom sits 12px above the bubble");
  });

  it("clears the initial prompt above the bubble as well", () => {
    assert.equal(chatClearance(PHONE_BAR, [LAUNCHER, PROMPT], 844), 844 - PROMPT.top + 12);
  });

  it("reports no usable space while the open panel fills the screen", () => {
    assert.equal(chatClearance(PHONE_BAR, [LAUNCHER, PANEL], 844), null);
  });

  it("ignores chat boxes horizontally clear of the bar, and lifts the desktop bar that overlaps the launcher", () => {
    const desktopLauncher = { top: 822, bottom: 880, left: 1362, right: 1420 };
    assert.equal(chatClearance({ left: 1000, right: 1300 }, [desktopLauncher], 900), 0);
    assert.equal(chatClearance({ left: 1130, right: 1416 }, [desktopLauncher], 900), 90);
  });

  it("ignores chat boxes outside the viewport", () => {
    assert.equal(chatClearance(PHONE_BAR, [{ top: 900, bottom: 958, left: 312, right: 370 }], 844), 0);
  });
});
