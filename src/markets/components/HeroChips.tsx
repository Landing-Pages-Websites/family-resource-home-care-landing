import type { ReactElement } from "react";
import { HERO_CHIPS } from "../content";
import { MarketIcon } from "./MarketIcon";

/** The four proof chips under the hero offer. */
export function HeroChips(): ReactElement {
  return (
    <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 max-w-xl">
      {HERO_CHIPS.map((chip) => (
        <li key={chip} className="flex items-start gap-2.5 text-white text-base font-medium">
          <span className="w-6 h-6 rounded-md bg-[var(--color-accent)] text-[var(--color-primary)] flex items-center justify-center shrink-0 mt-0.5">
            <MarketIcon name="check" className="w-3.5 h-3.5" strokeWidth={3.5} />
          </span>
          <span>{chip}</span>
        </li>
      ))}
    </ul>
  );
}
