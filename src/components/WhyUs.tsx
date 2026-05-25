"use client";

import { Reveal } from "./Reveal";
import { PAYMENT_TYPES, type Territory } from "./Brand";

interface WhyUsProps {
  territory: Territory;
}

const REASONS = [
  {
    title: "Free in-home assessment",
    body: "A care coordinator visits — same day or next day, at no cost — to understand your loved one's routine, listen to your concerns, and build a care plan around their personality and home.",
    icon: "calendar",
  },
  {
    title: "Caregivers matched, not assigned",
    body: "We pair every client with a caregiver chosen for their personality, skills, language, and hobbies — not the first one available. Most families stay with the same caregiver for years.",
    icon: "match",
  },
  {
    title: "Flexible care, on your schedule",
    body: "From a few hours of companionship a week to overnight or 24/7 live-in care, our schedule flexes with yours. Need to adjust hours after a hospital stay? We can usually shift the same day.",
    icon: "clock",
  },
  {
    title: "Backed by a full local team",
    body: "Every caregiver is backed by a {territory.name} office that handles scheduling, supervision, and after-hours support — so there&rsquo;s always a real human to call when life changes.",
    icon: "team",
  },
];

function Icon({ name }: { name: string }) {
  const cls = "w-6 h-6 text-[var(--color-accent-dark)]";
  switch (name) {
    case "calendar":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM9 16l2 2 4-4" />
        </svg>
      );
    case "match":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 11h-6M19 8l3 3-3 3" />
        </svg>
      );
    case "clock":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
        </svg>
      );
    case "team":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        </svg>
      );
    default:
      return null;
  }
}

export function WhyUs({ territory }: WhyUsProps) {
  return (
    <section id="why-us" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal variant="up">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              Why Families Choose Us
            </span>
          </Reveal>
          <Reveal variant="up" delay={80}>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[var(--color-primary)] leading-tight">
              The Pacific Northwest&rsquo;s trusted in-home care since 1996.
            </h2>
          </Reveal>
          <Reveal variant="up" delay={140}>
            <p className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed">
              We&rsquo;ve helped thousands of families across Oregon and
              Washington keep loved ones safe at home — and we&rsquo;ve done it
              by hiring caregivers we&rsquo;d trust with our own parents.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {REASONS.map((r, i) => (
            <Reveal key={r.title} variant="up" delay={i * 80}>
              <div className="h-full bg-[var(--color-soft)] rounded-2xl p-6 sm:p-7 border border-[var(--color-border)]">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/15 flex items-center justify-center">
                  <Icon name={r.icon} />
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-[var(--color-primary)] leading-snug">
                  {r.title}
                </h3>
                <p className="mt-2 text-[15px] text-[var(--color-text-muted)] leading-relaxed">
                  {r.body.replace("{territory.name}", territory.name)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Payment options strip */}
        <Reveal variant="up" delay={400}>
          <div className="mt-12 rounded-2xl bg-[var(--color-primary)] text-white p-7 sm:p-9 shadow-lg">
            <div className="grid lg:grid-cols-5 gap-6 items-center">
              <div className="lg:col-span-2">
                <div className="text-[11px] uppercase tracking-wider font-bold text-[var(--color-accent)]">
                  Payment Options
                </div>
                <h3 className="mt-2 text-2xl sm:text-[1.75rem] font-extrabold leading-tight">
                  Flexible ways to pay for care
                </h3>
                <p className="mt-2 text-white/80 text-[15px] leading-relaxed">
                  We accept Medicaid, VA benefits, private pay, and long-term
                  care insurance — and our team can help you understand what
                  your policy covers.
                </p>
              </div>
              <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_TYPES.map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
                      <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="font-semibold text-white">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
