// components/ApartmentList.tsx
'use client';

import { useState, useEffect } from 'react';
import { getApartments } from '@/services/api-services'; // Adjust path
import { ApartmentCard } from '@/components/apartment-card';
import { ApartmentData } from '@/lib/interface'; // Adjust path to your interface

interface Apartment {
  _id: string;
  name: string;
  location: string;
  pricePerNight: number;
  ratings?: number;
  maxGuests?: number;
  rooms?: number;
  bathrooms?: number;
  gallery?: string[];
}

export default function ApartmentList() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        const response = await getApartments();
        setApartments(response.data || []);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch apartments');
        console.error('Error fetching apartments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p>Loading apartments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (apartments.length === 0) {
    return (
      <div className="p-4 text-center">
        <p>No apartments found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {apartments.map((apt) => (
        <ApartmentCard
          key={apt._id}
          id={apt._id}
          imageUrl={apt.gallery?.[0] || '/placeholder.svg'}
          name={apt.name}
          location={apt.location}
          price={`₦${apt.pricePerNight.toLocaleString()}`}
          rating={apt.ratings || 0}
          guests={apt.maxGuests || 1}
          beds={apt.rooms || 1}
          baths={apt.bathrooms || 1}
        />
      ))}
    </div>
  );
}

