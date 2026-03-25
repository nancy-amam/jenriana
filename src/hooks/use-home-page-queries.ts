"use client";

import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getApartments, getTrendingApartments } from "@/services/api-services";
import { locationFeatures } from "@/lib/dummy-data";
import { toast } from "sonner";

export interface HomeApartment {
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

function normalizeApartments(apartments: HomeApartment[]): HomeApartment[] {
  return apartments.map((apt) => ({
    ...apt,
    id: apt._id,
    ratings: typeof apt.ratings === "number" ? apt.ratings : 4.8,
  }));
}

function locationSlug(locationName: string) {
  let slug = locationName.toLowerCase().replace(/\s+/g, " ");
  if (slug === "victoria isalnd") slug = "victoria island";
  return slug;
}

export function useHomePageQueries(filters: { location: string; guests: number }) {
  const apartmentsQuery = useQuery({
    queryKey: ["home", "apartments", { page: 1, limit: 50 }] as const,
    queryFn: () => getApartments(1, 50),
    staleTime: 60 * 1000,
  });

  const trendingQuery = useQuery({
    queryKey: ["home", "trending"] as const,
    queryFn: async () => {
      try {
        return await getTrendingApartments();
      } catch (e: unknown) {
        const err = e instanceof Error ? e : new Error(String(e));
        toast.error(err.message);
        throw err;
      }
    },
    staleTime: 60 * 1000,
    retry: false,
  });

  const locationCountQueries = useQueries({
    queries: locationFeatures.map((feature) => {
      const slug = locationSlug(feature.locationName);
      return {
        queryKey: ["home", "location-count", slug] as const,
        queryFn: () => getApartments(1, 1, slug),
        staleTime: 5 * 60 * 1000,
      };
    }),
  });

  const locationCounts: Record<string, number> = {};
  for (let i = 0; i < locationFeatures.length; i++) {
    locationCounts[locationFeatures[i].locationName] = locationCountQueries[i]?.data?.total ?? 0;
  }

  const rawApartments: HomeApartment[] = apartmentsQuery.data?.data ?? [];

  const allApartments = useMemo(() => normalizeApartments(rawApartments), [rawApartments]);

  const featuredApartments = useMemo(() => {
    let featured = allApartments;
    if (filters.location) {
      featured = featured.filter((apt) => apt.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.guests && filters.guests > 0) {
      featured = featured.filter((apt) => (apt.maxGuests || 1) >= filters.guests);
    }
    return [...featured].sort(() => Math.random() - 0.5);
  }, [allApartments, filters.location, filters.guests]);

  const trendingList = useMemo(() => {
    const trendingRaw = trendingQuery.data?.data ?? [];
    return trendingRaw.map((item: { apartmentId: HomeApartment & { averageRating?: number } }) => {
      const apt = item.apartmentId;
      return {
        _id: apt._id,
        id: apt._id,
        name: apt.name,
        location: apt.location,
        pricePerNight: apt.pricePerNight,
        ratings: apt.averageRating || apt.ratings || 4.8,
        maxGuests: apt.maxGuests,
        rooms: apt.rooms,
        bathrooms: apt.bathrooms,
        gallery: apt.gallery || [],
        isTrending: true as const,
      };
    });
  }, [trendingQuery.data]);

  const apartmentsError =
    apartmentsQuery.isError && apartmentsQuery.error instanceof Error
      ? apartmentsQuery.error.message
      : apartmentsQuery.isError
        ? "Failed to fetch apartments"
        : null;

  const trendingError =
    trendingQuery.isError && trendingQuery.error instanceof Error
      ? trendingQuery.error.message
      : trendingQuery.isError
        ? "Failed to fetch trending apartments"
        : null;

  const apartmentsLoadingPulse = apartmentsQuery.isFetching && allApartments.length === 0;
  const trendingLoadingPulse = trendingQuery.isFetching && trendingList.length === 0;

  return {
    allApartments,
    featuredApartments,
    trendingList,
    locationCounts,
    apartmentsError,
    trendingError,
    apartmentsLoadingPulse,
    trendingLoadingPulse,
    refetchApartments: apartmentsQuery.refetch,
    refetchTrending: trendingQuery.refetch,
  };
}
