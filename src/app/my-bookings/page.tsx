"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPinIcon, UsersIcon, CalendarDays, CalendarCheck, ChevronDown, StarIcon } from "lucide-react";
import { differenceInDays } from "date-fns";
import { getActiveBookings, getBookingHistory, postApartmentComment, cancelBooking } from "@/services/api-services";
import ApartmentLoadingPage from "@/components/loading";

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

interface Review {
  rating: number;
  comment: string;
  userImage: string;
}

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeFilter, setActiveFilter] = useState<"active" | "history">("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<string | null>(null);
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [postedReview, setPostedReview] = useState<Review | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);

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
    alert(`Viewing details for booking: ${bookingId}`);
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
    // Navigate to the apartment page
    router.push(`/apartments/${apartmentId}`);
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
        userImage: "/images/user.png",
      });
      alert(response.message);
    } catch (err: any) {
      console.error(`Failed to post review for apartment ${apartmentId}:`, err);
      alert(`Failed to post review: ${err.message || "Please try again."}`);
    }
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
        {/* Header Section: Title and Filter Cards */}
        <h1 className="text-[24px] font-normal text-[#111827] mb-4">My Bookings</h1>
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveFilter("active")}
            className={` rounded-lg border px-4 py-4 text-base font-normal transition-colors ${
              activeFilter === "active"
                ? "bg-black text-white border-black"
                : "bg-white text-[#4b5563] border-gray-300 hover:bg-gray-50"
            }`}
          >
            Active Bookings
          </button>
          <button
            onClick={() => setActiveFilter("history")}
            className={` rounded-lg border px-4 py-4 text-base font-normal transition-colors ${
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
              // Use the first gallery image or fallback to default
              const apartmentImage = booking.apartmentData.gallery?.[0] || '/images/image20.png';
              
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow-md flex flex-col lg:flex-row lg:items-stretch gap-0 lg:gap-6 lg:min-h-[200px]"
                >
                  {/* Mobile Layout */}
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
                          onClick={() => handleRebook(booking.apartmentId)}
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
                           <div className="flex items-center" onClick={() => handleRateStay(booking.id)}>
  {/* your other content here */}
  <ChevronDown className="w-6 h-6 " />
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
                          <div className="mt-3" onClick={() => handleRateStay(booking.id)}>
                            <span className="text-base text-[#111827] font-normal">Rate Your Stay</span>
                          </div>
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
                                <div className="flex items-center" onClick={() => handleRateStay(booking.id)}>
  {/* your other content here */}
  <ChevronDown className="w-6 h-6 " />
</div>

                      </div>
                         
                      <button
                        onClick={() => handleRebook(booking.apartmentId)}
                        className="w-[141px] h-[50px] rounded-lg bg-black text-white px-[18px] py-[12px] text-base font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
                      >
                        Rebook
                      </button>
                    </div>
                  </div>

                  {/* Review Modal */}
                  {showReviewModal === booking.id && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-[20px] p-6 w-[500px] max-h-[600px] flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <h2 className="text-xl font-normal text-[#111827]">Rating</h2>
                          <button
                            onClick={() => setShowReviewModal(null)}
                            className="text-[#4b5566] hover:text-black text-xl"
                          >
                            ✕
                          </button>
                        </div>
                        
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className={`w-8 h-8 cursor-pointer ${
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
                        
                        <button
                          onClick={() => handlePostReview(booking.apartmentId)}
                          className="w-[150px] h-[50px] rounded-lg bg-black text-white px-4 py-3 text-base font-normal hover:bg-gray-800 transition-colors"
                        >
                          Post Review
                        </button>
                        
                        {postedReview && (
                          <div className="flex items-start gap-3 mt-4 p-4 bg-gray-50 rounded-lg">
                            <div className="relative w-10 h-10">
                              <Image
                                src="/images/user.png"
                                alt={postedReview.userImage}
                                fill
                                className="rounded-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-[#111827]">Your Review</span>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIcon
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= postedReview.rating ? "text-[#FFD700]" : "text-gray-300"
                                      }`}
                                      fill={star <= postedReview.rating ? "#FFD700" : "none"}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-[#374151]">{postedReview.comment}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cancellation Modal for Confirmed Bookings */}
                  {showCancelModal === booking.id && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-[20px] p-6 w-[480px] max-w-full flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <h2 className="text-xl font-semibold text-[#111827]">Cancel Booking</h2>
                          <button
                            onClick={() => setShowCancelModal(null)}
                            className="text-[#4b5566] hover:text-black text-xl"
                          >
                            ✕
                          </button>
                        </div>
                        
                        <div className="text-base text-[#374151] leading-relaxed">
                          <p className="mb-4">
                            Are you sure you want to cancel this booking?
                          </p>
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <p className="text-sm text-[#8B5A00] mb-2 font-medium">
                              Important Notice:
                            </p>
                            <p className="text-sm text-[#8B5A00] mb-2">
                              • Please contact support to discuss refund options before canceling
                            </p>
                            <p className="text-sm text-[#8B5A00]">
                              • A cancellation fee applies
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <button
                            onClick={() => setShowCancelModal(null)}
                            className="flex-1 h-[50px] rounded-lg border border-gray-300 px-4 py-3 text-base font-normal text-[#374151] bg-white hover:bg-gray-50 transition-colors"
                          >
                            Keep Booking
                          </button>
                          <button
                            onClick={() => handleConfirmCancel(booking.id)}
                            className="flex-1 h-[50px] rounded-lg bg-red-600 text-white px-4 py-3 text-base font-medium hover:bg-red-700 transition-colors"
                          >
                            Cancel Anyway
                          </button>
                        </div>
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