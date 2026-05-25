"use client";

import Image from "next/image";
import { Reveal } from "./Reveal";
import type { Territory } from "./Brand";

interface VideoStoryProps {
  territory: Territory;
}

export function VideoStory({ territory }: VideoStoryProps) {
  return (
    <section id="our-story" className="py-16 sm:py-20 lg:py-24 bg-[var(--color-soft)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-7">
          <Reveal variant="up">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[var(--color-accent)]/15 text-[var(--color-accent-dark)]">
              See Our Story
            </span>
          </Reveal>
          <Reveal variant="up" delay={80}>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[var(--color-primary)] leading-tight">
              A year of care, growth &amp; impact.
            </h2>
          </Reveal>
          <Reveal variant="up" delay={140}>
            <div className="mt-6 relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-[var(--color-border)] bg-black">
              <iframe
                src="https://www.youtube-nocookie.com/embed/JCQiaW_uyow?rel=0&modestbranding=1"
                title="Family Resource Home Care — 2025 Year in Review"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-5 space-y-5">
          <Reveal variant="right" delay={120}>
            <div className="relative bg-white rounded-2xl p-6 sm:p-7 border border-[var(--color-border)] shadow-lg">
              <p className="text-[16px] sm:text-[17px] text-[var(--color-text)] leading-relaxed">
                Family Resource Home Care has spent nearly three decades caring
                for Pacific Northwest families. Today our caregivers, schedulers,
                and care coordinators are spread across Oregon, Washington,
                Idaho, Colorado, and New Mexico &mdash; with deep local roots in{" "}
                <span className="font-semibold text-[var(--color-primary)]">
                  {territory.name}
                </span>
                .
              </p>
              <p className="mt-3 text-[15px] text-[var(--color-text-muted)] leading-relaxed">
                Watch the short video to meet the people behind our care, hear
                from clients, and see what a year of in-home care across the
                Pacific Northwest looks like.
              </p>
            </div>
          </Reveal>

          <Reveal variant="right" delay={220}>
            <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/family-home.jpg"
                alt="A Family Resource Home Care caregiver and senior client laughing together"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/55 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-[11px] uppercase tracking-wider font-bold opacity-90">
                  Real care, real families
                </div>
                <div className="mt-1 text-base sm:text-lg font-extrabold leading-snug">
                  Hand-matched caregivers across the Portland Metro.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
