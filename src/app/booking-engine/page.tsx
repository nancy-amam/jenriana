'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { format, differenceInDays } from 'date-fns';
import { MapPin, Wallet, Banknote, Lock } from 'lucide-react';
import { getApartmentById, initiateCheckout, verifyPayment } from '@/services/api-services';
import ApartmentLoadingPage from '@/components/loading';

interface Addon {
  _id: string;
  name: string;
  price: number;
  pricingType: 'perNight' | 'oneTime';
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
  specialRequest?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

type PaymentMethod = 'card' | 'bank-transfer';

function BookingEngineContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('bookingId');
  const passedImage = searchParams.get('image');
  const verify = searchParams.get('verify'); // Check for verification flag
  const reference = searchParams.get('reference'); // Paystack reference

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    // Handle payment verification
    if (verify === 'true' && reference && bookingId) {
      const verifyPaymentAndRedirect = async () => {
        try {
          const response = await verifyPayment(reference, bookingId);
          if (response.message === 'Payment successful, booking confirmed') {
            alert('Payment successful! Your booking is confirmed.');
            router.push('/'); // Redirect to homepage
          } else {
            setError('Payment verification failed. Please contact support.');
            setLoading(false);
          }
        } catch (err: any) {
          console.error('BookingEnginePage: Payment verification failed:', err);
          setError('Failed to verify payment. Please try again or contact support.');
          setLoading(false);
        }
      };
      verifyPaymentAndRedirect();
      return;
    }

    // Existing booking fetch logic
    if (!bookingId) {
      setError('No booking selected.');
      setLoading(false);
      return;
    }
    try {
      const storedBooking = localStorage.getItem(`booking_${bookingId}`);
      if (!storedBooking) {
        setError('Booking data not found.');
        setLoading(false);
        return;
      }
      const parsedBooking = JSON.parse(storedBooking);
      setBooking(parsedBooking);

      // Fetch apartment gallery
      const fetchApartment = async () => {
        try {
          const response = await getApartmentById(parsedBooking.apartmentId);
          const gallery = response.data.apartment.gallery || [];
          setGalleryImages(
            gallery.length >= 3
              ? gallery.slice(0, 3)
              : passedImage
                ? [decodeURIComponent(passedImage), decodeURIComponent(passedImage), decodeURIComponent(passedImage)]
                : ['/images/image18.png', '/images/image19.png', '/images/image20.png']
          );
        } catch (err: any) {
          console.error('BookingEnginePage: Failed to fetch apartment gallery:', err);
          setGalleryImages(
            passedImage
              ? [decodeURIComponent(passedImage), decodeURIComponent(passedImage), decodeURIComponent(passedImage)]
              : ['/images/placeholder1.jpg', '/images/placeholder2.jpg', '/images/placeholder3.jpg']
          );
        }
        setLoading(false);
      };
      fetchApartment();
    } catch (err: any) {
      console.error('BookingEnginePage: Failed to load booking data:', err);
      setError('Failed to load booking details.');
      setLoading(false);
    }
  }, [bookingId, passedImage, verify, reference]);

  const handleConfirmAndPay = async () => {
    if (!booking) return;
    try {
      const response = await initiateCheckout(booking._id, paymentMethod);
      if (paymentMethod === 'bank-transfer') {
        alert(
          `Please transfer ₦${booking.totalAmount.toLocaleString()} to:\n` +
          `Bank Name: ${response.bankDetails.bankName}\n` +
          `Account Name: ${response.bankDetails.accountName}\n` +
          `Account Number: ${response.bankDetails.accountNumber}\n\n` +
          `${response.bankDetails.note}`
        );
        router.push('/'); // Redirect to homepage after bank transfer
      } else {
        window.location.href = response.payment.authorization_url;
      }
    } catch (err: any) {
      console.error('BookingEnginePage: Failed to initiate checkout:', err);
      alert(`Failed to initiate payment: ${err.message || 'Please try again later.'}`);
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
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold">
        {error || 'Invalid booking information. Please go back and try again.'}
      </div>
    );
  }

  const nights = differenceInDays(new Date(booking.checkOutDate), new Date(booking.checkInDate));
  const formattedCheckIn = format(new Date(booking.checkInDate), 'MMM d, yyyy');
  const formattedCheckOut = format(new Date(booking.checkOutDate), 'MMM d, yyyy');

  return (
    <div className="bg-[#f1f1f1] py-12 px-4 md:px-16">
      <div className="max-w-[1550px] mx-auto grid grid-cols-1 md:grid-cols-[757px_minmax(0,1fr)] md:gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          {/* Apartment Info Card */}
          <div className="bg-white rounded-lg p-6 shadow-md w-full">
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <h2 className="order-2 sm:order-1 text-2xl font-normal text-[#111827]">
                {booking.apartmentName}
              </h2>
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
              ₦{((booking.totalAmount - booking.serviceCharge - booking.tax - booking.addons.reduce((sum, a) => sum + a.total, 0)) / nights).toLocaleString(undefined, { maximumFractionDigits: 0 })}
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
                <p>{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</p>
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
                    ₦{((booking.totalAmount - booking.serviceCharge - booking.tax - booking.addons.reduce((sum, a) => sum + a.total, 0)) / nights).toLocaleString(undefined, { maximumFractionDigits: 0 })} x {nights} night(s)
                  </span>
                  <span>₦{(booking.totalAmount - booking.serviceCharge - booking.tax - booking.addons.reduce((sum, a) => sum + a.total, 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#4b5566] text-sm">
                  <span>Service Fee</span>
                  <span>₦{booking.serviceCharge.toLocaleString()}</span>
                </div>
                {booking.addons.map((addon) => (
                  <div key={addon._id} className="flex justify-between text-[#4b5566] text-sm">
                    <span>{addon.name} ({addon.pricingType === 'perNight' ? 'Per night' : 'One-time'})</span>
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
        <div className="bg-white rounded-lg p-6 shadow-md w-full md:max-h-[550px] mt-4 md:mt-0">
          <h2 className="text-xl md:text-2xl font-normal text-[#111827] mb-2">Payment Details</h2>
          <p className="text-[#4b5566] mb-2">Payment Method</p>
          <div className="space-y-4 mb-6 font-normal">
            <label className="flex items-center gap-3 w-full px-4 py-2 border border-gray-300 rounded-[8px] cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="form-radio text-black h-4 w-4"
              />
              <Wallet className="w-5 h-5 text-gray-700" />
              <span className="text-base font-normal text-[#111827]">Credit/Debit Card</span>
            </label>
            <label className="flex items-center gap-3 w-full px-4 py-2 border border-gray-300 rounded-[8px] cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="bank-transfer"
                checked={paymentMethod === 'bank-transfer'}
                onChange={() => setPaymentMethod('bank-transfer')}
                className="form-radio text-black h-4 w-4"
              />
              <Banknote className="w-5 h-5 text-gray-700" />
              <span className="text-base font-normal text-[#111827]">Bank Transfer</span>
            </label>
          </div>
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-normal text-[#374151] mb-1">
                  Card Number
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  placeholder="XXXX XXXX XXXX XXXX"
                  className="w-full px-4 py-2 rounded-[8px] border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-black"
                  disabled
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-normal text-[#374151] mb-1">
                    Expiry Date
                  </label>
                  <input
                    id="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 rounded-[8px] border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-black"
                    disabled
                  />
                </div>
                <div>
                  <label htmlFor="cvc" className="block text-sm font-normal text-[#374151] mb-1">
                    CVC
                  </label>
                  <input
                    id="cvc"
                    type="text"
                    placeholder="XXX"
                    className="w-full px-4 py-2 rounded-[8px] border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-black"
                    disabled
                  />
                </div>
              </div>
            </div>
          )}
          {paymentMethod === 'bank-transfer' && (
            <div className="text-[#4b5566] space-y-2">
              <p>Please transfer the total amount to the following bank account:</p>
              <p className="font-semibold">Bank Name: Jenrianna Bank</p>
              <p className="font-semibold">Account Name: Jenrianna Apartments</p>
              <p className="font-semibold">Account Number: 1234567890</p>
              <p className="text-sm text-[#4b5566]">Your booking will be confirmed upon receipt of payment.</p>
            </div>
          )}
          <button
            onClick={handleConfirmAndPay}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors mt-8"
          >
            Confirm and Pay ₦{booking.totalAmount.toLocaleString()}
          </button>
          <p className="text-sm text-[#4b5566] text-center  mt-2">
            {paymentMethod === 'card'
              ? 'You will be redirected to Paystack to complete your payment.'
              : 'Please complete the bank transfer to confirm your booking.'}
          </p>
          <div className="text-xs text-[#4b5566] mt-2 flex items-center justify-center gap-1">
            <Lock className="w-4 h-4" />
            <p>Your payment information is secure and encrypted</p>
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