"use client";

import { useQuery } from "@tanstack/react-query";
import { getFeedbacks } from "@/services/api-services";

export interface PublishedGeneralFeedback {
  _id: string;
  name: string;
  contact?: string;
  enjoyedMost?: string;
  improvements?: string;
  customerService?: string;
  recommend?: string | null;
  createdAt?: string;
}

export function usePublishedGeneralFeedback() {
  return useQuery({
    queryKey: ["feedback", "general", "published"] as const,
    queryFn: async () => {
      const res = await getFeedbacks(true);
      return (res.data ?? []) as PublishedGeneralFeedback[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
