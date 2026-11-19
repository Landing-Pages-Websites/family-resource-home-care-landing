"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

interface ScrollFlagOptions {
  /**
   * Turn on only once `read` has stayed true this long (no flash in a gap scrolled straight through).
   * Turning off is then immediate and committed before the frame paints.
   */
  showAfterMs?: number;
}

/**
 * A boolean recomputed on scroll and resize (passive listeners), whenever the page's layout changes
 * size (an FAQ opening, a form swapping to its success card), when an animation settles and when a
 * web font finishes loading.
 */
export function useScrollFlag(read: () => boolean, { showAfterMs }: ScrollFlagOptions = {}): boolean {
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    let pending: number | undefined;
    const confirm = (): void => {
      pending = undefined;
      if (read()) setFlag(true);
    };
    // Event callbacks run outside React, so a hide can be flushed there; the effect's own run cannot.
    // `sync` only matters with `showAfterMs`; without it the flag simply follows `read`.
    const decide = (sync: boolean): void => {
      if (showAfterMs === undefined) return setFlag(read());
      if (read()) {
        pending ??= window.setTimeout(confirm, showAfterMs);
        return;
      }
      window.clearTimeout(pending);
      pending = undefined;
      const hide = (): void => setFlag(false);
      if (sync) flushSync(hide);
      else hide();
    };
    const update = (): void => decide(true);
    decide(false);
    const stop = watchLayout(update);
    return () => {
      window.clearTimeout(pending);
      stop();
    };
  }, [read, showAfterMs]);
  return flag;
}

/** Calls `update` on every event that can move content under a fixed element; returns the cleanup. */
function watchLayout(update: () => void): () => void {
  const stop = new AbortController();
  const options = { passive: true, signal: stop.signal };
  window.addEventListener("scroll", update, options);
  window.addEventListener("resize", update, options);
  document.addEventListener("transitionend", update, { capture: true, signal: stop.signal });
  document.fonts.addEventListener("loadingdone", update, { signal: stop.signal });
  const layout = new ResizeObserver(update);
  layout.observe(document.body);
  return () => {
    stop.abort();
    layout.disconnect();
  };
}
