"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getPartnerDashboard,
  getPartnerApartments,
  getPartnerApartment,
  getPartnerTransactions,
} from "@/services/api-services";

export const partnerKeys = {
  dashboard: ["partner", "dashboard"] as const,
  apartments: ["partner", "apartments"] as const,
  apartment: (id: string) => ["partner", "apartment", id] as const,
  transactions: ["partner", "transactions"] as const,
};

export function usePartnerDashboard() {
  return useQuery({
    queryKey: partnerKeys.dashboard,
    queryFn: getPartnerDashboard,
  });
}

export function usePartnerApartments() {
  return useQuery({
    queryKey: partnerKeys.apartments,
    queryFn: async () => {
      const data = await getPartnerApartments();
      return data.apartments;
    },
  });
}

export function usePartnerApartment(id: string | null) {
  return useQuery({
    queryKey: partnerKeys.apartment(id ?? ""),
    queryFn: () => getPartnerApartment(id!),
    enabled: !!id,
  });
}

export function usePartnerTransactions() {
  return useQuery({
    queryKey: partnerKeys.transactions,
    queryFn: async () => {
      const data = await getPartnerTransactions();
      return data.transactions;
    },
  });
}
