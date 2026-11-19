import type { ReactElement } from "react";
import { Reveal } from "@/components/Reveal";
import { REASONS } from "../content";
import { MarketIcon } from "./MarketIcon";

const STAGGER_MS = 80;

/** The four reason cards. */
export function ReasonGrid(): ReactElement {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
      {REASONS.map((reason, i) => (
        <Reveal key={reason.title} variant="up" delay={i * STAGGER_MS} className="h-full">
          <div className="h-full bg-[var(--color-soft)] rounded-2xl p-6 sm:p-7 border border-[var(--color-border)]">
            <span className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/15 text-[var(--color-primary)] flex items-center justify-center">
              <MarketIcon name={reason.icon} className="w-6 h-6" />
            </span>
            <h3 className="mt-4 text-xl font-extrabold text-[var(--color-primary)] leading-snug">{reason.title}</h3>
            <p className="mt-2 text-[15px] text-[var(--color-text-muted)] leading-relaxed">{reason.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
