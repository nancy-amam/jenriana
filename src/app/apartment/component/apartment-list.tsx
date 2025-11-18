"use client";

import Link from "next/link";
import { ApartmentCard } from "@/components/apartment-card";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { ApartmentGridCard } from "@/components/apartment-grid-card";

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

export default function ApartmentList({ apartments, loading, error }: ApartmentListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-lg overflow-hidden bg-white border border-gray-100">
            <div className="animate-pulse">
              <div className="h-[150px] w-full bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
                <div className="flex items-center justify-between pt-2">
                  <div className="h-5 w-24 bg-gray-200 rounded" />
                  <div className="h-4 w-12 bg-gray-200 rounded" />
                </div>
                <div className="flex gap-3 pt-1">
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center bg-red-50 border border-red-100 text-red-700 rounded-xl p-6 gap-3">
        <AlertTriangle className="h-6 w-6" />
        <p className="text-sm">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition"
          type="button"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  if (apartments.length === 0) {
    return <div className="p-4 text-center text-gray-600">No apartments found.</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      {apartments.map((apt) => (
        <Link key={apt._id} href={`/apartment/${apt._id}`} className="block">
          <ApartmentGridCard
            imageUrl={apt.gallery?.[0]}
            name={apt.name}
            location={apt.location}
            priceLabel={`₦${apt.pricePerNight.toLocaleString()}`}
            nights={2}
            rating={apt.ratings || 4.9}
            isGuestFavorite
          />
        </Link>
      ))}
    </div>
  );
}
