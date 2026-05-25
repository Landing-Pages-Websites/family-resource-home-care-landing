"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import type { Territory } from "./Brand";

interface FAQProps {
  territory: Territory;
}

// FAQs lightly paraphrased from
// https://www.familyresourcehomecare.com/how-we-help/frequently-asked-questions/
// Excluded per task: "home health," "assisted living," "Medicare," dementia/Alzheimer's.
function buildFaqs(territory: Territory) {
  return [
  {
    q: "What services does Family Resource Home Care provide?",
    a: "Our caregivers help with personal care (bathing, dressing, grooming), companion care, meal preparation, transportation and errands, veteran care, after-hospital and transitional care, and respite care for family caregivers. Every plan is built around your loved one's routine and needs during a free in-home assessment.",
  },
  {
    q: "How quickly can care start?",
    a: "Most families have a caregiver in the home within a day or two of the initial assessment — and assessments themselves are usually available same day or next day. We move quickly because we know urgency matters.",
  },
  {
    q: "What does an in-home assessment include?",
    a: "A care coordinator visits your loved one's home (no obligation, no cost) to learn their routine, preferences, mobility, and goals. We then build a customized care plan and match a caregiver chosen for their personality, skills, and schedule fit.",
  },
  {
    q: "What payment types do you accept?",
    a: "Medicaid, Veterans Affairs (VA) benefits, private pay, and long-term care insurance. Our team can help you understand what your specific policy or benefit covers and assist with paperwork.",
  },
  {
    q: "How are caregivers screened?",
    a: "Every caregiver completes background checks, references, and training before being placed. Care is supervised by your local office, and there's an on-call team available after hours if needs change.",
  },
  {
    q: "How do you match a caregiver to my loved one?",
    a: "We thoughtfully match caregivers based on personality, hobbies, skills, language, and schedule — not just availability. Most families stay with the same caregiver for years, which builds trust and consistency.",
  },
  {
    q: "Can care change as needs change?",
    a: "Absolutely. Many clients start with a few hours of companion care a week and add hours as needs evolve. We can scale up to overnight or 24/7 live-in care, and we can usually adjust the schedule the same day you call.",
  },
  {
    q: `Do you serve my city in ${territory.name}?`,
    a: `Our ${territory.name} team serves ${territory.region}. If your city isn't on the list, give us a call at ${territory.phoneDisplay} — we'll let you know right away whether we cover your neighborhood.`,
  },
  ];
}

export function FAQ({ territory }: FAQProps) {
  const [open, setOpen] = useState<number | null>(0);
  const FAQS = buildFaqs(territory);

  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <Reveal variant="up">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              Common Questions
            </span>
          </Reveal>
          <Reveal variant="up" delay={80}>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[var(--color-primary)] leading-tight">
              Answers for families exploring care
            </h2>
          </Reveal>
        </div>

        <div className="mt-10 divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} variant="fade" delay={i * 40}>
                <div>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-start justify-between gap-4 px-5 sm:px-7 py-5 text-left hover:bg-[var(--color-soft)] transition"
                  >
                    <span className="font-extrabold text-[var(--color-primary)] text-[15px] sm:text-base leading-snug">
                      {item.q}
                    </span>
                    <span
                      className={`mt-1 w-7 h-7 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0 transition-transform ${
                        isOpen ? "rotate-45" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 5v14M5 12h14"
                        />
                      </svg>
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-7 pb-5 -mt-1 text-[15px] text-[var(--color-text-muted)] leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal variant="up" delay={200}>
          <div className="mt-10 text-center">
            <p className="text-[var(--color-text-muted)]">
              Still have questions about care in {territory.name}?
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <a href="#contact" className="btn-primary">
                Request Free Assessment
              </a>
              <a href={territory.phoneHref} className="btn-secondary">
                Call {territory.phoneDisplay}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
