import type { Metadata } from "next";
import { SITE } from "@/site";
import { MARKETS, SITE_ORIGIN, plainName, type MarketId } from "./markets";

export function marketMetadata(marketId: MarketId): Metadata {
  const market = MARKETS[marketId];
  const name = plainName(market);
  const title = `Senior In-Home Care in ${name} | ${SITE.brandName}`;
  const description = `Personal care, companionship, respite and 24-hour support in ${name}. Request a free in-home assessment, available same day or next day.`;
  const url = `${SITE_ORIGIN}/${market.id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, type: "website", url },
    robots: { index: true, follow: true },
  };
}
