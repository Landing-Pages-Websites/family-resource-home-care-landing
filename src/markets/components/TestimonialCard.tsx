import type { ReactElement } from "react";
import type { Testimonial } from "../content";
import { MarketIcon } from "./MarketIcon";

interface Props {
  note: Testimonial;
}

/** One note in the client's own words, credited to its real region and year. */
export function TestimonialCard({ note }: Props): ReactElement {
  return (
    <figure className="bg-[var(--color-warm)] rounded-2xl p-6 sm:p-7 border border-[var(--color-border)] flex flex-col">
      <MarketIcon name="quote" className="w-7 h-7 text-[var(--color-cta-dark)]" strokeWidth={2} />
      <blockquote className="mt-4 text-[15px] text-[var(--color-text)] leading-relaxed">
        &ldquo;{note.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span aria-hidden className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm shrink-0">
          {note.initials}
        </span>
        <span>
          <span className="block font-bold text-[var(--color-primary)] text-sm">{note.name}</span>
          <span className="block text-sm text-[var(--color-text-muted)]">{note.year}</span>
        </span>
      </figcaption>
    </figure>
  );
}
