import type { ReactElement, ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  /** "light" on white/soft surfaces, "dark" on navy. */
  tone?: "light" | "dark";
}

const TONES = {
  light: "py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
  dark: "py-1.5 bg-[var(--color-accent)]/20 text-[var(--color-accent)] border border-[var(--color-accent)]/40",
} as const;

/** The template's section pill, at a readable 14px. */
export function Eyebrow({ children, tone = "light" }: EyebrowProps): ReactElement {
  return <span className={`inline-block px-3 rounded-full text-sm font-bold tracking-wide ${TONES[tone]}`}>{children}</span>;
}
