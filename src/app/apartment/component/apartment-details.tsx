"use client";

import { useMemo, useState, type ComponentType } from "react";
import { useQuery } from "@tanstack/react-query";
import type { DateRange } from "react-day-picker";
import { AirVent, Bath, Bed, Square, Users, Wifi } from "lucide-react";
import { Apartment } from "@/lib/interface";
import ApartmentHero from "../[id]/apartment-hero";
import BookingCard from "../[id]/booking-card";
import GalleryGrid from "../[id]/gallery-grid";
import LocationBlock from "../[id]/location-block";
import AvailabilityCalendar from "../[id]/availability-calendar";
import { featureMapping } from "../[id]/offer-grid";
import { getApartmentBookedDates } from "@/services/api-services";
import { ScrollReveal } from "@/components/scroll-reveal";

function buildIncludedLines(apt: Apartment): string[] {
  const beds = apt.beds ?? apt.rooms ?? 1;
  const baths = apt.baths ?? apt.bathrooms ?? 1;
  const lines: string[] = [
    `${beds} well-appointed bedroom${beds !== 1 ? "s" : ""}`,
    "Large living and dining area",
    `Private bathroom${baths !== 1 ? "s" : ""}`,
    "Premium comfort and space",
  ];
  const feats = apt.features ?? [];
  if (feats.some((f) => /kitchen|microwave|fridge/i.test(f))) {
    lines.splice(2, 0, "Fridge and microwave");
  }
  if (feats.some((f) => /coffee|tea/i.test(f))) {
    lines.push("Tea & coffee making facilities");
  }
  return [...new Set(lines)];
}

export default function ApartmentDetails({ apartment }: { apartment: Apartment }) {
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);
  const [roomCount, setRoomCount] = useState(1);

  const bookedDatesQuery = useQuery({
    queryKey: ["apartment", apartment.id, "booked-dates"] as const,
    queryFn: () => getApartmentBookedDates(apartment.id),
    enabled: Boolean(apartment.id?.trim()),
    staleTime: 60 * 1000,
  });

  const bookedDateStrings = bookedDatesQuery.data ?? [];
  const loadingBookedDates = bookedDatesQuery.isPending && bookedDateStrings.length === 0;
  const bookedDatesForCalendar = bookedDateStrings.map((d) => new Date(d));

  const range: DateRange | undefined = useMemo(() => {
    if (!checkIn) return undefined;
    return { from: checkIn, to: checkOut };
  }, [checkIn, checkOut]);

  const handleRangeChange = (next: DateRange | undefined) => {
    setCheckIn(next?.from);
    setCheckOut(next?.to);
  };

  const beds = apartment.beds ?? apartment.rooms ?? 1;
  const baths = apartment.baths ?? apartment.bathrooms ?? 1;

  const amenityItems = (apartment.features ?? [])
    .map((f) => {
      const m = featureMapping[f as keyof typeof featureMapping];
      return m ? { key: f, ...m } : null;
    })
    .filter(Boolean)
    .slice(0, 6) as {
      key: string;
      name: string;
      icon: ComponentType<{ size?: number; className?: string }>;
      color: string;
    }[];

  const description =
    apartment.description?.trim() ||
    "A refined stay with thoughtful amenities, generous space, and the comfort you expect from a premium suite.";

  const subtitleParts = [
    `${beds} bed · ${baths} bath`,
    apartment.location,
    `${apartment.maxGuests} Guests`,
  ];

  return (
    <div className="relative w-full min-h-screen bg-black text-zinc-100">
      <ApartmentHero
        name={apartment.name}
        location={apartment.location}
        imageUrl={apartment.imageUrl}
        pricePerNight={apartment.pricePerNight}
        averageRating={apartment.averageRating ?? null}
        hidePrice
        bookNowScrollToId="apartment-booking"
      />

      <ScrollReveal variant="fadeUp">
        <GalleryGrid name={apartment.name} gallery={apartment.gallery} variant="dark" />
      </ScrollReveal>

      <div className="mx-auto max-w-[1400px] px-4 pb-16 pt-4 md:px-8 lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
          <div className="min-w-0 flex-1 space-y-10 lg:max-w-none">
            <ScrollReveal variant="fadeUp">
            <header className="space-y-4">
              <h1 className="text-3xl leading-tight tracking-tight text-white md:text-4xl lg:text-[2.5rem]">
                {apartment.name}
              </h1>
              <p className="text-sm text-zinc-400 md:text-base">{subtitleParts.join(" / ")}</p>

              <div className="flex flex-wrap gap-x-6 gap-y-4 border-b border-white/10 pb-6">
                <div className="flex min-w-[5.5rem] flex-col items-center gap-1.5 text-center">
                  <Square className="h-5 w-5 text-[color:var(--color-luxury-gold)]" strokeWidth={1.25} />
                  <span className="text-xs text-zinc-400">Suite</span>
                  <span className="text-sm font-medium text-zinc-200">Premium</span>
                </div>
                <div className="flex min-w-[5.5rem] flex-col items-center gap-1.5 text-center">
                  <Users className="h-5 w-5 text-[color:var(--color-luxury-gold)]" strokeWidth={1.25} />
                  <span className="text-xs text-zinc-400">Guests</span>
                  <span className="text-sm font-medium text-zinc-200">{apartment.maxGuests}</span>
                </div>
                <div className="flex min-w-[5.5rem] flex-col items-center gap-1.5 text-center">
                  <Bed className="h-5 w-5 text-[color:var(--color-luxury-gold)]" strokeWidth={1.25} />
                  <span className="text-xs text-zinc-400">Beds</span>
                  <span className="text-sm font-medium text-zinc-200">{beds}</span>
                </div>
                <div className="flex min-w-[5.5rem] flex-col items-center gap-1.5 text-center">
                  <Bath className="h-5 w-5 text-[color:var(--color-luxury-gold)]" strokeWidth={1.25} />
                  <span className="text-xs text-zinc-400">Bathrooms</span>
                  <span className="text-sm font-medium text-zinc-200">{baths}</span>
                </div>
                <div className="flex min-w-[5.5rem] flex-col items-center gap-1.5 text-center">
                  <Wifi className="h-5 w-5 text-[color:var(--color-luxury-gold)]" strokeWidth={1.25} />
                  <span className="text-xs text-zinc-400">Wi‑Fi</span>
                  <span className="text-sm font-medium text-zinc-200">High-speed</span>
                </div>
                <div className="flex min-w-[5.5rem] flex-col items-center gap-1.5 text-center">
                  <AirVent className="h-5 w-5 text-[color:var(--color-luxury-gold)]" strokeWidth={1.25} />
                  <span className="text-xs text-zinc-400">Climate</span>
                  <span className="text-sm font-medium text-zinc-200">Air-conditioning</span>
                </div>
              </div>

              <p className="max-w-3xl text-[15px] leading-relaxed text-zinc-400 md:text-base">{description}</p>
            </header>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.05}>
            <section>
              <h2 className="mb-4 text-xl text-white md:text-2xl">Room Amenities</h2>
              {amenityItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {amenityItems.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-900/40 px-4 py-3"
                    >
                      <item.icon size={22} className={`shrink-0 ${item.color}`} />
                      <span className="text-sm text-zinc-200">{item.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">Amenities will be listed here when available.</p>
              )}
            </section>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.08}>
            <section>
              <h2 className="mb-4 text-xl text-white md:text-2xl">What&apos;s included in this suite?</h2>
              <ul className="list-inside list-disc space-y-2 text-zinc-400 marker:text-[color:var(--color-luxury-gold)]">
                {buildIncludedLines(apartment).map((line) => (
                  <li key={line} className="pl-1 text-[15px] leading-relaxed">
                    {line}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-xl text-white md:text-2xl">Availability</h2>
              <AvailabilityCalendar
                range={range}
                onRangeChange={handleRangeChange}
                bookedDates={bookedDatesForCalendar}
              />
            </section>
            </ScrollReveal>

            <ScrollReveal variant="fadeUp" delay={0.06} className="border-t border-white/10 pt-10">
              <LocationBlock address={apartment.address || apartment.location} rules={apartment.rules || []} variant="dark" />
            </ScrollReveal>
          </div>

          <ScrollReveal variant="fadeRight" delay={0.06} className="w-full shrink-0 scroll-mt-28 lg:sticky lg:top-24 lg:w-[min(100%,380px)] xl:w-[400px]">
          <aside
            id="apartment-booking"
            className="w-full"
          >
            <BookingCard
              apartmentId={apartment.id}
              maxGuests={apartment.maxGuests}
              pricePerNight={apartment.pricePerNight}
              imageUrl={apartment.imageUrl}
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckInChange={setCheckIn}
              onCheckOutChange={setCheckOut}
              guests={guests}
              onGuestsChange={setGuests}
              roomCount={roomCount}
              onRoomCountChange={setRoomCount}
              bookedDateStrings={bookedDateStrings}
              loadingBookedDates={loadingBookedDates}
              addons={apartment.addons}
            />
          </aside>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
