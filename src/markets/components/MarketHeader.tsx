"use client";

import type { ReactElement } from "react";
import { Logo } from "@/components/Logo";
import { SITE } from "@/site";
import { HERO_FORM_ID, HERO_SECTION_ID } from "../content";
import type { Market } from "../markets";
import { MarketIcon } from "./MarketIcon";
import { useScrollFlag } from "./useScrollFlag";

interface MarketHeaderProps {
  market: Market;
}

const SCROLLED_PX = 24;
const hasScrolled = (): boolean => window.scrollY > SCROLLED_PX;

/** Logo plus the call and hero-form actions; no navigation exits. */
export function MarketHeader({ market }: MarketHeaderProps): ReactElement {
  const scrolled = useScrollFlag(hasScrolled);
  const surface = scrolled ? "bg-white/95 backdrop-blur shadow-md border-b border-[var(--color-border)]" : "bg-white border-b border-transparent";
  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${surface}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        <a href={`#${HERO_SECTION_ID}`} className="shrink-0 flex items-center rounded-md" aria-label={`${SITE.brandName}, back to top`}>
          <Logo className="h-10 sm:h-12" />
        </a>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={market.phoneHref}
            className="hidden sm:inline-flex items-center gap-2 min-h-11 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg px-3 py-2 font-bold text-sm whitespace-nowrap hover:bg-[var(--color-primary)] hover:text-white transition"
          >
            <MarketIcon name="phone" className="w-4 h-4" strokeWidth={2.4} />
            {market.phoneDisplay}
          </a>
          <a href={`#${HERO_FORM_ID}`} className="btn-primary min-h-11 text-sm px-4 sm:px-5 py-2.5 sm:py-3 whitespace-nowrap">
            Free Assessment
          </a>
        </div>
      </div>
    </header>
  );
}
