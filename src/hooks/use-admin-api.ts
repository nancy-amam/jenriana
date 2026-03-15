"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminAnalytics,
  getActivity,
  getAdminPartners,
  getAdminApartments,
  getApartmentById,
  getAllBookings,
  getAllUsers,
  getTrendingApartments,
  getFeedbacks,
  getAllCoupons,
  deleteCoupon,
  toggleCoupon,
  updateFeedbackPublish,
  createTrendingApartment,
  deleteTrendingApartment,
} from "@/services/api-services";

export const adminKeys = {
  analytics: ["admin", "analytics"] as const,
  activity: ["admin", "activity"] as const,
  partners: ["admin", "partners"] as const,
  apartments: (page: number, location?: string) => ["admin", "apartments", page, location] as const,
  apartment: (id: string) => ["admin", "apartment", id] as const,
  bookings: (page: number, search?: string) => ["admin", "bookings", page, search] as const,
  users: (page: number, search?: string) => ["admin", "users", page, search] as const,
  trending: ["admin", "trending"] as const,
  feedbacks: ["admin", "feedbacks"] as const,
  coupons: ["admin", "coupons"] as const,
};

export function useAdminAnalytics() {
  return useQuery({
    queryKey: adminKeys.analytics,
    queryFn: getAdminAnalytics,
  });
}

export function useAdminActivity() {
  return useQuery({
    queryKey: adminKeys.activity,
    queryFn: async () => {
      const res = await getActivity();
      return res.activities ?? [];
    },
  });
}

export function useAdminPartners() {
  return useQuery({
    queryKey: adminKeys.partners,
    queryFn: async () => {
      const data = await getAdminPartners();
      return data.partners;
    },
  });
}

export function useAdminApartments(page: number, location?: string) {
  return useQuery({
    queryKey: adminKeys.apartments(page, location),
    queryFn: () => getAdminApartments(page, 10, location),
  });
}

export function useAdminApartment(id: string | null) {
  return useQuery({
    queryKey: adminKeys.apartment(id ?? ""),
    queryFn: () => getApartmentById(id!),
    enabled: !!id,
  });
}

export function useAdminBookings(page: number, search?: string) {
  return useQuery({
    queryKey: adminKeys.bookings(page, search),
    queryFn: () => getAllBookings(page, 10, search),
  });
}

export function useAdminUsers(page: number, search?: string) {
  return useQuery({
    queryKey: adminKeys.users(page, search),
    queryFn: () => getAllUsers(page, 10, search),
  });
}

export function useTrendingApartments(enabled = true) {
  return useQuery({
    queryKey: adminKeys.trending,
    queryFn: getTrendingApartments,
    enabled,
  });
}

export function useAdminFeedbacks() {
  return useQuery({
    queryKey: adminKeys.feedbacks,
    queryFn: () => getFeedbacks().then((r) => r.data ?? []),
  });
}

export function useAdminCoupons() {
  return useQuery({
    queryKey: adminKeys.coupons,
    queryFn: () => getAllCoupons().then((r) => r.coupons ?? []),
  });
}

export function usePartnersMutation() {
  const qc = useQueryClient();
  return {
    invalidatePartners: () => qc.invalidateQueries({ queryKey: ["admin", "partners"] }),
  };
}

export function useCouponMutations() {
  const qc = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.coupons }),
  });
  const toggleMutation = useMutation({
    mutationFn: toggleCoupon,
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.coupons }),
  });
  return { deleteCoupon: deleteMutation.mutateAsync, toggleCoupon: toggleMutation.mutateAsync };
}

export function useFeedbackPublishMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, publish }: { id: string; publish: boolean }) =>
      updateFeedbackPublish(id, publish),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.feedbacks }),
  });
}

export function useTrendingMutations() {
  const qc = useQueryClient();
  const addMutation = useMutation({
    mutationFn: createTrendingApartment,
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.trending }),
  });
  const removeMutation = useMutation({
    mutationFn: deleteTrendingApartment,
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.trending }),
  });
  return {
    addTrending: addMutation.mutateAsync,
    removeTrending: removeMutation.mutateAsync,
  };
}
