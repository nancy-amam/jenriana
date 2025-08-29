import React from 'react';
import BookingCardMobile from './mobile-bookings';
import BookingCardDesktop from './desktop-booking';

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

interface BookingCardProps {
  booking: Booking;
  onRebook: (apartmentId: string) => void;
  onViewDetails: (bookingId: string) => void;
  onCancelBooking: (bookingId: string) => void;
  onRateStay: (bookingId: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onRebook,
  onViewDetails,
  onCancelBooking,
  onRateStay
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col lg:flex-row lg:items-stretch gap-0 lg:gap-6 lg:min-h-[200px]">
      <BookingCardMobile
        booking={booking}
        onRebook={onRebook}
        onViewDetails={onViewDetails}
        onCancelBooking={onCancelBooking}
        onRateStay={onRateStay}
      />
      
      <BookingCardDesktop
        booking={booking}
        onRebook={onRebook}
        onViewDetails={onViewDetails}
        onCancelBooking={onCancelBooking}
        onRateStay={onRateStay}
      />
    </div>
  );
};

export default BookingCard;