"use client";

import { LeadForm } from "./LeadForm";
import { Reveal } from "./Reveal";
import type { Territory } from "./Brand";

interface ContactProps {
  territory: Territory;
}

export function Contact({ territory }: ContactProps) {
  return (
    <section
      id="contact"
      className="py-16 sm:py-20 lg:py-24 bg-[var(--color-primary)] text-white relative overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 0% 0%, rgba(70,188,236,0.20), transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(245,166,35,0.15), transparent 50%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        <div>
          <Reveal variant="up">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/15 text-[var(--color-accent)]">
              Free Assessment
            </span>
          </Reveal>
          <Reveal variant="up" delay={80}>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold leading-tight">
              Care in {territory.name} can start as soon as tomorrow.
            </h2>
          </Reveal>
          <Reveal variant="up" delay={140}>
            <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed">
              Tell us a little about your loved one and we&rsquo;ll call to
              schedule your free in-home assessment — usually same day or next
              day. No pressure, no obligation, no commitment.
            </p>
          </Reveal>

          <Reveal variant="up" delay={200}>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-lg bg-white/10 text-[var(--color-accent)] flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z" />
                  </svg>
                </span>
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold text-[var(--color-accent)]">
                    Call {territory.name}
                  </div>
                  <a
                    href={territory.phoneHref}
                    className="block text-xl sm:text-2xl font-extrabold mt-1 hover:text-[var(--color-accent)] transition"
                  >
                    {territory.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-lg bg-white/10 text-[var(--color-accent)] flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                    />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold text-[var(--color-accent)]">
                    {territory.name} Office
                  </div>
                  <div className="mt-1 text-white/90 text-[15px]">
                    {territory.branchAddress}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-lg bg-white/10 text-[var(--color-accent)] flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4h16v16H4z M4 4l8 8 8-8"
                    />
                  </svg>
                </span>
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold text-[var(--color-accent)]">
                    Email
                  </div>
                  <a
                    href={`mailto:${territory.branchEmail}`}
                    className="block text-white/90 mt-1 hover:text-[var(--color-accent)] transition"
                  >
                    {territory.branchEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-lg bg-white/10 text-[var(--color-accent)] flex items-center justify-center shrink-0">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 7v5l3 2"
                    />
                  </svg>
                </span>
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold text-[var(--color-accent)]">
                    Hours
                  </div>
                  <div className="mt-1 text-white/90 text-[15px]">
                    Open 7 days · 24/7 on-call support
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal variant="right" delay={120}>
          <LeadForm
            territory={territory}
            variant="contact"
            headline="Request Your Free Assessment"
            subhead="Tell us a little about your loved one — we'll call to schedule a visit, usually within minutes during business hours."
          />
        </Reveal>
      </div>
    </section>
  );
}
