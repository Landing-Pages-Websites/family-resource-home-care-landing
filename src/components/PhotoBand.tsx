"use client";

import Image from "next/image";
import { Reveal } from "./Reveal";
import type { Territory } from "./Brand";

interface PhotoBandProps {
  territory: Territory;
}

/**
 * Upper-third lifestyle imagery band (sits between Stats and Services).
 * Per Lindsay feedback (2026-05-25): "push more imagery up the page" —
 * the upper third was text-dense; this section breaks it with a real photo
 * sourced from familyresourcehomecare.com.
 */
export function PhotoBand({ territory }: PhotoBandProps) {
  const photo = territory.images.photoBand;
  return (
    <section
      id="local-care"
      className="py-12 sm:py-16 lg:py-20 bg-white"
      aria-label={`A glimpse of in-home care in ${territory.name}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <Reveal variant="left" className="lg:col-span-7">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-xl border border-[var(--color-border)]">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/35 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 bg-white/95 backdrop-blur rounded-full px-3 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] shadow">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                  Local team · {territory.name}
                </span>
                <span className="inline-flex items-center gap-2 bg-[var(--color-primary)]/90 backdrop-blur rounded-full px-3 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white shadow">
                  In-home senior care
                </span>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-5">
            <Reveal variant="up">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[var(--color-accent)]/15 text-[var(--color-accent-dark)]">
                Real Care, Real Families
              </span>
            </Reveal>
            <Reveal variant="up" delay={80}>
              <h2 className="mt-4 text-2xl sm:text-3xl lg:text-[2.1rem] font-extrabold text-[var(--color-primary)] leading-tight">
                A familiar face at the door &mdash; not a stranger.
              </h2>
            </Reveal>
            <Reveal variant="up" delay={140}>
              <p className="mt-4 text-[15px] sm:text-base text-[var(--color-text-muted)] leading-relaxed">
                Every Family Resource Home Care visit in {territory.name}{" "}
                starts with a caregiver who has been thoughtfully matched to your
                loved one&rsquo;s personality, routine, and home. We hire for
                warmth first &mdash; then back every caregiver with a local
                care-coordination team, 24/7 on-call support, and a free
                in-home assessment that listens before it prescribes.
              </p>
            </Reveal>
            <Reveal variant="up" delay={200}>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5 max-w-xl">
                {[
                  "Hand-matched caregivers",
                  "Background-checked & insured",
                  "Locally supervised",
                  "Same/next-day visits",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-2.5 text-[14px] sm:text-[15px] text-[var(--color-text)] font-medium"
                  >
                    <span className="w-5 h-5 rounded-md bg-[var(--color-accent)]/20 text-[var(--color-accent-dark)] flex items-center justify-center shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 24 24"
                        fill="none"
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
          </div>
        </div>
      </div>
    </section>
  );
}
