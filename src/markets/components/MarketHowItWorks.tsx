import type { ReactElement } from "react";
import { StepList } from "./StepList";
import { Reveal } from "@/components/Reveal";
import type { Market } from "../markets";
import { CtaPair } from "./CtaPair";
import { SectionHeading } from "./SectionHeading";

interface MarketHowItWorksProps {
  market: Market;
}

const STRIPE = "absolute left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-cta)] to-[var(--color-accent)]";

/**
 * The template's navy stepper band between the service cards and the reasons grid. The template's
 * dimmed backdrop photo is left out: the only originals with full-bleed pixels are the hero and
 * photo-band scenes, and a scene is never shown twice on a page.
 */
export function MarketHowItWorks({ market }: MarketHowItWorksProps): ReactElement {
  return (
    <section id="how-it-works" className="relative py-16 sm:py-20 lg:py-24 overflow-hidden bg-[var(--color-primary)] text-white" aria-labelledby="how-title">
      <div aria-hidden className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[rgba(11,42,72,0.92)] to-[rgba(11,42,72,0.97)]" />
      <div aria-hidden className={`${STRIPE} top-0`} />
      <div aria-hidden className={`${STRIPE} bottom-0`} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading eyebrow="Getting Started Is Simple" id="how-title" tone="dark">
            From the first conversation to the right support at&nbsp;home.
          </SectionHeading>
        </div>
        <Reveal variant="up" delay={220}>
          <div className="mt-12 sm:mt-14 relative">
            <div aria-hidden className="hidden md:block absolute top-7 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/60 to-transparent" />
            <StepList />
          </div>
        </Reveal>
        <Reveal variant="up" delay={300}>
          <CtaPair market={market} tone="dark" className="mt-12 sm:mt-14 justify-center" />
        </Reveal>
      </div>
    </section>
  );
}
