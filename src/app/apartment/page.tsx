"use client";

import { useState, useEffect } from "react";
import { getApartments } from "@/services/api-services";
import ApartmentList from "./component/apartment-list";
import SearchBar from "@/components/filter-section";

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
  const [sortBy, setSortBy] = useState("latest");
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [visibleCount, setVisibleCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const fetchApartments = async () => {
    try {
      setLoading(true);
      const response = await getApartments(
        1, 
        50, 
        filters.location || undefined,
        filters.guests || 2
      );
      setApartments(response.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch apartments");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchApartments();

 
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


  const handleSearch = async () => {
    await fetchApartments();
    setVisibleCount(isMobile ? 3 : 8); 
  };


  const sorted = [...apartments].sort((a, b) => {
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

  const visibleApartments = sorted.slice(0, visibleCount);

  const handleLoadMore = () => {
    const batchSize = isMobile ? 3 : 8;
    setVisibleCount((prev) => prev + batchSize);
  };

  return (
    <div className="bg-white md:bg-[#f1f1f1]">
      <div className="bg-[#f1f1f1]  px-4 md:px-16 pt-5 md:pt-[220px] pb-6">
        <SearchBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch} 
          buttonLabel="Search"
        />
      </div>

      <div className="mx-auto px-4 md:px-[110px] py-10">
        <div className="flex items-center px-2 md:px-0 justify-between mb-6">
          <p className="text-black font-regular text-lg md:text-[20px]">
            {sorted.length} apartments found
          </p>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-[187px] h-[41px] rounded-[12px] border border-[#E5E7EB] px-3 bg-white text-gray-700 text-sm focus:outline-none"
          >
            <option value="latest">Most Popular</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        <ApartmentList
          apartments={visibleApartments}
          loading={loading}
          error={error}
        />

        {visibleCount < sorted.length && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleLoadMore}
              className="bg-black text-white px-6 py-3 rounded-lg"
            >
              Load More Apartments
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
