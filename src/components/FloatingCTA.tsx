"use client";

import { useEffect, useState } from "react";
import type { Territory } from "./Brand";

interface FloatingCTAProps {
  territory: Territory;
}

export function FloatingCTA({ territory }: FloatingCTAProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-3 inset-x-3 z-40 sm:hidden transition-all ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <div className="flex gap-2 bg-white shadow-2xl rounded-2xl p-2 border border-[var(--color-border)]">
        <a
          href={territory.phoneHref}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[var(--color-primary)] text-white font-bold text-sm py-3 rounded-xl"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            aria-hidden="true"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z" />
          </svg>
          Call Now
        </a>
        <a
          href="#contact"
          className="flex-1 inline-flex items-center justify-center bg-[var(--color-cta)] text-white font-bold text-sm py-3 rounded-xl"
        >
          Free Assessment
        </a>
      </div>
    </div>
  );
}
