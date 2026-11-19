import type { ReactElement } from "react";
import { STEPS } from "../content";

/** The three numbered steps. */
export function StepList(): ReactElement {
  return (
    <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
      {STEPS.map((step) => (
        <li key={step.num} className="relative text-center px-2">
          <span className="mx-auto w-14 h-14 sm:w-[3.75rem] sm:h-[3.75rem] rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] flex items-center justify-center font-extrabold text-xl shadow-lg ring-4 ring-[var(--color-primary)]">
            {step.num}
          </span>
          <h3 className="mt-5 text-lg sm:text-xl font-extrabold leading-snug text-white">{step.title}</h3>
          <p className="mt-2.5 text-base text-white/85 leading-relaxed max-w-sm mx-auto">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
