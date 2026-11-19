import type { ReactElement } from "react";
import { isQualifiedLead } from "../formEvents";
import type { Market } from "../markets";
import { FormCard } from "./FormCard";
import type { FormHeadingTag } from "./FormHeading";
import { FormSuccess } from "./FormSuccess";

interface FormSuccessCardProps {
  heading: FormHeadingTag;
  market: Market;
  anchorId: string;
  placement: "hero" | "contact";
  firstName: string;
  ready: string;
  takeFocus: boolean;
}

export function FormSuccessCard({ heading, market, anchorId, placement, firstName, ready, takeFocus }: FormSuccessCardProps): ReactElement {
  return (
    <FormCard anchorId={anchorId} placement={placement}>
      <FormSuccess heading={heading} market={market} firstName={firstName.trim()} qualified={isQualifiedLead({ ready })} takeFocus={takeFocus} />
    </FormCard>
  );
}
