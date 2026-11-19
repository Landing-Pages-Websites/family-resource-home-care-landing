import type { ReactElement } from "react";
import { PaymentOptions } from "./PaymentOptions";
import { ReasonGrid } from "./ReasonGrid";
import { Reveal } from "@/components/Reveal";
import type { Market } from "../markets";
import { SectionCta } from "./SectionCta";
import { SectionHeading } from "./SectionHeading";

interface MarketWhyUsProps {
  market: Market;
}

/** Four reason cards, the navy payment-options strip and the closing CTA pair. */
export function MarketWhyUs({ market }: MarketWhyUsProps): ReactElement {
  return (
    <section id="why-us" className="py-16 sm:py-20 lg:py-24 bg-white" aria-labelledby="why-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading eyebrow={<>Why Families Choose Us</>} id="why-title">
            A local team behind every&nbsp;visit.
          </SectionHeading>
          <Reveal variant="up" delay={140}>
            <p className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed">
              We pair thoughtful caregiver matching with the support of our {market.name}&nbsp;office.
            </p>
          </Reveal>
        </div>
        <ReasonGrid />
        <Reveal variant="up" delay={320}>
          <PaymentOptions />
        </Reveal>
        <SectionCta market={market} delay={360} />
      </div>
    </section>
  );
}
