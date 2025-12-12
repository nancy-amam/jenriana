import React from "react";
import Image from "next/image";
import { MapPinIcon, UsersIcon, CalendarDays, CalendarCheck, ChevronDown } from "lucide-react";

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

interface BookingCardDesktopProps {
  booking: Booking;
  onRebook: (apartmentId: string) => void;
  onViewDetails: (bookingId: string) => void;
  onCancelBooking: (bookingId: string) => void;
  onRateStay: (bookingId: string) => void;
}

const BookingCardDesktop: React.FC<BookingCardDesktopProps> = ({
  booking,
  onRebook,
  onViewDetails,
  onCancelBooking,
  onRateStay,
}) => {
  const apartmentImage = booking.apartmentData.gallery?.[0] || "/images/image20.png";

  return (
    <div className="hidden  w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:flex flex-col lg:flex-row">
      <div className="w-full lg:w-[320px] h-[220px] lg:h-auto relative flex-shrink-0">
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
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium shadow">
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-grow justify-between p-6 gap-6">
        <div className="flex flex-col gap-4 flex-grow">
          <div>
            <h2 className="text-xl font-semibold text-[#111827]">{booking.apartmentData.name}</h2>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <MapPinIcon className="w-4 h-4 text-red-400" />
              {booking.apartmentData.location}
            </p>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <p>
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

            <div>
              <div className="flex items-center gap-2 font-medium">
                <CalendarCheck className="w-4 h-4" />
                Booked on
              </div>
              <p className="text-gray-500 ml-6">
                {new Date(booking.bookingDate).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <button
              onClick={() => onRateStay(booking.id)}
              className="text-sm cursor-pointer font-medium text-black underline underline-offset-4 hover:text-gray-700 transition"
            >
              Rate Your Stay
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mt-2">
            <button
              onClick={() => onViewDetails(booking.id)}
              className="rounded-lg border border-gray-300 h-[48px] px-5 text-sm font-medium bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition"
            >
              View Details
            </button>

            <button
              onClick={() => onCancelBooking(booking.id)}
              className="rounded-lg border border-red-300 h-[48px] px-5 text-sm font-medium text-red-600 bg-red-50 flex items-center justify-center hover:bg-red-100 transition"
            >
              Cancel Booking
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between lg:w-[180px] gap-5">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <UsersIcon className="w-5 h-5" />
            <span>{booking.guests} Guests</span>
          </div>

          <div>
            <p className="text-3xl font-bold text-black">₦{booking.totalPrice.toLocaleString()}</p>
            {/* <button
              onClick={() => onRateStay(booking.id)}
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <ChevronDown className="w-5 h-5" />
            </button> */}
          </div>

          <button
            onClick={() => onRebook(booking.apartmentId)}
            className="w-full h-[48px] rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
          >
            Rebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCardDesktop;
