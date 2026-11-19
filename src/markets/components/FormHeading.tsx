import type { ReactElement } from "react";

export type FormHeadingTag = "h2" | "h3";

interface FormHeadingProps {
  /** h2 in the hero, where the card follows the h1; h3 under the contact section's h2. */
  as: FormHeadingTag;
  id: string;
  title: string;
  subhead?: string;
  compact: boolean;
}

export function FormHeading({ as: Heading, id, title, subhead, compact }: FormHeadingProps): ReactElement {
  return (
    <div className={compact ? "mb-3" : "mb-5 sm:mb-6"}>
      <Heading id={id} className={`${compact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"} font-extrabold text-[var(--color-primary)] leading-tight`}>
        {title}
      </Heading>
      {subhead ? <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-muted)]">{subhead}</p> : null}
    </div>
  );
}
