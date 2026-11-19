import type { ReactElement } from "react";
import { MarketIcon } from "./MarketIcon";

/** The template's "Same Day Free Assessment" tag on the hero form corner (desktop only). */
export function HeroBadge(): ReactElement {
  return (
    <div className="hidden lg:flex absolute -top-4 -right-4 z-20 items-center gap-2 bg-[var(--color-cta)] text-[var(--color-primary)] rounded-xl shadow-xl px-3.5 py-2.5">
      <MarketIcon name="clock" className="w-6 h-6 shrink-0" strokeWidth={2.5} />
      <span className="text-sm font-extrabold leading-tight">
        Same Day
        <br />
        Free Assessment
      </span>
    </div>
  );
}
