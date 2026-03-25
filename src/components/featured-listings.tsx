"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HiArrowNarrowRight } from "react-icons/hi";

const PER_SLIDE = 3;

interface Apartment {
  _id: string;
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  ratings?: number;
  maxGuests?: number;
  rooms?: number;
  bathrooms?: number;
  gallery?: string[];
  isTrending: boolean;
  features?: string[];
}

interface FeaturedListingsProps {
  apartments: Apartment[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

function chunkApartments<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

function viewFromLocation(loc: string): string {
  const l = loc.toLowerCase();
  if (l.includes("hill") || l.includes("mountain")) return "Mountain View";
  if (l.includes("water") || l.includes("island") || l.includes("lagoon")) return "Waterfront View";
  return "City View";
}

function estimateSqm(rooms: number, id: string): string {
  const r = rooms || 1;
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const base = 32 + r * 22 + (h % 28);
  return `${base.toFixed(1)} sq. M`;
}

function buildDescription(apt: Apartment): string {
  if (apt.features?.length) {
    const snippet = apt.features.slice(0, 3).join(", ");
    return `${snippet}. A refined stay tailored for comfort and convenience.`;
  }
  return `Located in ${apt.location}. A welcoming space for business or leisure.`;
}

function FeaturedPulseSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6 lg:gap-8 md:items-stretch">
        {[0, 1, 2].map((k) => (
          <div key={k} className="flex h-full flex-col px-1 sm:px-2">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-white/10" />
            <div className="mx-auto mt-4 h-6 w-3/4 rounded-sm bg-white/10" />
            <div className="mx-auto mt-3 h-4 w-1/2 rounded-sm bg-white/10" />
            <div className="mx-auto mt-4 h-16 w-full max-w-sm rounded-sm bg-white/10" />
            <div className="mx-auto mt-5 h-4 w-24 rounded-sm bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedListingCard({ apartment }: { apartment: Apartment }) {
  const priceLabel = `₦${apartment.pricePerNight.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  const stats = `${estimateSqm(apartment.rooms ?? 1, apartment.id)} / ${apartment.location} / ${apartment.maxGuests ?? 1} Guests`;
  const imageUrl = apartment.gallery?.[0] || "/placeholder.svg";

  return (
    <article className="flex h-full flex-col px-1 sm:px-2">
      <Link href={`/apartment/${apartment.id}`} className="group block">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-black/40">
          <Image
            src={imageUrl}
            alt={apartment.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 22rem"
          />
          <div className="absolute left-2 top-2 bg-white px-2 py-1.5 text-[10px] font-medium uppercase tracking-wide text-black sm:left-3 sm:top-3 sm:px-3 sm:text-[11px] md:text-xs">
            {priceLabel} / NIGHT
          </div>
        </div>
      </Link>

      <h3 className="font-luxury-display mt-4 text-center text-base leading-snug text-white sm:mt-5 md:text-lg lg:text-xl">
        {apartment.name}
      </h3>

      <p className="font-luxury-body mt-2 text-center text-xs text-explore-accent sm:text-sm">{stats}</p>

      <p className="font-luxury-body mt-3 flex-1 text-center text-xs leading-relaxed text-luxury-muted line-clamp-4 sm:text-[13px] md:text-sm">
        {buildDescription(apartment)}
      </p>

      <div className="mt-4 flex justify-center sm:mt-5">
        <Link
          href={`/apartment/${apartment.id}`}
          className="font-luxury-body inline-flex items-center gap-1 border-b border-explore-accent pb-0.5 text-xs font-medium text-explore-accent transition-colors hover:border-explore-accent-hover hover:text-explore-accent-hover sm:text-sm"
        >
          Book Now
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Link>
      </div>
    </article>
  );
}

const FeaturedListings: React.FC<FeaturedListingsProps> = ({ apartments, loading, error, onRetry }) => {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(0);

  const slides = useMemo(() => chunkApartments(apartments, PER_SLIDE), [apartments]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? i : i - 1));
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => (i >= slides.length - 1 ? i : i + 1));
  }, [slides.length]);

  useEffect(() => {
    setIndex((i) => {
      if (slides.length === 0) return 0;
      return Math.min(i, slides.length - 1);
    });
  }, [slides.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) < 48) return;
    if (dx > 0) goPrev();
    else goNext();
  };

  return (
    <section className="relative bg-explore-bg px-4 py-14 md:px-10 md:py-20 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-luxury-display text-2xl text-white md:text-3xl">Featured Listings</h2>
          <Link
            href="/apartment"
            className="font-luxury-body inline-flex items-center gap-1 text-sm text-explore-accent transition-colors hover:text-explore-accent-hover"
          >
            View more
            <HiArrowNarrowRight className="h-6 w-6" />
          </Link>
        </div>

        {loading && apartments.length === 0 ? (
          <div className="min-h-[28rem] py-12">
            <FeaturedPulseSkeleton />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-6 py-8 text-center text-red-200">
            <p>Error: {error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-500"
            >
              Retry
            </button>
          </div>
        ) : apartments.length === 0 ? (
          <div className="py-16 text-center text-luxury-muted">
            <p>No featured apartments available.</p>
          </div>
        ) : (
          <div className="relative px-10 sm:px-12 md:px-14">
            <div className="overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
              >
                {slides.map((group, slideIdx) => (
                  <div key={slideIdx} className="w-full min-w-full shrink-0">
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6 lg:gap-8 md:items-stretch">
                      {group.map((apartment) => (
                        <FeaturedListingCard key={apartment.id} apartment={apartment} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={goPrev}
              disabled={index === 0}
              aria-label="Previous listings"
              className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-explore-accent shadow-lg backdrop-blur-sm transition hover:border-explore-accent/30 hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={index === slides.length - 1}
              aria-label="Next listings"
              className="absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-explore-accent shadow-lg backdrop-blur-sm transition hover:border-explore-accent/30 hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {slides.length > 1 && (
              <div className="mt-10 flex justify-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === index ? "w-8 bg-explore-accent" : "w-2 bg-explore-accent/50 hover:bg-explore-accent/70"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedListings;
