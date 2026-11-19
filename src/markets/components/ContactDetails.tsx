import type { ReactElement } from "react";
import type { Market } from "../markets";
import { DetailRow } from "./DetailRow";

interface Props {
  market: Market;
}

/** Office phone and address rows in the navy contact column. */
export function ContactDetails({ market }: Props): ReactElement {
  return (
    <div className="mt-8 space-y-5">
      <DetailRow icon="phone" label={`Call our ${market.name} office`}>
        <a href={market.phoneHref} className="inline-flex min-h-11 items-center text-xl sm:text-2xl font-extrabold whitespace-nowrap hover:text-[var(--color-accent)] transition">
          {market.phoneDisplay}
        </a>
      </DetailRow>
      <DetailRow icon="pin" label="Office address">
        <p className="mt-1 text-white/90 text-base">{market.address}</p>
      </DetailRow>
    </div>
  );
}
