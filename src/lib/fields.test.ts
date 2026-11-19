import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  EMAIL_PATTERN,
  EMAIL_REGEX,
  formatPhone,
  isValidEmail,
  isValidPhone,
  nationalDigits,
  normalizeEmail,
  phoneDigits,
} from "./fields";

const local = (length: number): string => "a".repeat(length);

/** Builds `<local>@<labels...>.com` totalling exactly `total` characters. */
function addressOfLength(total: number): string {
  const tail = ".com";
  const labels: string[] = [];
  let remaining = total - "a@".length - tail.length;
  while (remaining > 0) {
    const size = Math.min(63, remaining);
    labels.push("b".repeat(size));
    remaining -= size + 1;
  }
  const domain = labels.join(".");
  const address = `a@${domain}${tail}`;
  return address.length === total ? address : `a@${domain}${"c".repeat(total - address.length)}${tail}`;
}

describe("email: accepted", () => {
  const accepted = [
    "you@company.com",
    "first.last+tag@sub.example.io",
    "a@b.co",
    "UPPER@EXAMPLE.COM",
    "  padded@x.com  ",
    "a_b%c@x-y.com",
    `${local(64)}@x.com`,
    `x@${"d".repeat(63)}.com`,
    addressOfLength(254),
  ];
  for (const value of accepted) {
    it(`accepts ${value.slice(0, 40)}`, () => assert.equal(isValidEmail(value), true));
  }
});

describe("email: rejected", () => {
  const rejected: Array<[string, string]> = [
    ["no @", "you.company.com"],
    ["two @", "a@b@x.com"],
    ["no TLD", "me@x"],
    ["no TLD 2", "foo@bar"],
    ["1-letter TLD", "a@x.c"],
    ["numeric TLD", "a@x.123"],
    ["consecutive dots in local", "a..b@x.com"],
    ["consecutive dots in domain", "a@x..com"],
    ["leading dot in local", ".a@x.com"],
    ["trailing dot in local", "a.@x.com"],
    ["label starts with hyphen", "a@-x.com"],
    ["label ends with hyphen", "a@x-.com"],
    ["inner whitespace", "a b@x.com"],
    ["tab inside", "a@x\t.com"],
    ["empty local", "@x.com"],
    ["empty domain", "a@"],
    ["quoted local", '"quoted"@x.com'],
    ["unicode local", "josé@x.com"],
    ["kelvin sign in TLD", "a@x.Kom"],
    ["65-char local", `${local(65)}@x.com`],
    ["64-char label overflow", `a@${"d".repeat(64)}.com`],
    ["255-char address", addressOfLength(255)],
    ["empty", ""],
    ["whitespace only", "   "],
  ];
  for (const [label, value] of rejected) {
    it(`rejects ${label}`, () => assert.equal(isValidEmail(value), false));
  }

  it("rejects non-strings", () => {
    for (const value of [undefined, null, 42, {}]) assert.equal(isValidEmail(value), false);
  });
});

describe("email: normalisation", () => {
  const cases: Array<[string, string]> = [
    ["  Me@EXAMPLE.Com ", "Me@example.com"],
    ["UPPER@EXAMPLE.COM", "UPPER@example.com"],
    ["a@b.co", "a@b.co"],
  ];
  for (const [input, expected] of cases) {
    it(`${JSON.stringify(input)} -> ${expected}`, () => assert.equal(normalizeEmail(input), expected));
  }
});

describe("email: EMAIL_PATTERN under the browser's `v` flag", () => {
  it("compiles and agrees with EMAIL_REGEX on every probe", () => {
    const unicodeSets = new RegExp(`^(?:${EMAIL_PATTERN})$`, "v");
    const probes = ["you@company.com", "me@x", "a..b@x.com", "a@-x.com", "a@x.c", "x@y.io", "a+b@c-d.org", "a b@x.com"];
    for (const probe of probes) assert.equal(unicodeSets.test(probe), EMAIL_REGEX.test(probe), probe);
  });
});

describe("phone: input handling", () => {
  const cases: Array<[string, string]> = [
    ["+1 (413) 412-3123", "(413) 412-3123"],
    ["1-413-412-3123", "(413) 412-3123"],
    ["14134123123", "(413) 412-3123"],
    ["tel:+14134123123", "(413) 412-3123"],
    ["4134123123", "(413) 412-3123"],
    ["  (413) 412-3123  ", "(413) 412-3123"],
    ["413", "(413"],
    ["4134", "(413) 4"],
    ["413412", "(413) 412"],
    ["", ""],
  ];
  for (const [input, expected] of cases) {
    it(`formats ${JSON.stringify(input)} -> ${JSON.stringify(expected)}`, () => assert.equal(formatPhone(input), expected));
  }

  it("leaves non-NANP input exactly as entered, never truncating", () => {
    for (const raw of [
      "+52 55 1234 5678",
      "+44 7911 123456",
      "+91 98765 43210",
      "+86 138 0013 8000",
      "Phone #2: 413-412-3123",
      "(413) 412-31234",
      "+1 413 412 3123 ext 45",
    ]) {
      assert.equal(formatPhone(raw), raw);
      assert.equal(phoneDigits(raw), "");
      assert.equal(nationalDigits(raw), null);
    }
  });

  it("typing a leading 1 digit by digit ends at the national number", () => {
    const typed = "14134123123";
    let shown = "";
    for (const ch of typed) shown = formatPhone(shown + ch);
    assert.equal(shown, "(413) 412-3123");
  });

  it("drops the 1 only from exactly 11 digits", () => {
    assert.equal(phoneDigits("14134123123"), "4134123123");
    assert.equal(phoneDigits("1413412312"), "1413412312");
    assert.equal(phoneDigits("141341231234"), "");
  });

  it("is idempotent on its own output", () => {
    assert.equal(formatPhone(formatPhone("+1 (413) 412-3123")), "(413) 412-3123");
  });
});

describe("phone: only phone characters reach digit extraction", () => {
  // Each of these holds exactly one valid-looking 10-digit number once non-digits are stripped.
  const rejected: Array<[string, string]> = [
    ["letters only", "abc"],
    ["letters after +1", "+1abc4134123123"],
    ["letters inside the number", "+1413abc4123123"],
    ["leading letters", "abc4134123123"],
    ["trailing letters", "4134123123abc"],
    ["label text", "Phone #2: 413-412-3123"],
    ["extension marker", "413-412-3123 x"],
    ["unicode letters", "413\u00e9412-3123"],
    ["hash", "#413-412-3123"],
    ["slash", "413/412/3123"],
    ["colon", "413:412:3123"],
    ["comma", "413,412,3123"],
    ["star", "*4134123123"],
    ["underscore", "413_412_3123"],
    ["plus inside the number", "413+412-3123"],
    ["plus after the country code", "1+4134123123"],
    ["double plus", "++14134123123"],
    ["second plus", "+1+4134123123"],
    ["trailing plus", "4134123123+"],
    ["unsupported scheme", "sms:+14134123123"],
    ["scheme not at the start", "+1 tel:4134123123"],
    ["scheme twice", "tel:tel:4134123123"],
    ["space between + and 1", "+ 14134123123"],
    ["foreign code after the scheme", "tel:+44 4134123123"],
  ];
  for (const [label, value] of rejected) {
    it(`rejects ${label} without fabricating a number: ${JSON.stringify(value)}`, () => {
      assert.equal(nationalDigits(value), null);
      assert.equal(phoneDigits(value), "");
      assert.equal(formatPhone(value), value);
      assert.equal(isValidPhone(value), false);
    });
  }

  const accepted = [
    "4134123123",
    "413 412 3123",
    "413.412.3123",
    "413-412-3123",
    "(413)412-3123",
    "(413) 412-3123",
    "+14134123123",
    "+1 413 412 3123",
    "+1 (413) 412-3123",
    "+1-413-412-3123",
    "+1.413.412.3123",
    "1-413-412-3123",
    "1 (413) 412-3123",
    "tel:+14134123123",
    "TEL:4134123123",
    "tel: +1 413 412 3123",
    "413\u2013412\u20133123",
    "413\u2011412\u20113123",
    "  +1 (413) 412-3123  ",
    "413\t412\t3123",
  ];
  for (const value of accepted) {
    it(`accepts ${JSON.stringify(value)} as 4134123123`, () => {
      assert.equal(phoneDigits(value), "4134123123");
      assert.equal(formatPhone(value), "(413) 412-3123");
      assert.equal(isValidPhone(value), true);
    });
  }
});

describe("phone: validity", () => {
  const accepted = ["(413) 412-3123", "(615) 469-0703", "(212) 555-1234", "+1 (413) 412-3123", "1-212-555-1234", "tel:+16154690703", "tel:+14134123123"];
  for (const value of accepted) it(`accepts ${value}`, () => assert.equal(isValidPhone(value), true));

  const rejected: Array<[string, string]> = [
    ["area starts with 1", "(123) 456-7890"],
    ["area starts with 0", "(011) 412-3123"],
    ["N11 area 911", "(911) 412-3123"],
    ["N11 area 211", "(211) 412-3123"],
    ["N11 area 411", "(411) 412-3123"],
    ["N11 exchange 211", "212-211-5555"],
    ["N11 exchange 411", "4134111234"],
    ["exchange starts with 1", "(413) 155-1234"],
    ["exchange starts with 0", "(413) 055-1234"],
    ["fictional 555-0100", "(413) 555-0100"],
    ["fictional 555-0101 in the QA area", "(555) 555-0101"],
    ["fictional 555-0199 in the QA area", "(555) 555-0199"],
    ["fictional 555-0123", "(413) 555-0123"],
    ["fictional 555-0199", "(413) 555-0199"],
    ["too short", "(413) 412-312"],
    ["empty", ""],
    ["Mexico +52", "+52 55 1234 5678"],
    ["UK +44", "+44 7911 123456"],
    ["UK +44 landline", "+44 20 7946 0958"],
    ["India +91", "+91 98765 43210"],
    ["China +86", "+86 138 0013 8000"],
    ["label text with digits", "Phone #2: 413-412-3123"],
    ["extension", "+1 413 412 3123 ext 45"],
    ["11 digits not starting with 1", "24134123123"],
    ["too many digits", "(413) 412-31234"],
    ["unicode digits", "\u0664\u0661\u0663\u0664\u0661\u0662\u0663\u0661\u0662\u0663"],
    ["letters", "call me maybe"],
  ];
  for (const [label, value] of rejected) it(`rejects ${label}`, () => assert.equal(isValidPhone(value), false));

  for (let n = 2; n <= 9; n += 1) {
    const n11 = `${n}11`;
    for (const national of [`${n11}4123123`, `413${n11}1234`]) {
      for (const value of [national, `+1 ${national}`]) {
        it(`rejects N11 area or exchange in ${value}`, () => assert.equal(isValidPhone(value), false));
      }
    }
  }

  it("accepts non-N11 neighbors in either block and N11 in the line number", () => {
    for (const block of ["210", "212", "310", "312", "910", "912"]) {
      assert.equal(isValidPhone(`${block}4123123`), true, block);
      assert.equal(isValidPhone(`413${block}1234`), true, block);
    }
    assert.equal(isValidPhone("4134120211"), true);
  });

  it("+44 is rejected for its country code, not its digit count", () => {
    assert.equal(nationalDigits("+44 20 7946 0958"), null);
    assert.equal(isValidPhone("+44 4134123123"), false);
  });

  it("accepts the mandated QA number 5555550100 in every input form", () => {
    for (const value of ["+15555550100", "15555550100", "5555550100", "(555) 555-0100", "tel:+15555550100"]) {
      assert.equal(isValidPhone(value), true, value);
      assert.equal(formatPhone(value), "(555) 555-0100", value);
      assert.equal(phoneDigits(value), "5555550100", value);
    }
  });

  it("the QA exception is that one number, not its overlong or foreign variants", () => {
    for (const value of ["+155555501001", "555555010012", "+44 5555550100", "+52 5555550100"]) {
      assert.equal(isValidPhone(value), false, value);
      assert.equal(formatPhone(value), value, value);
    }
  });

  it("accepts 555 exchanges outside 01XX", () => {
    assert.equal(isValidPhone("(212) 555-0200"), true);
    assert.equal(isValidPhone("(212) 555-1000"), true);
  });
});
