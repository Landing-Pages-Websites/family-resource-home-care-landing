import type { ReactElement } from "react";
import { FORM_ANCHOR } from "@/site";
import { PRIMARY_CTA } from "../content";
import type { Market } from "../markets";
import { MarketIcon } from "./MarketIcon";

interface CtaPairProps {
  market: Market;
  /** The form the primary CTA opens: the final form by default, the hero form in the hero. */
  href?: string;
  /** "light" pairs the outlined navy call button; "dark" the outlined white one for navy sections. */
  tone?: "light" | "dark";
  /** "lg" is the hero's larger type. */
  size?: "md" | "lg";
  className?: string;
}

/** Primary assessment CTA beside the market call button. */
export function CtaPair({ market, href = FORM_ANCHOR, tone = "light", size = "md", className = "" }: CtaPairProps): ReactElement {
  const text = size === "lg" ? "text-base sm:text-lg" : "";
  const callStyle = tone === "dark" ? "btn-outline-light" : "btn-secondary";
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <a href={href} className={`btn-primary min-h-11 ${text}`}>
        {PRIMARY_CTA}
        <MarketIcon name="arrow" className="w-4 h-4" strokeWidth={2.6} />
      </a>
      <a href={market.phoneHref} className={`${callStyle} min-h-11 whitespace-nowrap ${text}`}>
        <MarketIcon name="phone" className={size === "lg" ? "w-5 h-5" : "w-4 h-4"} strokeWidth={2.4} />
        Call {market.phoneDisplay}
      </a>
    </div>
  );
}
