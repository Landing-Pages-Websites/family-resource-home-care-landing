import type { ReactElement } from "react";
import { CityChips } from "./CityChips";
import { OfficeActions } from "./OfficeActions";
import { Reveal } from "@/components/Reveal";
import type { Market } from "../markets";
import { SectionHeading } from "./SectionHeading";

interface MarketLocationsProps {
  market: Market;
}

/** Service-area chips and the first-party office address, with call and assessment actions. */
export function MarketLocations({ market }: MarketLocationsProps): ReactElement {
  return (
    <section id="service-area" className="py-16 sm:py-20 lg:py-24 bg-[var(--color-soft)]" aria-labelledby="area-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading eyebrow={<>{market.counties}</>} id="area-title">
            Your Local {market.name}&nbsp;Office
          </SectionHeading>
        </div>
        <Reveal variant="up" delay={160}>
          <div className="mt-10 bg-white rounded-2xl p-6 sm:p-8 border border-[var(--color-border)] shadow-sm">
            <CityChips market={market} />
            <OfficeActions market={market} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
