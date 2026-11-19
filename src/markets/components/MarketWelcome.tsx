import Image from "next/image";
import type { ReactElement } from "react";
import { Reveal } from "@/components/Reveal";
import { MARKET_IMAGES } from "../images";
import type { Market } from "../markets";
import { CtaPair } from "./CtaPair";
import { SectionHeading } from "./SectionHeading";

interface MarketWelcomeProps {
  market: Market;
}

/** Photo beside the local welcome. 4:3 and capped at 576px when stacked, so the source keeps 2x density. */
export function MarketWelcome({ market }: MarketWelcomeProps): ReactElement {
  const photo = MARKET_IMAGES.welcome;
  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 bg-white" aria-labelledby="about-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <Reveal variant="left">
          <div className="relative aspect-[4/3] w-full sm:max-w-xl lg:max-w-none mx-auto rounded-3xl overflow-hidden shadow-xl">
            <Image src={photo.src} alt={photo.alt} fill className="object-cover object-center" sizes="(max-width: 639px) 115vw, (max-width: 1023px) 660px, 50vw" />
          </div>
        </Reveal>
        <div>
          <SectionHeading eyebrow={<>Welcome to {market.name}</>} id="about-title" size="2.5rem">
            A neighborhood team that treats your family like our&nbsp;own.
          </SectionHeading>
          <Reveal variant="up" delay={140}>
            <p className="mt-5 text-[17px] text-[var(--color-text)] leading-relaxed">
              Our local team brings caregivers and care coordination together to support your family at home. We serve{" "}
              {market.counties}, with one&#8209;on&#8209;one help that respects your loved one&rsquo;s routine and preferences.
            </p>
          </Reveal>
          <Reveal variant="up" delay={200}>
            <CtaPair market={market} className="mt-8" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
