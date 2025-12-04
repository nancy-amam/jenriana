"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { format, differenceInDays } from "date-fns";
import { MapPin, Wallet, Banknote, Lock, Loader2 } from "lucide-react";
import { getApartmentById, initiateCheckout } from "@/services/api-services";
import ApartmentLoadingPage from "@/components/loading";

interface Addon {
  _id: string;
  name: string;
  price: number;
  pricingType: "perNight" | "oneTime";
  total: number;
}

interface Booking {
  _id: string;
  userId: string;
  apartmentId: string;
  apartmentName: string;
  apartmentLocation: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  addons: Addon[];
  serviceCharge: number;
  tax: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  residentialAddress: string;
  specialRequest?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type PaymentMethod = "card" | "bank-transfer";

function BookingEngineContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");
  const passedImage = searchParams.get("image");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const cleanupOldBookings = () => {
    const ONE_HOUR = 60 * 60 * 1000;
    const now = Date.now();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("booking_") && !key.includes("_payment_")) {
        try {
          const bookingData = localStorage.getItem(key);
          if (bookingData) {
            const booking = JSON.parse(bookingData);
            const bookingTime = new Date(booking.createdAt).getTime();
            const bookingId = booking._id;
            const paymentInProgress = localStorage.getItem(`booking_${bookingId}_payment_in_progress`);

            if (now - bookingTime > ONE_HOUR && !paymentInProgress) {
              localStorage.removeItem(key);
              localStorage.removeItem(`booking_${bookingId}_payment_method`);
              localStorage.removeItem(`booking_${bookingId}_payment_in_progress`);
              console.log(`Cleaned up old booking: ${key}`);
            }
          }
        } catch (error) {
          localStorage.removeItem(key);
        }
      }
    }
  };

  const checkCurrentBookingExpiry = useCallback(() => {
    if (!booking || isProcessingPayment) return;

    const ONE_HOUR = 60 * 60 * 1000;
    const now = Date.now();
    const bookingTime = new Date(booking.createdAt).getTime();

    const paymentInProgress = localStorage.getItem(`booking_${booking._id}_payment_in_progress`);
    if (now - bookingTime > ONE_HOUR && !paymentInProgress) {
      localStorage.removeItem(`booking_${bookingId}`);
      localStorage.removeItem(`booking_${booking._id}_payment_method`);
      localStorage.removeItem(`booking_${booking._id}_payment_in_progress`);
      setError("This booking session has expired. Please create a new booking.");
      setBooking(null);
    }
  }, [booking, isProcessingPayment, bookingId]);

  useEffect(() => {
    cleanupOldBookings();

    if (!bookingId) {
      setError("No booking selected.");
      setLoading(false);
      return;
    }

    try {
      const storedBooking = localStorage.getItem(`booking_${bookingId}`);
      if (!storedBooking) {
        setError("Booking data not found.");
        setLoading(false);
        return;
      }
      const parsedBooking = JSON.parse(storedBooking);
      setBooking(parsedBooking);

      const fetchApartment = async () => {
        try {
          const response = await getApartmentById(parsedBooking.apartmentId);
          const gallery = response.data.gallery || [];

          if (gallery.length >= 3) {
            setGalleryImages(gallery.slice(0, 3));
          } else if (gallery.length > 0) {
            const images = [...gallery];
            while (images.length < 3) {
              images.push(passedImage ? decodeURIComponent(passedImage) : "/images/placeholder.jpg");
            }
            setGalleryImages(images.slice(0, 3));
          } else if (passedImage) {
            setGalleryImages([
              decodeURIComponent(passedImage),
              decodeURIComponent(passedImage),
              decodeURIComponent(passedImage),
            ]);
          } else {
            setGalleryImages(["/images/image18.png", "/images/image19.png", "/images/image20.png"]);
          }
        } catch (err: any) {
          console.error("BookingEnginePage: Failed to fetch apartment gallery:", err);
          if (passedImage) {
            setGalleryImages([
              decodeURIComponent(passedImage),
              decodeURIComponent(passedImage),
              decodeURIComponent(passedImage),
            ]);
          } else {
            setGalleryImages(["/images/placeholder1.jpg", "/images/placeholder2.jpg", "/images/placeholder3.jpg"]);
          }
        }
        setLoading(false);
      };
      fetchApartment();
    } catch (err: any) {
      console.error("BookingEnginePage: Failed to load booking data:", err);
      setError("Failed to load booking details.");
      setLoading(false);
    }
  }, [bookingId, passedImage]);

  // Periodic expiry check - runs every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      checkCurrentBookingExpiry();
    }, 5 * 60 * 1000);

    // Also check immediately when component mounts (after booking is loaded)
    if (booking) {
      checkCurrentBookingExpiry();
    }

    return () => clearInterval(interval);
  }, [booking, checkCurrentBookingExpiry]);

  const clearBookingFromLocalStorage = () => {
    if (bookingId) {
      localStorage.removeItem(`booking_${bookingId}`);
      localStorage.removeItem(`booking_${bookingId}_payment_method`);
      localStorage.removeItem(`booking_${bookingId}_payment_in_progress`);
    }
  };

  // Cleanup on page unload - Updated to respect payment in progress
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Don't clear if payment is in progress
      if (!isProcessingPayment && bookingId) {
        const currentTime = Date.now();
        const bookingData = localStorage.getItem(`booking_${bookingId}`);
        const paymentInProgress = localStorage.getItem(`booking_${bookingId}_payment_in_progress`);

        if (bookingData && !paymentInProgress) {
          try {
            const booking = JSON.parse(bookingData);
            const bookingTime = new Date(booking.createdAt).getTime();
            const FIFTEEN_MINUTES = 15 * 60 * 1000;

            // If booking is older than 15 minutes, clear it
            if (currentTime - bookingTime > FIFTEEN_MINUTES) {
              localStorage.removeItem(`booking_${bookingId}`);
              localStorage.removeItem(`booking_${bookingId}_payment_method`);
              localStorage.removeItem(`booking_${bookingId}_payment_in_progress`);
            }
          } catch (error) {
            // If parsing fails, remove the corrupted data
            localStorage.removeItem(`booking_${bookingId}`);
            localStorage.removeItem(`booking_${bookingId}_payment_method`);
            localStorage.removeItem(`booking_${bookingId}_payment_in_progress`);
          }
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [bookingId, isProcessingPayment]);

  const handleConfirmAndPay = async () => {
    if (!booking) return;

    setIsProcessingPayment(true);

    try {
      const response = await initiateCheckout(booking._id, paymentMethod);

      // Mark booking as "payment in progress" to prevent cleanup
      localStorage.setItem(`booking_${booking._id}_payment_in_progress`, "true");
      localStorage.setItem(`booking_${booking._id}_payment_method`, paymentMethod);

      window.location.href = response.payment.authorization_url;

      // if (paymentMethod === 'bank-transfer') {
      //   alert(
      //     `Please transfer ₦${booking.totalAmount.toLocaleString()} to:\n` +
      //     `Bank Name: ${response.bankDetails.bankName}\n` +
      //     `Account Name: ${response.bankDetails.accountName}\n` +
      //     `Account Number: ${response.bankDetails.accountNumber}\n\n` +
      //     `${response.bankDetails.note}`
      //   );

      //   // Only clear localStorage for bank transfer since it's completed
      //   clearBookingFromLocalStorage();
      //   router.push('/payment-success');
      // } else {
      //   // For card payments, redirect to Paystack but keep booking data
      //   window.location.href = response.payment.authorization_url;
      // }
    } catch (err: any) {
      console.error("BookingEnginePage: Failed to initiate checkout:", err);
      alert(`Failed to initiate payment: ${err.message || "Please try again later."}`);
      // Remove payment in progress flag on error
      if (booking) {
        localStorage.removeItem(`booking_${booking._id}_payment_in_progress`);
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black">
        <ApartmentLoadingPage />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "Your booking session may have expired or been cancelled."}</p>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/")}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start New Booking
            </button>

            <button
              onClick={() => router.back()}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            If you were making a payment and it was cancelled, please start a new booking.
          </p>
        </div>
      </div>
    );
  }

  const nights = differenceInDays(new Date(booking.checkOutDate), new Date(booking.checkInDate));
  const formattedCheckIn = format(new Date(booking.checkInDate), "MMM d, yyyy");
  const formattedCheckOut = format(new Date(booking.checkOutDate), "MMM d, yyyy");

  return (
    <div className="bg-[#f1f1f1] py-12 px-4 md:px-16">
      <div className="max-w-[1550px] mx-auto grid grid-cols-1 md:grid-cols-[757px_minmax(0,1fr)] md:gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-lg p-6 shadow-md w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <h2 className="order-2 sm:order-1 text-2xl font-normal text-[#111827]">{booking.apartmentName}</h2>
              {passedImage && (
                <div className="order-1 sm:order-2 mb-8 sm:mb-10 sm:ml-4 overflow-x-auto flex gap-2 sm:block sm:overflow-visible">
                  <Image
                    src={decodeURIComponent(passedImage)}
                    alt={booking.apartmentName}
                    width={200}
                    height={100}
                    className="rounded-md object-cover flex-shrink-0"
                    unoptimized
                  />
                </div>
              )}
            </div>
            <p className="flex items-center text-base text-[#4b5566] md:-mt-20">
              <MapPin className="w-4 h-4 mr-1 text-[#4b5566]" />
              {booking.apartmentLocation}
            </p>
            <p className="text-[24px] md:text-[30px] font-normal text-[#111827] mb-4">
              ₦
              {(
                (booking.totalAmount -
                  booking.serviceCharge -
                  booking.tax -
                  booking.addons.reduce((sum, a) => sum + a.total, 0)) /
                nights
              ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              <span className="text-sm font-normal text-[#6b7280]">/night</span>
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {galleryImages.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt={`${booking.apartmentName} ${index + 1}`}
                  width={100}
                  height={60}
                  className="rounded-md object-cover flex-shrink-0"
                  unoptimized
                />
              ))}
            </div>
          </div>
          {/* Booking Confirmation Summary */}
          <div className="bg-white rounded-lg p-6 shadow-md w-full">
            <h2 className="text-[20px] font-normal text-[#111827] mb-4">Booking Confirmation</h2>
            <div className="space-y-4 text-[#374151]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-normal text-[#374151]">Check-in</p>
                  <p>{formattedCheckIn}</p>
                </div>
                <div>
                  <p className="text-sm font-normal text-[#374151]">Check-out</p>
                  <p>{formattedCheckOut}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-normal text-[#374151]">Guests</p>
                <p>
                  {booking.guests} Guest{booking.guests > 1 ? "s" : ""}
                </p>
              </div>
              <div>
                <p className="text-sm font-normal text-[#374151]">Customer Name</p>
                <p>{booking.customerName}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-[#374151]">Email</p>
                <p>{booking.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-[#374151]">Phone</p>
                <p>{booking.customerPhone}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-[#374151]">Residential Address</p>
                <p>{booking.residentialAddress}</p>
              </div>
              {booking.specialRequest && (
                <div>
                  <p className="text-sm font-normal text-[#374151]">Special Request</p>
                  <p>{booking.specialRequest}</p>
                </div>
              )}
              <div className="pt-4 mt-4 space-y-2">
                <h3 className="text-lg font-normal text-[#111827]">Booking Summary</h3>
                <div className="flex justify-between text-sm">
                  <span>
                    ₦
                    {(
                      (booking.totalAmount -
                        booking.serviceCharge -
                        booking.tax -
                        booking.addons.reduce((sum, a) => sum + a.total, 0)) /
                      nights
                    ).toLocaleString(undefined, { maximumFractionDigits: 0 })}{" "}
                    x {nights} night(s)
                  </span>
                  <span>
                    ₦
                    {(
                      booking.totalAmount -
                      booking.serviceCharge -
                      booking.tax -
                      booking.addons.reduce((sum, a) => sum + a.total, 0)
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#4b5566] text-sm">
                  <span>Service Fee</span>
                  <span>₦{booking.serviceCharge.toLocaleString()}</span>
                </div>
                {booking.addons.map((addon) => (
                  <div key={addon._id} className="flex justify-between text-[#4b5566] text-sm">
                    <span>
                      {addon.name} ({addon.pricingType === "perNight" ? "Per night" : "One-time"})
                    </span>
                    <span>₦{addon.total.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between text-[#4b5566] text-sm">
                  <span>Taxes (7.5%)</span>
                  <span>₦{booking.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-[#111827] border-t border-gray-300 pt-2">
                  <span>Total</span>
                  <span>₦{booking.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Column: Payment Details Card */}
        <div className="wrap">
          <div className="bg-white rounded-lg p-6 shadow-md w-full md:max-h-auto mt-4 md:mt-0">
            <h2 className="text-xl md:text-2xl font-normal text-[#111827] mb-2">Checkout Payment</h2>
            <p className="text-sm text-[#4b5566]">
              You’ll be prompted to make your payment on Paystack using either bank transfer or card.
            </p>

            <div className="wrap mt-10">
              <label className="text-sm text-black/70 mb-2">Coupon/Promo Code </label>
              <input
                type="text"
                className="border-black/10 border rounded-sm w-full p-3 outline-0 ring-0"
                placeholder="Enter coupon or promo code"
              />
            </div>

            <button
              onClick={handleConfirmAndPay}
              disabled={isProcessingPayment}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors mt-8 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                `Confirm and Pay ₦${booking.totalAmount.toLocaleString()}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingEnginePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-white">
          <ApartmentLoadingPage />
        </div>
      }
    >
      <BookingEngineContent />
    </Suspense>
  );
}
