'use client'

import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { useState } from "react" 
import { format, addDays, differenceInDays } from "date-fns"
import { BedIcon, BathIcon, MapPin, Wallet, Banknote, Lock } from 'lucide-react' 
import { useRouter } from "next/navigation"

import { detailedApartments, services } from "@/lib/dummy-data" 

type PaymentMethod = 'card' | 'bank-transfer';

export default function BookingEnginePage() {
  const searchParams = useSearchParams()
  const apartmentId = searchParams.get("apartmentId")
  const initialNights = Number(searchParams.get("nights"))
  const initialGuests = Number(searchParams.get("guests"))
  const price = Number(searchParams.get("price"))
  const selectedServicesParam = searchParams.get("selectedServices")
  const initialSelectedServices = selectedServicesParam ? selectedServicesParam.split(',') : [];
  const router = useRouter();

  const apartment = detailedApartments.find((apt) => apt.id === apartmentId)

  // Initialize dates as strings for native input type="date"
  const initialCheckInDate = format(new Date(), "yyyy-MM-dd");
  const initialCheckOutDate = format(addDays(new Date(), initialNights || 1), "yyyy-MM-dd");

  const [checkInDate, setCheckInDate] = useState<string>(initialCheckInDate)
  const [checkOutDate, setCheckOutDate] = useState<string>(initialCheckOutDate)
  const [numGuests, setNumGuests] = useState<number>(initialGuests || 1)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  // Calculate nights dynamically based on selected dates (parsing strings to Date objects)
  const nights = checkInDate && checkOutDate
    ? differenceInDays(new Date(checkOutDate), new Date(checkInDate))
    : (initialNights || 1);

  // Recalculate totals whenever relevant states change
  const totalCost = price * nights
  const serviceFee = 5000
  const taxes = 0.075 * totalCost
  const selectedServicesTotal = initialSelectedServices.reduce((sum, serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return sum + (service ? service.price : 0);
  }, 0);
  const grandTotal = totalCost + serviceFee + taxes + selectedServicesTotal;

  if (!apartment || isNaN(initialNights) || isNaN(initialGuests) || isNaN(price)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold">
        Invalid booking information. Please go back and select an apartment.
      </div>
    )
  }


const handleConfirmAndPay = () => {
  const booking = {
    id: Date.now().toString(),
    apartmentId: apartment.id,
    apartmentName: apartment.name,
    apartmentLocation: apartment.location,
    checkInDate,
    checkOutDate,
    nights,
    guests: numGuests,
    totalPrice: grandTotal,
    selectedServices: initialSelectedServices.map((serviceId) => {
  const service = services.find((s) => s.id === serviceId);
  return service ? {
    id: service.id,
    name: service.name,
    price: service.price
  } : null;
}).filter(Boolean) as { id: string; name: string; price: number }[],

    paymentMethod,
    bookingDate: new Date().toISOString(),
  };

  const existingBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
  localStorage.setItem('myBookings', JSON.stringify([booking, ...existingBookings]));

  // ✅ Navigate to My Bookings immediately (no alert)
  router.push('/my-bookings');
};



  return (
    <div className=" bg-[#f1f1f1] py-12 px-4 md:px-16">
      <div className="max-w-[1550px] mx-auto grid grid-cols-1 md:grid-cols-[757px_minmax(0,1fr)] md:gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          {/* Apartment Info Card */}
            <div className="bg-white rounded-lg p-6 shadow-md w-full">
  <div className="flex flex-col sm:flex-row sm:justify-between">
    
    {/* Image gallery (Top on mobile, right on larger screens) */}
    <div className="order-1 sm:order-2 mb-8 sm:mb-10 sm:ml-4 overflow-x-auto flex gap-2 sm:block sm:overflow-visible">
  {apartment.galleryImages.slice(0, 4).map((img) => (
    <Image
      key={img.id}
      src={img.src || "/placeholder.svg"}
      alt={img.alt}
      width={200} // Larger width so only 1 fits in mobile viewport
      height={100}
      className="rounded-md object-cover flex-shrink-0"
    />
  ))}
</div>


    {/* Apartment name */}
    <h2 className="order-2 sm:order-1 text-2xl font-normal text-[#111827]">{apartment.name}</h2>
  </div>

  <p className="flex items-center text-base text-[#4b5566] md:-mt-20">
    <MapPin className="w-4 h-4 mr-1 text-[#4b5566]" />
    {apartment.location}
  </p>

  <p className="text-[30px] font-normal text-[#111827]">
    ₦{apartment.price.toLocaleString()}
    <span className="text-sm font-normal text-[#6b7280]">/night</span>
  </p>
</div>

          {/* Booking Details Card */}
          <div className="bg-white rounded-lg p-6 shadow-md w-full md:max-h-[450px]">
            <h2 className="text-[20px] font-normal text-[#111827] mb-4">Booking Details</h2>
            <div className="space-y-4 text-[#374151]">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="check-in-date" className="font-normal text-sm text-[#374151] mb-1">Check-in:</label>
                  <input
                    id="check-in-date"
                    type="date"
                    className="w-full px-4 py-2 rounded border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-black"
                    onChange={(e) => setCheckInDate(e.target.value)}
                    value={checkInDate}
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="check-out-date" className="font-medium text-sm text-[#374151] mb-1">Check-out:</label>
                  <input
                    id="check-out-date"
                    type="date"
                    className="w-full px-4 py-2 rounded border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-black"
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    value={checkOutDate}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="guests" className="font-normal text-sm text-[#374151] mb-1">Number of Guests:</label>
                <select
                  id="guests"
                  className="w-full px-4 py-2 rounded border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-black"
                  value={numGuests}
                  onChange={(e) => setNumGuests(Number(e.target.value))}
                >
                  <option value="">Select guests</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} Guest{i + 1 > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className=" pt-4 mt-4 space-y-2">
                <h3 className="text-lg font-normal text-[#111827]">Booking Summary</h3>
                <div className="flex justify-between text-sm">
                  <span>₦{price.toLocaleString()} x {nights} night(s)</span>
                  <span>₦{totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#4b5566] text-sm">
                  <span>Service Fee</span>
                  <span>₦{serviceFee.toLocaleString()}</span>
                </div>
                {initialSelectedServices.map((serviceId) => {
                  const service = services.find(s => s.id === serviceId);
                  return service ? (
                    <div key={service.id} className="flex justify-between text-[#4b5566] text-sm">
                      <span>{service.name}</span>
                      <span>₦{service.price.toLocaleString()}</span>
                    </div>
                  ) : null;
                })}
                <div className="flex justify-between text-[#4b5566] text-sm">
                  <span>Taxes (7.5%)</span>
                  <span>₦{taxes.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-[#111827] border-t border-gray-300 pt-2">
                  <span>Total</span>
                  <span>₦{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Column: Payment Details Card */}
        <div className="bg-white rounded-lg p-6 shadow-md w-full md:max-h-[480px] mt-4 md:mt-0">
          <h2 className="text-2xl font-normal text-[#111827] mb-2">Payment Details</h2>
          <p className=" text-[#4b5566] mb-2">Payment Method</p>
<div className="space-y-4 mb-6 font-normal">
  {/* Card Payment Option */}
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

  {/* Bank Transfer Option */}
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
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors text-lg font-medium mt-8"
          >
            Confirm and Pay ₦{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </button>
          <div className="text-xs text-[#4b5566] mt-2 flex items-center gap-1">
  <Lock className="w-4 h-4" />
  <p>Your payment information is secure and encrypted</p>
</div>
        </div>
      </div>
    </div>
  )
}
