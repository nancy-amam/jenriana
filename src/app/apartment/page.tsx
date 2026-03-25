"use client";

import { useState, useEffect, useMemo } from "react";
import ApartmentList from "./component/apartment-list";
import SearchBar from "@/components/filter-section";
import ApartmentsHero from "@/components/apartments-hero";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useApartmentsListQuery } from "@/hooks/use-apartments-list-query";

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

export default function ApartmentsPage() {
  const [filters, setFilters] = useState({ location: "", guests: 0 });
  const [appliedFilters, setAppliedFilters] = useState({ location: "", guests: 0 });
  const [sortBy, setSortBy] = useState("latest");

  const [visibleCount, setVisibleCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const apartmentsQuery = useApartmentsListQuery(appliedFilters);

  const apartments: Apartment[] = apartmentsQuery.data?.data ?? [];

  const loading = apartmentsQuery.isFetching && apartments.length === 0;
  const error =
    apartmentsQuery.isError && apartmentsQuery.error instanceof Error
      ? apartmentsQuery.error.message
      : apartmentsQuery.isError
        ? "Failed to fetch apartments"
        : null;

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    setVisibleCount(isMobile ? 6 : 8);
  }, [apartments, isMobile]);

  const handleFilterChange = (field: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setAppliedFilters({ ...filters });
    setVisibleCount(isMobile ? 3 : 8);
  };

  const sorted = useMemo(() => {
    return [...apartments].sort((a, b) => {
      switch (sortBy) {
        case "priceLowHigh":
          return a.pricePerNight - b.pricePerNight;
        case "priceHighLow":
          return b.pricePerNight - a.pricePerNight;
        case "rating":
          return (b.ratings ?? 0) - (a.ratings ?? 0);
        default:
          return 0;
      }
    });
  }, [apartments, sortBy]);

  const visibleApartments = sorted.slice(0, visibleCount);

  const handleLoadMore = () => {
    const batchSize = isMobile ? 3 : 8;
    setVisibleCount((prev) => prev + batchSize);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <ApartmentsHero />
      <ScrollReveal variant="fadeUp">
        <SearchBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          buttonLabel="Search"
          showBlack
        />
      </ScrollReveal>

      <div className="mx-auto px-4 md:px-[110px] py-10 md:py-12">
        <ScrollReveal variant="fadeUp" delay={0.05}>
          <div className="flex items-center px-2 md:px-0 justify-between mb-6">
            <p className="text-zinc-200 font-regular text-sm lg:text-lg md:text-[20px]">
              {sorted.length} apartments found
            </p>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-[187px] h-[41px] rounded-[12px] border border-white/15 px-3 bg-zinc-900/90 text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-explore-accent/40 [color-scheme:dark]"
            >
              <option value="latest">Most Popular</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </ScrollReveal>

        <ApartmentList
          apartments={visibleApartments}
          loading={loading}
          error={error}
          onRetry={() => void apartmentsQuery.refetch()}
        />

        {visibleCount < sorted.length && (
          <ScrollReveal variant="fadeUp" className="flex justify-center mt-10">
            <button
              type="button"
              onClick={handleLoadMore}
              className="rounded-lg border border-explore-accent/50 bg-explore-accent/15 px-6 py-3 text-sm font-medium text-explore-accent transition hover:bg-explore-accent/25"
            >
              Load More Apartments
            </button>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
