import Image from "next/image";
import type { ReactElement } from "react";
import { Reveal } from "@/components/Reveal";
import { MARKET_IMAGES } from "../images";
import type { Market } from "../markets";
import { CtaPair } from "./CtaPair";
import { SectionHeading } from "./SectionHeading";

interface MarketStoryProps {
  market: Market;
}

/** The template's soft story band, as a still photo (no video on these routes). */
export function MarketStory({ market }: MarketStoryProps): ReactElement {
  const photo = MARKET_IMAGES.story;
  return (
    <section id="our-story" className="overflow-hidden py-16 sm:py-20 lg:py-24 bg-[var(--color-soft)]" aria-labelledby="story-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-7">
          <SectionHeading eyebrow={<>More Than a Helping Hand</>} id="story-title">
            Small moments. <span className="min-[360px]:whitespace-nowrap">Meaningful support.</span>
          </SectionHeading>
          <Reveal variant="up" delay={140}>
            <p className="mt-5 text-[17px] text-[var(--color-text)] leading-relaxed max-w-2xl">
              A shared meal, a favorite activity or an extra hand with daily routines can make time at home feel easier. Our
              caregivers bring practical help and companionship while keeping your loved one&rsquo;s preferences at the center.
            </p>
          </Reveal>
          <Reveal variant="up" delay={200}>
            <CtaPair market={market} className="mt-8" />
          </Reveal>
        </div>
        <Reveal variant="right" delay={120} className="lg:col-span-5">
          <div className="relative aspect-[16/10] lg:aspect-[4/3] w-full sm:max-w-xl lg:max-w-none mx-auto rounded-2xl overflow-hidden shadow-lg">
            <Image src={photo.src} alt={photo.alt} fill className="object-cover object-[60%_center]" sizes="(max-width: 1023px) 115vw, 55vw" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
