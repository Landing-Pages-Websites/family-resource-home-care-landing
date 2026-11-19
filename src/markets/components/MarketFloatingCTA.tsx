"use client";

import { useCallback, useRef, type ReactElement } from "react";
import { FORM_ANCHOR } from "@/site";
import { PRIMARY_CTA } from "../content";
import { shouldShowFloatingCta } from "../floatingCta";
import { MarketIcon } from "./MarketIcon";
import { useScrollFlag } from "./useScrollFlag";

/** Forward-only CTA to the final form, shown only in real gaps between the hero and the final form. */
export function MarketFloatingCTA(): ReactElement {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const read = useCallback(() => shouldShowFloatingCta(wrapperRef.current), []);
  const show = useScrollFlag(read);
  const visibility = show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none";
  return (
    <div
      ref={wrapperRef}
      className={`fixed z-40 bottom-3 inset-x-3 sm:inset-x-auto sm:bottom-6 sm:right-6 transition-all duration-200 ${visibility}`}
      aria-hidden={!show}
      inert={!show}
    >
      <a href={FORM_ANCHOR} tabIndex={show ? undefined : -1} className="btn-primary min-h-11 w-full sm:w-auto rounded-2xl sm:rounded-full py-3.5 px-5 shadow-2xl">
        <MarketIcon name="arrow" className="w-4 h-4" strokeWidth={2.6} />
        {PRIMARY_CTA}
      </a>
    </div>
  );
}
