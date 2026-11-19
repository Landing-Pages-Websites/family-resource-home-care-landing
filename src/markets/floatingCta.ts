// When the market floating CTA may show: only in real gaps between the hero and the final form.
// It stays hidden while any part of the hero (with its form) or the final form card is on screen,
// and while its fixed lane would cover a section action, inline link or FAQ control.

import { FINAL_FORM_ID, HERO_FORM_ID, HERO_SECTION_ID } from "./content";

const CONTROLS = "main a[href], main button, main summary, main input, main select, main textarea, footer a[href]";
/** The wrapper sits this far lower while hidden (translate-y-6); the lane covers both positions. */
export const HIDDEN_SHIFT_PX = 24;
/** Reveal moves content up to 32px while it animates in; a control counts anywhere along that path. */
const REVEAL_TRAVEL_PX = 32;

function isOnScreen(element: HTMLElement | null): boolean {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
}

export interface Box {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * The lane the bar can occupy, from its shown position down through its hidden offset. It removes
 * the bar's current vertical translate, so the result is the same whether the bar is shown, hidden
 * or mid-fade; otherwise its own show/hide would move the lane and could toggle it forever.
 */
export function floatingLane(rect: Box, translateY: number): Box {
  const top = rect.top - translateY;
  return { top, bottom: rect.bottom - translateY + HIDDEN_SHIFT_PX, left: rect.left, right: rect.right };
}

/** True when a control, anywhere along Reveal's travel, would sit under the lane. */
export function coversLane(lane: Box, control: Box): boolean {
  const t = REVEAL_TRAVEL_PX;
  return control.bottom + t > lane.top && control.top - t < lane.bottom && control.right + t > lane.left && control.left - t < lane.right;
}

/** The wrapper's current vertical offset: Tailwind's translate-y-* sets the CSS `translate` property. */
function offsetY(element: HTMLElement): number {
  const style = getComputedStyle(element);
  const [, translateY = "0"] = style.translate === "none" ? [] : style.translate.split(" ");
  return (parseFloat(translateY) || 0) + new DOMMatrixReadOnly(style.transform).m42;
}

function laneCoversControl(wrapper: HTMLElement): boolean {
  const lane = floatingLane(wrapper.getBoundingClientRect(), offsetY(wrapper));
  for (const control of document.querySelectorAll<HTMLElement>(CONTROLS)) {
    if (wrapper.contains(control)) continue;
    const rect = control.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0 && coversLane(lane, rect)) return true;
  }
  return false;
}

export function shouldShowFloatingCta(wrapper: HTMLElement | null): boolean {
  if (!wrapper) return false;
  const hero = document.getElementById(HERO_SECTION_ID);
  if (!hero || hero.getBoundingClientRect().bottom > 0) return false;
  if (isOnScreen(document.getElementById(HERO_FORM_ID)) || isOnScreen(document.getElementById(FINAL_FORM_ID))) return false;
  return !laneCoversControl(wrapper);
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
      if (rect.width > 0 && rect.height > 0 && isPainted(part)) boxes.push(rect);
    }
  }
  return boxes;
}
