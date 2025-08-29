"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { differenceInDays } from "date-fns";
import { getActiveBookings, getBookingHistory, postApartmentComment, cancelBooking } from "@/services/api-services";
import ApartmentLoadingPage from "@/components/loading";
import BookingFilterTabs from "./components/booking-filters";
import BookingCard from "./components/booking-card";
import ReviewModal from "./components/review-modal";
import CancelBookingModal from "./components/cancel-modal";
import BookingDetailsModal from "./components/booking-details";

interface ApartmentData {
  _id: string;
  name: string;
  location: string;
  pricePerNight: number;
  gallery: string[];
}

interface Booking {
  id: string;
  apartmentId: string;
  apartmentData: ApartmentData;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalPrice: number;
  bookingDate: string;
  nights: number;
  status: string;
}

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeFilter, setActiveFilter] = useState<"active" | "history">("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showReviewModal, setShowReviewModal] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = activeFilter === "active" ? await getActiveBookings() : await getBookingHistory();
        const apiBookings = response.bookings || [];
        const mappedBookings: Booking[] = apiBookings.map((booking: any) => ({
          id: booking._id,
          apartmentId: booking.apartmentId._id,
          apartmentData: {
            _id: booking.apartmentId._id,
            name: booking.apartmentId.name,
            location: booking.apartmentId.location,
            pricePerNight: booking.apartmentId.pricePerNight,
            gallery: booking.apartmentId.gallery || []
          },
          checkInDate: booking.checkInDate,
          checkOutDate: booking.checkOutDate,
          guests: booking.guests,
          totalPrice: booking.totalAmount,
          bookingDate: booking.createdAt,
          nights: differenceInDays(new Date(booking.checkOutDate), new Date(booking.checkInDate)),
          status: booking.status,
        }));
        setBookings(mappedBookings);
      } catch (err: any) {
        console.error(`Failed to fetch ${activeFilter} bookings:`, err);
        setError(`Failed to load ${activeFilter} bookings. Please try again.`);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [activeFilter]);

  const handleViewDetails = (bookingId: string) => {
    setShowDetailsModal(bookingId);
  };

  const handleCancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking && booking.status.toLowerCase() === 'confirmed') {
      setShowCancelModal(bookingId);
    } else {
      if (confirm(`Are you sure you want to cancel this booking?`)) {
        performCancelBooking(bookingId);
      }
    }
  };

  const performCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      const updatedBookings = bookings.filter((b) => b.id !== bookingId);
      setBookings(updatedBookings);
    } catch (error: any) {
      console.error("Failed to cancel booking:", error);
      alert(`Failed to cancel booking: ${error.message || "Please try again."}`);
    }
  };

  const handleConfirmCancel = (bookingId: string) => {
    setShowCancelModal(null);
    performCancelBooking(bookingId);
  };

  const handleRebook = (apartmentId: string) => {
    router.push(`/apartments/${apartmentId}`);
  };

  const handleRateStay = (bookingId: string) => {
    setShowReviewModal(bookingId);
  };

  const handlePostReview = async (apartmentId: string, rating: number, comment: string) => {
    const response = await postApartmentComment(apartmentId, rating, comment);
    alert(response.message);
  };

  const getCurrentBooking = (bookingId: string | null) => {
    return bookingId ? bookings.find(b => b.id === bookingId) || null : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center text-black">
        <ApartmentLoadingPage />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center text-red-600 text-lg font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f1f1] py-12 px-4 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        {/* Header Section */}
        <h1 className="text-[24px] font-normal text-[#111827] mb-4">My Bookings</h1>
        
        {/* Filter Tabs */}
        <BookingFilterTabs 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg p-6 shadow-md text-center text-gray-600">
            {activeFilter === "active" ? "You have no active bookings yet." : "You have no booking history yet."}
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onRebook={handleRebook}
                onViewDetails={handleViewDetails}
                onCancelBooking={handleCancelBooking}
                onRateStay={handleRateStay}
              />
            ))}
          </div>
        )}

        {/* Review Modal */}
        <ReviewModal
          isOpen={!!showReviewModal}
          onClose={() => setShowReviewModal(null)}
          onPostReview={handlePostReview}
          apartmentId={getCurrentBooking(showReviewModal)?.apartmentId || ""}
        />

        {/* Cancel Booking Modal */}
        <CancelBookingModal
          isOpen={!!showCancelModal}
          onClose={() => setShowCancelModal(null)}
          onConfirmCancel={() => handleConfirmCancel(showCancelModal!)}
          bookingId={showCancelModal || ""}
        />

        {/* Booking Details Modal */}
        <BookingDetailsModal
          isOpen={!!showDetailsModal}
          onClose={() => setShowDetailsModal(null)}
          booking={getCurrentBooking(showDetailsModal)}
        />
      </div>
    </div>
  );
}