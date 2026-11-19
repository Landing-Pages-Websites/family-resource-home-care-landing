// When the market floating CTA may show: only in real gaps between the hero and the final form.
// It stays hidden while any part of the hero (with its form) or the final form card is on screen,
// while its fixed lane would cover a section action, inline link or FAQ control, and while it would
// paint over static content: a line of text (heading, body, eyebrow, quote, address, chip) or a photo.

import { FINAL_FORM_ID, HERO_FORM_ID, HERO_SECTION_ID } from "./content";

const CONTROLS = "main a[href], main button, main summary, main input, main select, main textarea, footer a[href]";
/** Where static content is read: text nodes (as painted glyph lines), meaningful photos and icons. */
const CONTENT_ROOTS = "main, footer";
const MEDIA = 'img:not([alt=""]), svg';
/** The wrapper sits this far lower while hidden (translate-y-6); the lane covers both positions. */
export const HIDDEN_SHIFT_PX = 24;
/** Reveal moves content up to 32px while it animates in; a control counts anywhere along that path. */
const REVEAL_TRAVEL_PX = 32;
/** Breathing room kept between the lane and static content (also covers eyebrow and chip fills). */
const STATIC_GAP_PX = 12;

function isOnScreen(element: HTMLElement | null): boolean {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
}

/** True when the rect is more than `min` pixels in both directions (sr-only boxes are 1x1). */
function hasArea(rect: DOMRect, min = 0): boolean {
  return rect.width > min && rect.height > min;
}

export interface Box {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface Point {
  x: number;
  y: number;
}

const ORIGIN: Point = { x: 0, y: 0 };

/**
 * The lane the bar can occupy, from its shown position down through its hidden offset. It removes
 * the bar's current vertical translate, so the result is the same whether the bar is shown, hidden
 * or mid-fade; otherwise its own show/hide would move the lane and could toggle it forever.
 */
export function floatingLane(rect: Box, translateY: number): Box {
  const top = rect.top - translateY;
  return { top, bottom: rect.bottom - translateY + HIDDEN_SHIFT_PX, left: rect.left, right: rect.right };
}

/** True when the box, grown by the margin on every side, reaches into the lane. */
function nearLane(lane: Box, box: Box, margin: number): boolean {
  return box.bottom + margin > lane.top && box.top - margin < lane.bottom && box.right + margin > lane.left && box.left - margin < lane.right;
}

/** True when a control, anywhere along Reveal's travel, would sit under the lane. */
export function coversLane(lane: Box, control: Box): boolean {
  return nearLane(lane, control, REVEAL_TRAVEL_PX);
}

/** True when static content sits in the lane or within its breathing gap. */
export function crowdsLane(lane: Box, content: Box): boolean {
  return nearLane(lane, content, STATIC_GAP_PX);
}

/**
 * The painted rect together with where it settles once its translate (a Reveal still sliding in,
 * or not yet started) is gone, so content is protected along its whole remaining travel.
 */
export function settledBounds(rect: Box, shift: Point): Box {
  return {
    top: Math.min(rect.top, rect.top - shift.y),
    bottom: Math.max(rect.bottom, rect.bottom - shift.y),
    left: Math.min(rect.left, rect.left - shift.x),
    right: Math.max(rect.right, rect.right - shift.x),
  };
}

/** Shown: fades and slides in. Hidden: stops painting at once, so a fading bar never covers content. */
export function floatingVisibility(show: boolean): string {
  return show ? "transition-[opacity,translate] duration-200 opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none";
}

/** An element's own offset: Tailwind's translate-* utilities set the CSS `translate` property. */
function translation(element: Element): Point {
  const style = getComputedStyle(element);
  const [x = "0", y = "0"] = style.translate === "none" ? [] : style.translate.split(" ");
  const matrix = new DOMMatrixReadOnly(style.transform);
  return { x: (parseFloat(x) || 0) + matrix.m41, y: (parseFloat(y) || 0) + matrix.m42 };
}

/** The summed translate of an element and its ancestors, memoised for one measurement. */
function shiftOf(element: Element, cache: Map<Element, Point>): Point {
  const cached = cache.get(element);
  if (cached) return cached;
  const parent = element.parentElement;
  const above = parent && parent !== document.body ? shiftOf(parent, cache) : ORIGIN;
  const own = translation(element);
  const total = { x: above.x + own.x, y: above.y + own.y };
  cache.set(element, total);
  return total;
}

function laneCoversControl(wrapper: HTMLElement, lane: Box): boolean {
  for (const control of document.querySelectorAll<HTMLElement>(CONTROLS)) {
    if (wrapper.contains(control)) continue;
    const rect = control.getBoundingClientRect();
    if (hasArea(rect) && coversLane(lane, rect)) return true;
  }
  return false;
}

/** Margin within which content can matter: the most a Reveal still has to travel, plus the gap. */
const NEARBY_PX = REVEAL_TRAVEL_PX + STATIC_GAP_PX;

/** True when a painted line of a text node, along its remaining travel, crowds the lane. */
function textCrowdsLane(text: Text, lane: Box, range: Range, cache: Map<Element, Point>): boolean {
  const parent = text.parentElement;
  if (!parent || !/\S/.test(text.data)) return false;
  const box = parent.getBoundingClientRect();
  // Screen-reader-only text sits in a clipped 1px box; skip anything too far away to matter.
  if (!hasArea(box, 1) || !nearLane(lane, box, NEARBY_PX)) return false;
  range.selectNodeContents(text);
  const shift = shiftOf(parent, cache);
  for (const line of range.getClientRects()) if (crowdsLane(lane, settledBounds(line, shift))) return true;
  return false;
}

/** True when a photo or icon, along its remaining travel, crowds the lane. */
function mediaCrowdsLane(media: Element, lane: Box, cache: Map<Element, Point>): boolean {
  const rect = media.getBoundingClientRect();
  return hasArea(rect) && nearLane(lane, rect, NEARBY_PX) && crowdsLane(lane, settledBounds(rect, shiftOf(media, cache)));
}

function laneCrowdsContent(lane: Box): boolean {
  const cache = new Map<Element, Point>();
  const range = document.createRange();
  for (const root of document.querySelectorAll(CONTENT_ROOTS)) {
    for (const media of root.querySelectorAll(MEDIA)) if (mediaCrowdsLane(media, lane, cache)) return true;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) if (textCrowdsLane(node as Text, lane, range, cache)) return true;
  }
  return false;
}

export function shouldShowFloatingCta(wrapper: HTMLElement | null): boolean {
  if (!wrapper) return false;
  const hero = document.getElementById(HERO_SECTION_ID);
  if (!hero || hero.getBoundingClientRect().bottom > 0) return false;
  if (isOnScreen(document.getElementById(HERO_FORM_ID)) || isOnScreen(document.getElementById(FINAL_FORM_ID))) return false;
  const lane = floatingLane(wrapper.getBoundingClientRect(), translation(wrapper).y);
  return !laneCoversControl(wrapper, lane) && !laneCrowdsContent(lane);
}

// The site's inherited chat (GTM loads a <chat-widget> whose launcher, prompt and panel live in its
// open shadow root; the host itself has no height). The bar rises above whatever of it is painted.
export const CHAT_HOST = "chat-widget";
/** Minimum space between the bar and the chat's painted UI, held along the whole reveal. */
const CHAT_GAP_PX = 12;
/** The bar never rises past this share of the viewport; a taller chat (an open panel) hides it. */
const MAX_CLEARANCE_RATIO = 0.45;

/**
 * The bottom offset that lifts the bar clear of every chat box across its horizontal span, or null
 * when only an unusable lift would clear them. 0 means the bar keeps its resting position. The lift
 * includes the hidden shift, so the gap holds along the whole reveal (24px below up to rest).
 */
export function chatClearance(bar: Pick<Box, "left" | "right">, boxes: Box[], viewportHeight: number): number | null {
  let clearance = 0;
  for (const box of boxes) {
    const besideBar = box.right + CHAT_GAP_PX <= bar.left || box.left - CHAT_GAP_PX >= bar.right;
    if (besideBar || box.top >= viewportHeight || box.bottom <= 0) continue;
    clearance = Math.max(clearance, viewportHeight - box.top + CHAT_GAP_PX + HIDDEN_SHIFT_PX);
  }
  return clearance > viewportHeight * MAX_CLEARANCE_RATIO ? null : clearance;
}

/** Whether an element paints; older Safari (before 17.4) lacks checkVisibility, so read its own style. */
function isPainted(element: Element): boolean {
  if (typeof element.checkVisibility === "function") return element.checkVisibility({ opacityProperty: true, visibilityProperty: true });
  const style = getComputedStyle(element);
  return style.visibility !== "hidden" && style.opacity !== "0";
}

/** Every painted chat element, read from the shadow root rather than the zero-height host. */
export function chatBoxes(): Box[] {
  const boxes: Box[] = [];
  for (const host of document.querySelectorAll(CHAT_HOST)) {
    for (const part of host.shadowRoot?.querySelectorAll("*") ?? []) {
      const rect = part.getBoundingClientRect();
      if (hasArea(rect) && isPainted(part)) boxes.push(rect);
    }
  }
  return boxes;
}
