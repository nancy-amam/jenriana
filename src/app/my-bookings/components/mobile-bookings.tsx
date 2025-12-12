"use client";

import React from "react";
import Image from "next/image";
import { MapPinIcon, UsersIcon, CalendarDays, CalendarCheck, ChevronRight } from "lucide-react";

interface Booking {
  id: string;
  apartmentId: string;
  apartmentData: {
    _id: string;
    name: string;
    location: string;
    pricePerNight: number;
    gallery: string[];
  };
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalPrice: number;
  bookingDate: string;
  nights: number;
  status: string;
}

interface BookingCardMobileProps {
  booking: Booking;
  onRebook: (apartmentId: string) => void;
  onViewDetails: (bookingId: string) => void;
  onCancelBooking: (bookingId: string) => void;
  onRateStay: (bookingId: string) => void;
}

export default function BookingCardMobile({
  booking,
  onRebook,
  onViewDetails,
  onCancelBooking,
  onRateStay,
}: BookingCardMobileProps) {
  const apartmentImage = booking.apartmentData.gallery?.[0] || "/images/image20.png";

  return (
    <div className="lg:hidden rounded-2xl bg-white border border-gray-200 overflow-hidden mb-6">
      <div className="relative w-full h-[220px]">
        <Image
          src={apartmentImage}
          alt={booking.apartmentData.name}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/image20.png";
          }}
        />

        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold text-[#00a699] shadow-sm">
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </div>
      </div>

      <div className="p-5 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-[#111827] leading-tight">{booking.apartmentData.name}</h2>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <MapPinIcon className="w-4 h-4 text-gray-500" />
            {booking.apartmentData.location}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-100">
          <div className="flex items-start gap-3">
            <CalendarDays className="w-3 h-3 text-gray-500 mt-0.5" />
            <div>
              {/* <p className="text-sm text-gray-500">Check-in — Check-out</p> */}
              <p className="text-xs text-gray-900">
                {new Date(booking.checkInDate).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                –{" "}
                {new Date(booking.checkOutDate).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex items-start gap-3">
              <CalendarCheck className="w-3 h-3 text-gray-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Booked on</p>
                <p className="text-xs text-gray-900">
                  {new Date(booking.bookingDate).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <button
              onClick={() => onRateStay(booking.id)}
              className="text-xs font-semibold text-black underline underline-offset-4 hover:text-gray-700"
            >
              Rate Your Stay
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <UsersIcon className="w-5 h-5 text-gray-500 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">{booking.guests} Guests</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Total Paid</p>
            <p className="text-lg font-bold text-gray-900">₦{booking.totalPrice.toLocaleString()}</p>
          </div>

          <button onClick={() => onRateStay(booking.id)} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onViewDetails(booking.id)}
            className="flex-1 h-[48px] rounded-lg bg-gray-100 text-gray-900 text-sm font-medium hover:bg-gray-200 transition"
          >
            View Details
          </button>

          <button
            onClick={() => onCancelBooking(booking.id)}
            className="flex-1 h-[48px] rounded-lg bg-red-50 text-red-600 border border-red-200 text-sm font-medium hover:bg-red-100 transition"
          >
            Cancel
          </button>
        </div>

        <button
          onClick={() => onRebook(booking.apartmentId)}
          className="w-full h-[48px] rounded-lg bg-black text-white font-medium hover:bg-gray-800 transition"
        >
          Rebook
        </button>
      </div>
    </div>
  );
}
