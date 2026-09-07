"use client";

import Image from "next/image";
import { LeadForm } from "./LeadForm";
import { Reveal } from "./Reveal";
import type { Territory } from "./Brand";

interface HeroProps {
  territory: Territory;
}

export function Hero({ territory }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-20 overflow-hidden bg-[var(--color-primary)] text-white"
    >
      {/* Background caregiver photo, gently dimmed */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <Image
          src={territory.images.heroBg.src}
          alt=""
          fill
          priority
          className="object-cover object-center opacity-[0.18]"
        />
      </div>

      {/* Warm radial accents */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 5% 0%, rgba(70,188,236,0.30), transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(245,166,35,0.20), transparent 55%), linear-gradient(180deg, rgba(11,42,72,0.88), rgba(11,42,72,0.96))",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left: copy column */}
        <div className="lg:col-span-7">
          <Reveal variant="up">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 backdrop-blur px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
              {territory.heroPattern}
            </span>
          </Reveal>

          <Reveal variant="up" delay={80}>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.05] text-white">
              Compassionate{" "}
              {territory.id === "oregon-city" ? "Senior " : ""}In-Home Care in
              {" "}
              <span className="text-[var(--color-accent)]">
                {territory.name}
              </span>
            </h1>
          </Reveal>

          <Reveal variant="up" delay={140}>
            <p className="mt-5 text-lg sm:text-xl text-white/85 max-w-2xl leading-relaxed">
              Our caregivers help your loved one stay safe, comfortable, and
              independent at home across {territory.region}.{" "}
              <span className="text-white font-semibold">
                Free in-home assessment available same day or next day
              </span>{" "}
              — no pressure, no obligation.
            </p>
          </Reveal>

          <Reveal variant="up" delay={200}>
            <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 max-w-xl">
              {[
                "Free same/next-day assessment",
                "Personalized care plan",
                "Caregivers matched to your loved one",
                "Family-owned since 1996",
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2.5 text-white text-[15px] sm:text-base font-medium"
                >
                  <span className="w-6 h-6 rounded-md bg-[var(--color-accent)] flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      className="w-3.5 h-3.5 text-[var(--color-primary)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal variant="up" delay={280}>
            <div className="mt-9 flex flex-wrap items-center justify-start gap-3">
              <a href="#contact" className="btn-primary text-base sm:text-lg">
                Get My Free Assessment
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

          <Reveal variant="up" delay={360}>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-white/75">
              <div className="flex items-center gap-2">
                <Stars />
                <span className="font-semibold text-white">
                  Best of Home Care
                </span>
                <span>Award Winner</span>
              </div>
              <span
                aria-hidden
                className="hidden sm:block w-px h-4 bg-white/20"
              />
              <span className="font-medium">Medicaid · VA · Private Pay</span>
              <span
                aria-hidden
                className="hidden sm:block w-px h-4 bg-white/20"
              />
              <span className="font-medium">Open 7 days</span>
            </div>
          </Reveal>
        </div>

        {/* Right: Form card */}
        <div className="lg:col-span-5">
          <Reveal variant="right" delay={120}>
            <div className="relative">
              <div className="hidden lg:flex absolute -top-4 -right-4 z-20 items-center gap-2 bg-[var(--color-cta)] text-white rounded-xl shadow-xl px-3.5 py-2.5">
                <svg
                  className="w-6 h-6 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3M21 12c0 5-4 9-9 9s-9-4-9-9 4-9 9-9 9 4 9 9z"
                  />
                </svg>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-widest font-extrabold leading-none">
                    Same Day
                  </div>
                  <div className="text-sm font-extrabold leading-tight">
                    Free Assessment
                  </div>
                </div>
              </div>

              <LeadForm
                territory={territory}
                variant="hero"
                headline="Request Your Free In-Home Assessment"
                subhead="Same-day or next-day visits available — we'll listen, answer questions, and help you decide if care is right for your loved one."
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Stars() {
  return (
    <span className="flex items-center text-[var(--color-cta)]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.3 5.9.86-4.25 4.14 1 5.86L10 14.9l-5.27 2.77 1-5.86L1.5 7.66l5.9-.86L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}
