"use client";

import { useQuery } from "@tanstack/react-query";
import { getApartmentById } from "@/services/api-services";
import { transformApartment } from "@/lib/helpers";
import ApartmentDetails from "../component/apartment-details";
import type { Apartment } from "@/lib/interface";

function ApartmentDetailPulseSkeleton() {
  return (
    <div className="min-h-screen w-full animate-pulse bg-black">
      <div className="h-[min(70vh,520px)] w-full bg-zinc-800" />
      <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-10">
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-[4/3] rounded-xl bg-zinc-800" />
          ))}
        </div>
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="flex-1 space-y-8">
            <div className="h-10 w-4/5 max-w-lg rounded bg-zinc-800" />
            <div className="h-4 w-full max-w-2xl rounded bg-zinc-800/80" />
            <div className="flex flex-wrap gap-4">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 w-20 rounded-lg bg-zinc-800" />
              ))}
            </div>
            <div className="h-48 rounded-xl bg-zinc-800/90" />
          </div>
          <div className="h-[420px] w-full shrink-0 rounded-2xl border border-white/10 bg-zinc-900/80 lg:w-[380px]" />
        </div>
      </div>
    </div>
  );
}

export default function ApartmentDetailClient({ id }: { id: string }) {
  const query = useQuery({
    queryKey: ["apartment", "detail", id] as const,
    queryFn: async () => {
      const response = await getApartmentById(id);
      return transformApartment(response.data) as Apartment;
    },
    enabled: Boolean(id?.trim()),
  });

  if (query.isPending && !query.data) {
    return <ApartmentDetailPulseSkeleton />;
  }

  if (query.isError) {
    const message = query.error instanceof Error ? query.error.message : String(query.error);
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-6 text-red-400">
        <h1 className="text-xl font-bold">Error loading apartment</h1>
        <p className="mt-2">{message}</p>
        <p className="mt-2 text-zinc-500 text-sm">Apartment ID: {id}</p>
        <button
          type="button"
          onClick={() => void query.refetch()}
          className="mt-6 rounded-lg bg-explore-accent px-4 py-2 text-sm font-medium text-black hover:opacity-90"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!query.data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-6 text-zinc-300">
        <p>No apartment data found for ID: {id}</p>
      </div>
    );
  }

  return <ApartmentDetails apartment={query.data} />;
}
