import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { chatClearance, coversLane, floatingLane, HIDDEN_SHIFT_PX } from "./floatingCta";

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
// The component's reveal (duration-200), sampled from its first frame to its end. Sampled linearly:
// the eased slide only ever moves up, so the first frame (fully shifted) is the worst case either way.
const REVEAL_MS = 200;
const REVEAL_SAMPLES_MS = [0, 16, 50, 100, 200];

describe("floating CTA chat clearance", () => {
  it("keeps the resting position when no chat is painted", () => {
    assert.equal(chatClearance(PHONE_BAR, [], 844), 0);
  });

  it("lifts the bar so its hidden position clears the launcher by 12px", () => {
    const offset = chatClearance(PHONE_BAR, [LAUNCHER], 844);
    assert.equal(offset, 114);
    assert.equal(844 - Number(offset) + HIDDEN_SHIFT_PX, LAUNCHER.top - 12, "hidden bar bottom sits 12px above the bubble");
  });

  it("keeps the whole reveal path clear of the launcher alone and with its prompt", () => {
    // Reveal: translate 24px -> 0 over 200ms (ease-out, monotonic), opacity 0 -> 1, pointer events on
    // from the first frame. The old 90px lift settled at 754 but started at 778, over the bubble at 766.
    const oldStart = LAUNCHER.top - 12 + HIDDEN_SHIFT_PX;
    assert.equal(oldStart, 778, "the old settled bottom (754) plus the hidden shift");
    assert.ok(oldStart > LAUNCHER.top, "started inside the bubble");
    for (const chat of [[LAUNCHER], [LAUNCHER, PROMPT]]) {
      const offset = Number(chatClearance(PHONE_BAR, chat, 844));
      const chatTop = Math.min(...chat.map((box) => box.top));
      for (const ms of REVEAL_SAMPLES_MS) {
        const barBottom = 844 - offset + HIDDEN_SHIFT_PX * (1 - ms / REVEAL_MS);
        assert.ok(barBottom <= chatTop - 12, `bar bottom ${barBottom} at ${ms}ms is 12px clear of ${chatTop}`);
      }
    }
  });

  it("clears the initial prompt above the bubble as well", () => {
    assert.equal(chatClearance(PHONE_BAR, [LAUNCHER, PROMPT], 844), 844 - PROMPT.top + 12 + HIDDEN_SHIFT_PX);
  });

  it("reports no usable space while the open panel fills the screen", () => {
    assert.equal(chatClearance(PHONE_BAR, [LAUNCHER, PANEL], 844), null);
  });

  it("ignores chat boxes horizontally clear of the bar, and lifts the desktop bar that overlaps the launcher", () => {
    const desktopLauncher = { top: 822, bottom: 880, left: 1362, right: 1420 };
    assert.equal(chatClearance({ left: 1000, right: 1300 }, [desktopLauncher], 900), 0);
    assert.equal(chatClearance({ left: 1130, right: 1416 }, [desktopLauncher], 900), 114);
  });

  it("ignores chat boxes outside the viewport", () => {
    assert.equal(chatClearance(PHONE_BAR, [{ top: 900, bottom: 958, left: 312, right: 370 }], 844), 0);
  });
});
