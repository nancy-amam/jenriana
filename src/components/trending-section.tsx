import React, { useRef, useState } from "react";
import { TrendingApartmentCard } from "@/components/trending-card";
import ApartmentLoadingPage from "@/components/loading";
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

const TrendingSection: React.FC<TrendingSectionProps> = ({ apartments, loading, error, onRetry }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <section className="px-4 md:px-16 mt-3 relative">
      <h2 className="lg:text-xl font-bold mb-6 md:mb-5 text-[#1e1e1e] text-left text-lg">Trending This Week</h2>

      {loading ? (
        <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-screen">
          <div className="flex justify-center items-center h-64">
            <ApartmentLoadingPage />
          </div>
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">
          <p>Error: {error}</p>
          <button onClick={onRetry} className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg">
            Retry
          </button>
        </div>
      ) : apartments.length === 0 ? (
        <div className="p-4 text-center">
          <p>No trending apartments available.</p>
        </div>
      ) : (
        <div className="relative">
          {/* scrollable container */}
          <div
            ref={containerRef}
            className="flex overflow-x-hidden pb-4 space-x-4 snap-x snap-mandatory overflow-hidden"
          >
            {apartments.map((apartment) => (
              <div key={apartment.id} className="flex-shrink-0 snap-start">
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

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 disabled:opacity-40"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === apartments.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 disabled:opacity-40"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </section>
  );
};

export default TrendingSection;
