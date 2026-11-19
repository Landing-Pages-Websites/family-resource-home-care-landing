"use client";

import { useCallback, useRef, type CSSProperties, type ReactElement } from "react";
import { FORM_ANCHOR } from "@/site";
import { PRIMARY_CTA } from "../content";
import { chatBoxes, chatClearance, shouldShowFloatingCta } from "../floatingCta";
import { MarketIcon } from "./MarketIcon";
import { useChatClearance } from "./useChatClearance";
import { useScrollFlag } from "./useScrollFlag";

/**
 * Forward-only CTA to the final form, shown only in real gaps between the hero and the final form.
 * It rests above the inherited chat widget's painted UI, and hides while that UI leaves no room.
 */
export function MarketFloatingCTA(): ReactElement {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const measureChat = useCallback(() => {
    const wrapper = wrapperRef.current;
    return wrapper ? chatClearance(wrapper.getBoundingClientRect(), chatBoxes(), window.innerHeight) : 0;
  }, []);
  const chat = useChatClearance(measureChat);
  const read = useCallback(() => chat.fits && shouldShowFloatingCta(wrapperRef.current), [chat]);
  const show = useScrollFlag(read);
  const visibility = show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none";
  return (
    <div
      ref={wrapperRef}
      style={{ "--chat-clearance": `${chat.offset}px` } as CSSProperties}
      className={`fixed z-40 bottom-[max(0.75rem,var(--chat-clearance))] inset-x-3 sm:inset-x-auto sm:bottom-[max(1.5rem,var(--chat-clearance))] sm:right-6 transition-[opacity,translate] duration-200 ${visibility}`}
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
