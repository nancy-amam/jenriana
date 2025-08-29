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
  onRateStay
}) => {
  const apartmentImage = booking.apartmentData.gallery?.[0] || '/images/image20.png';

  return (
    <div className="hidden lg:flex lg:items-stretch w-full">
      <div className="flex-shrink-0 w-[300px] h-auto relative rounded-l-lg overflow-hidden">
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
      </div>

      <div className="flex-grow grid grid-cols-[2fr_1fr] gap-4 w-full p-6">
        <div className="flex flex-col justify-between">
          <h2 className="text-xl font-normal text-[#111827]">{booking.apartmentData.name}</h2>
          <p className="text-base text-[#4b5566] flex items-center gap-1 mt-1">
            <MapPinIcon className="w-4 h-4 text-[#111827]" />
            {booking.apartmentData.location}
          </p>
          <div className="text-sm text-[#374151] mt-2">
            <div className="flex items-start gap-2">
              <CalendarDays className="w-4 h-4 text-[#4b5566] mt-0.5" />
              <div>
                <span className="font-normal text-[#111827] mb-2">Check-in – Check-out:</span>
                <p className="mt-1">
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
            <div className="mt-3">
              <div className="flex items-center gap-2 text-sm text-[#111827] font-normal">
                <CalendarCheck className="w-4 h-4" />
                <span>Booked on</span>
              </div>
              <p className="text-sm text-[#4b5566] mt-1 ml-5">
                {new Date(booking.bookingDate).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="mt-3" onClick={() => onRateStay(booking.id)}>
              <span className="text-base text-[#111827] font-normal">Rate Your Stay</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              onClick={() => onViewDetails(booking.id)}
              className="w-[141px] h-[50px] rounded-lg border border-gray-300 px-[18px] py-[12px] text-base font-normal text-[#212121] bg-[#d1d5db]/30 hover:bg-gray-50 transition-colors flex items-center justify-center whitespace-nowrap"
            >
              View Details
            </button>
            <button
              onClick={() => onCancelBooking(booking.id)}
              className="w-[141px] h-[50px] rounded-lg border border-gray-300 px-[18px] py-[12px] text-base font-normal text-[#212121] bg-[#d1d5db]/30 hover:bg-red-50 transition-colors flex items-center justify-center whitespace-nowrap"
            >
              Cancel Booking
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between h-full lg:h-[150px] w-full lg:w-auto lg:min-w-[200px] mt-4 lg:mt-0 p-6 gap-4">
        <div className="w-[104px] h-[36px] rounded-lg bg-green-100 text-[#00a699] px-[10px] py-[7px] text-sm font-medium flex items-center justify-center">
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </div>
        <div className="text-sm mt-2 flex items-center gap-2">
          <UsersIcon className="w-5 h-5 text-[#4b5566]" />
          <div>
            <span className="font-normal text-[#4b5566] block">Guests</span>
            <span className="text-[#374151] block">{booking.guests} Guests</span>
          </div>
        </div>
        <div className="text-sm text-[#4b5566]">
          <div className="flex items-center gap-2 text-black font-bold">
            <span className="text-xl">₦</span>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-medium text-[#4b5566]">Total Paid</span>
              <div className="flex items-center">
                <span className="text-base">{booking.totalPrice.toLocaleString()}</span>
                <span className="text-sm font-medium text-[#6b7280] ml-2">
                  for {booking.nights} {booking.nights === 1 ? "night" : "nights"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center" onClick={() => onRateStay(booking.id)}>
            <ChevronDown className="w-6 h-6" />
          </div>
        </div>
        
        <button
          onClick={() => onRebook(booking.apartmentId)}
          className="w-[141px] h-[50px] rounded-lg bg-black text-white px-[18px] py-[12px] text-base font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
        >
          Rebook
        </button>
      </div>
    </div>
  );
};

export default BookingCardDesktop;