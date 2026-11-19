// Visitor copy shared by the four market routes. Sources: research page_blueprint.json
// copy_direction, service_copy.json, faq_provenance.json and proof.json for task 68e909bd.
// Hyphenated words in headings, buttons and chips use U+2011 so they never break at the hyphen.

import { FORM_ANCHOR, SITE } from "@/site";
import type { MarketIconName } from "./components/MarketIcon";

export const PRIVACY_URL = SITE.privacyUrl;
export const PRIMARY_CTA = "Get My Free Assessment";
/** The hero section; the floating CTA appears only once it has scrolled out of view. */
export const HERO_SECTION_ID = "hero";
/** The hero form; the hero CTA pair and the header button open it. */
export const HERO_FORM_ID = "hero-form";
/** The final form; every CTA after the hero goes forward to it. */
export const FINAL_FORM_ID = FORM_ANCHOR.slice(1);
/** The closing contact section; the floating CTA hides as it nears it. */
export const CONTACT_SECTION_ID = "contact";
/** SITE.primaryCta with a no-break hyphen, so the button never splits "In-Home". */
export const SUBMIT_LABEL = SITE.primaryCta.replace("In-Home", "In\u2011Home");
export const FORM_TITLE = "Request Your Free In\u2011Home\u00a0Assessment";
export const HERO_FORM_SUBHEAD =
  "Same\u2011day or next\u2011day visits available. We’ll listen, answer questions, and help you decide if care is right for your loved one.";
export const PRIVACY_NOTE = "We’ll use your details to respond to your care inquiry.";

// Each hero proof point appears once on a screen: the offer lives in the hero sentence and the
// stats strip, ownership in the stats strip (and the phone trust line), payment in the trust row.
export const HERO_CHIPS = [
  "Personalized care plan",
  "Caregivers matched to your loved one",
  "Trained caregivers we employ directly",
  "Visits from a few hours to 24\u2011hour care",
] as const;

export const PAYMENT_TRUST = "Medicaid · VA · Private Pay";
export const OWNERSHIP_TRUST = "Independently owned";

export const STATS = [
  { value: "Independently", label: "Owned", sub: "Not a franchise, with caregivers backed by our local team." },
  { value: "Same Day", label: "Assessments", sub: "Free in\u2011home visits available today or tomorrow, with no obligation." },
  {
    value: "24/7",
    label: "On\u2011Call Support",
    sub: "A supervisor is available when questions come up outside regular office hours.",
  },
  {
    value: "Local",
    label: "Caregivers",
    sub: "Matched to your needs, background\u2011checked and supervised by our local office.",
  },
] as const;

export interface ServiceCard {
  name: string;
  body: string;
  icon: MarketIconName;
}

export const SERVICES: readonly ServiceCard[] = [
  { name: "Personal Care", body: "Respectful help with bathing, dressing, grooming and daily routines.", icon: "shower" },
  { name: "Companion Care", body: "Conversation, favorite activities and a familiar companion at home.", icon: "heart" },
  {
    name: "Meal Preparation",
    body: "Meal planning, grocery shopping and preparation that fits personal preferences.",
    icon: "utensils",
  },
  {
    name: "Transportation & Errands",
    body: "Help getting to appointments, picking up prescriptions and completing everyday errands.",
    icon: "car",
  },
  {
    name: "Veteran Care",
    body: "Practical in\u2011home support for veterans, with help exploring VA benefit options.",
    icon: "shield",
  },
  {
    name: "After\u2011Hospital / Transitional Care",
    body: "Help with everyday tasks while settling back into home after a hospital stay.",
    icon: "hospital",
  },
  {
    name: "Respite Care",
    body: "Time for family caregivers to rest, attend to other responsibilities or take a break.",
    icon: "users",
  },
  {
    name: "24\u2011hour Care",
    body: "Around\u2011the\u2011clock assistance for families who need support throughout the day and night.",
    icon: "moon",
  },
];

export const STEPS = [
  {
    num: "01",
    title: "Tell us what’s happening",
    body: "We’ll listen to your family’s concerns and learn what help would make daily life easier.",
  },
  {
    num: "02",
    title: "Meet with us at home",
    body: "Together, we’ll develop a care plan around your loved one’s routine, preferences and needs.",
  },
  {
    num: "03",
    title: "Meet your caregiver",
    body: "We’ll match a caregiver to the plan and keep in touch as your family’s needs change.",
  },
] as const;

export const REASONS: ReadonlyArray<{ title: string; body: string; icon: MarketIconName }> = [
  {
    title: "Free in\u2011home assessment",
    body: "A care coordinator visits at no cost to understand your loved one’s routine and listen to your concerns.",
    icon: "calendar",
  },
  {
    title: "Caregivers matched, not assigned",
    body: "We take your loved one’s personality, preferences and needs into account when making a match.",
    icon: "match",
  },
  {
    title: "Flexible care, on your schedule",
    body: "From regular visits to overnight and 24\u2011hour support, we work with your family to plan a schedule that fits changing needs.",
    icon: "clock",
  },
  {
    title: "Backed by a full local team",
    body: "Our office handles scheduling, supervision and after\u2011hours support, so there’s a person to turn to when life changes.",
    icon: "team",
  },
];

export const PAYMENT_OPTIONS = [
  "Medicaid",
  "Veterans Affairs (VA) benefits",
  "Private pay",
  "Long\u2011term care insurance",
] as const;

/** Verbatim (the middle one an unaltered excerpt), with each note's true region and year. The short
 * note sits in the middle so the row is balanced, and the Spokane credit never closes it. */
export const TESTIMONIALS = [
  {
    quote:
      "I would like to share a huge compliment for the amazing care our family received from Family Resource Home Care. The caregiver who supported our loved one was compassionate, dependable, and truly went above and beyond. Her kindness and professionalism made a meaningful difference during an important time for our family. Thank you to the Spokane team for providing such wonderful support and service.",
    name: "Spokane Family Member of Client",
    year: "2026",
    initials: "SF",
    excerpt: false,
  },
  {
    quote:
      "The transition from independent living to needing assistance in my home has been made easier by their tact and professionalism. Thank you so much.",
    name: "Family Resource Client",
    year: "2025",
    initials: "FR",
    excerpt: true,
  },
  {
    quote:
      "I would like to leave a huge compliment for my Caregiver today, named Vanessa! She was outstanding! Showed up on time, worked very hard the whole time she was here, did all that was asked and then some! Her attitude was very professional, caring and helpful. Great listener and communicator too. Thank you for sending her on my first day of care giving services with your company. She is a perfect example that shines as an employee in every way!!",
    name: "Portland East Client",
    year: "2026",
    initials: "PE",
    excerpt: false,
  },
] as const;

export const FAQS = [
  {
    q: "What is the minimum visit length?",
    a: "Our minimum shift is two to four hours, depending on the branch. Your local team can explain the visit length for your area.",
  },
  {
    q: "How much does care cost?",
    a: "You pay for the services and time you need. Rates vary by location and individual needs, and we provide an exact bill rate at your assessment.",
  },
  { q: "Can I cancel care if my plans change?", a: "Yes. You can cancel service at any time with 24 hours’ notice." },
  {
    q: "Do I pay the caregiver directly?",
    a: "Our caregivers are our employees, and we handle their pay. We send you an itemized monthly bill and accept Visa, MasterCard and checks, with autopay available from a checking account or credit card.",
  },
  {
    q: "What happens if my regular caregiver is away?",
    a: "If your regular caregiver takes vacation, becomes ill or has an unexpected emergency, we make every effort to arrange a qualified substitute for the scheduled visit.",
  },
  {
    q: "Can I request a different caregiver?",
    a: "Yes. You can request a new caregiver at any time by speaking with our caregiver managers.",
  },
  {
    q: "Do caregivers speak English and have driving credentials?",
    a: "We require and test written and spoken English fluency. Caregivers who drive for clients must have a driver’s license, insurance and a good driving record, with documentation regularly updated.",
  },
  {
    q: "Can you provide references?",
    a: "Yes. We can provide a list of satisfied clients and community referral sources who are happy to talk about their experience.",
  },
] as const;
