import type { ReactElement } from "react";
import { Reveal } from "@/components/Reveal";
import { FAQS } from "../content";
import type { Market } from "../markets";
import { CtaPair } from "./CtaPair";
import { FaqItem } from "./FaqItem";

interface MarketFAQProps {
  market: Market;
}

/** First-party FAQ answers the rest of the page does not cover, all collapsed at load. */
export function MarketFAQ({ market }: MarketFAQProps): ReactElement {
  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-24 bg-white" aria-labelledby="faq-title">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Reveal variant="up">
          <h2 id="faq-title" className="text-center text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[var(--color-primary)] leading-tight">
            Questions From Families
          </h2>
        </Reveal>
        <div className="mt-10 divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] bg-white shadow-sm overflow-hidden">
          {FAQS.map((item) => (
            <FaqItem key={item.q} question={item.q} answer={item.a} />
          ))}
        </div>
        <Reveal variant="up" delay={120}>
          <div className="mt-10 text-center">
            <p className="text-base text-[var(--color-text-muted)]">Still have questions about care in {market.name}?</p>
            <CtaPair market={market} className="mt-4 justify-center" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
