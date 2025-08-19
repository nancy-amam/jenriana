"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPinIcon, UsersIcon, CalendarDays, CalendarCheck, ChevronDownIcon, StarIcon } from "lucide-react";
import { differenceInDays } from "date-fns";
import { getActiveBookings, getBookingHistory, postApartmentComment } from "@/services/api-services";

interface ApartmentId {
  _id: string;
  name: string;
  location: string;
  pricePerNight: number;
}

interface Booking {
  id: string;
  apartmentId: string; // Added for comment API
  apartmentName: string;
  apartmentLocation: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalPrice: number;
  bookingDate: string;
  nights: number;
  status: string;
}

interface Review {
  rating: number;
  comment: string;
  userImage: string; // Placeholder for user image
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeFilter, setActiveFilter] = useState<"active" | "history">("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<string | null>(null);
  const [rating, setRating] = useState(4); // Default 4 stars
  const [comment, setComment] = useState("");
  const [postedReview, setPostedReview] = useState<Review | null>(null);

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
          apartmentName: booking.apartmentId.name,
          apartmentLocation: booking.apartmentId.location,
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
    alert(`Viewing details for booking: ${bookingId}`);
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm(`Are you sure you want to cancel booking ${bookingId}?`)) {
      const updatedBookings = bookings.filter((b) => b.id !== bookingId);
      setBookings(updatedBookings);
      alert(`Booking ${bookingId} cancelled.`);
    }
  };

  const handleRebook = (bookingId: string) => {
    alert(`Rebooking for booking: ${bookingId}`);
  };

  const handleRateStay = (bookingId: string) => {
    setShowReviewModal(bookingId);
    setRating(4);
    setComment("");
    setPostedReview(null);
  };

  const handlePostReview = async (apartmentId: string) => {
    try {
      const response = await postApartmentComment(apartmentId, rating, comment);
      setPostedReview({
        rating,
        comment,
        userImage: "/placeholder-user.jpg", // Placeholder; update with actual user image source
      });
      alert(response.message); // "Feedback added and rating updated"
    } catch (err: any) {
      console.error(`Failed to post review for apartment ${apartmentId}:`, err);
      alert(`Failed to post review: ${err.message || "Please try again."}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center text-black">
        Loading bookings...
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
        {/* Header Section: Title and Filter Cards */}
        <h1 className="text-[24px] font-normal text-[#111827] mb-4">My Bookings</h1>
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveFilter("active")}
            className={`w-[156px] h-[44px] rounded-lg border px-[19px] py-[11px] text-base font-normal transition-colors ${
              activeFilter === "active"
                ? "bg-black text-white border-black"
                : "bg-white text-[#4b5563] border-gray-300 hover:bg-gray-50"
            }`}
          >
            Active Bookings
          </button>
          <button
            onClick={() => setActiveFilter("history")}
            className={`w-[156px] h-[44px] rounded-lg border px-[19px] py-[11px] text-base font-normal transition-colors ${
              activeFilter === "history"
                ? "bg-black text-white border-black"
                : "bg-white text-[#4b5563] border-gray-300 hover:bg-gray-50"
            }`}
          >
            Booking History
          </button>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg p-6 shadow-md text-center text-gray-600">
            {activeFilter === "active" ? "You have no active bookings yet." : "You have no booking history yet."}
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const apartmentImage = "/placeholder.svg?height=150&width=200&text=Apartment";
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow-md flex flex-col lg:flex-row lg:items-stretch gap-0 lg:gap-6 lg:min-h-[200px]"
                >
                  {/* Mobile Layout */}
                  <div className="lg:hidden">
                    {/* Image with Confirmed badge */}
                    <div className="relative w-full h-[200px] rounded-t-lg overflow-hidden">
                      <Image
                        src={apartmentImage}
                        alt={booking.apartmentName}
                        width={800}
                        height={800}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-4 right-4 w-[104px] h-[36px] rounded-lg bg-green-100 text-[#00a699] px-[10px] py-[7px] text-sm font-medium flex items-center justify-center">
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                    </div>

                    {/* Mobile Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h2 className="text-xl font-normal text-[#111827]">{booking.apartmentName}</h2>
                          <p className="text-base text-[#4b5566] flex items-center gap-1 mt-1">
                            <MapPinIcon className="w-4 h-4 text-[#111827]" />
                            {booking.apartmentLocation}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRebook(booking.id)}
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
                          {activeFilter === "history" && (
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleRateStay(booking.id)}>
                              <span className="text-sm text-[#111827] font-normal">Rate Your Stay</span>
                              <ChevronDownIcon className="w-4 h-4 text-[#4b5566]" />
                            </div>
                          )}
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
                            <div>
                              <span className="text-sm font-medium text-[#4b5566] block">Total Paid</span>
                              <div className="flex flex-col">
                                <span className="text-sm text-black font-bold">{booking.totalPrice.toLocaleString()}</span>
                                <span className="text-xs text-[#6b7280]">
                                  for {booking.nights} {booking.nights === 1 ? "night" : "nights"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleViewDetails(booking.id)}
                          className="flex-1 h-[50px] rounded-lg border border-gray-300 px-4 py-3 text-sm font-normal text-[#212121] bg-[#d1d5db]/30 hover:bg-gray-50 transition-colors flex items-center justify-center"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="flex-1 h-[50px] rounded-lg border border-gray-300 px-4 py-3 text-sm font-normal text-[#212121] bg-[#d1d5db]/30 hover:bg-red-50 transition-colors flex items-center justify-center"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Large Screen Layout */}
                  <div className="hidden lg:flex lg:items-stretch w-full">
                    <div className="flex-shrink-0 w-[300px] h-auto relative rounded-l-lg overflow-hidden">
                      <Image
                        src={apartmentImage}
                        alt={booking.apartmentName}
                        width={800}
                        height={800}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="flex-grow grid grid-cols-[2fr_1fr] gap-4 w-full p-6">
                      <div className="flex flex-col justify-between">
                        <h2 className="text-xl font-normal text-[#111827]">{booking.apartmentName}</h2>
                        <p className="text-base text-[#4b5566] flex items-center gap-1 mt-1">
                          <MapPinIcon className="w-4 h-4 text-[#111827]" />
                          {booking.apartmentLocation}
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
                          {activeFilter === "history" && (
                            <div className="mt-3 flex items-center gap-2 cursor-pointer" onClick={() => handleRateStay(booking.id)}>
                              <span className="text-sm text-[#111827] font-normal">Rate Your Stay</span>
                              <ChevronDownIcon className="w-4 h-4 text-[#4b5566]" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                          <button
                            onClick={() => handleViewDetails(booking.id)}
                            className="w-[141px] h-[50px] rounded-lg border border-gray-300 px-[18px] py-[12px] text-base font-normal text-[#212121] bg-[#d1d5db]/30 hover:bg-gray-50 transition-colors flex items-center justify-center whitespace-nowrap"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
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
                      <div className="text-sm mt-8 flex items-center gap-2">
                        <UsersIcon className="w-5 h-5 text-[#4b5566]" />
                        <div>
                          <span className="font-normal text-[#4b5566] block">Guests</span>
                          <span className="text-[#374151] block">{booking.guests} Guests</span>
                        </div>
                      </div>
                      <div className="text-sm text-[#4b5566]">
                        <div className="flex items-center gap-2 text-black font-bold">
                          <span className="text-xl">₦</span>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-[#4b5566]">Total Paid</span>
                            <div className="flex items-center gap-2">
                              <span className="text-base">{booking.totalPrice.toLocaleString()}</span>
                              <span className="text-sm font-medium text-[#6b7280]">
                                for {booking.nights} {booking.nights === 1 ? "night" : "nights"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRebook(booking.id)}
                        className="w-[141px] h-[50px] rounded-lg bg-black text-white px-[18px] py-[12px] text-base font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
                      >
                        Rebook
                      </button>
                    </div>
                  </div>

                  {/* Review Modal */}
                  {showReviewModal === booking.id && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div
                        className="bg-white rounded-[20px] p-4 w-[1006px] h-[395px] flex flex-col gap-[17px]"
                        style={{ opacity: 1 }}
                      >
                        <div className="flex justify-between items-center">
                          <h2 className="text-xl font-normal text-[#111827]">Rating</h2>
                          <button
                            onClick={() => setShowReviewModal(null)}
                            className="text-[#4b5566] hover:text-black"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className={`w-6 h-6 cursor-pointer ${
                                star <= rating ? "text-[#FFD700]" : "text-gray-300"
                              }`}
                              fill={star <= rating ? "#FFD700" : "none"}
                              onClick={() => setRating(star)}
                            />
                          ))}
                        </div>
                        <div className="text-base font-normal text-[#111827]">Your Review</div>
                        <textarea
                          placeholder="Share your experience"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="w-full h-[120px] p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black resize-none"
                        />
                        <div className="flex items-center">
                          <button
                            onClick={() => handlePostReview(booking.apartmentId)}
                            className="w-[150px] h-[50px] rounded-lg bg-black text-white px-4 py-3 text-base font-normal hover:bg-gray-800 transition-colors"
                          >
                            Post Review
                          </button>
                        </div>
                        {postedReview && (
                          <div className="flex items-start gap-3">
                            <Image
                              src={postedReview.userImage}
                              alt="User"
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <StarIcon
                                    key={star}
                                    className={`w-5 h-5 ${
                                      star <= postedReview.rating ? "text-[#FFD700]" : "text-gray-300"
                                    }`}
                                    fill={star <= postedReview.rating ? "#FFD700" : "none"}
                                  />
                                ))}
                              </div>
                              <p className="text-sm text-[#374151] mt-2">{postedReview.comment}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}