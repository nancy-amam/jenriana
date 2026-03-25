"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { format, differenceInDays } from "date-fns";
import { MapPin, Loader2, Calendar, Users, User, Mail, Phone, Home, MessageSquare } from "lucide-react";
import { getApartmentById, initiateCheckout, validateCoupon } from "@/services/api-services";
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
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountedTotal, setDiscountedTotal] = useState<number | null>(null);

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
      const response = await initiateCheckout(booking._id, paymentMethod, appliedCoupon?._id);

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
      <div className="min-h-screen flex items-center justify-center bg-black text-zinc-100">
        <ApartmentLoadingPage />
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError(null);

    try {
      // const res = await fetch("/api/coupon/validate", {
      //   method: "POST",
      //   body: JSON.stringify({ code: couponInput }),
      //   headers: { "Content-Type": "application/json" },
      // });

      // const data = await res.json();
      // if (!res.ok) {
      //   setCouponError(data.message || "Invalid coupon");
      //   setAppliedCoupon(null);
      //   setDiscountedTotal(null);
      //   return;
      // }

      const data = await validateCoupon(couponInput);

      setAppliedCoupon(data.coupon);

      const discountAmount = (booking!.totalAmount * data.coupon.discount) / 100;
      setDiscountedTotal(booking!.totalAmount - discountAmount);
    } catch (error: any) {
      console.log(error);
      setCouponError("Something went wrong.");
      setCouponError("Invalid coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4 text-zinc-100">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/90 p-8 text-center shadow-xl">
          <div className="text-5xl mb-4">😔</div>
          <h1 className="text-2xl font-semibold mb-3 text-white">Booking Not Found</h1>
          <p className="text-zinc-400 mb-8">{error || "Your booking session may have expired or been cancelled."}</p>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/")}
              className="w-full rounded-lg bg-white py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              Start New Booking
            </button>

            <button
              onClick={() => router.back()}
              className="w-full rounded-lg border border-white/15 bg-transparent py-3 text-sm font-medium text-zinc-200 transition hover:bg-white/5"
            >
              Go Back
            </button>
          </div>

          <p className="mt-6 text-xs text-zinc-500">
            If you were making a payment and it was cancelled, please start a new booking.
          </p>
        </div>
      </div>
    );
  }

  const nights = Math.max(
    1,
    differenceInDays(new Date(booking.checkOutDate), new Date(booking.checkInDate))
  );
  const formattedCheckIn = format(new Date(booking.checkInDate), "MMM d, yyyy");
  const formattedCheckOut = format(new Date(booking.checkOutDate), "MMM d, yyyy");
  const formattedCheckInIso = format(new Date(booking.checkInDate), "yyyy-MM-dd");
  const formattedCheckOutIso = format(new Date(booking.checkOutDate), "yyyy-MM-dd");

  const roomSubtotal =
    booking.totalAmount -
    booking.serviceCharge -
    booking.tax -
    booking.addons.reduce((sum, a) => sum + a.total, 0);
  const pricePerNightDisplay = roomSubtotal / nights;

  const summaryRow = "flex justify-between gap-4 text-sm";
  const labelMuted = "text-xs uppercase tracking-wide text-zinc-500";

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="border-b border-white/10 px-4 py-10 md:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-luxury-gold)]">
          Step 2 of 2
        </p>
        <h1 className="mt-2 text-3xl text-white md:text-4xl">Review your booking</h1>
        <p className="mt-2 max-w-2xl text-zinc-400">
          Confirm everything you entered on the previous step matches what you want before paying. This page is a
          read-only summary of your stay and contact details.
        </p>
      </div>

      <div className="mx-auto grid max-w-[1550px] grid-cols-1 gap-8 px-4 py-10 md:grid-cols-[1fr_minmax(300px,420px)] md:gap-10 md:px-12 md:py-12">
        <div className="flex flex-col gap-6">
          {/* Property + gallery */}
          <section className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 md:p-8">
            <p className={labelMuted}>Property</p>
            <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-normal text-white">{booking.apartmentName}</h2>
                <p className="mt-2 flex items-center gap-2 text-zinc-400">
                  <MapPin className="h-4 w-4 shrink-0 text-zinc-500" />
                  {booking.apartmentLocation}
                </p>
                <p className="mt-4 text-2xl text-white md:text-3xl">
                  ₦{pricePerNightDisplay.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  <span className="text-sm font-normal text-zinc-500"> / night</span>
                </p>
              </div>
              {passedImage && (
                <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl border border-white/10 sm:h-32 sm:w-44">
                  <Image
                    src={decodeURIComponent(passedImage)}
                    alt={booking.apartmentName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
              {galleryImages.map((img, index) => (
                <div key={index} className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-white/10">
                  <Image src={img} alt={`${booking.apartmentName} ${index + 1}`} fill className="object-cover" unoptimized />
                </div>
              ))}
            </div>
          </section>

          {/* What you entered — stay */}
          <section className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 md:p-8">
            <h2 className="text-lg font-medium text-white">Your stay</h2>
            <p className="mt-1 text-sm text-zinc-500">Dates and guest count from your booking request</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="flex gap-3 rounded-xl border border-white/5 bg-black/30 p-4">
                <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-luxury-gold)]" />
                <div>
                  <p className={labelMuted}>Check-in</p>
                  <p className="mt-1 text-white">{formattedCheckIn}</p>
                  <p className="mt-1 text-xs text-zinc-500">{formattedCheckInIso}</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-xl border border-white/5 bg-black/30 p-4">
                <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-luxury-gold)]" />
                <div>
                  <p className={labelMuted}>Check-out</p>
                  <p className="mt-1 text-white">{formattedCheckOut}</p>
                  <p className="mt-1 text-xs text-zinc-500">{formattedCheckOutIso}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-3 rounded-xl border border-white/5 bg-black/30 p-4">
              <Users className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-luxury-gold)]" />
              <div>
                <p className={labelMuted}>Guests</p>
                <p className="mt-1 text-white">
                  {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </section>

          {/* What you entered — contact */}
          <section className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 md:p-8">
            <h2 className="text-lg font-medium text-white">Your details</h2>
            <p className="mt-1 text-sm text-zinc-500">Contact information you submitted at checkout</p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex gap-3">
                <User className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                <div>
                  <p className={labelMuted}>Full name</p>
                  <p className="mt-0.5 text-zinc-200">{booking.customerName}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                <div>
                  <p className={labelMuted}>Email</p>
                  <p className="mt-0.5 text-zinc-200">{booking.customerEmail}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                <div>
                  <p className={labelMuted}>Phone</p>
                  <p className="mt-0.5 text-zinc-200">{booking.customerPhone}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Home className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                <div>
                  <p className={labelMuted}>Residential address</p>
                  <p className="mt-0.5 text-zinc-200">{booking.residentialAddress}</p>
                </div>
              </li>
              {booking.specialRequest ? (
                <li className="flex gap-3">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                  <div>
                    <p className={labelMuted}>Special request</p>
                    <p className="mt-0.5 text-zinc-200">{booking.specialRequest}</p>
                  </div>
                </li>
              ) : null}
            </ul>
          </section>

          {/* Price breakdown */}
          <section className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 md:p-8">
            <h2 className="text-lg font-medium text-white">Price breakdown</h2>
            <p className="mt-1 text-sm text-zinc-500">Based on your selected nights and add-ons</p>
            <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
              <div className={summaryRow}>
                <span className="text-zinc-400">
                  ₦{pricePerNightDisplay.toLocaleString(undefined, { maximumFractionDigits: 0 })} × {nights} night
                  {nights !== 1 ? "s" : ""}
                </span>
                <span className="text-zinc-200">₦{roomSubtotal.toLocaleString()}</span>
              </div>
              <div className={summaryRow}>
                <span className="text-zinc-400">Service fee</span>
                <span className="text-zinc-200">₦{booking.serviceCharge.toLocaleString()}</span>
              </div>
              {booking.addons.map((addon) => (
                <div key={addon._id} className={summaryRow}>
                  <span className="text-zinc-400">
                    {addon.name} ({addon.pricingType === "perNight" ? "per night" : "one-time"})
                  </span>
                  <span className="text-zinc-200">₦{addon.total.toLocaleString()}</span>
                </div>
              ))}
              <div className={summaryRow}>
                <span className="text-zinc-400">Taxes (7.5%)</span>
                <span className="text-zinc-200">₦{booking.tax.toLocaleString()}</span>
              </div>
              <div className={`${summaryRow} border-t border-white/10 pt-4 text-base font-semibold text-white`}>
                <span>Total due</span>
                <span>₦{(discountedTotal ?? booking.totalAmount).toLocaleString()}</span>
              </div>
            </div>
          </section>
        </div>

        <aside className="md:sticky md:top-24 md:self-start">
          <div className="rounded-2xl border border-[color:var(--color-luxury-gold)]/30 bg-zinc-900/90 p-6 shadow-xl md:p-8">
            <h2 className="text-xl font-medium text-white">Payment</h2>
            <p className="mt-2 text-sm text-zinc-400">
              You’ll complete payment securely via Paystack (card or bank transfer).
            </p>

            <div className="mt-8">
              <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">Coupon / promo code</label>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[color:var(--color-luxury-gold)]/50"
                  placeholder="Enter code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                  className="shrink-0 rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:opacity-50"
                >
                  {couponLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Apply"}
                </button>
              </div>
              {couponError && <p className="mt-2 text-sm text-red-400">{couponError}</p>}
              {appliedCoupon && (
                <p className="mt-2 text-sm text-emerald-400/90">Coupon applied — {appliedCoupon.discount}% off</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleConfirmAndPay}
              disabled={isProcessingPayment}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3.5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing…
                </>
              ) : (
                `Pay ₦${(discountedTotal ?? booking.totalAmount).toLocaleString()}`
              )}
            </button>
            <p className="mt-4 text-center text-xs text-zinc-500">
              By paying, you agree to the total shown above and our booking terms.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function BookingEnginePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black text-zinc-100">
          <ApartmentLoadingPage />
        </div>
      }
    >
      <BookingEngineContent />
    </Suspense>
  );
}
