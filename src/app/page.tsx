"use client"

import Image from "next/image"
import { ApartmentCard } from "@/components/apartment-card"
import { TestimonialCard } from "@/components/testimonial-card"
import { TrendingApartmentCard } from "@/components/trending-card"
import {
  featuredApartments,
  locationFeatures,
  testimonials,
  trendingApartments,
} from "@/lib/dummy-data"

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative h-[90vh] w-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/hero-bg.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-6 md:px-16">
          <div className="flex flex-col md:flex-row items-center font-normal justify-between text-white mb-8">
            <h1 className="text-[45px]  font-bold ">
              Book Your Ideal Stay in Just a Few Clicks
            </h1>
            <p className="text-[20px] max-w-xl text-[#ffffff]/90">
              Discover handpicked apartments in top Nigerian cities — curated
              for comfort and convenience.
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white text-[#1e1e1e] rounded-xl shadow-lg p-4 md:p-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-[#1e1e1e] mb-1"
              >
                Location
              </label>
              <select
                id="location"
                className="w-full rounded-md px-3 py-2"
              >
                <option value="">Select City</option>
                <option value="ikeja">Ikeja</option>
                <option value="lekki">Lekki</option>
                <option value="victoria-island">Victoria Island</option>
                <option value="ikeja">Magodo</option>
                <option value="ikeja">Ikorodu</option>
                <option value="ikeja">Badagry</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="check-in"
                className="block text-sm font-medium text-[#1e1e1e] mb-1"
              >
                Check In
              </label>
              <input
                id="check-in"
                type="date"
                className="w-full  rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label
                htmlFor="check-out"
                className="block text-sm font-medium text-[#1e1e1e] mb-1"
              >
                Check Out
              </label>
              <input
                id="check-out"
                type="date"
                className="w-full  rounded-md px-3 py-2 "
              />
            </div>
            <div>
              <label
                htmlFor="guests"
                className="block text-sm font-medium text-[#1e1e1e] mb-1"
              >
                Guests
              </label>
              <select
                id="guests"
                className="w-full rounded-md px-3 py-2"
              >
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>3 Guests</option>
                <option>4+ Guests</option>
              </select>
            </div>
            <div className="md:pt-5">
              <button className="w-full bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition">
                Find Apartments
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Features Section */}
           <section className="py-12 md:py-24 lg:py-32 px-6 md:px-16">
        <h2 className="text-[36px] font-medium mb-8 text-[#1e1e1e] text-left">
          Explore Features
        </h2>

        <div className="space-y-6">
          {/* First row: 1 col + 1 col + 2 col */}
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-1">
              <div className="relative w-full h-[323px]">
                <Image
                  src={locationFeatures[0].imageUrl || "/placeholder.svg"}
                  alt={locationFeatures[0].altText}
                  fill
                  className="object-cover rounded-[20px]"
                />
              </div>
              <div className="p-4 text-left">
                <h3 className="text-base font-normal text-[#1e1e1e]">
                  {locationFeatures[0].locationName}
                </h3>
                <p className="text-base text-[#4b5563]">
                  {locationFeatures[0].apartmentCount} Apartments
                </p>
              </div>
            </div>

            <div className="col-span-1">
              <div className="relative w-full h-[323px]">
                <Image
                  src={locationFeatures[1].imageUrl || "/placeholder.svg"}
                  alt={locationFeatures[1].altText}
                  fill
                  className="object-cover rounded-[20px]"
                />
              </div>
              <div className="p-4 text-left">
                <h3 className="text-base font-normal text-[#1e1e1e]">
                  {locationFeatures[1].locationName}
                </h3>
                <p className="text-base text-[#4b5563]">
                  {locationFeatures[1].apartmentCount} Apartments
                </p>
              </div>
            </div>

            <div className="col-span-2">
              <div className="relative w-full h-[323px]">
                <Image
                  src={locationFeatures[2].imageUrl || "/placeholder.svg"}
                  alt={locationFeatures[2].altText}
                  fill
                  className="object-cover rounded-[20px]"
                />
              </div>
              <div className="p-4 text-left">
                <h3 className="text-base font-normal text-[#1e1e1e]">
                  {locationFeatures[2].locationName}
                </h3>
                <p className="text-base text-[#4b5563]">
                  {locationFeatures[2].apartmentCount} Apartments
                </p>
              </div>
            </div>
          </div>

          {/* Second row: 2 col + 1 col + 1 col */}
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-2">
              <div className="relative w-full h-[323px]">
                <Image
                  src={locationFeatures[3].imageUrl || "/placeholder.svg"}
                  alt={locationFeatures[3].altText}
                  fill
                  className="object-cover rounded-[20px]"
                />
              </div>
              <div className="p-4 text-left">
                <h3 className="text-base font-normal text-[#1e1e1e]">
                  {locationFeatures[3].locationName}
                </h3>
                <p className="text-base text-[#4b5563]">
                  {locationFeatures[3].apartmentCount} Apartments
                </p>
              </div>
            </div>

            <div className="col-span-1">
              <div className="relative w-full h-[323px]">
                <Image
                  src={locationFeatures[4].imageUrl || "/placeholder.svg"}
                  alt={locationFeatures[4].altText}
                  fill
                  className="object-cover rounded-[20px]"
                />
              </div>
              <div className="p-4 text-left">
                <h3 className="text-base font-normal text-[#1e1e1e]">
                  {locationFeatures[4].locationName}
                </h3>
                <p className="text-base text-[#4b5563]">
                  {locationFeatures[4].apartmentCount} Apartments
                </p>
              </div>
            </div>

            <div className="col-span-1">
              <div className="relative w-full h-[323px]">
                <Image
                  src={locationFeatures[5].imageUrl || "/placeholder.svg"}
                  alt={locationFeatures[5].altText}
                  fill
                  className="object-cover rounded-[20px]"
                />
              </div>
              <div className="p-4 text-left">
                <h3 className="text-base font-normal text-[#1e1e1e]">
                  {locationFeatures[5].locationName}
                </h3>
                <p className="text-base text-[#4b5563]">
                  {locationFeatures[5].apartmentCount} Apartments
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



       {/* Featured Listings */}
      <section className="py-12 md:py-24 lg:py-32 px-6 md:px-16">
        <h2 className="text-[36px] font-medium mb-8 text-[#1e1e1e] text-left">
          Featured Listings
        </h2>
        <div className="flex overflow-x-scroll pb-4 space-x-6 no-scrollbar">
          {featuredApartments.map((apartment) => (
            <ApartmentCard key={apartment.id} {...apartment} />
          ))}
        </div>
      </section>

      {/* Guest Testimonials */}
      <section className="py-12 md:py-24 lg:py-32 px-6 md:px-16">
        <h2 className="text-[36px] font-medium mb-8 text-[#1e1e1e] text-left">
          What our guests say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-12 md:py-24 lg:py-32 px-6 md:px-16">
        <h2 className="text-[36px] font-medium mb-8 text-[#1e1e1e] text-left">
          Trending This Week
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trendingApartments.map((apartment) => (
            <TrendingApartmentCard
              key={apartment.id}
              apartment={apartment}
            />
          ))}
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="relative py-24 md:py-32 lg:py-40 flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="/images/contact-bg.png"
          alt="Modern apartment interior"
          fill
          className="object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative z-20 max-w-3xl px-6">
          <h2 className="text-[36px] md:text-[36px] font-normal mb-4">
            Can&apos;t Decide? Let&apos;s Help You Find the Perfect Apartment.
          </h2>
          <p className="text-base md:text-base mb-8">
            Not sure where to start? Our team is ready to assist you in choosing
            an apartment that fits your needs — no stress, no pressure.
          </p>
          <button className="bg-[#212121] mt-5 text-white py-4 px-10 rounded-lg text-base font-normal hover:bg-gray-800 transition">
            Contact Us
          </button>
        </div>
      </section>
    </main>
  )
}
