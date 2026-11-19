import type { ReactElement } from "react";
import { TestimonialCard } from "./TestimonialCard";
import { Reveal } from "@/components/Reveal";
import { TESTIMONIALS } from "../content";
import type { Market } from "../markets";
import { SectionCta } from "./SectionCta";
import { SectionHeading } from "./SectionHeading";

const STAGGER_MS = 100;

interface MarketTestimonialsProps {
  market: Market;
}

/** Verbatim client notes in the template's warm cards, each credited to its real region, then the closing CTA pair. */
export function MarketTestimonials({ market }: MarketTestimonialsProps): ReactElement {
  return (
    <section id="testimonials" className="py-16 sm:py-20 lg:py-24 bg-white" aria-labelledby="testimonials-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading eyebrow={<>In Our Clients&rsquo; Own Words</>} id="testimonials-title">
            Real notes from real Family Resource&nbsp;families
          </SectionHeading>
        </div>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 lg:items-start gap-5 sm:gap-6">
          {TESTIMONIALS.map((note, i) => (
            <Reveal key={note.name} variant="up" delay={i * STAGGER_MS}>
              <TestimonialCard note={note} />
            </Reveal>
          ))}
        </div>
        <SectionCta market={market} />
      </div>
    </section>
  );
}
