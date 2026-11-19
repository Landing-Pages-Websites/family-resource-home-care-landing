import type { ReactElement, SelectHTMLAttributes } from "react";
import { MarketIcon } from "./MarketIcon";

interface ChevronSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  placeholder: string;
  options: readonly { value: string; label: string }[];
}

/** A styled native select with the visible chevron the forms rules require. */
export function ChevronSelect({ placeholder, options, ...select }: ChevronSelectProps): ReactElement {
  return (
    <div className="relative">
      <select {...select}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--market-placeholder)]">
        <MarketIcon name="chevron" className="w-5 h-5" strokeWidth={2} />
      </span>
    </div>
  );
}
