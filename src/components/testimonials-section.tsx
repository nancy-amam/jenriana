"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { usePublishedGeneralFeedback } from "@/hooks/use-published-general-feedback";

const AUTO_SLIDE_MS = 6000;
const SIDE_IMAGE = "/images/location/testimonials-side.png";

function ratingStars(rating: number) {
  const n = Math.min(5, Math.max(1, rating));
  return n;
}

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const feedbackQuery = usePublishedGeneralFeedback();
  const feedback = feedbackQuery.data ?? [];
  const loading = feedbackQuery.isFetching && feedback.length === 0;

  useEffect(() => {
    if (feedback.length === 0) return;
    setCurrentIndex((i) => Math.min(i, feedback.length - 1));
  }, [feedback.length]);

  useEffect(() => {
    if (feedback.length <= 1) return;
    const id = window.setInterval(() => {
      setCurrentIndex((i) => (i + 1) % feedback.length);
    }, AUTO_SLIDE_MS);
    return () => window.clearInterval(id);
  }, [feedback.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + feedback.length) % feedback.length);
  }, [feedback.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % feedback.length);
  }, [feedback.length]);

  const current = feedback[currentIndex];
  const stars = current
    ? ratingStars(current.customerService === "Excellent" ? 5 : 4)
    : 5;

  return (
    <section className="relative w-full overflow-hidden bg-explore-bg">
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 15% 20%, rgba(166, 145, 117, 0.4) 0%, transparent 42%),
              radial-gradient(circle at 85% 80%, rgba(166, 145, 117, 0.15) 0%, transparent 38%)`,
          }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-4 pt-10 pb-4 text-center md:px-10 md:pt-14 lg:px-16">
          <p className="font-luxury-body text-[10px] uppercase tracking-[0.28em] text-explore-accent md:text-xs">
            Guest experiences
          </p>
          <h2 className="font-luxury-display mt-2 text-xl font-normal tracking-tight text-white md:text-2xl lg:text-3xl">
            What our guests say
          </h2>
          <div
            className="mx-auto mt-3 h-px max-w-[12rem] rounded-full bg-gradient-to-r from-transparent via-explore-accent to-transparent opacity-90 md:mt-4"
            aria-hidden
          />
          <p className="font-luxury-body mx-auto mt-4 max-w-lg text-[11px] leading-relaxed text-luxury-muted md:text-sm">
            Real feedback from stays across our curated homes.
          </p>
        </div>

        <div className="grid min-h-[280px] grid-cols-1 lg:grid-cols-2 lg:min-h-[340px]">
          {/* Side image */}
          <div className="relative min-h-[200px] w-full lg:min-h-0">
            <Image
              src={SIDE_IMAGE}
              alt="Upscale apartment bedroom interior"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={false}
            />
            <div
              className="absolute inset-0 z-10 bg-black/50 pointer-events-none"
              aria-hidden
            />
          </div>

          {/* Review panel — explore accent tint, no red */}
          <div
            className="relative flex min-h-[260px] flex-col justify-center border-l border-explore-accent/25 bg-gradient-to-b from-explore-accent/[0.18] via-explore-bg to-explore-bg px-6 py-8 md:px-10 md:py-10 lg:min-h-0 lg:px-12 lg:py-11"
          >
            {loading ? (
              <div className="mx-auto w-full max-w-lg space-y-6 animate-pulse">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-5 w-5 rounded-sm bg-white/20" />
                  ))}
                </div>
                <div className="h-24 rounded-md bg-white/10" />
                <div className="h-4 w-32 rounded bg-white/15" />
              </div>
            ) : feedback.length === 0 ? (
              <div className="mx-auto max-w-lg text-center">
                <p className="font-luxury-body text-sm text-white/80 md:text-base">
                  No reviews published yet. Check back soon.
                </p>
              </div>
            ) : (
              <>
                <div
                  key={current?._id ?? currentIndex}
                  className="mx-auto w-full max-w-lg transition-opacity duration-300"
                >
                  <div className="mb-5 flex justify-start gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 md:h-6 md:w-6 ${
                          i < stars
                            ? "fill-explore-accent text-explore-accent"
                            : "fill-white/15 text-white/15"
                        }`}
                        aria-hidden
                      />
                    ))}
                  </div>

                  <blockquote className="font-luxury-display text-left text-base leading-relaxed text-white md:text-lg lg:text-[1.2rem] lg:leading-[1.55]">
                    <span className="text-white/90">&ldquo;</span>
                    {current?.enjoyedMost?.trim() || "Great stay — thank you for hosting us."}
                    <span className="text-white/90">&rdquo;</span>
                  </blockquote>

                  <div className="mt-6 text-left md:mt-7">
                    <cite className="font-luxury-display not-italic text-base text-white md:text-lg">
                      {current?.name ?? "Guest"}
                    </cite>
                    <p className="font-luxury-body mt-2 text-[10px] uppercase tracking-[0.2em] text-white/55 md:text-[11px]">
                      Guest review
                    </p>
                  </div>
                </div>

                {feedback.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      aria-label="Previous review"
                      className="absolute left-1.5 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-explore-accent/35 text-white/90 transition hover:bg-explore-accent/15 md:left-3"
                    >
                      <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      aria-label="Next review"
                      className="absolute right-1.5 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-explore-accent/35 text-white/90 transition hover:bg-explore-accent/15 md:right-3"
                    >
                      <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                    </button>

                    <div className="mt-7 flex justify-center gap-2 md:mt-8">
                      {feedback.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCurrentIndex(i)}
                          aria-label={`Go to review ${i + 1}`}
                          aria-current={i === currentIndex}
                          className={`h-2 w-2 rounded-full transition-colors md:h-2.5 md:w-2.5 ${
                            i === currentIndex
                              ? "bg-explore-accent"
                              : "bg-explore-accent/35 hover:bg-explore-accent/60"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
