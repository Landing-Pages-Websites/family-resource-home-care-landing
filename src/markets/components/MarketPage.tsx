import type { ReactElement } from "react";
import { QueryParamPersistence } from "@/components/QueryParamPersistence";
import { MARKETS, type MarketId } from "../markets";
import { LeadFlowProvider } from "./LeadFlowProvider";
import { MarketContact } from "./MarketContact";
import { MarketFAQ } from "./MarketFAQ";
import { MarketFloatingCTA } from "./MarketFloatingCTA";
import { MarketFooter } from "./MarketFooter";
import { MarketHeader } from "./MarketHeader";
import { MarketHero } from "./MarketHero";
import { MarketHowItWorks } from "./MarketHowItWorks";
import { MarketLocations } from "./MarketLocations";
import { MarketPhotoBand } from "./MarketPhotoBand";
import { MarketServices } from "./MarketServices";
import { MarketStats } from "./MarketStats";
import { MarketStory } from "./MarketStory";
import { MarketTestimonials } from "./MarketTestimonials";
import { MarketTracking } from "./MarketTracking";
import { MarketWelcome } from "./MarketWelcome";
import { MarketWhyUs } from "./MarketWhyUs";
import "../market.css";

interface MarketPageProps {
  marketId: MarketId;
}

/** The approved Portland template, section for section, for one new market. Server-rendered; forms are client islands. */
export function MarketPage({ marketId }: MarketPageProps): ReactElement {
  const market = MARKETS[marketId];
  return (
    <div className="frhc-market contents">
      <MarketTracking />
      <MarketHeader market={market} />
      <LeadFlowProvider>
        <main className="bg-white">
          <QueryParamPersistence />
          <MarketHero market={market} />
          <MarketStats />
          <MarketPhotoBand market={market} />
          <MarketWelcome market={market} />
          <MarketServices market={market} />
          <MarketHowItWorks market={market} />
          <MarketWhyUs market={market} />
          <MarketStory market={market} />
          <MarketLocations market={market} />
          <MarketTestimonials market={market} />
          <MarketFAQ market={market} />
          <MarketContact market={market} />
        </main>
      </LeadFlowProvider>
      <MarketFooter market={market} />
      <MarketFloatingCTA />
    </div>
  );
}
