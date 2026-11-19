import type { ReactElement } from "react";
import { Reveal } from "@/components/Reveal";
import type { Market } from "../markets";
import { CtaPair } from "./CtaPair";

interface SectionCtaProps {
  market: Market;
  delay?: number;
}

/** The centered form-plus-phone pair that closes a content section, forward to the final form. */
export function SectionCta({ market, delay = 200 }: SectionCtaProps): ReactElement {
  return (
    <Reveal variant="up" delay={delay}>
      <CtaPair market={market} className="mt-12 sm:mt-14 justify-center" />
    </Reveal>
  );
}
