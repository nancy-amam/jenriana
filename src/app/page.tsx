'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getApartments } from '@/services/api-services';
import { ApartmentCard } from '@/components/apartment-card';
import { TestimonialCard } from '@/components/testimonial-card';
import { TrendingApartmentCard } from '@/components/trending-card';
import ApartmentLoadingPage from '@/components/loading';
import { locationFeatures, testimonials } from '@/lib/dummy-data';

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

const fetchApartments = async () => {
    try {
      setLoading(true);
      const response = await getApartments();
      const apartments: Apartment[] = response.data || [];

      const normalized = apartments.map((apt) => ({
        ...apt,
        id: apt._id,
        ratings: typeof apt.ratings === 'number' ? apt.ratings : 4.8,
      }));

      const shuffled = [...normalized].sort(() => Math.random() - 0.5);
      setFeaturedApartments(shuffled.slice(0, 5));

      let trending = normalized.filter((apt) => apt.isTrending);
      if (trending.length === 0) trending = shuffled.slice(0, 4);
      else trending = trending.sort(() => Math.random() - 0.5).slice(0, 4);

      setTrendingApartments(trending);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch apartments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);


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
          <div>
            <label htmlFor="location" className="block text-base font-normal text-[#1e1e1e] mb-2 md:mb-1">Location</label>
            <select id="location" className="w-full px-3 py-3 rounded-xl md:rounded-none bg-white md:bg-transparent">
              <option value="">Select City</option>
              <option value="ikeja">Ikeja</option>
              <option value="lekki">Lekki</option>
              <option value="victoria-island">Victoria Island</option>
              <option value="magodo">Magodo</option>
              <option value="ikorodu">Ikorodu</option>
              <option value="badagry">Badagry</option>
            </select>
          </div>
          <div>
            <label htmlFor="check-in" className="block text-base font-medium text-[#1e1e1e] mb-2 md:mb-1">Check In</label>
            <input id="check-in" type="date" className="w-full px-3 py-3 rounded-xl md:rounded-none bg-white md:bg-transparent" />
          </div>
          <div>
            <label htmlFor="check-out" className="block text-base font-medium text-[#1e1e1e] mb-2 md:mb-1">Check Out</label>
            <input id="check-out" type="date" className="w-full px-3 py-3 rounded-xl md:rounded-none bg-white md:bg-transparent" />
          </div>
          <div>
            <label htmlFor="guests" className="block text-base font-medium text-[#1e1e1e] mb-2 md:mb-1">Guests</label>
            <select id="guests" className="w-full px-3 py-3 rounded-xl md:rounded-none bg-white md:bg-transparent">
              <option>1 Guest</option>
              <option>2 Guests</option>
              <option>3 Guests</option>
              <option>4+ Guests</option>
            </select>
          </div>
          <div className="md:pt-5 mx-auto">
            <button className="w-full bg-black mt-2 md:mt-0 text-white py-3 md:px-6 px-16 rounded-xl hover:bg-gray-800 transition">
              Find Apartments
            </button>
          </div>
        </div>
      </div>

      {/* Explore Features Section (layout untouched) */}
      <section className="py-12 md:py-24 lg:py-32 px-4 md:px-16 mt-5">
        <h2 className="text-2xl md:text-[36px] font-medium mb-6 md:mb-8 text-[#1e1e1e] text-left">
          Explore by Location
        </h2>

        <div className="md:hidden flex gap-4 overflow-x-auto no-scrollbar">
          {locationFeatures.map((feature, idx) => (
            <div key={idx} className="min-w-[260px] flex-shrink-0 rounded-[20px] overflow-hidden">
              <div className="relative w-full h-[220px]">
                <Image
                  src={feature.imageUrl || "/placeholder.svg"}
                  alt={feature.altText}
                  fill
                  className="object-cover rounded-[20px]"
                />
              </div>
              <div className="p-4 text-left">
                <h3 className="text-base font-normal text-[#1e1e1e]">{feature.locationName}</h3>
                <p className="text-sm text-[#4b5563]">{feature.apartmentCount} Apartments</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6 hidden md:block">
          {/* The exact grid layout of your 6 images (unchanged) */}
          <div className="grid grid-cols-4 gap-6">
            {/* Copy your original 6-image grid structure here */}
            {locationFeatures.slice(0, 6).map((feature, idx) => (
              <div key={idx} className={`col-span-${idx === 2 || idx === 3 ? 2 : 1}`}>
                <div className="relative w-full h-[323px]">
                  <Image
                    src={feature.imageUrl || "/placeholder.svg"}
                    alt={feature.altText}
                    fill
                    className="object-cover rounded-[20px]"
                  />
                </div>
                <div className="p-4 text-left">
                  <h3 className="text-base font-normal text-[#1e1e1e]">{feature.locationName}</h3>
                  <p className="text-base text-[#4b5563]">{feature.apartmentCount} Apartments</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-12 md:py-24 lg:py-32 px-4 md:px-16">
        <h2 className="text-2xl md:text-[36px] font-medium mb-6 md:mb-8 text-[#1e1e1e] text-left">
          Featured Listings
        </h2>
        {loading ? (
          <ApartmentLoadingPage />
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            <p>Error: {error}</p>
          </div>
        ) : featuredApartments.length === 0 ? (
          <div className="p-4 text-center">
            <p>No featured apartments available.</p>
          </div>
        ) : (
          <div className="flex overflow-x-auto overflow-hidden pb-4 space-x-4 no-scrollbar">
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
        <div className="flex overflow-x-auto gap-6 no-scrollbar justify-between">
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
          <ApartmentLoadingPage />
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            <p>Error: {error}</p>
          </div>
        ) : trendingApartments.length === 0 ? (
          <div className="p-4 text-center">
            <p>No trending apartments available.</p>
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 no-scrollbar justify-between">
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
        <Image src="/images/contact-bg.png" alt="Modern apartment interior" fill className="object-cover z-0" />
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative z-20 max-w-3xl px-6">
          <h2 className="text-xl md:text-2xl md:text-[36px] font-normal mb-4">
            Can&apos;t Decide? Let&apos;s Help You Find the Perfect Apartment.
          </h2>
          <p className="text-sm md:text-base mb-8">
            Not sure where to start? Our team is ready to assist you in choosing an apartment that fits your needs — no stress, no pressure.
          </p>
          <button className="bg-[#212121] mt-5 text-white text-sm py-4 px-10 rounded-lg font-normal hover:bg-gray-800 transition">
            Contact Us
          </button>
        </div>
      </section>
    </main>
  );
}
