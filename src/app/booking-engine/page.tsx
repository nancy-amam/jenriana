'use client'

import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import { format, addDays } from "date-fns"
import { BedIcon, BathIcon } from 'lucide-react'
import { detailedApartments, services } from "@/lib/dummy-data" // Import dummy data

type PaymentMethod = 'card' | 'bank-transfer';

export default function BookingEnginePage() {
  const searchParams = useSearchParams()
  const apartmentId = searchParams.get("apartmentId")
  const nights = Number(searchParams.get("nights"))
  const guests = Number(searchParams.get("guests"))
  const price = Number(searchParams.get("price"))
  const selectedServicesParam = searchParams.get("selectedServices")
  const initialSelectedServices = selectedServicesParam ? selectedServicesParam.split(',') : [];

  console.log("BookingEnginePage: Received URL parameters:");
  console.log("  apartmentId:", apartmentId);
  console.log("  nights:", nights, "isNaN(nights):", isNaN(nights));
  console.log("  guests:", guests, "isNaN(guests):", isNaN(guests));
  console.log("  price:", price, "isNaN(price):", isNaN(price));
  console.log("  selectedServicesParam:", selectedServicesParam);
  console.log("  initialSelectedServices:", initialSelectedServices);

  const apartment = detailedApartments.find((apt) => apt.id === apartmentId)
  console.log("BookingEnginePage: Found apartment:", apartment);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  if (!apartment || isNaN(nights) || isNaN(guests) || isNaN(price)) {
    console.error("BookingEnginePage: Displaying 'Invalid booking information' due to missing/invalid parameters.");
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold">
        Invalid booking information. Please go back and select an apartment.
      </div>
    )
  }

  const totalCost = price * nights
  const serviceFee = 5000
  const taxes = 0.075 * totalCost

  const selectedServicesTotal = initialSelectedServices.reduce((sum, serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return sum + (service ? service.price : 0);
  }, 0);

  const grandTotal = totalCost + serviceFee + taxes + selectedServicesTotal;

  const checkInDate = new Date() // In a real app, this would come from searchParams
  const checkOutDate = addDays(checkInDate, nights)
  const formattedCheckIn = format(checkInDate, "MMM d, yyyy")
  const formattedCheckOut = format(checkOutDate, "MMM d, yyyy")

  const handleConfirmAndPay = () => {
    alert(`Confirming booking for ${apartment.name} with total ₦${grandTotal.toLocaleString()} via ${paymentMethod}.`);
    // Here you would integrate with your payment gateway
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 md:px-16">
      <div className="max-w-[1550px] mx-auto grid grid-cols-1 md:grid-cols-[757px_minmax(0,1fr)] md:gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          {/* Apartment Info Card */}
          <div className="bg-white rounded-lg p-6 shadow-md w-full md:h-[264px]">
            <h2 className="text-2xl font-semibold text-[#111827] mb-2">{apartment.name}</h2>
            <p className="text-base text-gray-600 mb-4">{apartment.location}</p>
            <p className="text-xl font-bold text-[#111827] mb-4">
              ₦{apartment.price.toLocaleString()}<span className="text-sm font-normal text-gray-500">/night</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {apartment.galleryImages.slice(0, 3).map((img) => (
                <Image
                  key={img.id}
                  src={img.src || "/placeholder.svg"}
                  alt={img.alt}
                  width={120}
                  height={80}
                  className="rounded-md object-cover flex-shrink-0"
                />
              ))}
              {apartment.galleryImages.length > 3 && (
                <Image
                  src={apartment.galleryImages[3].src || "/placeholder.svg"}
                  alt={apartment.galleryImages[3].alt}
                  width={120}
                  height={80}
                  className="rounded-md object-cover flex-shrink-0 ml-auto" // "one small image of it to the right"
                />
              )}
            </div>
          </div>

          {/* Booking Details Card */}
          <div className="bg-white rounded-lg p-6 shadow-md w-full md:h-[460px]">
            <h2 className="text-2xl font-semibold text-[#111827] mb-4">Booking Details</h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Check-in:</span>
                <span>{formattedCheckIn}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Check-out:</span>
                <span>{formattedCheckOut}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Number of Guests:</span>
                <span>{guests}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <h3 className="text-lg font-semibold text-[#111827]">Booking Summary</h3>
                <div className="flex justify-between text-sm">
                  <span>₦{price.toLocaleString()} x {nights} night(s)</span>
                  <span>₦{totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service Fee</span>
                  <span>₦{serviceFee.toLocaleString()}</span>
                </div>
                {initialSelectedServices.map((serviceId) => {
                  const service = services.find(s => s.id === serviceId);
                  return service ? (
                    <div key={service.id} className="flex justify-between text-sm">
                      <span>{service.name}</span>
                      <span>₦{service.price.toLocaleString()}</span>
                    </div>
                  ) : null;
                })}
                <div className="flex justify-between text-sm">
                  <span>Taxes (7.5%)</span>
                  <span>₦{taxes.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-[#111827] border-t border-gray-300 pt-2">
                  <span>Grand Total</span>
                  <span>₦{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Details Card */}
        <div className="bg-white rounded-lg p-6 shadow-md w-full md:h-[460px] mt-4 md:mt-0">
          <h2 className="text-2xl font-semibold text-[#111827] mb-4">Payment Details</h2>

          <div className="space-y-4 mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="form-radio text-black h-4 w-4"
              />
              <span className="text-lg text-gray-800">Card</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="bank-transfer"
                checked={paymentMethod === 'bank-transfer'}
                onChange={() => setPaymentMethod('bank-transfer')}
                className="form-radio text-black h-4 w-4"
              />
              <span className="text-lg text-gray-800">Bank Transfer</span>
            </label>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  placeholder="XXXX XXXX XXXX XXXX"
                  className="w-full px-4 py-2 rounded border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    id="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 rounded border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <input
                    id="cvc"
                    type="text"
                    placeholder="XXX"
                    className="w-full px-4 py-2 rounded border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  id="cardholderName"
                  type="text"
                  placeholder="Name on card"
                  className="w-full px-4 py-2 rounded border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'bank-transfer' && (
            <div className="text-gray-700 space-y-2">
              <p>Please transfer the total amount to the following bank account:</p>
              <p className="font-semibold">Bank Name: Jenrianna Bank</p>
              <p className="font-semibold">Account Name: Jenrianna Apartments</p>
              <p className="font-semibold">Account Number: 1234567890</p>
              <p className="text-sm text-gray-500">Your booking will be confirmed upon receipt of payment.</p>
            </div>
          )}

          <button
            onClick={handleConfirmAndPay}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors text-lg font-medium mt-8"
          >
            Confirm and Pay ₦{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </button>
        </div>
      </div>
    </div>
  )
}
