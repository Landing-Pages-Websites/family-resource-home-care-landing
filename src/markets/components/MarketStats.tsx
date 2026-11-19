import type { ReactElement } from "react";
import { Reveal } from "@/components/Reveal";
import { SITE } from "@/site";
import { STATS } from "../content";

const STAGGER_MS = 80;
/** One size for all four values, stepped to measured cell widths so the widest value fits (see PROVENANCE.md). */
const VALUE_SCALE = "text-2xl min-[440px]:text-xl sm:text-3xl lg:text-2xl xl:text-3xl min-[85rem]:text-4xl";

/** The template's overlapping four-cell trust strip. One column on narrow phones so no value overflows. */
export function MarketStats(): ReactElement {
  return (
    <section id="trust-bar" className="relative -mt-8 sm:-mt-10 z-10 px-4 sm:px-6" aria-label={`Why families choose ${SITE.brandName}`}>
      <div className="max-w-7xl mx-auto bg-white border border-[var(--color-border)] rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 min-[440px]:grid-cols-2 lg:grid-cols-4 divide-y min-[440px]:divide-y-0 lg:divide-x divide-[var(--color-border)]">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} variant="up" delay={i * STAGGER_MS}>
              <div className="p-5 sm:p-6 lg:p-7 text-center">
                <div className={`${VALUE_SCALE} font-extrabold text-[var(--color-primary)] leading-none`}>{stat.value}</div>
                <div className="mt-2 text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">{stat.label}</div>
                <p className="mt-1.5 text-sm text-[var(--color-text-muted)] leading-snug">{stat.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
