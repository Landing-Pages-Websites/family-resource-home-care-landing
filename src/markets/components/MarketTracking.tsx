"use client";

import { SITE_ID, SITE_KEY } from "@/components/Brand";
import { useTracking } from "@/hooks/useTracking";

const TRACKING = { siteKey: SITE_KEY, siteId: SITE_ID };

/** The template's useTracking call; layout.tsx already loads the optimizer, so this is a guarded no-op. */
export function MarketTracking(): null {
  useTracking(TRACKING);
  return null;
}
