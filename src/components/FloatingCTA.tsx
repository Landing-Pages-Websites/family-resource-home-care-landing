"use client";

import { useEffect, useState } from "react";

export function FloatingCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 600;
      // Hide once the user reaches the contact form — they're already there.
      const contact = document.getElementById("contact");
      let nearContact = false;
      if (contact) {
        const rect = contact.getBoundingClientRect();
        // Considered "near contact" when the top of the section is within
        // the viewport (or already scrolled past).
        nearContact = rect.top < window.innerHeight * 0.85;
      }
      setShow(scrolled && !nearContact);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      {/* Mobile: full-width bottom bar — single Free Assessment CTA → form */}
      <div
        className={`fixed bottom-3 inset-x-3 z-40 sm:hidden transition-all ${
          show
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}
        aria-hidden={!show}
      >
        <a
          href="#contact"
          className="flex items-center justify-center w-full bg-[var(--color-cta)] hover:bg-[var(--color-cta-dark)] text-white font-extrabold text-base py-3.5 rounded-2xl shadow-2xl"
        >
          Request Free In-Home Assessment
        </a>
      </div>

      {/* Desktop: bottom-right pill — single Free Assessment CTA → form */}
      <div
        className={`hidden sm:block fixed bottom-6 right-6 z-40 transition-all ${
          show
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}
        aria-hidden={!show}
      >
        <a
          href="#contact"
          className="inline-flex items-center gap-2 bg-[var(--color-cta)] hover:bg-[var(--color-cta-dark)] text-white font-extrabold text-sm py-3.5 px-5 rounded-full shadow-2xl"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            aria-hidden="true"
          >
            <path
              d="M5 12h14M13 5l7 7-7 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Request Free Assessment
        </a>
      </div>
    </>
  );
}
