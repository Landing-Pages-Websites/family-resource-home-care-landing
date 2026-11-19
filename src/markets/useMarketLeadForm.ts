"use client";

// Provenance: lp-starter e8e8d9b src/hooks/useMegaLeadForm.ts. The pre-starter hook of that
// name stays untouched for the root and Portland routes, so this copy lives here. The
// normalize -> build -> postLead path is identical; the one addition is the market's static
// territory keys, sent as formDataDefaults (buildLeadPayload rejects any reserved key).

import { useCallback } from "react";
import { browserAttributionEnv, getSessionId, getVisitorId, resolveAttribution } from "@/lib/attribution";
import { buildLeadPayload, normalizeFormData, postLead, type FormValues, type SubmittedFormData } from "@/lib/leadPayload";
import { SITE, type LeadFormProfile } from "@/site";
import { marketFormDataDefaults, type Market } from "./markets";

interface UseMarketLeadFormReturn {
  /** Resolves with the validated fields that were accepted; throws on invalid input or any failed submission. */
  submit: (values: FormValues) => Promise<SubmittedFormData>;
}

export function useMarketLeadForm(market: Market, profile: LeadFormProfile): UseMarketLeadFormReturn {
  const { fields, qualificationRules } = profile;
  const submit = useCallback(
    async (values: FormValues): Promise<SubmittedFormData> => {
      // Third validation layer: a programmatic call can bypass the UI and its gate.
      const formData = normalizeFormData(fields, values);
      const env = browserAttributionEnv();
      const context = {
        url: window.location.href,
        referrerUrl: document.referrer || null,
        sessionId: getSessionId(env),
        visitorId: getVisitorId(env),
      };
      const site = { ...SITE, fields, qualificationRules, formDataDefaults: marketFormDataDefaults(market) };
      await postLead(buildLeadPayload(site, formData, context, resolveAttribution(env)));
      return formData;
    },
    [fields, qualificationRules, market],
  );

  return { submit };
}
