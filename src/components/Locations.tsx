"use client";

import { Reveal } from "./Reveal";
import type { Territory } from "./Brand";

interface LocationsProps {
  territory: Territory;
}

export function Locations({ territory }: LocationsProps) {
  return (
    <section
      id="service-area"
      className="py-16 sm:py-20 lg:py-24 bg-[var(--color-soft)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal variant="up">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              Where We Serve
            </span>
          </Reveal>
          <Reveal variant="up" delay={80}>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[var(--color-primary)] leading-tight">
              In-home care across {territory.name}
            </h2>
          </Reveal>
          <Reveal variant="up" delay={140}>
            <p className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed">
              Our {territory.name} team serves {territory.region}. Not sure if
              we cover your neighborhood? Call us and we&rsquo;ll confirm right
              away.
            </p>
          </Reveal>
        </div>

        <Reveal variant="up" delay={200}>
          <div className="mt-10 bg-white rounded-2xl p-6 sm:p-8 border border-[var(--color-border)] shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {territory.cities.map((city) => (
                <div
                  key={city}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[var(--color-soft-2)]"
                >
                  <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] shrink-0" />
                  <span className="text-sm sm:text-[15px] font-semibold text-[var(--color-primary)]">
                    {city}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-7 grid lg:grid-cols-3 gap-5 lg:gap-6 items-start">
              <div className="lg:col-span-2 bg-[var(--color-soft)] rounded-xl p-5">
                <div className="text-[11px] uppercase tracking-wider font-bold text-[var(--color-primary)]">
                  {territory.name} Office
                </div>
                <div className="mt-2 text-[15px] text-[var(--color-text)] leading-relaxed">
                  {territory.branchAddress}
                </div>
                <div className="mt-2 text-[14px] text-[var(--color-text-muted)]">
                  <a
                    className="hover:underline"
                    href={`mailto:${territory.branchEmail}`}
                  >
                    {territory.branchEmail}
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href={territory.phoneHref}
                  className="btn-primary w-full text-sm sm:text-base"
                >
                  Call {territory.phoneDisplay}
                </a>
                <a
                  href="#contact"
                  className="btn-secondary w-full text-sm sm:text-base"
                >
                  Free Assessment
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
