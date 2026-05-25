"use client";

import type { Territory } from "./Brand";

interface FooterProps {
  territory: Territory;
}

export function Footer({ territory }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[var(--color-primary-dark)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
        <div>
          <div className="text-lg font-extrabold">Family Resource Home Care</div>
          <p className="mt-3 text-sm text-white/75 leading-relaxed max-w-md">
            The Pacific Northwest&rsquo;s trusted in-home care since 1996.
            Compassionate, family-owned, and proudly serving the Portland Metro
            with personal care, companion care, and veteran care.
          </p>
          <p className="mt-4 text-xs text-white/60 leading-relaxed">
            Non-medical home care · Licensed in Oregon &amp; Washington
          </p>
        </div>

        <div className="md:text-right">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
            {territory.name} Office
          </div>
          <div className="mt-3 space-y-2 text-sm text-white/85">
            <div>{territory.branchAddress}</div>
            <a
              href={territory.phoneHref}
              className="block font-semibold hover:text-[var(--color-accent)] transition"
            >
              {territory.phoneDisplay}
            </a>
            <a
              href={`mailto:${territory.branchEmail}`}
              className="block hover:text-[var(--color-accent)] transition"
            >
              {territory.branchEmail}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <div>© {year} Family Resource Home Care. All rights reserved.</div>
          <div>An equal opportunity employer.</div>
        </div>
      </div>
    </footer>
  );
}
