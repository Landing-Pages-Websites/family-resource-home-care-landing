"use client";

import { Reveal } from "./Reveal";

const STATS = [
  {
    value: "28+",
    label: "Years Caring",
    sub: "Family-owned and trusted in the Pacific Northwest since 1996.",
  },
  {
    value: "Same Day",
    label: "Assessments",
    sub: "Free in-home visits available today or tomorrow — no obligation.",
  },
  {
    value: "Award",
    label: "Winning",
    sub: "Best of Home Care — Provider, Employer & Leader in Experience.",
  },
  {
    value: "Local",
    label: "Caregivers",
    sub: "Hand-matched, background-checked, and supervised by your local office.",
  },
] as const;

export function Stats() {
  return (
    <section
      id="stats"
      className="relative -mt-8 sm:-mt-10 z-10 px-4 sm:px-6"
      aria-label="Why families choose Family Resource Home Care"
    >
      <div className="max-w-7xl mx-auto bg-white border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[var(--color-border)]">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} variant="up" delay={i * 80}>
              <div className="p-5 sm:p-6 lg:p-7 text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-primary)] leading-none">
                  {stat.value}
                </div>
                <div className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
                  {stat.label}
                </div>
                <div className="mt-1.5 text-xs sm:text-[13px] text-[var(--color-text-muted)] leading-snug">
                  {stat.sub}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
