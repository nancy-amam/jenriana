'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { getApartments } from '@/services/api-services';
import { ApartmentCard } from '@/components/apartment-card';
import { TestimonialCard } from '@/components/testimonial-card';
import { TrendingApartmentCard } from '@/components/trending-card';
import ApartmentLoadingPage from '@/components/loading';
import { locationFeatures, testimonials } from '@/lib/dummy-data';
import DateInput from "@/components/date-inputs";
import Link from 'next/link';

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

    // Apply filters
    let filtered = normalized;
    if (filters.location) {
      filtered = filtered.filter((apt) =>
        apt.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.guests && filters.guests > 0) {
      filtered = filtered.filter(
        (apt) => (apt.maxGuests || 1) >= filters.guests
      );
    }

    // Shuffle ALL
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setFeaturedApartments(shuffled);

    // Trending (fallback to shuffled if none marked trending)
    let trending = normalized.filter((apt) => apt.isTrending);
    if (trending.length === 0) trending = shuffled.slice(0, 4);
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
  }, 500);

  return () => clearTimeout(timeout);
}, [fetchApartments]);



  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative h-screen w-full bg-cover bg-center "
        style={{ backgroundImage: "url('/images/hero-bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 h-full flex flex-col justify-end pb-6 px-4 md:px-16 mb-5">
          <div className="flex flex-col md:flex-row md:items-start text-white mb-6 md:mb-[160px]">
            <h1 className="text-[28px] md:w-auto w-[328px] md:text-[45px] font-normal">
              Book Your Ideal Stay in Just a Few Clicks
            </h1>
            <p className="text-[16px] md:text-[20px] font-normal text-[#ffffff]/90 
                          mt-2 md:-mt-6 md:max-w-xl 
                          self-end md:self-center text-right md:text-right md:w-auto w-[258px]">
              Discover handpicked apartments in top Nigerian cities — curated for comfort and convenience.
            </p>
          </div>
        </div>
      </section>

      {/* Search Bar */}

      <div className="mt-10 md:-mt-[170px] px-4 md:px-16 z-20 relative">
  <div className="bg-[#f1f1f1] md:bg-white text-[#1e1e1e] md:rounded-xl md:shadow-lg p-4 md:p-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
    
    {/* Location */}
    <div className=' '>
      <label
        htmlFor="location"
        className="block text-base font-normal text-[#1e1e1e] mb-2 md:mb-1"
      >
        Location
      </label>
          <select
  id="location"
  aria-label="Select Location"
  value={filters.location}
  onChange={(e) => handleFilterChange("location", e.target.value)}
  className="w-full px-3 py-4 rounded-xl md:rounded-none bg-white md:bg-transparent cursor-pointer"
>
  <option value="">Select City</option>
  <option value="ikeja">Ikeja</option>
  <option value="lekki">Lekki</option>
  <option value="victoria-island">Victoria Island</option>
  <option value="magodo">Magodo</option>
  <option value="ikorodu">Ikorodu</option>
  <option value="badagry">Badagry</option>
</select>
    </div>

    {/* Check In */}
    <div>
      <DateInput id="check-in" label="Check In" />
    </div>

    {/* Check Out */}
    <div>
      <DateInput id="check-out" label="Check Out" />
    </div>

    {/* Guests */}
    <div className=''>
      <label
        htmlFor="guests"
        className="block text-base font-normal text-[#1e1e1e] mb-2 md:mb-1"
      >
        Guests
      </label>
        <select
  id="guests"
  aria-label="Select Guests"
  value={filters.guests}
  onChange={(e) => handleFilterChange("guests", Number(e.target.value))}
  className="w-full px-3 py-4 rounded-xl md:rounded-none bg-white md:bg-transparent cursor-pointer"
>
  <option value={0}>Any</option>
  <option value={1}>1 Guest</option>
  <option value={2}>2 Guests</option>
  <option value={3}>3 Guests</option>
  <option value={4}>4+ Guests</option>
</select>
    </div>

    {/* Search Button */}
    <div className="md:pt-5 mx-auto w-full">
      <button className="w-full bg-black mt-2 md:mt-0 text-white py-3 md:px-6 px-16 rounded-xl hover:bg-gray-800 transition cursor-pointer ">
        Find Apartments
      </button>
    </div>
  </div>
</div>


   {/* Explore Features Section */}
<section className="py-12 md:py-24 lg:py-32 px-4 md:px-16 mt-5">
  <h2 className="text-2xl md:text-[36px] font-medium mb-6 md:mb-8 text-[#1e1e1e] text-left">
    Explore by Location
  </h2>

  {/* Mobile horizontal scroll (unchanged) */}
  <div className="md:hidden flex gap-4 overflow-x-auto no-scrollbar">
    {locationFeatures.map((feature, idx) => (
      <div key={idx} className="min-w-[260px] flex-shrink-0 rounded-[20px] overflow-hidden">
        <div className="relative w-full h-[220px]">
          <Image
            src={feature.src || "/placeholder.svg"}
            alt={feature.alt}
            fill
            className="object-cover rounded-[20px]"
             loading="lazy"
           aria-label={`Image of ${feature.alt}`}
          />
        </div>
        <div className="p-4 text-left">
          <h3 className="text-base font-normal text-[#1e1e1e]">{feature.locationName}</h3>
          <p className="text-sm text-[#4b5563]">{feature.apartmentCount} Apartments</p>
        </div>
      </div>
    ))}
  </div>

  {/* Desktop custom grid */}
  <div className="hidden md:grid grid-cols-4 gap-x-6  ">
    {/* Top Row */}
    <div className="col-span-1 row-span-1">
      <div className="relative w-full h-[323px]">
        <Image
          src={locationFeatures[0].src || "/placeholder.svg"}
          alt={locationFeatures[0].alt}
          fill
          className="object-cover rounded-[20px]"
           loading="lazy"
  aria-label={`Image of ${locationFeatures}`}
        />
      </div>
      <div className="p-2 text-left">
        <h3 className="text-base font-normal text-[#1e1e1e]">{locationFeatures[0].locationName}</h3>
        <p className="text-base text-[#4b5563]">{locationFeatures[0].apartmentCount} Apartments</p>
      </div>
    </div>
    <div className="col-span-1 row-span-1">
      <div className="relative w-full h-[323px]">
        <Image
          src={locationFeatures[1].src || "/placeholder.svg"}
          alt={locationFeatures[1].alt}
          fill
          className="object-cover rounded-[20px]"
           loading="lazy"
  aria-label={`Image of ${locationFeatures}`}
        />
      </div>
      <div className="p-2 text-left">
        <h3 className="text-base font-normal text-[#1e1e1e]">{locationFeatures[1].locationName}</h3>
        <p className="text-base text-[#4b5563]">{locationFeatures[1].apartmentCount} Apartments</p>
      </div>
    </div>
    <div className="col-span-2 row-span-2">
      <div className="relative w-full h-[323px] ">
        <Image
          src={locationFeatures[2].src || "/placeholder.svg"}
          alt={locationFeatures[2].alt}
          fill
          className="object-cover rounded-[20px]"
           loading="lazy"
  aria-label={`Image of ${locationFeatures}`}
        />
      </div>
      <div className="p-2 text-left">
        <h3 className="text-base font-normal text-[#1e1e1e]">{locationFeatures[2].locationName}</h3>
        <p className="text-base text-[#4b5563]">{locationFeatures[2].apartmentCount} Apartments</p>
      </div>
    </div>

    {/* Bottom Row */}
    <div className="col-span-2 row-span-2 mt-5">
      <div className="relative w-full h-[323px] ">
        <Image
          src={locationFeatures[3].src || "/placeholder.svg"}
          alt={locationFeatures[3].alt}
          fill
          className="object-cover rounded-[20px]"
           loading="lazy"
  aria-label={`Image of ${locationFeatures}`}
        />
      </div>
      <div className="p-2 text-left">
        <h3 className="text-base font-normal text-[#1e1e1e]">{locationFeatures[3].locationName}</h3>
        <p className="text-base text-[#4b5563]">{locationFeatures[3].apartmentCount} Apartments</p>
      </div>
    </div>
    <div className="col-span-1 row-span-1">
      <div className="relative w-full h-[323px]">
        <Image
          src={locationFeatures[4].src || "/placeholder.svg"}
          alt={locationFeatures[4].alt}
          fill
          className="object-cover rounded-[20px]"
           loading="lazy"
  aria-label={`Image of ${locationFeatures}`}
        />
      </div>
      <div className="p-2 text-left">
        <h3 className="text-base font-normal text-[#1e1e1e]">{locationFeatures[4].locationName}</h3>
        <p className="text-base text-[#4b5563]">{locationFeatures[4].apartmentCount} Apartments</p>
      </div>
    </div>
    <div className="col-span-1 row-span-1">
      <div className="relative w-full h-[323px]">
        <Image
          src={locationFeatures[5].src || "/placeholder.svg"}
          alt={locationFeatures[5].alt}
          fill
          className="object-cover rounded-[20px]"
           loading="lazy"
  aria-label={`Image of ${locationFeatures}`}
        />
      </div>
      <div className="p-2 text-left">
        <h3 className="text-base font-normal text-[#1e1e1e]">{locationFeatures[5].locationName}</h3>
        <p className="text-base text-[#4b5563]">{locationFeatures[5].apartmentCount} Apartments</p>
      </div>
    </div>
  </div>
</section>


      {/* Featured Listings */}
      <section className="py-12 md:py-24 lg:py-32 px-4 md:px-16">
        <h2 className="text-2xl md:text-[36px] font-medium mb-6 md:mb-8 text-[#1e1e1e] text-left">
          Featured Listings
        </h2>
        {loading ? (
              <div className="p-4 sm:p-6  min-h-screen">
                     <div className="flex justify-center items-center h-64">
                       <ApartmentLoadingPage />
                     </div>
                   </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            <p>Error: {error}</p>
             <button
      onClick={fetchApartments}
      className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg"
    >
      Retry
    </button>
          </div>
        ) : featuredApartments.length === 0 ? (
          <div className="p-4 text-center">
            <p>No featured apartments available.</p>
          </div>
        ) : (
          <div className="flex overflow-x-auto overflow-hidden pb-4 space-x-4 no-scrollbar snap-x snap-mandatory">
            {featuredApartments.map((apartment) => (
              <ApartmentCard
                key={apartment.id}
                id={apartment.id}
                imageUrl={apartment.gallery?.[0] || '/placeholder.svg'}
                name={apartment.name}
                location={apartment.location}
                price={`₦${apartment.pricePerNight.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`}
                rating={apartment.ratings || 4.8}
                guests={apartment.maxGuests || 1}
                beds={apartment.rooms || 1}
                baths={apartment.bathrooms || 1}
              />
            ))}
          </div>
        )}
      </section>

      {/* Guest Testimonials */}
      <section className="py-12 md:py-24 lg:py-32 px-4 md:px-16 text-center">
        <h2 className="text-2xl md:text-[36px] font-medium mb-6 md:mb-8 text-[#1e1e1e] text-left">
          What our guests say
        </h2>
        <div className="flex overflow-x-auto gap-6 no-scrollbar snap-x snap-mandatory justify-between">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-12 md:py-24 lg:py-32 px-4 md:px-16">
        <h2 className="text-2xl md:text-[36px] font-medium mb-6 md:mb-8 text-[#1e1e1e] text-left">
          Trending This Week
        </h2>
        {loading ? (
               <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-screen">
                      <div className="flex justify-center items-center h-64">
                        <ApartmentLoadingPage />
                      </div>
                    </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            <p>Error: {error}</p>
             <button
      onClick={fetchApartments}
      className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg"
    >
      Retry
    </button>
          </div>
        ) : trendingApartments.length === 0 ? (
          <div className="p-4 text-center">
            <p>No trending apartments available.</p>
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 no-scrollbar snap-x snap-mandatory justify-between">
            {trendingApartments.map((apartment) => (
              <TrendingApartmentCard
                key={apartment.id}
                apartment={{
                  id: apartment.id,
                  imageUrl: apartment.gallery?.[0] || '/placeholder.svg',
                  name: apartment.name,
                  location: apartment.location,
                  price: `₦${apartment.pricePerNight.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`,
                  rating: apartment.ratings || 4.8,
                  guests: apartment.maxGuests || 1,
                  beds: apartment.rooms || 1,
                  baths: apartment.bathrooms || 1,
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Contact Us Section */}
      <section className="relative py-24 md:py-32 lg:py-40 flex items-center justify-center text-center text-white overflow-hidden">
        <Image src="/images/contact-bg.png" alt="Modern apartment interior" fill className="object-cover z-0" loading='lazy' />
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative z-20 max-w-3xl px-6">
          <h2 className="text-xl md:text-2xl md:text-[36px] font-normal mb-4">
            Can&apos;t Decide? Let&apos;s Help You Find the Perfect Apartment.
          </h2>
          <p className="text-sm md:text-base mb-8">
            Not sure where to start? Our team is ready to assist you in choosing an apartment that fits your needs — no stress, no pressure.
          </p>
          <Link href={'/contact-us'}>
          <button className="bg-[#212121] mt-5 text-white text-sm py-4 px-10 rounded-lg font-normal hover:bg-gray-800 transition cursor-pointer ">
            Contact Us
          </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
