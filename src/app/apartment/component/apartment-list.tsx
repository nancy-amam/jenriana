"use client";

import Link from "next/link";
import { FeaturedApartmentCard } from "./apartsment-card";

interface Apartment {
  _id: string;
  name: string;
  location: string;
  pricePerNight: number;
  ratings?: number;
  reviews?: number;
  maxGuests?: number;
  rooms?: number;
  bathrooms?: number;
  gallery?: string[];
}

interface ApartmentListProps {
  apartments: Apartment[];
  loading: boolean;
  error: string | null;
}

export default function ApartmentList({
  apartments,
  loading,
  error,
}: ApartmentListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="w-full max-w-[313px] h-[385px] bg-gray-200 animate-pulse rounded-lg mx-auto"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (apartments.length === 0) {
    return <div className="p-4 text-center">No apartments found.</div>;
  }

  return (
    <>
      {apartments.map((apt) => (
        <Link key={apt._id} href={`/apartment/${apt._id}`} className="block">
          <FeaturedApartmentCard
            id={apt._id}
            imageUrl={apt.gallery?.[0] || "/placeholder.svg"}
            name={apt.name}
            location={apt.location}
            price={`₦${apt.pricePerNight.toLocaleString()}`}
            rating={apt.ratings || 0}
            reviews={apt.reviews || 0}
            guests={apt.maxGuests || 1}
            beds={apt.rooms || 1}
            baths={apt.bathrooms || 1}
            isGuestFavourite={Math.random() > 0.7} // 👈 random for demo
            className="mx-auto"
          />
        </Link>
      ))}
    </>
  );
}
