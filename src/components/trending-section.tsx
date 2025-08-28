import React from 'react';
import { TrendingApartmentCard } from '@/components/trending-card';
import ApartmentLoadingPage from '@/components/loading';

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

const TrendingSection: React.FC<TrendingSectionProps> = ({
  apartments,
  loading,
  error,
  onRetry
}) => {
  return (
    <section className="py-12 md:py-24 lg:py-32 px-4 md:px-16">
      <h2 className="text-2xl md:text-[36px] font-medium mb-6 md:mb-8 text-[#1e1e1e] text-left">
        Trending This Week
      </h2>
      
      {loading ? (
        <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-screen">
          <div className="flex justify-center items-center h-64">
            <ApartmentLoadingPage />
          </div>
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">
          <p>Error: {error}</p>
          <button
            onClick={onRetry}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      ) : apartments.length === 0 ? (
        <div className="p-4 text-center">
          <p>No trending apartments available.</p>
        </div>
      ) : (
        <div className="flex overflow-x-auto gap-4 no-scrollbar snap-x snap-mandatory justify-between">
          {apartments.map((apartment) => (
            <TrendingApartmentCard
              key={apartment.id}
              apartment={{
                id: apartment.id,
                imageUrl: apartment.gallery?.[0] || '/placeholder.svg',
                name: apartment.name,
                location: apartment.location,
                price: `₦${apartment.pricePerNight.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`,
                rating: apartment.ratings || 4.8,
                guests: apartment.maxGuests || 1,
                beds: apartment.rooms || 1,
                baths: apartment.bathrooms || 1,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TrendingSection;