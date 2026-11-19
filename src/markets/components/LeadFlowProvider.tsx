"use client";

import { createContext, useContext, useMemo, useState, type ReactElement, type ReactNode } from "react";
import { useLeadFormFlow, type LeadFormFlow } from "@/hooks/useLeadFormFlow";

interface SharedLeadFlow {
  flow: LeadFormFlow;
  /** The form id of the placement whose send last started: only it announces the result. */
  sender: string | null;
  setSender: (formId: string) => void;
}

const LeadFlowContext = createContext<SharedLeadFlow | null>(null);

interface LeadFlowProviderProps {
  children: ReactNode;
}

/**
 * One inquiry per page view, shared by the hero and final forms (one lock, one success state).
 * The page's sections arrive as `children`, so a keystroke re-renders only the two forms.
 */
export function LeadFlowProvider({ children }: LeadFlowProviderProps): ReactElement {
  const flow = useLeadFormFlow();
  const [sender, setSender] = useState<string | null>(null);
  const value = useMemo(() => ({ flow, sender, setSender }), [flow, sender]);
  return <LeadFlowContext.Provider value={value}>{children}</LeadFlowContext.Provider>;
}

export function useSharedLeadFlow(): SharedLeadFlow {
  const shared = useContext(LeadFlowContext);
  if (!shared) throw new Error("Market lead forms must render inside LeadFlowProvider.");
  return shared;
}
