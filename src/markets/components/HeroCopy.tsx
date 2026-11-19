import type { ReactElement } from "react";
import { HERO_FORM_ID } from "../content";
import { cityList, type Market } from "../markets";
import { CtaPair } from "./CtaPair";
import { HeroChips } from "./HeroChips";
import { HeroTrustRow } from "./HeroTrustRow";
import { HeroTitle } from "./HeroTitle";
import { Reveal } from "@/components/Reveal";

interface HeroCopyProps {
  market: Market;
}

/** H1, agency line, offer, proof chips, the CTA pair that points at the hero form and the trust row. */
export function HeroCopy({ market }: HeroCopyProps): ReactElement {
  return (
    <>
      <HeroTitle market={market} />
      <Reveal variant="up" delay={110}>
        <p className="mt-4 text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed">
          A local senior care agency serving {cityList(market)}.
        </p>
      </Reveal>
      <Reveal variant="up" delay={140}>
        <p className="mt-4 text-lg sm:text-xl text-white/85 max-w-2xl leading-relaxed">
          Our caregivers help your loved one stay safe, comfortable, and independent at home.{" "}
          <span className="text-white font-semibold">Free in‑home assessment available same day or next day</span>, with a care
          plan tailored to your family and ongoing support from our local office.
        </p>
      </Reveal>
      <Reveal variant="up" delay={200}>
        <HeroChips />
      </Reveal>
      <Reveal variant="up" delay={280}>
        <CtaPair market={market} href={`#${HERO_FORM_ID}`} tone="dark" size="lg" className="mt-9 justify-start" />
      </Reveal>
      <Reveal variant="up" delay={360} className="hidden lg:block">
        <HeroTrustRow />
      </Reveal>
    </>
  );
}
