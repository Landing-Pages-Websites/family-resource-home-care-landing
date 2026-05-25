"use client";

import { Reveal } from "./Reveal";

// Verbatim testimonials from
// https://www.familyresourcehomecare.com/about/awards-reviews-testimonials/testimonials/
// (Captured 2026-05-25.) Selected to highlight Portland Metro presence,
// caregiver matching, and the practical day-to-day impact of in-home care —
// while excluding any topic the task spec asks us to keep off the LP
// (home health, assisted living, Medicare, dementia/Alzheimer's).
const TESTIMONIALS = [
  {
    quote:
      "I would like to leave a huge compliment for my Caregiver today, named Vanessa! She was outstanding! Showed up on time, worked very hard the whole time she was here, did all that was asked and then some! Her attitude was very professional, caring and helpful. Great listener and communicator too. Thank you for sending her on my first day of care giving services with your company. She is a perfect example that shines as an employee in every way!!",
    name: "Portland East Client",
    role: "Verified client testimonial · 2026",
    initials: "PE",
  },
  {
    quote:
      "I just wanted to let you know how grateful I am for the home care workers you have sent me. The workers have all been kind and gentle and patient with me, and now I feel comfortable and grateful for the real help they give me. I am no longer skipping meals because I'm too tired to prepare them. I can take walks with them and am going farther and feeling stronger than before. My laundry is caught up. The transition from independent living to needing assistance in my home has been made easier by their tact and professionalism. Thank you so much.",
    name: "Family Resource Client",
    role: "Verified client testimonial · 2025",
    initials: "FR",
  },
  {
    quote:
      "I would like to share a huge compliment for the amazing care our family received from Family Resource Home Care. The caregiver who supported our loved one was compassionate, dependable, and truly went above and beyond. Her kindness and professionalism made a meaningful difference during an important time for our family. Thank you to the team for providing such wonderful support and service.",
    name: "Family Member of Client",
    role: "Verified family testimonial · 2026",
    initials: "FM",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal variant="up">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              In Our Clients&rsquo; Own Words
            </span>
          </Reveal>
          <Reveal variant="up" delay={80}>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[var(--color-primary)] leading-tight">
              Real notes from real Family Resource families
            </h2>
          </Reveal>
          <Reveal variant="up" delay={140}>
            <p className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed">
              Verbatim testimonials shared with our team by clients and
              families across the Pacific Northwest. Read more at{" "}
              <a
                className="text-[var(--color-accent-dark)] underline"
                href="https://www.familyresourcehomecare.com/about/awards-reviews-testimonials/testimonials/"
                target="_blank"
                rel="noopener noreferrer"
              >
                familyresourcehomecare.com
              </a>
              .
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} variant="up" delay={i * 100}>
              <figure className="h-full bg-[var(--color-warm)] rounded-2xl p-6 sm:p-7 border border-[var(--color-border)] flex flex-col">
                <div className="flex items-center gap-1 text-[var(--color-cta)]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <svg
                      key={idx}
                      className="w-4 h-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M10 1.5l2.6 5.3 5.9.86-4.25 4.14 1 5.86L10 14.9l-5.27 2.77 1-5.86L1.5 7.66l5.9-.86L10 1.5z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 text-[14px] sm:text-[15px] text-[var(--color-text)] leading-relaxed grow">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {t.initials}
                  </span>
                  <div>
                    <div className="font-bold text-[var(--color-primary)] text-sm">
                      {t.name}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                      {t.role}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Badges row */}
        <Reveal variant="up" delay={400}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-90">
            {[
              {
                src: "/images/badge-best-of-home-care.png",
                alt: "Best of Home Care 2024 Award",
              },
              {
                src: "/images/badge-leader.png",
                alt: "Best of Home Care Leader in Experience",
              },
              {
                src: "/images/hcp-logo.png",
                alt: "Home Care Pulse Certified",
              },
            ].map((b) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={b.src}
                src={b.src}
                alt={b.alt}
                className="h-16 sm:h-20 w-auto"
                loading="lazy"
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
