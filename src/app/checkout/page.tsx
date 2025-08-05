'use client'

import { useSearchParams } from "next/navigation"
import { detailedApartments } from "@/lib/dummy-data"
import Image from "next/image"
import { useState } from "react"
import { format, addDays } from "date-fns"
import { BedDouble as BedIcon, Bath as BathIcon } from "lucide-react"

export default function CheckoutPage() {
  const searchParams = useSearchParams()

  const apartmentId = searchParams.get("apartmentId")
  const nights = Number(searchParams.get("nights"))
  const guests = Number(searchParams.get("guests"))
  const price = Number(searchParams.get("price"))

  const apartment = detailedApartments.find((apt) => apt.id === apartmentId)

  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    specialRequest: "",
  })

  if (!apartment || isNaN(nights) || isNaN(guests) || isNaN(price)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold">
        Invalid booking information
      </div>
    )
  }

  const totalCost = price * nights
  const serviceFee = 5000
  const taxes = 0.075 * totalCost
  const grandTotal = totalCost + serviceFee + taxes

  const checkInDate = new Date()
  const checkOutDate = addDays(checkInDate, nights)
  const formattedCheckIn = format(checkInDate, "MMM d, yyyy")
  const formattedCheckOut = format(checkOutDate, "MMM d, yyyy")

  return (
    <div className="relative min-h-screen bg-black text-white px-4 py-12 md:px-16 overflow-hidden">
      <Image
        src="/images/image8.png"
        alt="Apartment background"
        fill
        className="object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/80 z-10"></div>

      <div className="relative z-20 max-w-7xl mx-auto">
        <h1 className="text-[36px] font-normal mb-2">Confirm Your Booking</h1>
        <p className="mb-10 text-base font-normal ">Just a few more details to confirm your stay</p>

        <div className="flex flex-col md:flex-row gap-8 w-full items-start">
          {/* Guest Info */}
          <div className="bg-white text-black rounded-[12px] p-6 space-y-6 w-full md:flex-1 max-w-3xl">
            <h2 className="text-2xl font-medium mb-2" style={{ color: "#111827" }}>Guest Information</h2>
            <form className="space-y-5">
              {/* Name */}
              <div className="space-y-1">
                <label className="block text-base font-medium" style={{ color: "#212121" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                  className="w-full px-4 py-2 rounded border text-black"
                  style={{ borderColor: "#EAECF0" }}
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-base font-medium" style={{ color: "#212121" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                  className="w-full px-4 py-2 rounded border text-black"
                  style={{ borderColor: "#EAECF0" }}
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-base font-medium" style={{ color: "#212121" }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded border text-black"
                  style={{ borderColor: "#EAECF0" }}
                />
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="block text-base font-medium" style={{ color: "#212121" }}>
                  Residential Address
                </label>
                <input
                  type="text"
                  placeholder="Enter your complete address"
                  value={guestInfo.address}
                  onChange={(e) => setGuestInfo({ ...guestInfo, address: e.target.value })}
                  className="w-full px-4 py-2 rounded border text-black"
                  style={{ borderColor: "#EAECF0" }}
                />
              </div>

              {/* Special Request */}
              <div className="space-y-1">
                <label className="block text-base font-medium" style={{ color: "#212121" }}>
                  Special Request (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Any special requirements or requests for your stay"
                  value={guestInfo.specialRequest}
                  onChange={(e) => setGuestInfo({ ...guestInfo, specialRequest: e.target.value })}
                  className="w-full px-4 py-2 rounded border text-black"
                  style={{ borderColor: "#EAECF0" }}
                ></textarea>
              </div>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="bg-white text-black rounded-[12px] p-6 space-y-6 w-full md:w-[424px] max-w-full">
            {/* Apartment Info */}
            <div className="flex gap-4">
              {apartment.imageUrl && (
                <Image
                  src={apartment.imageUrl}
                  alt={apartment.name}
                  width={120}
                  height={80}
                  className="rounded-md object-cover"
                />
              )}
              <div>
                <h3 className="text-sm text-[#111827] font-normal">{apartment.name}</h3>
                <p className="text-sm text-[#4b5563]">{apartment.location}</p>
                <div className="flex gap-3 mt-2">
                  <div className=" p-1 flex gap-1 items-center">
                    <BedIcon className="w-5 h-5 mb-1 text-[#6b7280] " />
                    <span className="text-sm font-normal text-[#6b7280]">{apartment.beds} Beds</span>
                  </div>
                  <div className=" p-1 flex gap-1 items-center">
                    <BathIcon className="w-5 h-5 mb-1 text-[#6b7280]" />
                    <span className="text-sm font-normal text-[#6b7280]">{apartment.baths} Baths</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Check-in / Check-out */}
            <div className="flex justify-between text-black font-normal text-sm  pt-4">
              <div>
                <p className="text-[#6b7280] font-normal">Check-in</p>
                <p>{formattedCheckIn}</p>
              </div>
              <div>
                <p className="text-[#6b7280] font-normal">Check-out</p>
                <p>{formattedCheckOut}</p>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="text-sm text-[#6b7280] space-y-2 font-normal  pt-4">
              <div className="flex justify-between">
                <span>₦{price.toLocaleString()} x {nights} night(s)</span>
                <span className=" text-[#11827]">₦{totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span className=" text-[#11827]">₦{serviceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (7.5%)</span>
                <span className=" text-[#11827]">₦{taxes.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between font-semibold text-black border-t border-gray-300 pt-2">
                <span>Total</span>
                <span>₦{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>

            <button className="w-full bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 transition">
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
