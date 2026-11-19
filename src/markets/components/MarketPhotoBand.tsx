import Image from "next/image";
import type { ReactElement } from "react";
import { Reveal } from "@/components/Reveal";
import { MARKET_IMAGES } from "../images";
import type { Market } from "../markets";
import { CtaPair } from "./CtaPair";
import { SectionHeading } from "./SectionHeading";

interface MarketPhotoBandProps {
  market: Market;
}

export function MarketPhotoBand({ market }: MarketPhotoBandProps): ReactElement {
  return (
    <section id="local-care" className="py-12 sm:py-16 lg:py-20 bg-white" aria-labelledby="local-care-title">
      {/* From 1024px the closing pair is a centered row under the photo and text; from 1280px it sits
          centered under the text again, which the photo spans as one vertically centered column. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 xl:grid-rows-[1fr_auto_auto_1fr] gap-8 lg:gap-12 xl:gap-y-0 items-center">
        <Reveal variant="left" className="lg:col-span-7 xl:col-start-1 xl:row-start-1 xl:row-span-4">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-xl border border-[var(--color-border)]">
            <Image src={MARKET_IMAGES.photoBand.src} alt={MARKET_IMAGES.photoBand.alt} fill className="object-cover object-[50%_35%]" sizes="(max-width: 1023px) 100vw, 60vw" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/25 via-transparent to-transparent" />
          </div>
        </Reveal>
        <div className="lg:col-span-5 xl:col-start-8 xl:row-start-2 text-center">
          <SectionHeading eyebrow={<>Real Care, Real Families</>} id="local-care-title" size="2.1rem">
            A familiar face at the door, not a&nbsp;stranger.
          </SectionHeading>
          <Reveal variant="up" delay={140}>
            <p className="mt-4 text-base text-[var(--color-text-muted)] leading-relaxed">
              Every Family Resource Home Care visit in {market.name}{" "}starts with a caregiver thoughtfully matched to your loved
              one&rsquo;s personality, routine and needs. Our local care&#8209;coordination team is here to support you along the way.
            </p>
          </Reveal>
        </div>
        {/* Below 1024px the 32px grid gap less 4px keeps the pair 28px under the copy, as before. From
            1280px the pair is a little wider than the text column, so its box takes half of each gutter. */}
        <Reveal variant="up" delay={200} className="-mt-1 lg:mt-0 xl:mt-7 xl:-mx-6 lg:col-span-12 xl:col-span-5 xl:col-start-8 xl:row-start-3">
          <CtaPair market={market} className="justify-center" />
        </Reveal>
      </div>
    </section>
  );
}
