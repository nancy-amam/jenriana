"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { BathIcon, BedIcon, MapPinIcon, UsersIcon, StarIcon, AirVent, Wifi, Utensils, Laptop, Dumbbell, ParkingSquare, ShieldCheck, Tv, Ban, Users, Baby, Info } from 'lucide-react'

type Apartment = {
  id: string
  name: string
  location: string
  price: number
  rating: number
  imageUrl: string
  guests: number
  beds: number
  baths: number
  galleryImages: { id: string; src: string; alt: string }[]
  amenities: { id: string; name: string; icon: string }[]
}

export default function ApartmentDetails({ apartment }: { apartment: Apartment }) {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates.")
      return
    }
    const nights =
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
      (1000 * 60 * 60 * 24)
    if (nights <= 0) {
      alert("Check-out date must be after check-in date.")
      return
    }
    if (!guests || guests <= 0) {
      alert("Please select number of guests.")
      return
    }
    // Make sure price is a plain number (not formatted as "$250/night")
    const price = parseFloat(apartment.price.toString()) // Ensure price is a number before parsing
    if (isNaN(price)) {
      alert("Invalid apartment price.")
      return
    }
    router.push(
      `/checkout?apartmentId=${apartment.id}&nights=${nights}&guests=${guests}&price=${price}`
    )
  }

  return (
    <div className="relative w-full min-h-screen">
      {/* Background Image Section */}
      <div className="relative w-full h-[841px] mb-6 md:mb-0">
        <Image
          src={apartment.imageUrl || "/placeholder.svg"}
          alt={apartment.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        {/* Overlay Content (Text only) */}
        <div className="absolute bottom-10 left-0 right-0 text-white px-4 md:px-10">
          <div className="w-full md:max-w-[60%] mb-5">
            <h1 className="text-4xl md:text-[48px] mt-5 font-normal">{apartment.name}</h1>
            <p className="text-lg md:text-[20px] mt-2">{apartment.location}</p>
            <div className="flex mt-2 items-center gap-2 text-sm">
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-[#d1d5db]">{apartment.rating} (views)</span>
            </div>
            <div className="text-2xl md:text-[30px] mt-2 font-normal">${apartment.price}<span className="text-sm"> / night</span> </div>
          </div>
        </div>
      </div>

      {/* Booking Card (moved outside the background image div) */}
      <div className="relative z-10 mx-auto px-4 md:px-0 w-full md:absolute md:top-[460px] md:right-10 md:max-w-[460px]">
        <div className="bg-[#f1f1f1] text-[#1e1e1e] rounded-xl p-6 w-full border border-gray-200 shadow-md">
          <div className="flex mb-2 justify-center items-center mx-auto">
            <p className="text-[36px] text-[#111827] font-bold">${apartment.price} <span className="text-sm mb-5 text-gray-500 ">/ night</span></p>
          </div>
          <div className="flex gap-2 mb-2 text-[#1e1e1e]">
            <input
              type="date"
              className="border border-[#ffffff] w-1/2 px-3 py-2 rounded-md text-sm"
              onChange={(e) => setCheckIn(e.target.value)}
            />
            <input
              type="date"
              className="border border-[#ffffff] w-1/2 px-3 py-2 rounded-md text-sm"
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
          <label className="mb-2 text-sm text-[#1e1e1e]">Guest</label>
          <select
            className="border border-[#ffffff] rounded px-4 py-2 w-full"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          >
            <option value="">Select guests</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} Guest{i > 0 ? 's' : ''}
              </option>
            ))}
          </select>
          <button
            onClick={handleBooking}
            className="mt-4 bg-black text-white w-full rounded-md py-2 hover:bg-gray-800 transition"
          >
            Book Now
          </button>
          <p className="text-xs text-[#6b7280] mt-2 text-center">No stress. No pressure. Cancel anytime.</p>
        </div>
      </div>

      <div className="relative z-0">
        {/* Small Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 mb-5 gap-8 p-6 text-[#111827] px-10 max-w-[1400px] mx-auto">
          <div className="border border-gray-200 rounded-[12px] p-4 flex flex-col items-center">
            <UsersIcon className="w-5 h-5 mb-1 text-[#111827]" />
            <span className="text-sm font-medium">{apartment.guests} Guests</span>
          </div>
          <div className="border border-gray-200 rounded-[12px] p-4 flex flex-col items-center">
            <BedIcon className="w-5 h-5 mb-1 text-[#111827]" />
            <span className="text-sm font-medium">{apartment.beds} Beds</span>
          </div>
          <div className="border border-gray-200 rounded-[12px] p-4 flex flex-col items-center">
            <BathIcon className="w-5 h-5 mb-1 text-[#111827]" />
            <span className="text-sm font-medium">{apartment.baths} Baths</span>
          </div>
          <div className="border border-gray-200 rounded-[12px] p-4 flex flex-col items-center">
            <MapPinIcon className="w-5 h-5 mb-1 text-[#111827]" />
            <span className="text-sm font-medium">{apartment.location}</span>
          </div>
        </div>

        {/* Apartment Gallery */}
        <div className="px-6 max-w-[1400px] mx-auto mb-10">
          <h2 className="text-[36px] font-normal text-[#111827] mb-4">Apartment Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Image
                src={apartment.galleryImages[0].src || "/placeholder.svg"}
                alt={apartment.galleryImages[0].alt}
                width={700}
                height={500}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-4">
              {apartment.galleryImages.slice(1).map((img) => (
                <Image
                  key={img.id}
                  src={img.src || "/placeholder.svg"}
                  alt={img.alt}
                  width={250}
                  height={190}
                  className="w-full h-auto object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>

        {/* What This Apartment Offers */}
        <div className="max-w-[1400] mx-auto px-4 mb-10">
          <h2 className="text-[36px] font-normal text-[#111827] text-left mb-6">What This Apartment Offers</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {apartment.amenities.map((amenity) => {
              const IconComponent = {
                AirVent,
                Wifi,
                Utensils,
                Tv,
                Laptop,
                Dumbbell,
                ParkingSquare,
                ShieldCheck,
              }[amenity.icon];
              // Map specific colors to amenity types
              const getColor = (iconName: string) => {
                switch(iconName) {
                  case 'Wifi': return 'text-blue-500';
                  case 'Utensils': return 'text-red-500';
                  case 'Tv': return 'text-purple-500';
                  case 'Laptop': return 'text-indigo-500';
                  case 'Dumbbell': return 'text-green-500';
                  case 'ParkingSquare': return 'text-yellow-500';
                  case 'ShieldCheck': return 'text-teal-500';
                  default: return 'text-gray-500';
                }
              };
              const colorClass = getColor(amenity.icon);
              return (
                <div
                  key={amenity.id}
                  className="w-full h-[108px] border border-gray-200 rounded-[12px] p-6 flex flex-col items-center justify-center gap-2 text-center"
                >
                  {IconComponent && <IconComponent size={28} className={`${colorClass}`} />}
                  <div className="text-sm text-gray-800">{amenity.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Location Section */}
        <div className="max-w-[1400] mx-auto px-4 mb-10 gap-6">
          <h2 className="text-[36px] font-normal text-[#111827] text-left mb-6">Location</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map */}
            <div className="w-full h-[300px] rounded-lg overflow-hidden">
              {/* Replace with your actual map embed or component */}
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(apartment.location)}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="rounded-lg"
              ></iframe>
            </div>
            {/* Things to Know */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold mb-2">Things to know before booking</h3>
              <div className="flex items-start gap-2 text-gray-800">
                <Ban className="w-5 h-5 mt-1 text-red-500" />
                <span>No smoking</span>
              </div>
              <div className="flex items-start gap-2 text-gray-800">
                <Ban className="w-5 h-5 mt-1 text-yellow-500" />
                <span>No parties or events</span>
              </div>
              <div className="flex items-start gap-2 text-gray-800">
                <Baby className="w-5 h-5 mt-1 text-green-500" />
                <span>Children allowed</span>
              </div>
              <div className="flex items-start gap-2 text-gray-800">
                <Users className="w-5 h-5 mt-1 text-blue-500" />
                <span>Do not exceed booked guests count</span>
              </div>
              <div className="flex items-start gap-2 text-gray-800">
                <Info className="w-5 h-5 mt-1 text-purple-500" />
                <span>Check-in time: 3:00PM – 11:00PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
