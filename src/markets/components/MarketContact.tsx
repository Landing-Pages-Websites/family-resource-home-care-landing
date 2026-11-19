import type { ReactElement } from "react";
import { ContactDetails } from "./ContactDetails";
import { Reveal } from "@/components/Reveal";
import { CONTACT_SECTION_ID } from "../content";
import type { Market } from "../markets";
import { MarketLeadForm } from "./MarketLeadForm";

interface MarketContactProps {
  market: Market;
}

/** The final form. The details column is sticky from 1024px, so it stays beside the taller form. */
export function MarketContact({ market }: MarketContactProps): ReactElement {
  return (
    <section id={CONTACT_SECTION_ID} className="py-16 sm:py-20 lg:py-24 bg-[var(--color-primary)] text-white relative overflow-clip" aria-labelledby="contact-title">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 0% 0%, rgba(70,188,236,0.20), transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(245,166,35,0.15), transparent 50%)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        <div className="lg:sticky lg:top-28">
          <h2 id="contact-title" className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold leading-tight">
            Let&rsquo;s Talk About Care <span className="max-lg:whitespace-nowrap">in {market.name}</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed">
            Tell us a little about your family and the help you&rsquo;re looking for. Our local team will reach out to discuss your
            needs.
          </p>
          <ContactDetails market={market} />
        </div>
        <Reveal variant="right" delay={120}>
          <MarketLeadForm market={market} placement="contact" />
        </Reveal>
      </div>
    </section>
  );
}
