import React from 'react';
import { ApartmentCard } from '@/components/apartment-card';
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

interface FeaturedListingsProps {
  apartments: Apartment[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const FeaturedListings: React.FC<FeaturedListingsProps> = ({
  apartments,
  loading,
  error,
  onRetry
}) => {
  return (
    <section className="py-12 md:py-24 lg:py-32 px-4 md:px-16">
      <h2 className="text-2xl md:text-[36px] font-medium mb-6 md:mb-8 text-[#1e1e1e] text-left">
        Featured Listings
      </h2>
      
      {loading ? (
        <div className="p-4 sm:p-6 min-h-screen">
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
          <p>No featured apartments available.</p>
        </div>
      ) : (
        <div className="flex overflow-x-auto overflow-hidden pb-4 space-x-4 no-scrollbar snap-x snap-mandatory">
          {apartments.map((apartment) => (
            <ApartmentCard
              key={apartment.id}
              id={apartment.id}
              imageUrl={apartment.gallery?.[0] || '/placeholder.svg'}
              name={apartment.name}
              location={apartment.location}
              price={`₦${apartment.pricePerNight.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`}
              rating={apartment.ratings || 4.8}
              guests={apartment.maxGuests || 1}
              beds={apartment.rooms || 1}
              baths={apartment.bathrooms || 1}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedListings;