import React from 'react';

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

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  isOpen,
  onClose,
  booking
}) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] p-6 w-[520px] max-w-full flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#111827]">Booking Details</h2>
          <button
            onClick={onClose}
            className="text-[#4b5566] hover:text-black text-xl"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 text-sm">
              <div>
                <span className="text-[#4b5566] font-medium">Booking ID:</span>
                <p className="text-[#111827] mt-1 font-mono text-xs break-all">{booking.id}</p>
              </div>
              <div>
                <span className="text-[#4b5566] font-medium">Status:</span>
                <p className="text-[#111827] mt-1 capitalize">{booking.status}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-[#111827] mb-3">Apartment Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#4b5566]">Name:</span>
                  <span className="text-[#111827] font-medium">{booking.apartmentData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4b5566]">Location:</span>
                  <span className="text-[#111827]">{booking.apartmentData.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4b5566]">Price per night:</span>
                  <span className="text-[#111827]">₦{booking.apartmentData.pricePerNight.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-[#111827] mb-3">Booking Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#4b5566]">Check-in:</span>
                  <span className="text-[#111827]">
                    {new Date(booking.checkInDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4b5566]">Check-out:</span>
                  <span className="text-[#111827]">
                    {new Date(booking.checkOutDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4b5566]">Number of nights:</span>
                  <span className="text-[#111827] font-medium">{booking.nights} {booking.nights === 1 ? "night" : "nights"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4b5566]">Guests:</span>
                  <span className="text-[#111827]">{booking.guests} {booking.guests === 1 ? "guest" : "guests"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4b5566]">Booked on:</span>
                  <span className="text-[#111827]">
                    {new Date(booking.bookingDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-[#065f46] font-semibold text-lg">Total Amount Paid:</span>
                <span className="text-[#065f46] font-bold text-xl">₦{booking.totalPrice.toLocaleString()}</span>
              </div>
              <p className="text-[#047857] text-sm mt-1">
                ₦{booking.apartmentData.pricePerNight.toLocaleString()} × {booking.nights} {booking.nights === 1 ? "night" : "nights"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="w-[120px] h-[50px] rounded-lg bg-black text-white px-4 py-3 text-base font-medium hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal