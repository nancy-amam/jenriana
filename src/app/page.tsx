"use client";

import { useState, useEffect, useCallback } from "react";
import { getApartments, getTrendingApartments } from "@/services/api-services";
import HeroSection from "@/components/hero-section";
import SearchBar from "@/components/filter-section";
import FeaturedListings from "@/components/featured-listings";
import TestimonialsSection from "@/components/testimonials-section";
import TrendingSection from "@/components/trending-section";
import Features from "@/components/explore-features";
import Contact from "@/components/contact-us";
import FAQSection from "@/components/faqs";
import { toast } from "sonner";

interface Apartment {
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
}

export default function HomePage() {
  const [featuredApartments, setFeaturedApartments] = useState<Apartment[]>([]);
  const [trendingApartments, setTrendingApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ location: "", guests: 0 });

  const [trendingList, setTrendingList] = useState<any[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(false);

  const handleFilterChange = (field: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const fetchApartments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getApartments();
      const apartments: Apartment[] = response.data || [];

      const normalized = apartments.map((apt) => ({
        ...apt,
        id: apt._id,
        ratings: typeof apt.ratings === "number" ? apt.ratings : 4.8,
      }));

      // ✅ Apply filters ONLY to featured
      let featured = normalized;
      if (filters.location) {
        featured = featured.filter((apt) => apt.location.toLowerCase().includes(filters.location.toLowerCase()));
      }
      if (filters.guests && filters.guests > 0) {
        featured = featured.filter((apt) => (apt.maxGuests || 1) >= filters.guests);
      }

      // Shuffle featured
      const shuffledFeatured = [...featured].sort(() => Math.random() - 0.5);
      setFeaturedApartments(shuffledFeatured);

      // ✅ Trending: always based on ALL normalized (no filter)
      let trending = normalized.filter((apt) => apt.isTrending);
      if (trending.length === 0) trending = normalized.slice(0, 4);
      else trending = trending.sort(() => Math.random() - 0.5).slice(0, 4);

      setTrendingApartments(trending);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch apartments");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchApartments();
      fetchTrending();
    }, 500);

    return () => clearTimeout(timeout);
  }, [fetchApartments]);

  const fetchTrending = async () => {
    try {
      setLoadingTrending(true);

      const response = await getTrendingApartments();
      const trendingRaw = response.data || [];

      const mapped = trendingRaw.map((item: any) => {
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
          isTrending: true,
        };
      });

      setTrendingList(mapped);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoadingTrending(false);
    }
  };

  return (
    <main className=" bg-[#f1f1f1]">
      <HeroSection />
      <SearchBar
        filters={filters}
        showBlack
        onFilterChange={handleFilterChange}
        onSearch={fetchApartments}
        buttonLabel="Find Apartments"
      />
      <Features />
      <FeaturedListings apartments={featuredApartments} loading={loading} error={error} onRetry={fetchApartments} />
      <TrendingSection apartments={trendingList} loading={loading} error={error} onRetry={fetchApartments} />
      <TestimonialsSection />

      <FAQSection />
      <Contact />
    </main>
  );
}
