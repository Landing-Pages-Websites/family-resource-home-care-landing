import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { FAQS, OWNERSHIP_TRUST, STATS, marketTestimonials, type Testimonial } from "./content";
import { MARKETS, type MarketId } from "./markets";

// Exact copy from the human send-back (task f79bba62 qa_failure_reason).
const SALEM_QUOTE =
  "Staff at the Salem office are helpful, friendly, knowledgeable, polite and professional. … I applaud the staff for having all the qualities for this work: both the office people and the front‑line employees. Thank you for doing what you do.";
const ROSEBURG_QUOTE =
  "We finally found the right company after 16 years. The staff is great. … They actually check on us and make sure that my wife's needs are being met. They care and it shows! We have two fantastic caregivers. Both Sherree and Cary actually care about my wife and treat her like she's a person.";
const SPOUSE_QUOTE =
  "Other agencies just hire anyone who wants a job and they don't communicate as well. I can tell that Family Resource is not just doing this for the money. They are one of the very best agencies we've ever dealt with. … The communication has been excellent and they're very quick to call us back if we call them.";
const CLIENT_QUOTE =
  "I am no longer skipping meals because I'm too tired to prepare them. I can take walks with them and am going farther and feeling stronger than before. … The transition from independent living to needing assistance in my home has been made easier by their tact and professionalism.";
const VANESSA_QUOTE =
  "I would like to leave a huge compliment for my Caregiver today, named Vanessa! She was outstanding! Showed up on time, worked very hard the whole time she was here, did all that was asked and then some! Her attitude was very professional, caring and helpful. Great listener and communicator too. Thank you for sending her on my first day of care giving services with your company. She is a perfect example that shines as an employee in every way!!";

const MARKET_IDS = Object.keys(MARKETS) as MarketId[];
const FIRST_CARDS: Record<MarketId, Testimonial> = {
  salem: { quote: SALEM_QUOTE, initials: "SC", name: "Salem Client", year: "2026" },
  "grants-pass": { quote: ROSEBURG_QUOTE, initials: "RH", name: "Roseburg Husband of Client", year: "2026" },
  medford: { quote: ROSEBURG_QUOTE, initials: "RH", name: "Roseburg Husband of Client", year: "2026" },
  olympia: { quote: SPOUSE_QUOTE, initials: "SC", name: "Spouse of Client", year: "2024" },
};

describe("market testimonials", () => {
  const notes = MARKET_IDS.flatMap(marketTestimonials);

  for (const id of MARKET_IDS) {
    it(`${id}: market first review, then the shared client and Vanessa notes`, () => {
      assert.deepEqual(marketTestimonials(id), [
        FIRST_CARDS[id],
        { quote: CLIENT_QUOTE, initials: "FR", name: "Family Resource Client", year: "2025" },
        { quote: VANESSA_QUOTE, initials: "PE", name: "Portland East Client", year: "2026" },
      ]);
    });
  }

  it("marks each internal cut with exactly one ellipsis and keeps no Spokane credit", () => {
    for (const { quote } of notes.filter((n) => n.name !== "Portland East Client")) {
      assert.equal(quote.split("…").length - 1, 1, quote);
      assert.ok(!quote.startsWith("…"), quote);
    }
    assert.ok(notes.every((n) => !/Spokane/.test(n.quote + n.name)));
  });

  it("binds Salem's front‑line with U+2011 and adds no dashes", () => {
    assert.ok(marketTestimonials("salem")[0].quote.includes("front‑line"));
    assert.ok(notes.every((n) => !/[–—-]/.test(n.quote)));
  });
});

describe("trust strip and FAQ", () => {
  it("leads with the 50+ years of history stat and keeps the other three facts", () => {
    assert.deepEqual(STATS[0], {
      value: "50+",
      label: "Years of History",
      sub: "One of the largest independently owned home care agencies in the country, not a franchise.",
    });
    assert.deepEqual(
      STATS.slice(1).map((s) => [s.value, s.label]),
      [["Same Day", "Assessments"], ["24/7", "On‑Call Support"], ["Local", "Caregivers"]],
    );
    assert.equal(OWNERSHIP_TRUST, "Independently owned");
  });

  it("ends the minimum-visit answer on the shift length and keeps every question", () => {
    assert.deepEqual(FAQS[0], {
      q: "What is the minimum visit length?",
      a: "Our minimum shift is two to four hours, depending on the branch.",
    });
    assert.equal(FAQS.length, 8);
  });
});
