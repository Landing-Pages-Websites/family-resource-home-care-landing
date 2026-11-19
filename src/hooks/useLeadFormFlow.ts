"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { SubmissionStatus } from "@/lib/managedSubmit";
import type { FieldErrors, FormValues } from "@/lib/leadPayload";
import { safeRedirectUrl, scheduleRedirect } from "@/lib/successRedirect";
import type { PrepareValues } from "@/lib/prepareSubmissionValues";
import { SITE, type FieldConfig, type LeadFormProfile } from "@/site";

interface FlowSnapshot {
  values: FormValues;
  errors: FieldErrors;
  status: "idle" | SubmissionStatus;
  smsConsent: boolean;
}

function createState(fields: readonly FieldConfig[]) {
  const initial: FlowSnapshot = {
    values: Object.fromEntries(fields.map((field) => [field.name, ""])),
    errors: {}, status: "idle", smsConsent: false,
  };
  let snapshot = initial;
  const listeners = new Set<() => void>();
  return {
    // runSubmission takes this lock synchronously and keeps it after acceptance.
    lock: { current: false },
    getSnapshot: () => snapshot,
    getServerSnapshot: () => initial,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    update: (patch: Partial<FlowSnapshot>) => {
      snapshot = { ...snapshot, ...patch };
      for (const listener of listeners) listener();
    },
  };
}

export interface LeadFormFlowOptions {
  profile?: LeadFormProfile;
  formKey?: string;
  prepareValues?: PrepareValues;
}

const OWNER = Symbol("LeadFormFlow");

/** Opaque, tree-local owner. Create with useLeadFormFlow, never at module scope. */
export interface LeadFormFlow {
  readonly [OWNER]: {
    readonly state: ReturnType<typeof createState>;
    readonly profile: LeadFormProfile;
    readonly signature: string;
    readonly formKey?: string;
    readonly prepareValues?: PrepareValues;
  };
}

function assertCompatible(flow: LeadFormFlow, profile: LeadFormProfile, prepareValues?: PrepareValues): void {
  const config = flow[OWNER];
  if (profile.fields !== config.profile.fields
    || profile.qualificationRules !== config.profile.qualificationRules
    || prepareValues !== config.prepareValues
    || JSON.stringify([profile.fields, profile.qualificationRules]) !== config.signature) {
    throw new Error("Shared lead flow configuration must match its owner (immutable fields, rules and prepareValues). Remount the owner for a new inquiry/configuration.");
  }
}

/** One logical inquiry per mounted owner. Rerenders/placement remounts never reset it, even after success. */
export function useLeadFormFlow({ profile = SITE, formKey = SITE.formKey, prepareValues }: LeadFormFlowOptions = {}): LeadFormFlow {
  const [flow] = useState<LeadFormFlow>(() => ({
    [OWNER]: {
      state: createState(profile.fields),
      profile: { fields: profile.fields, qualificationRules: profile.qualificationRules },
      signature: JSON.stringify([profile.fields, profile.qualificationRules]),
      formKey, prepareValues,
    },
  }));
  assertCompatible(flow, profile, prepareValues);
  if (formKey !== flow[OWNER].formKey) throw new Error("Shared lead flow formKey cannot change. Remount its owner for a new inquiry/configuration.");
  const { state } = flow[OWNER];
  const { status } = useSyncExternalStore(state.subscribe, state.getSnapshot, state.getServerSnapshot);
  const href = safeRedirectUrl(SITE.successRedirectUrl)?.href;
  // One accepted inquiry has one redirect, even when its initiating placement unmounts.
  useEffect(() => {
    if (status !== "success" || !href) return;
    return scheduleRedirect(href, (destination) => window.location.assign(destination));
  }, [status, href]);
  return flow;
}

/** Internal controller binding: subscriptions are placement-local, state and the latch are owner-local. */
export function useLeadFormState(fieldsOrProfile: readonly FieldConfig[] | LeadFormProfile | undefined, prepareValues: PrepareValues | undefined, flow?: LeadFormFlow) {
  const source = fieldsOrProfile ?? flow?.[OWNER].profile ?? SITE;
  const profile: LeadFormProfile = "fields" in source ? source : { fields: source, qualificationRules: SITE.qualificationRules };
  const prepare = prepareValues ?? flow?.[OWNER].prepareValues;
  if (flow) assertCompatible(flow, profile, prepare);
  const [binding] = useState(() => ({ flow, state: flow?.[OWNER].state ?? createState(profile.fields) }));
  if (binding.flow !== flow) throw new Error("A lead placement cannot switch flow owners. Remount the placement to attach a different inquiry.");
  const { state } = binding;
  const snapshot = useSyncExternalStore(state.subscribe, state.getSnapshot, state.getServerSnapshot);
  return {
    state, snapshot, profile, prepareValues: prepare, formKey: flow?.[OWNER].formKey,
    assertConfiguration: () => { if (flow) assertCompatible(flow, profile, prepare); },
  };
}
