"use client";

import { Reveal } from "./Reveal";
import { SERVICES, type Territory } from "./Brand";

interface ServicesProps {
  territory: Territory;
}

function Icon({ name, className = "w-7 h-7" }: { name: string; className?: string }) {
  switch (name) {
    case "shower":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6a3 3 0 1 1 6 0v3M4 12h16M6 12v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-6" />
          <circle cx="9" cy="16" r="0.6" fill="currentColor" />
          <circle cx="12" cy="17" r="0.6" fill="currentColor" />
          <circle cx="15" cy="16" r="0.6" fill="currentColor" />
        </svg>
      );
    case "heart":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case "utensils":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 2v8a3 3 0 0 0 3 3v9M9 2v6M6 2v6M16 2c-2 0-4 2-4 5s2 5 4 5v9" />
        </svg>
      );
    case "car":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 17h14M5 17v3M19 17v3M3 17V11l2-5h14l2 5v6M7 14h.01M17 14h.01" />
        </svg>
      );
    case "shield":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z M9 12l2 2 4-4" />
        </svg>
      );
    case "hospital":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 21V8l8-5 8 5v13M9 21v-6h6v6M12 8v4M10 10h4" />
        </svg>
      );
    case "users":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    default:
      return null;
  }
}

export function Services({ territory }: ServicesProps) {
  return (
    <section
      id="services"
      className="py-16 sm:py-20 lg:py-24 bg-[var(--color-soft)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal variant="up">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              Services in {territory.name}
            </span>
          </Reveal>
          <Reveal variant="up" delay={80}>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[var(--color-primary)] leading-tight">
              In-Home Care That Adapts to Your Family
            </h2>
          </Reveal>
          <Reveal variant="up" delay={140}>
            <p className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed">
              Every plan begins with a free in-home assessment so we can match
              the right caregiver to your loved one&rsquo;s personality,
              routine, and needs in {territory.region}.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {SERVICES.map((svc, i) => (
            <Reveal key={svc.slug} variant="up" delay={i * 70}>
              <div className="h-full bg-white rounded-2xl p-6 sm:p-7 border border-[var(--color-border)] shadow-sm hover:shadow-md transition group">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition">
                  <Icon name={svc.icon} className="w-6 h-6" />
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-[var(--color-primary)] leading-snug">
                  {svc.name}
                </h3>
                <p className="mt-2 text-[15px] text-[var(--color-text-muted)] leading-relaxed">
                  {svc.short}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
