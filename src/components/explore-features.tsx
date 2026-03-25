"use client";

import type { ExploreSpotlight } from "@/lib/interface";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";

const PAIR_INTERVAL_MS = 7000;

export interface ExploreApartmentInput {
  _id: string;
  id?: string;
  name: string;
  location: string;
  gallery?: string[];
}

interface FeaturesProps {
  apartments: ExploreApartmentInput[];
  loading?: boolean;
  onLocationClick?: (location: string) => void;
  locationCounts?: Record<string, number>;
}

function FadeInUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transform-gpu will-change-transform transition-all duration-700 ease-out opacity-0 translate-y-8 ${
        inView ? "opacity-100 translate-y-0" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

function mapApartmentToSpotlight(apt: ExploreApartmentInput): ExploreSpotlight {
  const id = String(apt._id ?? apt.id ?? "");
  return {
    id,
    apartmentName: apt.name?.trim() || "Apartment",
    locationLine: apt.location?.trim() || "",
    filterLocation: (apt.location || "").toLowerCase().replace(/\s+/g, " ").trim(),
    src: apt.gallery?.[0] || "/placeholder.svg",
    alt: apt.name || "Apartment",
  };
}

/** Up to 6 listings, random order, even count for pairs (duplicate single listing if needed). */
function pickExploreSpotlights(apartments: ExploreApartmentInput[]): ExploreSpotlight[] {
  if (apartments.length === 0) return [];
  const mapped = apartments.map(mapApartmentToSpotlight);
  const shuffled = [...mapped].sort(() => Math.random() - 0.5);
  const max = Math.min(6, shuffled.length);
  let picked = shuffled.slice(0, max);
  if (picked.length % 2 === 1) picked = picked.slice(0, -1);
  if (picked.length === 0 && shuffled.length >= 1) {
    const one = shuffled[0];
    picked = [one, { ...one, id: `${one.id}-dup` }];
  }
  return picked;
}

function pairSpotlights(items: ExploreSpotlight[]): [ExploreSpotlight, ExploreSpotlight][] {
  const pairs: [ExploreSpotlight, ExploreSpotlight][] = [];
  for (let i = 0; i < items.length; i += 2) {
    const a = items[i];
    const b = items[i + 1] ?? items[0];
    pairs.push([a, b]);
  }
  return pairs;
}

function SpotlightCard({
  item,
  onBook,
}: {
  item: ExploreSpotlight;
  onBook: (item: ExploreSpotlight) => void;
}) {
  return (
    <div className="flex flex-col items-stretch w-full max-w-xl mx-auto">
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm">
        <Image
          src={item.src || "/placeholder.svg"}
          alt={item.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="lazy"
        />
        <div className="absolute bottom-4 left-4 max-w-[min(100%-2rem,20rem)] bg-black px-4 py-3 md:py-3.5">
          <h3 className="font-luxury-display text-base md:text-lg text-white leading-snug tracking-tight">
            {item.apartmentName}
          </h3>
          <p className="font-luxury-body text-xs md:text-sm text-white/75 mt-1 tracking-wide">{item.locationLine}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onBook(item)}
        className="mt-4 w-full bg-explore-accent py-3 text-center font-luxury-display text-sm tracking-wide text-white transition hover:bg-explore-accent-hover active:opacity-95"
      >
        Book now
      </button>
    </div>
  );
}

function ExploreSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 lg:gap-12 items-start animate-pulse">
      {[0, 1].map((k) => (
        <div key={k} className="w-full max-w-xl mx-auto">
          <div className="w-full aspect-[4/3] rounded-sm bg-white/10" />
          <div className="mt-4 h-12 w-full rounded-sm bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export default function Features({ apartments, loading = false }: FeaturesProps) {
  const router = useRouter();
  const spotlights = useMemo(() => pickExploreSpotlights(apartments), [apartments]);
  const pairs = useMemo(() => pairSpotlights(spotlights), [spotlights]);
  const [pairIndex, setPairIndex] = useState(0);

  useEffect(() => {
    setPairIndex(0);
  }, [spotlights]);

  useEffect(() => {
    if (pairs.length <= 1) return;
    const t = window.setInterval(() => {
      setPairIndex((i) => (i + 1) % pairs.length);
    }, PAIR_INTERVAL_MS);
    return () => window.clearInterval(t);
  }, [pairs.length]);

  const handleBook = (item: ExploreSpotlight) => {
    const baseId = item.id.replace(/-dup$/, "");
    router.push(`/apartment/${baseId}`);
  };

  return (
    <section className="bg-explore-bg py-14 md:py-20 px-4 md:px-10 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <FadeInUp>
          <p
            className="font-luxury-body text-explore-accent text-center text-xs md:text-sm tracking-[0.28em] uppercase mb-4"
          >
            Extraordinary accommodations
          </p>
          <h2 className="font-luxury-display text-center text-2xl sm:text-3xl md:text-[2rem] lg:text-4xl text-white leading-tight tracking-tight max-w-4xl mx-auto mb-12 md:mb-14">
            Explore by location — choose the apartment that best suits you
          </h2>
        </FadeInUp>

        {loading && spotlights.length === 0 ? (
          <ExploreSkeleton />
        ) : spotlights.length === 0 ? (
          <p className="font-luxury-body text-center text-white/60 text-sm md:text-base py-8">
            No apartments available yet. Check back soon.
          </p>
        ) : (
          <>
            <div className="relative min-h-[420px] md:min-h-[380px]">
              {pairs.map((pair, i) => (
                <div
                  key={`${pair[0].id}-${pair[1].id}-${i}`}
                  className={clsx(
                    "transition-opacity duration-[1100ms] ease-in-out",
                    pairIndex === i ? "relative z-[1] opacity-100" : "absolute inset-0 z-0 opacity-0 pointer-events-none",
                  )}
                  aria-hidden={pairIndex !== i}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 lg:gap-12 items-start">
                    <SpotlightCard item={pair[0]} onBook={handleBook} />
                    <SpotlightCard item={pair[1]} onBook={handleBook} />
                  </div>
                </div>
              ))}
            </div>

            {pairs.length > 1 && (
              <div className="flex justify-center gap-2 mt-10" role="tablist" aria-label="Apartment pairs">
                {pairs.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={pairIndex === i}
                    className={clsx(
                      "h-2 rounded-full transition-all duration-300",
                      pairIndex === i ? "w-8 bg-explore-accent" : "w-2 bg-explore-accent/60 hover:bg-explore-accent/80",
                    )}
                    onClick={() => setPairIndex(i)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
