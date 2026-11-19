"use client";

import type { ReactElement } from "react";
import { FINAL_FORM_ID, FORM_TITLE, HERO_FORM_ID, HERO_FORM_SUBHEAD } from "../content";
import { marketFormId, type Market } from "../markets";
import { useMarketLeadController } from "../useMarketLeadController";
import { FormCard } from "./FormCard";
import { FormHeading, type FormHeadingTag } from "./FormHeading";
import { FormSuccessCard } from "./FormSuccessCard";
import { FormTrustLine } from "./FormTrustLine";
import { useSharedLeadFlow } from "./LeadFlowProvider";
import { MarketLeadFormFields } from "./MarketLeadFormFields";
import { PrivacyNote } from "./PrivacyNote";
import { SubmitControl } from "./SubmitControl";

type Placement = "hero" | "contact";

interface MarketLeadFormProps {
  market: Market;
  placement: Placement;
}

// The hero is the compact variant: anchor for the hero CTAs, subhead, submit before the optional
// question, and the phone/tablet trust line under the submit. The card title is an h2 right under
// the hero h1, and an h3 under the contact section's h2.
interface PlacementConfig {
  anchorId: string;
  subhead?: string;
  compact: boolean;
  trustLine: boolean;
  heading: FormHeadingTag;
}
const PLACEMENTS: Record<Placement, PlacementConfig> = {
  hero: { anchorId: HERO_FORM_ID, subhead: HERO_FORM_SUBHEAD, compact: true, trustLine: true, heading: "h2" },
  contact: { anchorId: FINAL_FORM_ID, compact: false, trustLine: false, heading: "h3" },
};

/** The seven-field care inquiry, sharing one inquiry with the page's other placement. */
export function MarketLeadForm({ market, placement }: MarketLeadFormProps): ReactElement {
  const formId = marketFormId(placement, market);
  const { anchorId, subhead, compact, trustLine, heading } = PLACEMENTS[placement];
  const { flow, sender, setSender } = useSharedLeadFlow();
  const { formRef, fields, values, errors, status, setValue, handleClick, handleKeyDown, handleSubmit } =
    useMarketLeadController(formId, market, flow, () => setSender(formId));
  const isSender = sender === formId;
  if (status === "success") {
    const success = { heading, market, anchorId, placement, firstName: values.firstName ?? "", ready: values.ready ?? "" };
    return <FormSuccessCard {...success} takeFocus={isSender} />;
  }
  const failed = status === "error" && isSender;
  const submit = (
    <>
      <SubmitControl market={market} compact={compact} submitting={status === "submitting"} failed={failed} onSend={handleClick} />
      {trustLine ? <FormTrustLine /> : null}
    </>
  );
  return (
    <FormCard anchorId={anchorId} placement={placement}>
      <form ref={formRef} noValidate onKeyDown={handleKeyDown} onSubmit={handleSubmit} aria-labelledby={`${formId}-title`}>
        <FormHeading as={heading} id={`${formId}-title`} title={FORM_TITLE} subhead={subhead} compact={compact} />
        <MarketLeadFormFields {...{ formId, fields, values, errors, compact, submit }} onValue={setValue} />
        <PrivacyNote />
      </form>
    </FormCard>
  );
}
