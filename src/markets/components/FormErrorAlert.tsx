import type { ReactElement } from "react";
import { formErrorParts } from "@/components/formErrorMessage";
import type { Market } from "../markets";

interface FormErrorAlertProps {
  market: Market;
}

/** Failed or unconfirmed submit: the visitor's values stay in the form; the market phone is the fallback. */
export function FormErrorAlert({ market }: FormErrorAlertProps): ReactElement {
  const [prose] = formErrorParts(market.phoneDisplay);
  return (
    <p role="alert" className="mt-3 rounded-lg border-2 border-[var(--market-error)] bg-[var(--market-error-bg)] px-4 py-3 text-sm font-medium text-[var(--market-error)]">
      {prose}
      <span className="whitespace-nowrap">
        <a href={market.phoneHref} className="underline">
          {market.phoneDisplay}
        </a>
        .
      </span>
    </p>
  );
}
