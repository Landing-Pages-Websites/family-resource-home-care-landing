import type { ReactElement, ReactNode } from "react";

interface FormCardProps {
  /** In-page anchor the CTAs link to; kept on the card so it survives the success swap. */
  anchorId: string;
  placement: "hero" | "contact";
  children: ReactNode;
}

export function FormCard({ anchorId, placement, children }: FormCardProps): ReactElement {
  const shadow = placement === "hero" ? "shadow-2xl" : "shadow-lg";
  const pad = placement === "hero" ? "p-4 sm:p-8" : "p-6 sm:p-8";
  return (
    <div
      id={anchorId}
      className={`relative scroll-mt-24 rounded-2xl bg-white border border-[var(--color-border)] text-[var(--color-text)] ${shadow} ${pad}`}
    >
      {children}
    </div>
  );
}
