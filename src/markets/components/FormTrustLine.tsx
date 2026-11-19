import type { ReactElement } from "react";
import { OWNERSHIP_TRUST, PAYMENT_TRUST } from "../content";
import { MarketIcon } from "./MarketIcon";

/** Below 1024px (the breakpoint where HeroCopy shows HeroTrustRow), the hero's trust signal sits under the compact submit. */
export function FormTrustLine(): ReactElement {
  return (
    <p className="lg:hidden mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-sm text-[var(--color-text-muted)] leading-snug">
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <MarketIcon name="shield" className="w-4 h-4 shrink-0 text-[var(--color-primary)]" strokeWidth={2} />
        {OWNERSHIP_TRUST}
      </span>
      <span className="whitespace-nowrap">{PAYMENT_TRUST}</span>
    </p>
  );
}
