"use client";

import { useRef, useState } from "react";
import HeroSection from "@/components/hero-section";
import SearchBar from "@/components/filter-section";
import FeaturedListings from "@/components/featured-listings";
import TestimonialsSection from "@/components/testimonials-section";
import TrendingSection from "@/components/trending-section";
import Features from "@/components/explore-features";
import Contact from "@/components/contact-us";
import LocationBookSplit from "@/components/location-book-split";
import FAQSection from "@/components/faqs";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useHomePageQueries } from "@/hooks/use-home-page-queries";

export default function HomePage() {
  const [filters, setFilters] = useState({ location: "", guests: 0 });
  const featuredRef = useRef<HTMLDivElement>(null);

  const {
    allApartments,
    featuredApartments,
    trendingList,
    locationCounts,
    apartmentsError,
    trendingError,
    apartmentsLoadingPulse,
    trendingLoadingPulse,
    refetchApartments,
    refetchTrending,
  } = useHomePageQueries(filters);

  const handleFilterChange = (field: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <main className="bg-explore-bg">
      <HeroSection />
      <ScrollReveal variant="fadeUp">
        <SearchBar
          filters={filters}
          showBlack
          onFilterChange={handleFilterChange}
          onSearch={() => void refetchApartments()}
          buttonLabel="Find Apartments"
        />
      </ScrollReveal>
      <ScrollReveal variant="fade">
        <Features apartments={allApartments} loading={apartmentsLoadingPulse} locationCounts={locationCounts} />
      </ScrollReveal>
      <div ref={featuredRef}>
        <ScrollReveal variant="fadeUp" delay={0.04}>
          <FeaturedListings
            apartments={featuredApartments}
            loading={apartmentsLoadingPulse}
            error={apartmentsError}
            onRetry={() => void refetchApartments()}
          />
        </ScrollReveal>
      </div>
      <ScrollReveal variant="fadeUp" delay={0.06}>
        <TrendingSection
          apartments={trendingList}
          loading={trendingLoadingPulse}
          error={trendingError}
          onRetry={() => void refetchTrending()}
        />
      </ScrollReveal>
      <ScrollReveal variant="fadeUp">
        <TestimonialsSection />
      </ScrollReveal>

      <ScrollReveal variant="fadeUp">
        <FAQSection />
      </ScrollReveal>

      <ScrollReveal variant="fadeUp" delay={0.05}>
        <LocationBookSplit />
      </ScrollReveal>

      {/* <ScrollReveal variant="fade">
        <Contact />
      </ScrollReveal> */}
    </main>
  );
}
