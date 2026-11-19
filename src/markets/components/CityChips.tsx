import type { ReactElement } from "react";
import type { Market } from "../markets";

interface Props {
  market: Market;
}

/** The communities the office serves. */
export function CityChips({ market }: Props): ReactElement {
  return (
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] gap-3 sm:gap-4" aria-label={`Communities we serve from our ${market.name} office`}>
      {market.cities.map((city) => (
        <li key={city} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[var(--color-soft-2)]">
          <span aria-hidden className="w-2 h-2 rounded-full bg-[var(--color-accent-dark)] shrink-0" />
          <span className="text-[15px] font-semibold text-[var(--color-primary)]">{city}</span>
        </li>
      ))}
    </ul>
  );
}
