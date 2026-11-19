import type { SubmittedFormData } from "@/lib/leadPayload";
import { SITE } from "@/site";

/** The only keys we send; the optimizer's trackEvent ignores top-level keys it does not know, such as flattened fields. */
export interface MegaTagEventPayload {
  elementId: string;
  formData: SubmittedFormData;
}

export interface MegaTagApi {
  trackEvent?: (eventName: string, payload?: MegaTagEventPayload) => unknown;
}

// Provenance: lp-starter e8e8d9b src/lib/conversionEvents.ts. Its `declare global` block is
// omitted here only because the pre-starter src/components/LeadForm.tsx already declares
// `Window.MegaTag` / `Window.dataLayer`, and a second, differently typed declaration fails tsc.

function attempt(fire: () => void): void {
  try {
    fire();
  } catch {
    // The lead is already saved; a tag failure must never read as a failed submit.
  }
}

/**
 * Call ONLY after the lead API confirmed success. The optimizer's trackEvent reads only
 * `elementId` and `formData` from the payload, so every field goes out as its own key inside `formData`.
 */
export function fireConversionEvents(formId: string, formData: SubmittedFormData): void {
  attempt(() => window.MegaTag?.trackEvent?.("form_submit", { elementId: formId, formData }));
  attempt(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "form_submission", form_id: formId, form_provider: SITE.sourceProvider });
  });
}
