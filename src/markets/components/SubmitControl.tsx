import type { ReactElement } from "react";
import { SITE } from "@/site";
import { SUBMIT_LABEL } from "../content";
import type { Market } from "../markets";
import { FormErrorAlert } from "./FormErrorAlert";

interface SubmitControlProps {
  market: Market;
  compact: boolean;
  submitting: boolean;
  failed: boolean;
  onSend: () => void;
}

/** type="button": a click never raises a native submit, so the optimizer cannot count an unsent lead. */
export function SubmitControl({ market, compact, submitting, failed, onSend }: SubmitControlProps): ReactElement {
  return (
    <>
      <button
        type="button"
        onClick={onSend}
        disabled={submitting}
        aria-busy={submitting}
        className={`btn-primary w-full min-h-11 sm:text-lg disabled:opacity-60 disabled:cursor-not-allowed ${
          compact ? "mt-3 py-3 px-3 text-sm" : "mt-5 py-3.5 text-base"
        }`}
      >
        {submitting ? SITE.pendingLabel : SUBMIT_LABEL}
      </button>
      {failed ? <FormErrorAlert market={market} /> : null}
    </>
  );
}
