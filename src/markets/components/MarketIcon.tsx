import type { ReactElement } from "react";

// The template's outline icon set (24px grid, round caps), plus `moon` for 24-hour care and
// `quote` for testimonial cards. One family, stroke drawn in currentColor.
const PATHS = {
  phone:
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z",
  arrow: "M5 12h14M13 5l7 7-7 7",
  check: "M5 13l4 4L19 7",
  pin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  plus: "M12 5v14M5 12h14",
  chevron: "M19.5 8.25l-7.5 7.5-7.5-7.5",
  shower: "M9 6a3 3 0 1 1 6 0v3M4 12h16M6 12v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-6",
  heart:
    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  utensils: "M3 2v8a3 3 0 0 0 3 3v9M9 2v6M6 2v6M16 2c-2 0-4 2-4 5s2 5 4 5v9",
  car: "M5 17h14M5 17v3M19 17v3M3 17V11l2-5h14l2 5v6M7 14h.01M17 14h.01",
  shield: "M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z M9 12l2 2 4-4",
  hospital: "M4 21V8l8-5 8 5v13M9 21v-6h6v6M12 8v4M10 10h4",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  calendar: "M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM9 16l2 2 4-4",
  match: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 11h-6M19 8l3 3-3 3",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
  team: "M17 20v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  quote: "M7 11H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v6a4 4 0 0 1-4 4M18 11h-3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v6a4 4 0 0 1-4 4",
} as const;

export type MarketIconName = keyof typeof PATHS;

interface MarketIconProps {
  name: MarketIconName;
  /** Sizing comes from the caller, e.g. "w-6 h-6". */
  className: string;
  strokeWidth?: number;
}

export function MarketIcon({ name, className, strokeWidth = 1.8 }: MarketIconProps): ReactElement {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
