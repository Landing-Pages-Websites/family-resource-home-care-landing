"use client";

import { useEffect, useState } from "react";

/**
 * A boolean recomputed on scroll and resize (passive listeners), whenever the page's layout changes
 * size (an FAQ opening, a form swapping to its success card) and when an animation settles.
 */
export function useScrollFlag(read: () => boolean): boolean {
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    const update = (): void => setFlag(read());
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    document.addEventListener("transitionend", update, true);
    const layout = new ResizeObserver(update);
    layout.observe(document.body);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.removeEventListener("transitionend", update, true);
      layout.disconnect();
    };
  }, [read]);
  return flag;
}
