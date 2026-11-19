import type { SubmittedFormData } from "@/lib/leadPayload";
import { qualify } from "@/lib/qualification";
import { SITE, type QualificationRule } from "@/site";
import type { Market } from "./markets";

/** The paid-campaign optimization signal the Portland forms already send for ready-to-start leads. */
export const QUALIFIED_LEAD_EVENT = "qualified_lead";

/** The same rule buildLeadPayload writes as `form_data.qualified`; pass the rules the lead was sent with. */
export function isQualifiedLead(formData: SubmittedFormData, rules: readonly QualificationRule[] | undefined = SITE.qualificationRules): boolean {
  return qualify(rules, formData).qualified === true;
}

function attempt(fire: () => void): void {
  try {
    fire();
  } catch {
    // The lead is already saved; a tag failure must never read as a failed submit.
  }
}

/** Call ONLY after the lead API confirmed success, after fireConversionEvents. Not-ready leads send nothing. */
export function fireQualifiedLeadEvents(
  formId: string,
  formData: SubmittedFormData,
  market: Market,
  rules: readonly QualificationRule[] | undefined = SITE.qualificationRules,
): void {
  if (!isQualifiedLead(formData, rules)) return;
  attempt(() => window.MegaTag?.trackEvent?.(QUALIFIED_LEAD_EVENT, { elementId: formId, formData }));
  attempt(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: QUALIFIED_LEAD_EVENT, form_id: formId, territory: market.id });
  });
}
