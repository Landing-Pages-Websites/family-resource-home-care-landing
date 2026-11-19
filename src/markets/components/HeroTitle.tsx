import type { ReactElement } from "react";
import { Reveal } from "@/components/Reveal";
import type { Market } from "../markets";

interface Props {
  market: Market;
}

/** The local-agency tag and the H1, naming the market. */
export function HeroTitle({ market }: Props): ReactElement {
  return (
    <>
      <Reveal variant="up">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 backdrop-blur px-3 py-1.5 text-sm font-bold tracking-wide text-[var(--color-accent)]">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
          Local Home Care Agency · {market.name}
        </span>
      </Reveal>
      <Reveal variant="up" delay={80}>
        <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.05] text-white">
          Compassionate Senior <span className="whitespace-nowrap">In-Home</span> Care in{" "}
          <span className="text-[var(--color-accent)] whitespace-nowrap">{market.name}</span>
        </h1>
      </Reveal>
    </>
  );
}
