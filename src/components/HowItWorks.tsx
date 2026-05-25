"use client";

import Image from "next/image";
import { Reveal } from "./Reveal";
import type { Territory } from "./Brand";

interface HowItWorksProps {
  territory: Territory;
}

const STEPS = [
  {
    num: "01",
    title: "Talk with our team",
    body: "Call your local {territory.name} office or fill out the form. We'll ask a few quick questions to understand your loved one's situation.",
  },
  {
    num: "02",
    title: "Free in-home assessment",
    body: "A care coordinator visits the home — usually the same day or next day — to listen, learn routines, and build a customized care plan.",
  },
  {
    num: "03",
    title: "Care begins, on your terms",
    body: "We match your loved one with the right caregiver, set up the schedule, and stay in close contact as needs evolve.",
  },
];

/**
 * Distinct full-width "Not sure where to start?" CTA band.
 * Per Lindsay 2026-05-25 spec: pull the "Not sure where to start?" block out
 * of the feature-card grid and render it as a clearly differentiated band
 * between Services and Why Us. Uses a horizontal stepper (not cards) on a
 * dark navy gradient so it visually breaks from the Services card grid
 * above and the Why Us card grid below.
 */
export function HowItWorks({ territory }: HowItWorksProps) {
  return (
    <section
      id="how-it-works"
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-[var(--color-primary)] text-white"
    >
      {/* Lifestyle background photo, dimmed */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <Image
          src={territory.images.howItWorksBg.src}
          alt=""
          fill
          className="object-cover object-center opacity-[0.15]"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,42,72,0.92), rgba(11,42,72,0.97))",
        }}
      />
      {/* Accent stripes top & bottom to differentiate from surrounding card grids */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-cta)] to-[var(--color-accent)]"
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-cta)] to-[var(--color-accent)]"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal variant="up">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] bg-[var(--color-accent)]/20 text-[var(--color-accent)] border border-[var(--color-accent)]/40">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
              Not sure where to start?
            </span>
          </Reveal>
          <Reveal variant="up" delay={80}>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold leading-tight">
              Getting started is easy &mdash; here&rsquo;s how it works.
            </h2>
          </Reveal>
          <Reveal variant="up" delay={140}>
            <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed">
              Our care coordinators in {territory.name} walk you through every
              option in a friendly, no-pressure call. You decide if and when
              care starts &mdash; we make sure you have the information you need.
            </p>
          </Reveal>
        </div>

        {/* Horizontal connected stepper — visually distinct from card grids */}
        <Reveal variant="up" delay={220}>
          <div className="mt-12 sm:mt-14 relative">
            {/* Connector line (desktop) */}
            <div
              aria-hidden
              className="hidden md:block absolute top-7 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/60 to-transparent"
            />
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
              {STEPS.map((step) => (
                <li
                  key={step.num}
                  className="relative text-center px-2"
                >
                  <div className="mx-auto w-14 h-14 sm:w-[3.75rem] sm:h-[3.75rem] rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] flex items-center justify-center font-extrabold text-xl shadow-lg ring-4 ring-[var(--color-primary)]">
                    {step.num}
                  </div>
                  <h3 className="mt-5 text-lg sm:text-xl font-extrabold leading-snug text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-[14px] sm:text-[15px] text-white/80 leading-relaxed max-w-sm mx-auto">
                    {step.body.replace("{territory.name}", territory.name)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal variant="up" delay={400}>
          <div className="mt-12 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a href="#contact" className="btn-primary text-base sm:text-lg">
              Request My Free Assessment
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                aria-hidden="true"
              >
                <path
                  d="M5 12h14M13 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href={territory.phoneHref}
              className="btn-outline-light text-base sm:text-lg"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z" />
              </svg>
              Call {territory.phoneDisplay}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
