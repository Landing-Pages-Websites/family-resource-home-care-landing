"use client";

import { useId, useState, type ReactElement } from "react";
import { MarketIcon } from "./MarketIcon";

interface FaqItemProps {
  question: string;
  answer: string;
}

/** One disclosure: starts collapsed, the button names its panel. */
export function FaqItem({ question, answer }: FaqItemProps): ReactElement {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div>
      <h3>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="w-full min-h-11 flex items-start justify-between gap-4 px-5 sm:px-7 py-5 text-left hover:bg-[var(--color-soft)] transition"
        >
          <span className="font-extrabold tracking-normal text-[var(--color-primary)] text-base leading-snug">{question}</span>
          <span
            aria-hidden
            className={`mt-0.5 w-7 h-7 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0 transition-transform duration-200 ${
              open ? "rotate-45" : ""
            }`}
          >
            <MarketIcon name="plus" className="w-4 h-4" strokeWidth={2.6} />
          </span>
        </button>
      </h3>
      <div id={panelId} hidden={!open} className="px-5 sm:px-7 pb-5 -mt-1 text-base text-[var(--color-text-muted)] leading-relaxed">
        {answer}
      </div>
    </div>
  );
}
