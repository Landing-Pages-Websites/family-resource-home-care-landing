"use client";

import { useEffect, useRef, type ReactElement } from "react";
import type { Market } from "../markets";
import type { FormHeadingTag } from "./FormHeading";
import { MarketIcon } from "./MarketIcon";

interface FormSuccessProps {
  heading: FormHeadingTag;
  market: Market;
  firstName: string;
  qualified: boolean;
  /** Only the placement that sent the lead takes focus, so the reader hears the confirmation. */
  takeFocus: boolean;
}

/** Shown only after the lead API confirmed the lead (2xx and ok: true). */
export function FormSuccess({ heading: Heading, market, firstName, qualified, takeFocus }: FormSuccessProps): ReactElement {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (takeFocus) headingRef.current?.focus();
  }, [takeFocus]);

  const phone = (
    <a className="font-semibold text-[var(--color-primary)] underline whitespace-nowrap" href={market.phoneHref}>
      {market.phoneDisplay}
    </a>
  );
  return (
    <div role="status" className="flex flex-col items-center text-center py-4">
      <span className="w-16 h-16 rounded-full bg-[var(--color-success)]/15 text-[var(--color-success)] flex items-center justify-center mb-4">
        <MarketIcon name="check" className="w-8 h-8" strokeWidth={2.5} />
      </span>
      <Heading ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold text-[var(--color-primary)] mb-2 outline-none">
        Thank you{firstName ? `, ${firstName}` : ""}!
      </Heading>
      <p className="text-base text-[var(--color-text-muted)] max-w-sm leading-relaxed">
        {qualified
          ? `We’ve received your request. A ${market.name} care coordinator will call you to confirm details and schedule your free in\u2011home assessment. Need to talk now? Call `
          : "Thanks for reaching out. We’ve received your details. When you’re ready to talk about care, call "}
        {phone}.
      </p>
    </div>
  );
}
