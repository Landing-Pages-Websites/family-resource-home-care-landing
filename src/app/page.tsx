"use client";

import Link from "next/link";
import Image from "next/image";
import { TERRITORIES, TERRITORY_ORDER } from "@/components/Brand";

export default function FRHCIndexPage() {
  return (
    <main className="min-h-screen bg-[var(--color-soft)] flex flex-col">
      <section className="bg-[var(--color-primary)] text-white py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <Image
            src="/logo.png"
            alt="Family Resource Home Care"
            width={460}
            height={114}
            className="h-14 sm:h-16 w-auto mx-auto bg-white rounded-lg px-4 py-2"
            priority
          />
          <h1 className="mt-7 text-3xl sm:text-4xl font-extrabold leading-tight">
            Choose Your Portland Metro Office
          </h1>
          <p className="mt-4 text-white/85 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Select the office that serves your area to learn about in-home care
            services and request your free assessment.
          </p>
        </div>
      </section>

      <section className="flex-1 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {TERRITORY_ORDER.map((id) => {
            const t = TERRITORIES[id];
            return (
              <Link
                key={id}
                href={`/${id}`}
                className="bg-white rounded-2xl p-6 border border-[var(--color-border)] shadow-sm hover:shadow-md hover:border-[var(--color-accent)] transition group"
              >
                <div className="text-xs uppercase tracking-wider font-bold text-[var(--color-accent-dark)]">
                  Portland Metro
                </div>
                <h2 className="mt-2 text-xl font-extrabold text-[var(--color-primary)]">
                  {t.name}
                </h2>
                <p className="mt-2 text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {t.region}
                </p>
                <div className="mt-4 text-sm font-bold text-[var(--color-primary)] group-hover:text-[var(--color-accent-dark)] transition">
                  {t.phoneDisplay} →
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
