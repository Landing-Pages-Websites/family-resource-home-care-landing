import type { ReactElement } from "react";
import { HeroBadge } from "./HeroBadge";
import { Reveal } from "@/components/Reveal";
import { MARKET_IMAGES } from "../images";
import { HERO_SECTION_ID } from "../content";
import type { Market } from "../markets";
import { HeroCopy } from "./HeroCopy";
import { MarketLeadForm } from "./MarketLeadForm";
import { SectionBackdrop } from "./SectionBackdrop";

interface MarketHeroProps {
  market: Market;
}

/** The compact template hero: form first on phones, beside the H1 from 1024px. */
export function MarketHero({ market }: MarketHeroProps): ReactElement {
  return (
    <section id={HERO_SECTION_ID} className="relative overflow-hidden bg-[var(--color-primary)] text-white pt-20 sm:pt-28 lg:pt-24 pb-14 sm:pb-16">
      <SectionBackdrop image={MARKET_IMAGES.heroBg} opacity="opacity-[0.18]" priority />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 5% 0%, rgba(70,188,236,0.30), transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(245,166,35,0.20), transparent 55%), linear-gradient(180deg, rgba(11,42,72,0.88), rgba(11,42,72,0.96))",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <div className="order-2 lg:order-1 lg:col-span-7">
          <HeroCopy market={market} />
        </div>
        <div className="order-1 lg:order-2 lg:col-span-5">
          <Reveal variant="right" delay={120}>
            <div className="relative">
              <HeroBadge />
              <MarketLeadForm market={market} placement="hero" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
