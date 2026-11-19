# Market routes provenance (task 68e909bd)

`/salem`, `/grants-pass`, `/medford` and `/olympia` are additive. They mirror the approved
Portland template (sections, classes, palette, Manrope/Inter) through opt-in components in
`src/markets/**`, with the current new-surface corrections listed under "Required new-route
corrections" below (so the new pages are not a byte-for-byte copy of the template geometry). No pre-existing file is modified; the root and five Portland routes still
render through `src/components/TerritoryPage.tsx` and the legacy `LeadForm`.

## Canonical form modules (lp-starter `e8e8d9b5c8cd4be6d65818a914c33edecdbeed69`)

Byte-identical copies:

- `src/lib/{attribution,conditions,currency,date,domain,fields,leadPayload,managedSubmit,multiSelect,prepareSubmissionValues,qualification,reservedFields,successRedirect,textarea,waivers,zip}.ts`
  (`fields.ts` SHA-256 `d25400ba6ee08423f81f50a3dda98d6bd8d110952edfd99f0618799aeeedfe89`)
- `src/hooks/useLeadFormFlow.ts`, `src/components/formErrorMessage.ts`, `test/fixtures/site.ts`
- Tests: `src/lib/{fields,zip,attribution,qualification,leadPayload,conversionEvents,optionalFields,reservedFields}.test.ts`,
  `src/components/formErrorMessage.test.ts`

Documented deviations:

- `src/lib/conversionEvents.ts`: the `declare global` block is omitted, because the legacy
  `src/components/LeadForm.tsx` already declares `Window.MegaTag`/`dataLayer` with another type.
- `src/lib/managedSubmit.test.ts`: the "lead form wiring" block reads the market controller and
  form instead of the starter-only `useLeadFormController.ts` / `LeadForm.tsx` / `SubmitButton.tsx`.
- `src/site.ts`: starter types and constants verbatim; `SITE` is FRHC's, reading its ids from `Brand.ts`.
- `src/markets/useMarketLeadForm.ts` and `useMarketLeadController.ts` are adapters of the
  starter `useMegaLeadForm.ts` / `useLeadFormController.ts` (the legacy hook of that name must stay
  for the Portland routes). Same logic, plus per-market `territory*` form_data keys and the
  `qualified_lead` signal after an accepted ready lead.
- `src/markets/formEvents.ts`: its small never-throw `attempt()` wrapper repeats the private helper in
  `src/lib/conversionEvents.ts`, which stays byte-identical to the starter and does not export it.

Run the unit tests with `npx tsx --test "src/**/*.test.ts"` (no package.json change).

## Images (`public/images/markets/`)

Re-encoded to WebP q85 from first-party originals recovered for this task; never upscaled.

| File | Slot | Source (familyresourcehomecare.com uploads) | Source px | File px |
| --- | --- | --- | --- | --- |
| `frhc-hug-moment.webp` | hero backdrop | `2023/10/K4A2552-1.jpg` (sha256 `167ab4bf…`) | 5304×3536 | 3840×2560 |
| `frhc-bench-visit.webp` | photo band | `2023/11/FRHCAbout2-1.webp` (sha256 `967fbb27…`) | 2049×1652 | 2049×1652 |
| `frhc-park-walk.webp` | welcome | `2021/09/A-Paycheck-with-a-Purpose_06.jpg` (sha256 `2b18dcfd…`) | 1600×1067 | 1600×1067 |
| `frhc-garden-visit.webp` | story | `2019/04/fam-home-banner.jpg` (sha256 `6aa73e96…`) | 1400×768 | 1400×768 |

Slot ratios and `sizes` are set so every delivered file holds 2x density from 320px to 1728px.

The template's dimmed how-it-works backdrop photo is not used. `Family-Resource-Home-Care-Hero_01.jpg`
and `FRHCAbout2-1.webp` are the same bench scene (same people and outfits), and the only other
originals with full-bleed pixels (`K4A2552-1.jpg`) already fill the hero, so the band keeps its navy
wash and stripes without a repeated scene. Below 1024px the hero backdrop is a band at the photo's
own proportions fading into the navy (a full cover of the tall stacked hero would need more source
height than the original has); section geometry is unchanged.
These are company photos, not pictures of a market office; alt text never names a city.

## Hero proof amendment (controller-authorized, round 2)

The round-1 design review found the template's hero trust row missing and the same-day offer and
"independently owned" repeated across the hero chips, badge, form and stats. The controller
authorized a bounded amendment of the new-route hero chips and trust row only (the H1, agency
sentence, offer sentence, form copy, badge and stats are unchanged). Each point now appears once
per screen:

| Element | Copy | Source |
| --- | --- | --- |
| Hero chip (kept) | Personalized care plan | https://www.familyresourcehomecare.com/how-we-help/frequently-asked-questions/#collapse-1-8537 |
| Hero chip (kept) | Caregivers matched to your loved one | research `page_blueprint.json` hero copy (task positioning) |
| Hero chip (new) | Trained caregivers we employ directly | FAQ `#collapse-1-8543` (classroom and on-site training) and `#collapse-1-8532` ("Our caregivers are our employees") |
| Hero chip (new) | Visits from a few hours to 24‑hour care | FAQ `#collapse-1-8527` (two-to-four-hour minimum by branch) and https://www.familyresourcehomecare.com/home-care-services/overnight-24-7-care/ |
| Trust row, 1024px+ | Payment accepted: Medicaid · VA · Private Pay | FAQ `#collapse-1-8531` (state Medicaid programs, Veterans Administration); same categories as the page's Payment Options block |
| Trust line under the compact submit, below 1024px | Independently owned · Medicaid · VA · Private Pay | FAQ `#collapse-1-8540` ("one of the largest independently-owned home care agencies"; not a franchise) and `#collapse-1-8531` |

Removed from the chips: "Free same/next‑day assessment" (kept in the hero sentence, badge and stats)
and "Independently owned" (kept in the stats strip and, on phones, the trust line). No stars, award
or "Open 7 days" claim is shown: none is verified for these branches.

## Required new-route corrections (controller gates, round 2)

Current form, conversion and floating-CTA rules apply to these new surfaces even where the template
differs (WEB Director decision 1f376687). Old routes and shared CSS are untouched; every change below
lives in `src/markets/**`.

- **Controls:** 2px input/select borders in `#7d8797` (3.63:1 on white; the template's 1px `#dbe0e8`
  was 1.33:1), scoped in `market.css`; readiness options use the same colour. Focus and error borders
  are unchanged.
- **Section endings:** `PhotoBand` (its single CTA replaced), `Services`, `WhyUs` and `Testimonials`
  now end with the form CTA and phone pair (`CtaPair`) to `#form`, like the template's other content
  sections. These add one button row of height to each of those sections. The stats strip is a trust
  fragment and the final form section ends with its form, so neither gets a pair.
- **Floating CTA:** `floatingCta.ts` shows it only in real gaps: never while any part of the hero or
  of either form card is on screen, and never while its fixed lane would cover a section action, inline
  link or FAQ control (Reveal's 32px travel included). It is `inert` and out of the tab order while hidden.
- **Small screens:** the final form stacks its paired inputs below 360px, compact inputs use slimmer
  side padding below 360px, and the contact heading keeps "in {City}" together below 1024px.

## Floating CTA and the inherited chat widget (round 3, production repair)

On production (`/salem`, 390x844, scrollY 1900, chat prompt dismissed), the GTM-loaded `<chat-widget>`
launcher (58px, fixed at right 20 / bottom 20; rect x312..370, y766..824) covered the right end of the
floating bar (x12..378, y778.8..832). Two of the nine hit points landed on `CHAT-WIDGET`. The widget
draws in an open shadow root and its host is 0px tall, so the host's own rect cannot be used.

- **Change, `src/markets/**` only:** `chatBoxes()` reads the painted shadow-root parts (launcher,
  prompt, panel). `chatClearance()` lifts the bar above every part that overlaps it horizontally,
  through `bottom: max(<resting>, var(--chat-clearance))`. Without a chat, the bar keeps its resting
  12px / 24px. The bar is hidden only when the lift would take it past 45% of the viewport (an open
  panel). It reappears when the panel closes.
- **Updates are event-driven (`useChatClearance`):** it re-measures when a chat host is added, when
  the element upgrades, on host or shadow mutations, on part resizes, on transition or animation end,
  and on viewport resize. There is no polling and no scroll listener.
- **Reveal path (round 5, review fix):** the bar fades in while sliding up 24px (`translate-y-6` to 0),
  and it takes pointer events from the first frame. The 90px lift cleared only the settled bar
  (bottom 754 at 390x844); the reveal started at 778, over the launcher at 766. The lift now adds that
  24px (`HIDDEN_SHIFT_PX`), so the bar is 12px clear across the whole reveal and fade-out (114px
  lift for the bubble; settled bottom 730, start 754). The 45% cap applies to that full lift, so a
  chat part whose top sits within 24px of the old cutoff now hides the bar instead of lifting it.
- **Animation:** only opacity and translate are animated. The lane math already ignores the translate,
  so the existing no-oscillation result still holds.
- **Unchanged:** the chat, its loader and configuration, z-index order, tracking, legacy routes and
  every other floating rule (hero, form cards, control lane, `inert`, forward-only `#form`).

## Trust-strip value scale (QA repair, report 08003f71)

Independent QA (review task 63607326, report 08003f71) found that at 1024x768 with a classic scrollbar
(clientWidth 1009), "Independently" at 36px (`lg:text-4xl`) overprinted "Same Day" on all four routes.
"Independently" is about 7x its font size wide (252px at 36px), and a four-column cell's content box
is about 184px at clientWidth 1009. The text also left its content box at 1050-1280 and at 440
(two columns, 6.5px from the card edge).

- **Change, `MarketStats.tsx` only:** one shared `VALUE_SCALE` on all four values. Sizes are 24px
  (1 column), 20px from 440px (2 columns), 30px from 640px, 24px from 1024px (4 columns), 30px from
  1280px, and 36px from 85rem (1360px), where the max-w-7xl strip is at full width. Copy, weight,
  colour, labels, supporting text, padding, grid and section order are unchanged.
- **Accepted at native width (classic 15px scrollbar):** at 320-1728, including both sides of every
  breakpoint, each value is one line inside its cell's content box, with a positive gap to its
  neighbour and no sideways scroll. The minimum cell gutter is 27px (at 440). At 390, 1440 and 1728
  the strip region (cropped) is pixel-identical to the pre-repair build.

## Floating CTA yields to static content; closing pairs side by side (QA ab9dfbaf / 835fb063)

Independent QA (comment ab9dfbaf, bounded by 835fb063, 2026-11-19; attempt 2/3) found that at
390x844 (clientWidth 375) the settled amber bar covered the `#local-care` heading on all four routes
(Salem scrollY 1836, Grants Pass 1862, Medford 1888, Olympia 1836). The lane test only knew controls.

- **Static content lane (`floatingCta.ts`):** the bar also hides while static content is within 12px
  (`STATIC_GAP_PX`) of its lane. Static content means every painted text line in `main` and `footer`,
  read per text node with a DOM Range (headings, body, eyebrows, stats, quotes, names, chips, address,
  FAQ text), plus photos with alt text and icons. Text in screen-reader-only boxes (1px) is skipped,
  and so are decorative backdrops (`alt=""`). Whole sections and cards are not used, so blank padding
  and card fills stay usable. Each rect is joined with where it settles once any translate (a Reveal
  still sliding in) is gone. The lane, the control test, the hero/form rules, chat clearance and
  `inert` are unchanged.
- **Instant hide, animated show:** the 200ms fade and 24px slide now run only when the bar shows. A
  hide stops painting at once, so a fading bar never sits over text scrolling into its lane.
- **No flash, no lag (`useScrollFlag`, opt-in):** the bar shows only after its lane has been clear for
  150ms, so a gap scrolled straight through never flashes it. A hide is committed synchronously in the
  scroll/resize/layout event, before that frame paints. Font loads also trigger a re-check. The
  header's use of the hook is unchanged.
- **Limit:** in Chromium the compositor can scroll a frame before the page's scroll event runs. The
  12px gap absorbs small steps. A larger jump can show one frame of overlap before the hide, which a
  main-thread frame recorder cannot see.
- **Availability:** on phones the clear gaps are the space between sections, so the bar appears
  where a reader pauses between sections and stays hidden over reading content. The header's Free
  Assessment button stays available throughout.
- **Closing pairs (`MarketPhotoBand.tsx`, `OfficeActions.tsx`):** from 1024px both pairs are side
  by side and centered, with the same labels, targets, order and button classes. `#local-care`: from
  1024 to 1279px the pair is a centered row under the photo and text. From 1280px it is centered under
  the text column, on one line. It is 13-29px wider than that 479-485px column, so its box takes half
  of each 48px gutter and the pair extends 6.6-14.2px past the column on each side (at least 33px
  clear of the photo); this keeps the canonical column gap clear. Without the pair the
  column would end 140-145px above the photo. `#service-area`: the address card spans the office card
  and the pair is centered below it. Below 1024px both sections render exactly as before.

## Proof, testimonial and FAQ send-back (task 1293b210)

Human send-back: https://admin.gomega.ai/tasks/f79bba62-9e13-4703-bd45-7bdb3cece492 `qa_failure_reason`.
It supersedes only the first trust-strip stat, the first two testimonial cards and the first FAQ
answer on all four routes. Everything else above stays in force.

| Element | Now | Superseded (task 68e909bd) | Source |
| --- | --- | --- | --- |
| Stat 1 | "50+" / "Years of History" / "One of the largest independently owned home care agencies in the country, not a franchise." | "Independently" / "Owned" / "Not a franchise, with caregivers backed by our local team." | FAQ `#collapse-1-8525` ("history spans more than 50 years, with roots in several long-established, family-owned home care agencies"; the current organization took shape in 2018, so this is history, not entity age) and `#collapse-1-8540` ("one of the largest independently-owned home care agencies in the country") |
| Card 1 | Per market: /salem "Salem Client", 2026 (SC); /grants-pass and /medford "Roseburg Husband of Client", 2026 (RH); /olympia "Spouse of Client", 2024 (SC) | Spokane Family Member of Client, 2026, on every route | Testimonials page, credited there as "Happy Salem Client, 2026", "Happy Roseburg Husband of Client, 2026", "Spouse of Client, 2024" |
| Card 2 | "I am no longer skipping meals … tact and professionalism." (Family Resource Client, 2025) | Closing excerpt with an automatic leading "…" | Testimonials page, "Happy Client, 2025" |
| FAQ 1 answer | "Our minimum shift is two to four hours, depending on the branch." | Same plus "Your local team can explain the visit length for your area." | FAQ `#collapse-1-8527` |

- Sources: https://www.familyresourcehomecare.com/how-we-help/frequently-asked-questions/ and
  https://www.familyresourcehomecare.com/about/awards-reviews-testimonials/testimonials/ (both read
  2026-11-19). Excerpt wording is the human's exact text: "…" marks each cut (one per quote), the
  apostrophes are as supplied, and Salem's "front‑line" uses U+2011 so it never splits at the hyphen.
  Locality credits are the reviewers' own (Roseburg, no city for the spouse); they are not swapped
  for the route's market. Card 3 (Vanessa, Portland East Client, 2026) is unchanged.
- `TestimonialCard` no longer adds a leading ellipsis (the `excerpt` flag is gone). The first card
  comes from `marketTestimonials(market.id)` in `content.ts`.
- The hero ownership line ("Independently owned") and the other three stats are unchanged. The
  trust-strip value scale above stays as measured for "Independently"; "50+" is narrower.
- No layout, class, image, form, phone, CTA or tracking change.
