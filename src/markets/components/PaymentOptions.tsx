import type { ReactElement } from "react";
import { PAYMENT_OPTIONS } from "../content";
import { MarketIcon } from "./MarketIcon";

/** The navy payment-options strip. */
export function PaymentOptions(): ReactElement {
  return (
    <div className="mt-12 rounded-2xl bg-[var(--color-primary)] text-white p-7 sm:p-9 shadow-lg grid lg:grid-cols-5 gap-6 items-center">
      <div className="lg:col-span-2">
        <p className="text-sm uppercase tracking-wider font-bold text-[var(--color-accent)]">Payment Options</p>
        <h3 className="mt-2 text-2xl sm:text-[1.75rem] font-extrabold leading-tight">Flexible ways to pay for care</h3>
      </div>
      <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PAYMENT_OPTIONS.map((option) => (
          <li key={option} className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3">
            <span className="w-6 h-6 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] flex items-center justify-center shrink-0">
              <MarketIcon name="check" className="w-3.5 h-3.5" strokeWidth={3} />
            </span>
            <span className="font-semibold text-white">{option}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
