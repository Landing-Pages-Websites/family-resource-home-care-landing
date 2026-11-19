import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { chatClearance, coversLane, crowdsLane, floatingLane, floatingVisibility, HIDDEN_SHIFT_PX, settledBounds } from "./floatingCta";

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

// QA's settled failure (Salem, 390x844, usable 375, scrollY 1836): the bar at 676.83-730 with the
// prompt-free chat lift, over both lines of the #local-care heading.
const QA_BAR = { top: 676.828125, bottom: 730, left: 12, right: 363 };
const QA_HEADING_LINES = [
  { top: 682.515625, bottom: 723.515625, left: 41.21875, right: 333.765625 },
  { top: 720.015625, bottom: 761.015625, left: 43.671875, right: 331.328125 },
];

describe("floating CTA static content lane", () => {
  it("is crowded by each line of the heading QA saw under the settled bar", () => {
    const lane = floatingLane(QA_BAR, 0);
    for (const line of QA_HEADING_LINES) assert.equal(crowdsLane(lane, line), true);
  });

  it("gives the same answer while the bar is hidden 24px lower", () => {
    const hidden = { ...QA_BAR, top: QA_BAR.top + 24, bottom: QA_BAR.bottom + 24 };
    assert.equal(crowdsLane(floatingLane(hidden, 24), QA_HEADING_LINES[0]), true);
  });

  it("keeps a 12px breathing gap above and below the lane, and nothing beyond it", () => {
    const lane = floatingLane(QA_BAR, 0); // 676.83 to 754
    assert.equal(crowdsLane(lane, { top: 600, bottom: 665, left: 40, right: 330 }), true, "11.8px above the bar");
    assert.equal(crowdsLane(lane, { top: 600, bottom: 664.5, left: 40, right: 330 }), false, "12.3px above the bar");
    assert.equal(crowdsLane(lane, { top: 766.5, bottom: 800, left: 40, right: 330 }), false, "12.5px below the hidden bar");
    assert.equal(crowdsLane(lane, { top: 765, bottom: 800, left: 40, right: 330 }), true, "11px below the hidden bar");
  });

  it("ignores content beside a narrow desktop bar", () => {
    const lane = floatingLane({ top: 790, bottom: 842, left: 1130, right: 1416 }, 0);
    assert.equal(crowdsLane(lane, { top: 780, bottom: 820, left: 300, right: 1100 }), false);
    assert.equal(crowdsLane(lane, { top: 780, bottom: 820, left: 300, right: 1125 }), true);
  });
});

describe("floating CTA settled bounds", () => {
  it("is the painted rect itself when nothing is translated", () => {
    const rect = { top: 700, bottom: 740, left: 40, right: 330 };
    assert.deepEqual(settledBounds(rect, { x: 0, y: 0 }), rect);
  });

  it("covers the whole remaining Reveal travel of content still sliding up", () => {
    // translate-y-8 (32px) before Reveal starts: the line will settle 32px higher than it paints now.
    const line = { top: 790, bottom: 831, left: 41, right: 334 };
    assert.deepEqual(settledBounds(line, { x: 0, y: 32 }), { top: 758, bottom: 831, left: 41, right: 334 });
    assert.equal(crowdsLane(floatingLane(QA_BAR, 0), line), false, "its painted rect alone looks clear");
    assert.equal(crowdsLane(floatingLane(QA_BAR, 0), settledBounds(line, { x: 0, y: 32 })), true);
  });

  it("covers a sideways Reveal (-translate-x-6) toward its resting place", () => {
    const photo = { top: 500, bottom: 700, left: 16, right: 600 };
    assert.deepEqual(settledBounds(photo, { x: -24, y: 0 }), { top: 500, bottom: 700, left: 16, right: 624 });
  });
});

describe("floating CTA visibility", () => {
  it("fades and slides in when shown", () => {
    const shown = floatingVisibility(true).split(" ");
    for (const cls of ["transition-[opacity,translate]", "duration-200", "opacity-100", "translate-y-0"]) assert.ok(shown.includes(cls), cls);
  });

  it("stops painting at once when hidden, so a fading bar never covers content scrolling under it", () => {
    const hidden = floatingVisibility(false).split(" ");
    for (const cls of ["opacity-0", "translate-y-6", "pointer-events-none"]) assert.ok(hidden.includes(cls), cls);
    assert.ok(!hidden.some((cls) => cls.startsWith("transition") || cls.startsWith("duration")), "no hide transition");
  });
});
