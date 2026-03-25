"use client";

import { useQuery } from "@tanstack/react-query";
import { getApartments } from "@/services/api-services";

export interface AppliedApartmentFilters {
  location: string;
  guests: number;
}

export function useApartmentsListQuery(appliedFilters: AppliedApartmentFilters) {
  return useQuery({
    queryKey: ["apartments", "list", appliedFilters.location, appliedFilters.guests] as const,
    queryFn: () =>
      getApartments(1, 50, appliedFilters.location || undefined, appliedFilters.guests || 2),
    staleTime: 60 * 1000,
  });
}
