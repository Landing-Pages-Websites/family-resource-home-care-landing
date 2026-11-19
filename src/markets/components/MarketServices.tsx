import type { ReactElement } from "react";
import { Reveal } from "@/components/Reveal";
import { SERVICES } from "../content";
import type { Market } from "../markets";
import { SectionCta } from "./SectionCta";
import { SectionHeading } from "./SectionHeading";
import { MarketIcon } from "./MarketIcon";

const STAGGER_MS = 70;

interface MarketServicesProps {
  market: Market;
}

/** The template service-card grid; eight permitted services sit in two even rows of four, then the closing CTA pair. */
export function MarketServices({ market }: MarketServicesProps): ReactElement {
  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 bg-[var(--color-soft)]" aria-labelledby="services-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading eyebrow={<>Care That Fits Your Life</>} id="services-title">
            The right help, right at&nbsp;home.
          </SectionHeading>
        </div>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {SERVICES.map((service, i) => (
            <Reveal key={service.name} variant="up" delay={i * STAGGER_MS} className="h-full">
              <div className="h-full bg-white rounded-2xl p-6 sm:p-7 border border-[var(--color-border)] shadow-sm hover:shadow-md transition group">
                <span className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition">
                  <MarketIcon name={service.icon} className="w-6 h-6" />
                </span>
                <h3 className="mt-4 text-lg font-extrabold text-[var(--color-primary)] leading-snug">{service.name}</h3>
                <p className="mt-2 text-[15px] text-[var(--color-text-muted)] leading-relaxed">{service.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <SectionCta market={market} />
      </div>
    </section>
  );
}
