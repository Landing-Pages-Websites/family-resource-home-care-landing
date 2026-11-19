import type { ReactElement } from "react";
import { SITE } from "@/site";
import { PRIVACY_URL } from "../content";
import type { Market } from "../markets";

interface MarketFooterProps {
  market: Market;
}

/** Legal-only footer: the business, the office and the privacy policy; no navigation exits. */
export function MarketFooter({ market }: MarketFooterProps): ReactElement {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[var(--color-primary-dark)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="text-lg font-extrabold">{SITE.brandName}</p>
          <p className="mt-2 text-sm text-white/80">{market.address}</p>
        </div>
        <a href={market.phoneHref} className="text-base font-semibold whitespace-nowrap hover:text-[var(--color-accent)] transition">
          {market.phoneDisplay}
        </a>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/75">
          <p>© {year} {SITE.brandName}. All rights reserved.</p>
          <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
