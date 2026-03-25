import React, { useCallback, useEffect, useRef, useState } from "react";
import { TrendingApartmentCard } from "@/components/trending-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
}

interface TrendingSectionProps {
  apartments: Apartment[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

function TrendingPulseSkeleton() {
  return (
    <div className="flex animate-pulse gap-5 overflow-hidden pb-2 md:gap-6 px-1 sm:px-10 md:px-12">
      {[0, 1, 2, 3].map((k) => (
        <div key={k} className="min-w-[min(100%,280px)] flex-shrink-0 snap-start">
          <div className="aspect-[4/3] w-full max-w-[280px] rounded-lg bg-white/10" />
          <div className="mt-4 h-5 w-4/5 rounded-sm bg-white/10" />
          <div className="mt-2 h-4 w-3/5 rounded-sm bg-white/10" />
        </div>
      ))}
    </div>
  );
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ apartments, loading, error, onRetry }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateIndexFromScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el || apartments.length === 0) return;
    const first = el.children[0] as HTMLElement | undefined;
    if (!first) return;
    const cardWidth = first.offsetWidth;
    const style = window.getComputedStyle(el);
    const gap = parseFloat(style.columnGap || style.gap || "0") || 20;
    const step = cardWidth + gap;
    const idx = Math.round(el.scrollLeft / step);
    setCurrentIndex(Math.min(Math.max(0, idx), apartments.length - 1));
  }, [apartments.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateIndexFromScroll, { passive: true });
    return () => el.removeEventListener("scroll", updateIndexFromScroll);
  }, [updateIndexFromScroll]);

  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      const card = containerRef.current.children[index] as HTMLElement;
      if (card) {
        containerRef.current.scrollTo({
          left: card.offsetLeft,
          behavior: "smooth",
        });
      }
    }
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    if (currentIndex > 0) scrollToIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < apartments.length - 1) scrollToIndex(currentIndex + 1);
  };

  return (
    <section className="relative w-full overflow-hidden bg-explore-bg px-4 py-14 text-white md:px-10 md:py-20 lg:px-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(166, 145, 117, 0.35) 0%, transparent 45%),
            radial-gradient(circle at 80% 70%, rgba(166, 145, 117, 0.18) 0%, transparent 40%)`,
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-7 md:mb-10">
          <p className="font-luxury-body text-[10px] uppercase tracking-[0.28em] text-explore-accent md:text-xs">
            Handpicked
          </p>
          <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-luxury-display text-xl font-normal tracking-tight text-white md:text-2xl lg:text-3xl">
                Trending This Week
              </h2>
              <div className="mt-2 h-px w-12 bg-gradient-to-r from-explore-accent to-explore-accent/0 md:mt-2.5 md:w-14" />
            </div>
            <p className="max-w-md text-[11px] leading-relaxed text-luxury-muted md:text-sm">
              Residences guests are booking now — swipe or use the arrows to explore.
            </p>
          </div>
        </div>

        {loading && apartments.length === 0 ? (
          <div className="min-h-[240px] rounded-2xl border border-white/5 bg-white/[0.02] p-4 md:p-6">
            <TrendingPulseSkeleton />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-6 text-center md:rounded-2xl md:p-8">
            <p className="text-xs text-red-300/90 md:text-sm">Error: {error}</p>
            <button
              onClick={onRetry}
              className="mt-4 rounded-full border border-explore-accent/50 bg-explore-accent/10 px-4 py-2 text-xs text-explore-accent transition hover:bg-explore-accent/20 md:px-6 md:py-2.5 md:text-sm"
            >
              Retry
            </button>
          </div>
        ) : apartments.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center text-xs text-luxury-muted md:p-10 md:text-sm">
            <p>No trending apartments available.</p>
          </div>
        ) : (
          <div className="relative">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-5 bg-gradient-to-r from-explore-bg to-transparent md:w-14 lg:w-20"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-5 bg-gradient-to-l from-explore-bg to-transparent md:w-14 lg:w-20"
              aria-hidden
            />

            <div
              ref={containerRef}
              className="no-scrollbar relative flex gap-5 overflow-x-auto overflow-y-hidden pb-2 pt-1 snap-x snap-mandatory scroll-smooth px-1 sm:px-10 md:gap-6 md:px-12"
            >
              {apartments.map((apartment) => (
                <div key={apartment.id} className="snap-start flex-shrink-0">
                  <TrendingApartmentCard
                    apartment={{
                      id: apartment.id,
                      imageUrl: apartment.gallery?.[0] || "/placeholder.svg",
                      name: apartment.name,
                      location: apartment.location,
                      price: `₦${apartment.pricePerNight.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`,
                      rating: apartment.ratings || 4.8,
                      guests: apartment.maxGuests || 1,
                      beds: apartment.rooms || 1,
                      baths: apartment.bathrooms || 1,
                    }}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous listing"
              className="absolute left-1 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-explore-accent shadow-lg backdrop-blur-sm transition hover:border-explore-accent/30 hover:bg-black/70 disabled:pointer-events-none disabled:opacity-30 md:left-0 md:h-11 md:w-11"
            >
              <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === apartments.length - 1}
              aria-label="Next listing"
              className="absolute right-1 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-explore-accent shadow-lg backdrop-blur-sm transition hover:border-explore-accent/30 hover:bg-black/70 disabled:pointer-events-none disabled:opacity-30 md:right-0 md:h-11 md:w-11"
            >
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.75} />
            </button>

            {apartments.length > 1 && (
              <div className="mt-7 flex justify-center gap-2 md:mt-10">
                {apartments.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => scrollToIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 md:h-2 ${
                      i === currentIndex
                        ? "w-7 bg-explore-accent md:w-8"
                        : "w-1.5 bg-explore-accent/50 hover:bg-explore-accent/70"
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

export default TrendingSection;
