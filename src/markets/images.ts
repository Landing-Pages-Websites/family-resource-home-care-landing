// One distinct first-party FRHC scene per slot, re-encoded (never upscaled) from the recovered
// originals; provenance and pixel budgets are in src/markets/PROVENANCE.md. These are
// company photos, not pictures of a market office, so alt text never names a city.

export interface MarketImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const MARKET_IMAGES = {
  heroBg: {
    src: "/images/markets/frhc-hug-moment.webp",
    alt: "A Family Resource Home Care caregiver sharing a hug with a smiling senior client",
    width: 3840,
    height: 2560,
  },
  photoBand: {
    src: "/images/markets/frhc-bench-visit.webp",
    alt: "A caregiver and a senior client laughing together on a garden bench",
    width: 2049,
    height: 1652,
  },
  welcome: {
    src: "/images/markets/frhc-park-walk.webp",
    alt: "A caregiver walking beside a smiling senior man in a wheelchair on a tree-lined path",
    width: 1600,
    height: 1067,
  },
  story: {
    src: "/images/markets/frhc-garden-visit.webp",
    alt: "A senior woman trimming flowers in her garden while her caregiver looks on",
    width: 1400,
    height: 768,
  },
} as const satisfies Record<string, MarketImage>;
