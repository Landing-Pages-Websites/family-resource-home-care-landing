// ─── Single source of truth for spec-driven values on this LP ───
// Atlas task: 735fe782-2338-46ae-a778-ea63004cae8a (Family Resource Home Care — 5 territory LPs)
// Customer: af6bf9ba-151a-4d28-9786-6a585c237ead

export const BUSINESS_NAME = "Family Resource Home Care";
export const SHORT_NAME = "Family Resource Home Care";
export const TAGLINE = "Compassionate in-home care, right at home.";

// ─── Mega tracking — registered via `mega site-tracking enable` 2026-05-25 ───
// One site for all 5 territory pages on call.familyresourcehomecare.com.
export const SITE_ID = "bc581877-3414-42e7-a11e-a499c8292999";
export const SITE_KEY = "9ifd6n234obt4607";
export const CUSTOMER_ID = "af6bf9ba-151a-4d28-9786-6a585c237ead";
export const SOURCE_PROVIDER = "family-resource-home-care-landing";

// GTM container — per task comment from Lindsay (2026-05-25):
// "this is the GTM to use GTM-W95T5CC, make sure no other ones are on the site"
export const GTM_ID = "GTM-W95T5CC";

// ─── Territory model ─────────────────────────────────────────────
// One subdomain (call.familyresourcehomecare.com), 5 routes, one shared form.
// Each territory carries its own CTM phone, branch address, and copy.

export type TerritoryId =
  | "portland-east"
  | "portland-west"
  | "hillsboro"
  | "gresham"
  | "oregon-city";

export interface Territory {
  id: TerritoryId;
  name: string;
  shortName: string; // headline / breadcrumb usage
  region: string; // friendly area description
  cities: string[]; // cities in the territory
  phoneDisplay: string;
  phoneHref: string;
  phoneDigits: string; // 10-digit
  branchAddress: string;
  branchEmail: string;
  referenceUrl: string;
  heroPattern: string; // 1-line marketing hook for hero badge
  metaTitle: string;
  metaDescription: string;
}

export const TERRITORIES: Record<TerritoryId, Territory> = {
  "portland-east": {
    id: "portland-east",
    name: "Portland East",
    shortName: "Portland East",
    region: "Clackamas, Milwaukie, Gladstone, Happy Valley & Southeast Portland",
    cities: [
      "Clackamas",
      "Milwaukie",
      "Gladstone",
      "Happy Valley",
      "Southeast Portland",
      "Oak Grove",
      "Johnson City",
    ],
    phoneDisplay: "(503) 239-8000",
    phoneHref: "tel:+15032398000",
    phoneDigits: "5032398000",
    branchAddress: "12550 SE 93rd Ave Ste 160, Clackamas, OR 97015",
    branchEmail: "portlandeast@familyrhc.com",
    referenceUrl:
      "https://www.familyresourcehomecare.com/locations/portland-east-or/",
    heroPattern: "Serving SE Portland & Clackamas County",
    metaTitle:
      "In-Home Care in Portland East | Clackamas & Happy Valley | Family Resource Home Care",
    metaDescription:
      "Personal care, companion care, meal prep & veteran care across Clackamas, Milwaukie, Happy Valley & SE Portland. Free in-home assessment — same or next day. Call (503) 239-8000.",
  },
  "portland-west": {
    id: "portland-west",
    name: "Portland West",
    shortName: "Portland West",
    region: "Beaverton, Lake Oswego, Tualatin, West Linn & SW Portland",
    cities: [
      "Beaverton",
      "Lake Oswego",
      "Tualatin",
      "West Linn",
      "SW Portland",
      "Tigard",
      "Sherwood",
      "Wilsonville",
    ],
    phoneDisplay: "(503) 670-7260",
    phoneHref: "tel:+15036707260",
    phoneDigits: "5036707260",
    branchAddress: "Serving the Portland West Metro — by appointment",
    branchEmail: "portlandwest@familyrhc.com",
    referenceUrl:
      "https://www.familyresourcehomecare.com/locations/portland-west-or/",
    heroPattern: "Serving SW Portland & Westside Communities",
    metaTitle:
      "In-Home Care in Portland West | Beaverton, Lake Oswego & Tualatin | Family Resource Home Care",
    metaDescription:
      "Personal care, companion care, meal prep & veteran care across Beaverton, Lake Oswego, Tualatin, West Linn & SW Portland. Free in-home assessment — same or next day. Call (503) 670-7260.",
  },
  hillsboro: {
    id: "hillsboro",
    name: "Hillsboro",
    shortName: "Hillsboro",
    region: "Hillsboro, Forest Grove, Cornelius, St. Helens & NW Portland",
    cities: [
      "Hillsboro",
      "Forest Grove",
      "Cornelius",
      "St. Helens",
      "Scappoose",
      "NW Portland",
      "Aloha",
      "North Plains",
    ],
    phoneDisplay: "(971) 865-0101",
    phoneHref: "tel:+19718650101",
    phoneDigits: "9718650101",
    branchAddress: "Serving Washington & Columbia Counties — by appointment",
    branchEmail: "hillsboro@familyrhc.com",
    referenceUrl:
      "https://www.familyresourcehomecare.com/locations/hillsboro-or/",
    heroPattern: "Serving Hillsboro & Washington County",
    metaTitle:
      "In-Home Care in Hillsboro | Forest Grove, Cornelius & St. Helens | Family Resource Home Care",
    metaDescription:
      "Personal care, companion care, meal prep & veteran care across Hillsboro, Forest Grove, Cornelius, St. Helens & NW Portland. Free in-home assessment — same or next day. Call (971) 865-0101.",
  },
  gresham: {
    id: "gresham",
    name: "Gresham",
    shortName: "Gresham",
    region: "Gresham, Troutdale, Fairview, Sandy, Damascus & East SE Portland",
    cities: [
      "Gresham",
      "Troutdale",
      "Fairview",
      "Sandy",
      "Damascus",
      "Wood Village",
      "Boring",
      "East SE Portland",
    ],
    phoneDisplay: "(503) 512-7560",
    phoneHref: "tel:+15035127560",
    phoneDigits: "5035127560",
    branchAddress: "Serving East Multnomah County — by appointment",
    branchEmail: "gresham@familyrhc.com",
    referenceUrl:
      "https://www.familyresourcehomecare.com/locations/home-care-in-gresham/",
    heroPattern: "Serving Gresham & East Multnomah County",
    metaTitle:
      "In-Home Care in Gresham | Troutdale, Fairview & Sandy | Family Resource Home Care",
    metaDescription:
      "Personal care, companion care, meal prep & veteran care across Gresham, Troutdale, Fairview, Sandy & Damascus. Free in-home assessment — same or next day. Call (503) 512-7560.",
  },
  "oregon-city": {
    id: "oregon-city",
    name: "Oregon City",
    shortName: "Oregon City",
    region: "Oregon City, Canby, Estacada & Molalla",
    cities: [
      "Oregon City",
      "Canby",
      "Estacada",
      "Molalla",
      "Beavercreek",
      "Mulino",
      "Eagle Creek",
    ],
    phoneDisplay: "(971) 430-2384",
    phoneHref: "tel:+19714302384",
    phoneDigits: "9714302384",
    branchAddress: "Serving South Clackamas County — by appointment",
    branchEmail: "oregoncity@familyrhc.com",
    referenceUrl:
      "https://www.familyresourcehomecare.com/locations/home-care-in-oregon-city/",
    heroPattern: "Serving Oregon City & South Clackamas County",
    metaTitle:
      "In-Home Care in Oregon City | Canby, Estacada & Molalla | Family Resource Home Care",
    metaDescription:
      "Personal care, companion care, meal prep & veteran care across Oregon City, Canby, Estacada & Molalla. Free in-home assessment — same or next day. Call (971) 430-2384.",
  },
};

export const TERRITORY_ORDER: TerritoryId[] = [
  "portland-east",
  "portland-west",
  "hillsboro",
  "gresham",
  "oregon-city",
];

// ─── Services offered (per Atlas task content_requests) ───
// IMPORTANT: do NOT include "home health," "assisted living," "Medicare,"
// or dementia/Alzheimer's services — those are explicitly excluded.
export const SERVICES = [
  {
    slug: "personal-care",
    name: "Personal Care",
    short:
      "Bathing, grooming, dressing, mobility help & medication reminders — provided with dignity at home.",
    icon: "shower",
  },
  {
    slug: "companion-care",
    name: "Companion Care",
    short:
      "Conversation, friendly visits, hobbies, walks & social engagement to keep loved ones connected.",
    icon: "heart",
  },
  {
    slug: "meal-preparation",
    name: "Meal Preparation",
    short:
      "Grocery shopping, healthy home-cooked meals, dietary accommodations & shared mealtimes.",
    icon: "utensils",
  },
  {
    slug: "transportation-errands",
    name: "Transportation & Errands",
    short:
      "Safe rides to appointments, pharmacy pickups, grocery runs & community outings.",
    icon: "car",
  },
  {
    slug: "veteran-care",
    name: "Veteran Care",
    short:
      "Specialized in-home care for veterans, fully approved to accept VA Aid & Attendance benefits.",
    icon: "shield",
  },
  {
    slug: "after-hospital-care",
    name: "After-Hospital / Transitional Care",
    short:
      "Discharge support, recovery monitoring & a safe transition home after surgery or hospital stays.",
    icon: "hospital",
  },
  {
    slug: "respite-care",
    name: "Respite Care",
    short:
      "Short-term relief so family caregivers can rest, travel, or simply recharge — knowing care is covered.",
    icon: "users",
  },
] as const;

// ─── Accepted payment types (per Atlas spec) ───
export const PAYMENT_TYPES = [
  "Medicaid",
  "Veterans Affairs (VA) benefits",
  "Private pay",
  "Long-term care insurance",
] as const;

// ─── Form Q1 — qualifier ───
// "Are you or your loved one ready to receive care?" (Yes/No, required)
// Both Yes and No SUBMIT to lead API. "No" flags qualified:false.
export const READY_OPTIONS = [
  { value: "yes", label: "Yes — ready to start care", qualified: true },
  {
    value: "no",
    label: "No — just researching for now",
    qualified: false,
  },
] as const;

// ─── Form Q2 — optional: how did you hear about us ───
export const HEARD_FROM_OPTIONS = [
  { value: "", label: "Select an option…" },
  { value: "google_search", label: "Google search" },
  { value: "google_ads", label: "Google ad" },
  { value: "facebook", label: "Facebook" },
  { value: "referral_friend", label: "Friend or family referral" },
  { value: "referral_medical", label: "Hospital, doctor, or social worker" },
  { value: "referral_other", label: "Another organization or community" },
  { value: "other", label: "Other" },
] as const;

export type ReadyValue = (typeof READY_OPTIONS)[number]["value"];
export type HeardFromValue = (typeof HEARD_FROM_OPTIONS)[number]["value"];

// Disqualified leads still hit the lead API tagged with these fields.
export function leadIsQualified(args: {
  ready: ReadyValue | "";
}): { qualified: boolean; reason: string } {
  const q1 = READY_OPTIONS.find((o) => o.value === args.ready);
  if (q1 && !q1.qualified) {
    return { qualified: false, reason: "not_ready_to_start_care" };
  }
  return { qualified: true, reason: "" };
}
