import type { ReactElement, ReactNode } from "react";
import { MarketIcon, type MarketIconName } from "./MarketIcon";

interface DetailRowProps {
  icon: MarketIconName;
  label: string;
  children: ReactNode;
}

/** Icon tile, accent label and value, for the navy contact column. */
export function DetailRow({ icon, label, children }: DetailRowProps): ReactElement {
  return (
    <div className="flex items-start gap-3">
      <span className="w-10 h-10 rounded-lg bg-white/10 text-[var(--color-accent)] flex items-center justify-center shrink-0">
        <MarketIcon name={icon} className="w-5 h-5" strokeWidth={icon === "phone" ? 2 : 1.8} />
      </span>
      <div>
        <p className="text-sm uppercase tracking-wider font-bold text-[var(--color-accent)]">{label}</p>
        {children}
      </div>
    </div>
  );
}
