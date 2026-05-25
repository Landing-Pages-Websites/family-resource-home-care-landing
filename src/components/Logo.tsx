"use client";

import Image from "next/image";

interface LogoProps {
  className?: string;
}

/**
 * Family Resource Home Care logo.
 * Sourced from familyresourcehomecare.com (logo-2x.png, ~460x114).
 * Used in the header on a white background.
 */
export function Logo({ className = "h-12" }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Family Resource Home Care — Pacific Northwest's Trusted Home Care Agency"
      width={460}
      height={114}
      className={`${className} w-auto`}
      priority
    />
  );
}
