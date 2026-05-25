"use client";

import Image from "next/image";
import { Reveal } from "./Reveal";
import type { Territory } from "./Brand";

interface WelcomeProps {
  territory: Territory;
}

export function Welcome({ territory }: WelcomeProps) {
  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <Reveal variant="left">
          <div className="relative aspect-[4/5] sm:aspect-[5/6] rounded-3xl overflow-hidden shadow-xl">
            <Image
              src={territory.images.welcomeMain.src}
              alt={territory.images.welcomeMain.alt}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/35 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 bg-white/95 rounded-2xl p-4 shadow-lg">
              <div className="text-xs uppercase tracking-wider font-bold text-[var(--color-primary)]">
                Local team · {territory.name}
              </div>
              <div className="mt-1 text-sm text-[var(--color-text)] leading-snug">
                Care coordinators, caregivers, and 24/7 on-call support — all
                based right here in the Portland Metro.
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal variant="up">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[var(--color-accent)]/15 text-[var(--color-accent-dark)]">
              Welcome to {territory.name}
            </span>
          </Reveal>
          <Reveal variant="up" delay={80}>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.5rem] font-extrabold text-[var(--color-primary)] leading-tight">
              A neighborhood team that treats your family like our own.
            </h2>
          </Reveal>
          <Reveal variant="up" delay={140}>
            <p className="mt-5 text-[17px] text-[var(--color-text)] leading-relaxed">
              Family Resource Home Care has been the Pacific Northwest&rsquo;s
              trusted home care partner since 1996. Our {territory.name} branch
              brings that same hands-on, family-feel approach to{" "}
              {territory.region} — with caregivers who arrive on time, listen
              closely, and treat your loved one with the kind of patience and
              warmth you&rsquo;d give yourself.
            </p>
          </Reveal>
          <Reveal variant="up" delay={200}>
            <p className="mt-4 text-[17px] text-[var(--color-text-muted)] leading-relaxed">
              When you call, you&rsquo;ll speak with a real human in your
              community. When you book your free in-home assessment, our team
              comes to you — usually the same day or the next — to understand
              the routines, preferences, and small things that make your loved
              one feel at home.
            </p>
          </Reveal>

          <Reveal variant="up" delay={260}>
            <ul className="mt-7 space-y-3 max-w-xl">
              {[
                "Caregivers thoughtfully matched to personality & needs",
                "Hourly, overnight, or 24/7 live-in care available",
                "Backed by a full care-coordination team",
                "Approved to accept Medicaid, VA benefits & long-term care insurance",
              ].map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-[15px] sm:text-base"
                >
                  <span className="w-6 h-6 rounded-full bg-[var(--color-success)]/15 text-[var(--color-success)] flex items-center justify-center shrink-0 mt-0.5">
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
                  <span className="text-[var(--color-text)]">{line}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal variant="up" delay={320}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#contact" className="btn-primary">
                Get My Free Assessment
              </a>
              <a href={territory.phoneHref} className="btn-secondary">
                Call {territory.phoneDisplay}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
