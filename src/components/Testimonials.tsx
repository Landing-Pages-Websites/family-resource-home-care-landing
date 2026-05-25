"use client";

import { Reveal } from "./Reveal";

const TESTIMONIALS = [
  {
    quote:
      "From the first phone call we knew we were in good hands. The caregiver they matched with Mom feels like family — she shows up, she listens, and Mom actually looks forward to her visits.",
    name: "Jennifer R.",
    role: "Daughter of client",
    initials: "JR",
  },
  {
    quote:
      "After Dad's hospital stay we were terrified about bringing him home. Family Resource had a caregiver in place the next day. She helped with everything we couldn't and gave us our nights back.",
    name: "Michael & Lisa K.",
    role: "Son and daughter-in-law of client",
    initials: "MK",
  },
  {
    quote:
      "I'm a veteran and didn't realize the VA could cover my home care. Their team walked me through the paperwork and now I get help with meals and errands without leaving my place.",
    name: "Bob T.",
    role: "Client · Veteran",
    initials: "BT",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal variant="up">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              Families We&rsquo;ve Helped
            </span>
          </Reveal>
          <Reveal variant="up" delay={80}>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[var(--color-primary)] leading-tight">
              Why families across the Portland Metro trust us
            </h2>
          </Reveal>
          <Reveal variant="up" delay={140}>
            <p className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed">
              Family Resource Home Care is repeatedly recognized as a Best of
              Home Care Provider, Employer, and Leader in Experience.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} variant="up" delay={i * 100}>
              <figure className="h-full bg-[var(--color-warm)] rounded-2xl p-6 sm:p-7 border border-[var(--color-border)] flex flex-col">
                <div className="flex items-center gap-1 text-[var(--color-cta)]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <svg
                      key={idx}
                      className="w-4 h-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M10 1.5l2.6 5.3 5.9.86-4.25 4.14 1 5.86L10 14.9l-5.27 2.77 1-5.86L1.5 7.66l5.9-.86L10 1.5z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 text-[15px] sm:text-base text-[var(--color-text)] leading-relaxed grow">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {t.initials}
                  </span>
                  <div>
                    <div className="font-bold text-[var(--color-primary)] text-sm">
                      {t.name}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                      {t.role}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Badges row */}
        <Reveal variant="up" delay={400}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-90">
            {[
              {
                src: "/images/badge-best-of-home-care.png",
                alt: "Best of Home Care 2024 Award",
              },
              {
                src: "/images/badge-leader.png",
                alt: "Best of Home Care Leader in Experience",
              },
              {
                src: "/images/hcp-logo.png",
                alt: "Home Care Pulse Certified",
              },
            ].map((b) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={b.src}
                src={b.src}
                alt={b.alt}
                className="h-16 sm:h-20 w-auto"
                loading="lazy"
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
