"use client";

import { Apartment } from "@/lib/interface";
import ApartmentHero from "../[id]/apartment-hero";
import BookingCard from "../[id]/booking-card";
import GalleryGrid from "../[id]/gallery-grid";
import LocationBlock from "../[id]/location-block";
import OffersGrid from "../[id]/offer-grid";
import StatBadges from "../[id]/stats-badge";

export default function ApartmentDetails({ apartment }: { apartment: Apartment }) {
  return (
    <div className="relative w-full min-h-screen">
      <ApartmentHero
        name={apartment.name}
        location={apartment.location}
        imageUrl={apartment.imageUrl}
        pricePerNight={apartment.pricePerNight}
        averageRating={(apartment as any).averageRating ?? null}
      />

      <div className="relative -mt-24 md:-mt-40 px-4 md:px-10">
        <div className="mx-auto w-full md:max-w-[480px] md:ml-auto">
          <BookingCard
            apartmentId={apartment.id}
            maxGuests={apartment.maxGuests}
            pricePerNight={apartment.pricePerNight}
            imageUrl={apartment.imageUrl}
          />
        </div>
      </div>
      <br />
      <StatBadges
        maxGuests={apartment.maxGuests}
        beds={(apartment as any).beds ?? apartment.rooms}
        baths={(apartment as any).baths ?? apartment.bathrooms}
        location={apartment.location}
      />

      <GalleryGrid name={apartment.name} gallery={apartment.gallery} />

      <OffersGrid features={(apartment as any).features || []} />

      <LocationBlock
        address={(apartment as any).address || apartment.location}
        rules={(apartment as any).rules || []}
      />
    </div>
  );
}
