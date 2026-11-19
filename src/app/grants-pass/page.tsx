import type { Metadata } from "next";
import type { ReactElement } from "react";
import { MarketPage } from "@/markets/components/MarketPage";
import { marketMetadata } from "@/markets/metadata";

export const metadata: Metadata = marketMetadata("grants-pass");

export default function Page(): ReactElement {
  return <MarketPage marketId="grants-pass" />;
}
