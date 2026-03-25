"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";

const SLIDE_MS = 8000;

/** Moody interiors — same carousel pattern as homepage, tuned for dark UI */
const APARTMENTS_HERO_SLIDES = [
  "/images/hero-sliders/hero-01.png",
  "/images/hero-sliders/hero-02.png",
  "/images/hero-sliders/hero-03.png",
] as const;

function shuffleSlides<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const ApartmentsHero = () => {
  const slides = useMemo(() => shuffleSlides(APARTMENTS_HERO_SLIDES), []);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_MS);
    return () => window.clearInterval(t);
  }, [slides.length]);

  return (
    <section className="relative w-full min-h-[min(90vh,920px)] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {slides.map((src, i) => (
          <div
            key={src}
            className={clsx(
              "absolute inset-0 transition-opacity duration-[1100ms] ease-in-out",
              i === index ? "z-[1] opacity-100" : "z-0 opacity-0 pointer-events-none",
            )}
          >
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={src}
                alt="Apartment interior"
                fill
                priority={i === 0}
                sizes="100vw"
                className={clsx(
                  "object-cover brightness-[0.42] saturate-[0.85] contrast-[1.08]",
                  i === index && "hero-kenburns",
                )}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Deep charcoal + navy vignette for dark-mode legibility */}
      <div className="absolute inset-0 z-[2] bg-black/50" aria-hidden />
      <div className="absolute inset-0 z-[2] opacity-90" aria-hidden />
      <div className="relative z-[3] flex flex-col items-center justify-center text-center px-4 pt-28 pb-24 sm:pt-32 w-full max-w-5xl mx-auto">
        <span className="font-luxury-body text-xs md:text-sm tracking-[0.22em] uppercase text-[#a69175] mb-5 px-4 py-1.5 border border-[#a69175]/40 rounded-full bg-black/35 backdrop-blur-sm">
          Apartments
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl leading-[1.12] tracking-tight">
          Find a stay that feels like home
        </h1>
        <p className="font-luxury-body mt-6 text-base md:text-lg text-zinc-300 max-w-xl font-normal leading-relaxed">
          Browse curated spaces with the warmth of home and the polish of a boutique stay.
        </p>
      </div>
    </section>
  );
};

export default ApartmentsHero;
