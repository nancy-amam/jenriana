import React from 'react';
import Image from 'next/image';
import { MapPinIcon, UsersIcon, CalendarDays, CalendarCheck, ChevronDown } from 'lucide-react';

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

const BookingCardMobile: React.FC<BookingCardMobileProps> = ({
  booking,
  onRebook,
  onViewDetails,
  onCancelBooking,
  onRateStay
}) => {
  const apartmentImage = booking.apartmentData.gallery?.[0] || '/images/image20.png';

  return (
    <div className="lg:hidden">
      {/* Image with Status badge */}
      <div className="relative w-full h-[200px] rounded-t-lg overflow-hidden">
        <Image
          src={apartmentImage}
          alt={booking.apartmentData.name}
          width={800}
          height={800}
          className="object-cover w-full h-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/image20.png';
          }}
        />
        <div className="absolute top-4 right-4 w-[104px] h-[36px] rounded-lg bg-green-100 text-[#00a699] px-[10px] py-[7px] text-sm font-medium flex items-center justify-center">
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </div>
      </div>

      {/* Mobile Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-normal text-[#111827]">{booking.apartmentData.name}</h2>
            <p className="text-base text-[#4b5566] flex items-center gap-1 mt-1">
              <MapPinIcon className="w-4 h-4 text-[#111827]" />
              {booking.apartmentData.location}
            </p>
          </div>
          <button
            onClick={() => onRebook(booking.apartmentId)}
            className="w-[100px] h-[40px] rounded-lg bg-black text-white px-3 py-2 text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center flex-shrink-0"
          >
            Rebook
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CalendarDays className="w-4 h-4 text-[#4b5566] mt-0.5" />
              <div>
                <span className="font-normal text-[#111827] text-sm block">Check-in – Check-out:</span>
                <p className="text-sm text-[#4b5566] mt-1">
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
            <div className="flex items-start gap-2">
              <CalendarCheck className="w-4 h-4 text-[#111827] mt-0.5" />
              <div>
                <span className="text-sm text-[#111827] font-normal block">Booked on</span>
                <p className="text-sm text-[#4b5566] mt-1">
                  {new Date(booking.bookingDate).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-[#111827] font-normal">Rate Your Stay</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <UsersIcon className="w-4 h-4 text-[#4b5566] mt-0.5" />
              <div>
                <span className="font-normal text-[#4b5566] text-sm block">Guests</span>
                <span className="text-sm text-[#374151] block">{booking.guests} Guests</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg text-black font-bold mt-0.5">₦</span>
              <div className="flex-1">
                <span className="text-sm font-medium text-[#4b5566] block">Total Paid</span>
                <div className="flex flex-col">
                  <span className="text-sm text-black font-bold">{booking.totalPrice.toLocaleString()}</span>
                  <span className="text-xs text-[#6b7280]">
                    for {booking.nights} {booking.nights === 1 ? "night" : "nights"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center" onClick={() => onRateStay(booking.id)}>
              <ChevronDown className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onViewDetails(booking.id)}
            className="flex-1 h-[50px] rounded-lg border border-gray-300 px-4 py-3 text-sm font-normal text-[#212121] bg-[#d1d5db]/30 hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            View Details
          </button>
          <button
            onClick={() => onCancelBooking(booking.id)}
            className="flex-1 h-[50px] rounded-lg border border-gray-300 px-4 py-3 text-sm font-normal text-[#212121] bg-[#d1d5db]/30 hover:bg-red-50 transition-colors flex items-center justify-center"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCardMobile;