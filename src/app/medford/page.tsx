import type { Metadata } from "next";
import type { ReactElement } from "react";
import { MarketPage } from "@/markets/components/MarketPage";
import { marketMetadata } from "@/markets/metadata";

export const metadata: Metadata = marketMetadata("medford");

export default function Page(): ReactElement {
  return <MarketPage marketId="medford" />;
}
