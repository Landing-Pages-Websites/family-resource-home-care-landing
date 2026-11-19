import type { ReactElement, ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "./Eyebrow";

interface SectionHeadingProps {
  eyebrow: ReactNode;
  id: string;
  children: ReactNode;
  /** The template's per-section desktop h2 size. */
  size?: "2.1rem" | "2.5rem" | "2.6rem";
  tone?: "light" | "dark";
}

const SIZES = { "2.1rem": "lg:text-[2.1rem]", "2.5rem": "lg:text-[2.5rem]", "2.6rem": "lg:text-[2.6rem]" } as const;
const COLORS = { light: "text-[var(--color-primary)]", dark: "text-balance" } as const;

/** Eyebrow pill above the section h2, each with the template's staggered reveal. */
export function SectionHeading({ eyebrow, id, children, size = "2.6rem", tone = "light" }: SectionHeadingProps): ReactElement {
  return (
    <>
      <Reveal variant="up">
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal variant="up" delay={80}>
        <h2 id={id} className={`mt-4 text-3xl sm:text-4xl ${SIZES[size]} font-extrabold ${COLORS[tone]} leading-tight`}>
          {children}
        </h2>
      </Reveal>
    </>
  );
}
