"use client";

import { useEffect, useState } from "react";
import { CHAT_HOST } from "../floatingCta";

export interface ChatClearance {
  /** Bottom offset (px) that keeps the bar clear of the chat; the last usable one while blocked. */
  offset: number;
  /** False while the chat leaves the bar no usable space (for example, its panel is open). */
  fits: boolean;
}

interface ChatWatch {
  watched: WeakSet<Node>;
  changes: MutationObserver;
  sizes: ResizeObserver;
  update: () => void;
  signal: AbortSignal;
}

const RESTING: ChatClearance = { offset: 0, fits: true };

/**
 * Re-measures the chat clearance when the widget is added, changes (prompt, open/close), resizes or
 * finishes an animation, and on viewport resize. Event-driven: no polling, no scroll listener.
 */
export function useChatClearance(read: () => number | null): ChatClearance {
  const [clearance, setClearance] = useState(RESTING);
  useEffect(() => {
    const stop = new AbortController();
    const update = (): void => {
      watchChat(watch);
      const next = read();
      setClearance((prev) => settle(prev, next));
    };
    const changes = new MutationObserver(update);
    const watch: ChatWatch = { watched: new WeakSet(), changes, sizes: new ResizeObserver(update), update, signal: stop.signal };
    const pages = new MutationObserver((records) => {
      if (records.some(touchesChat)) update();
    });
    pages.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", update, { passive: true, signal: stop.signal });
    // A host added before its element is defined gets its shadow root on upgrade, which no observer sees.
    customElements.whenDefined(CHAT_HOST).then(() => {
      if (!stop.signal.aborted) update();
    });
    update();
    return () => {
      stop.abort();
      pages.disconnect();
      changes.disconnect();
      watch.sizes.disconnect();
    };
  }, [read]);
  return clearance;
}

/** Keeps the previous object when nothing changed, so an unchanged measurement never re-renders. */
function settle(prev: ChatClearance, next: number | null): ChatClearance {
  const offset = next ?? prev.offset;
  const fits = next !== null;
  return prev.offset === offset && prev.fits === fits ? prev : { offset, fits };
}

/** True when a page mutation adds or removes a chat host (the loader may nest it). */
function touchesChat(record: MutationRecord): boolean {
  return [...record.addedNodes, ...record.removedNodes].some(
    (node) => node instanceof Element && (node.matches(CHAT_HOST) || node.querySelector(CHAT_HOST) !== null),
  );
}

/** Observes each chat host, its shadow root and its parts once (re-observing would re-fire forever). */
function watchChat({ watched, changes, sizes, update, signal }: ChatWatch): void {
  const once = (node: Node): boolean => {
    if (watched.has(node)) return false;
    watched.add(node);
    return true;
  };
  for (const host of document.querySelectorAll(CHAT_HOST)) {
    if (once(host)) changes.observe(host, { attributes: true });
    const root = host.shadowRoot;
    if (!root) continue;
    if (once(root)) {
      changes.observe(root, { childList: true, subtree: true, attributes: true, characterData: true });
      root.addEventListener("transitionend", update, { signal });
      root.addEventListener("animationend", update, { signal });
    }
    for (const part of root.querySelectorAll("*")) if (once(part)) sizes.observe(part);
  }
}
