import type { ReactElement } from "react";
import { FORM_ANCHOR } from "@/site";
import { PRIMARY_CTA } from "../content";
import type { Market } from "../markets";
import { MarketIcon } from "./MarketIcon";

interface Props {
  market: Market;
}

/** Office address above the call and assessment actions: stacked full width on phones, a centered pair from 1024px. */
export function OfficeActions({ market }: Props): ReactElement {
  return (
    <div className="mt-7 grid gap-5 lg:gap-6 items-stretch">
      <div className="bg-[var(--color-soft)] rounded-xl p-5 flex items-start gap-3">
        <span className="w-10 h-10 rounded-lg bg-white text-[var(--color-primary)] flex items-center justify-center shrink-0">
          <MarketIcon name="pin" className="w-5 h-5" />
        </span>
        <div>
          <p className="text-sm uppercase tracking-wider font-bold text-[var(--color-primary)]">Office address</p>
          <p className="mt-1 text-base text-[var(--color-text)] leading-relaxed">{market.address}</p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-center gap-3">
        <a href={market.phoneHref} className="btn-primary min-h-11 w-full lg:w-auto text-base whitespace-nowrap">
          <MarketIcon name="phone" className="w-4 h-4" strokeWidth={2.4} />
          Call {market.phoneDisplay}
        </a>
        <a href={FORM_ANCHOR} className="btn-secondary min-h-11 w-full lg:w-auto text-base">
          {PRIMARY_CTA}
        </a>
      </div>
    </div>
  );
}
