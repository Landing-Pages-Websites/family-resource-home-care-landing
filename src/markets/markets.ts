// The four Google Search market routes added in task 68e909bd. Names, cities, counties and
// office addresses follow research market_copy.json (first-party location pages); phones are
// the task-authorized office numbers. The root and Portland routes use Brand.ts TERRITORIES.

export type MarketId = "salem" | "grants-pass" | "medford" | "olympia";

export interface Market {
  id: MarketId;
  name: string;
  /** Every city in the hero agency line and the service-area chips. */
  cities: readonly string[];
  counties: string;
  address: string;
  phoneDisplay: string;
  phoneHref: string;
}

const NBSP = "\u00a0";

export const MARKETS: Record<MarketId, Market> = {
  salem: {
    id: "salem",
    name: "Salem",
    cities: ["Salem", "Keizer", "Woodburn", "Independence", "Dallas"],
    counties: "Marion and Polk Counties",
    address: "670 Hawthorne Ave SE #140, Salem, OR 97301",
    phoneDisplay: "(503) 990-6380",
    phoneHref: "tel:+15039906380",
  },
  "grants-pass": {
    id: "grants-pass",
    name: `Grants${NBSP}Pass`,
    cities: ["Grants Pass", "Merlin", "Hugo", "Wilderville", "Murphy", "Rogue River"],
    counties: "Josephine County",
    address: "820 NE E St, Ste G, Grants Pass, OR 97526",
    phoneDisplay: "(541) 204-1451",
    phoneHref: "tel:+15412041451",
  },
  medford: {
    id: "medford",
    name: "Medford",
    cities: [
      "Medford",
      "Ashland",
      "Central Point",
      "Eagle Point",
      "Jacksonville",
      "Phoenix",
      "Talent",
      "White City",
      "Shady Cove",
    ],
    counties: "Jackson County",
    address: "1150 Crater Lake Ave Ste I, Medford, OR 97504",
    phoneDisplay: "(541) 392-8665",
    phoneHref: "tel:+15413928665",
  },
  olympia: {
    id: "olympia",
    name: "Olympia",
    cities: ["Olympia", "Lacey", "Tumwater"],
    counties: "Thurston, Mason and Lewis Counties",
    address: "2620 RW Johnson Blvd Southwest, Suite 104, Tumwater, WA 98512",
    phoneDisplay: "(360) 522-4024",
    phoneHref: "tel:+13605224024",
  },
};

export const SITE_ORIGIN = "https://call.familyresourcehomecare.com";

/** "Salem, Keizer, Woodburn, Independence and Dallas": the market's cities as one phrase. */
export function cityList(market: Market): string {
  const { cities } = market;
  if (cities.length < 2) return cities.join("");
  return `${cities.slice(0, -1).join(", ")} and ${cities[cities.length - 1]}`;
}

/** The name with ordinary spaces (the page keeps "Grants Pass" on one line with a no-break space). */
export function plainName(market: Market): string {
  return market.name.replace(/\u00a0/g, " ");
}

/** Static `form_data` keys that tell the office which market a lead came from. */
export function marketFormDataDefaults(market: Market): Record<string, string> {
  return {
    territory: market.id,
    territoryName: plainName(market),
    territoryPhone: market.phoneDisplay,
  };
}

/** The MegaTag `elementId` / dataLayer `form_id` for one form placement on one market page. */
export function marketFormId(placement: "hero" | "contact", market: Market): string {
  return `form-${placement}-${market.id}`;
}
