import type { ReactElement } from "react";
import { PAYMENT_TRUST } from "../content";
import { MarketIcon } from "./MarketIcon";

/** The template's trust row under the hero CTAs. HeroCopy shows it from 1024px; below that FormTrustLine carries it. */
export function HeroTrustRow(): ReactElement {
  return (
    <p className="mt-8 flex items-center gap-2 text-sm font-medium text-white/80">
      <MarketIcon name="shield" className="w-5 h-5 text-[var(--color-secondary)]" strokeWidth={2} />
      <span>
        <span className="font-semibold text-white">Payment accepted:</span> {PAYMENT_TRUST}
      </span>
    </p>
  );
}
