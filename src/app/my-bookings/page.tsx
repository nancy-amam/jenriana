'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MapPinIcon, UsersIcon, CalendarDays, CalendarCheck } from 'lucide-react';
import { detailedApartments } from '@/lib/dummy-data'; // To get apartment images

interface Booking {
  id: string;
  apartmentId: string;
  apartmentName: string;
  apartmentLocation: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: number;
  totalPrice: number;
  selectedServices: { id: string; name: string; price: number }[];
  paymentMethod: 'card' | 'bank-transfer';
  bookingDate: string;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeFilter, setActiveFilter] = useState<'active' | 'history'>('active'); // State for filter

  useEffect(() => {
    // In a real application, you would fetch this from a database
    // For now, we're using localStorage as a simple client-side persistence
    const stored = localStorage.getItem('myBookings');
    if (stored) {
      setBookings(JSON.parse(stored));
    }
  }, []);

  // Filter bookings based on activeFilter (simple logic for demonstration)
  const filteredBookings = bookings.filter(booking => {
    const checkOut = new Date(booking.checkOutDate);
    const now = new Date();
    if (activeFilter === 'active') {
      return checkOut >= now;
    } else { // 'history'
      return checkOut < now;
    }
  });

  const handleViewDetails = (bookingId: string) => {
    alert(`Viewing details for booking: ${bookingId}`);
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm(`Are you sure you want to cancel booking ${bookingId}?`)) {
      // Simulate cancellation by removing from local storage
      const updatedBookings = bookings.filter(b => b.id !== bookingId);
      setBookings(updatedBookings);
      localStorage.setItem('myBookings', JSON.stringify(updatedBookings));
      alert(`Booking ${bookingId} cancelled.`);
      // In a real app, you'd send a request to your backend to cancel
    }
  };

  const handleRebook = (bookingId: string) => {
    alert(`Rebooking for booking: ${bookingId}`);
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] py-12 px-4 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        {/* Header Section: Title and Filter Cards */}
        <h1 className="text-[24px] font-normal text-[#111827] mb-4">My Bookings</h1>
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveFilter('active')}
            className={`w-[156px] h-[44px] rounded-lg border px-[19px] py-[11px] text-base font-normal transition-colors ${
              activeFilter === 'active'
                ? 'bg-black text-white border-black'
                : 'bg-white text-[#4b5563] border-gray-300 hover:bg-gray-50'
            }`}
          >
            Active Bookings
          </button>
          <button
            onClick={() => setActiveFilter('history')}
            className={`w-[156px] h-[44px] rounded-lg border px-[19px] py-[11px] text-base font-normal transition-colors ${
              activeFilter === 'history'
                ? 'bg-black text-white border-black'
                : 'bg-white text-[#4b5563] border-gray-300 hover:bg-gray-50'
            }`}
          >
            Booking History
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg p-6 shadow-md text-center text-gray-600">
            {activeFilter === 'active' ? 'You have no active bookings yet.' : 'You have no booking history yet.'}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const apartmentImage = detailedApartments.find(apt => apt.id === booking.apartmentId)?.galleryImages[0]?.src;
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
                        src={apartmentImage || "/placeholder.svg?height=150&width=200&text=Apartment"}
                        alt={booking.apartmentName}
                        width={800}
                        height={800}
                        className="object-cover w-full h-full"
                      />
                      {/* Confirmed badge - top right */}
                      <div className="absolute top-4 right-4 w-[104px] h-[36px] rounded-lg bg-green-100 text-[#00a699] px-[10px] py-[7px] text-sm font-medium flex items-center justify-center">
                        Confirmed
                      </div>
                    </div>

                    {/* Mobile Content */}
                    <div className="p-4">
                      {/* Row 1: Apartment name + Rebook button */}
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

                      {/* Row 2: Two columns - Check-in/out & Booked on | Guests & Total */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Left Column: Dates */}
                        <div className="space-y-3">
                          {/* Check-in/Check-out */}
                          <div className="flex items-start gap-2">
                            <CalendarDays className="w-4 h-4 text-[#4b5566] mt-0.5" />
                            <div>
                              <span className="font-normal text-[#111827] text-sm block">Check-in – Check-out:</span>
                              <p className="text-sm text-[#4b5566] mt-1">
                                {new Date(booking.checkInDate).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}{' '}
                                –{' '}
                                {new Date(booking.checkOutDate).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>

                          {/* Booked On */}
                          <div className="flex items-start gap-2">
                            <CalendarCheck className="w-4 h-4 text-[#111827] mt-0.5" />
                            <div>
                              <span className="text-sm text-[#111827] font-normal block">Booked on</span>
                              <p className="text-sm text-[#4b5566] mt-1">
                                {new Date(booking.bookingDate).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Guests & Total */}
                        <div className="space-y-3">
                          {/* Guests */}
                          <div className="flex items-start gap-2">
                            <UsersIcon className="w-4 h-4 text-[#4b5566] mt-0.5" />
                            <div>
                              <span className="font-normal text-[#4b5566] text-sm block">Guests</span>
                              <span className="text-sm text-[#374151] block">{booking.guests} Guests</span>
                            </div>
                          </div>

                          {/* Total Paid */}
                          <div className="flex items-start gap-2">
                            <span className="text-lg text-black font-bold mt-0.5">₦</span>
                            <div>
                              <span className="text-sm font-medium text-[#4b5566] block">Total Paid</span>
                              <div className="flex flex-col">
                                <span className="text-sm text-black font-bold">{booking.totalPrice.toLocaleString()}</span>
                                <span className="text-xs text-[#6b7280]">for {booking.nights} {booking.nights === 1 ? 'night' : 'nights'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Row 3: Action Buttons */}
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

                  {/* Large Screen Layout (unchanged) */}
                  <div className="hidden lg:flex lg:items-stretch w-full">
                    {/* Left: Image */}
                    <div className="flex-shrink-0 w-[300px] h-auto relative rounded-l-lg overflow-hidden">
                      <Image
                        src={apartmentImage || "/placeholder.svg?height=150&width=200&text=Apartment"}
                        alt={booking.apartmentName}
                        width={800}
                        height={800}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* Middle Columns */}
                    <div className="flex-grow grid grid-cols-[2fr_1fr] gap-4 w-full p-6">
                      {/* Column 1: Apartment Details & Dates */}
                      <div className="flex flex-col justify-between">
                        <h2 className="text-xl font-normal text-[#111827]">{booking.apartmentName}</h2>
                        <p className="text-base text-[#4b5566] flex items-center gap-1 mt-1">
                          <MapPinIcon className="w-4 h-4 text-[#111827]" />
                          {booking.apartmentLocation}
                        </p>                        
                        <div className="text-sm text-[#374151] mt-2">
                          {/* Dates Range */}
                          <div className="flex items-start gap-2">
                            <CalendarDays className="w-4 h-4 text-[#4b5566] mt-0.5" />
                            <div>
                              <span className="font-normal text-[#111827] mb-2">Check-in – Check-out:</span>
                              <p className=' mt-1'>
                                {new Date(booking.checkInDate).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}{' '}
                                –{' '}
                                {new Date(booking.checkOutDate).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>

                          {/* Booked On */}
                          <div className="mt-3">
                            <div className="flex items-center gap-2 text-sm text-[#111827] font-normal">
                              <CalendarCheck className="w-4 h-4" />
                              <span>Booked on</span>
                            </div>
                            <p className="text-sm text-[#4b5566] mt-1 ml-5">
                              {new Date(booking.bookingDate).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons (moved here) */}
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

                    {/* Far Right Column: Summary and Rebook */}
                    <div className="flex flex-col justify-between h-full lg:h-[150px] w-full lg:w-auto lg:min-w-[200px] mt-4 lg:mt-0 p-6 gap-4">
                      {/* Confirmed badge */}
                      <div className="w-[104px] h-[36px] rounded-lg bg-green-100 text-[#00a699] px-[10px] py-[7px] text-sm font-medium flex items-center justify-center">
                        Confirmed
                      </div>

                      {/* Guests label + icon + value */}
                      <div className=" text-sm mt-8 flex items-center gap-2">
                        <UsersIcon className="w-5 h-5 text-[#4b5566]" />
                        <div>
                          <span className="font-normal text-[#4b5566] block">Guests</span>
                          <span className="text-[#374151] block">{booking.guests} Guests</span>
                        </div>
                      </div>

                      {/* Total paid */}
                      <div className="text-sm text-[#4b5566]">
                        <div className="flex items-center gap-2 text-black font-bold">
                          {/* Single ₦ icon */}
                          <span className="text-xl">₦</span>

                          {/* Text content */}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-[#4b5566]">Total Paid</span>
                            <div className="flex items-center gap-2">
                              <span className="text-base">{booking.totalPrice.toLocaleString()}</span>
                              <span className="text-sm font-medium text-[#6b7280]">for {booking.nights} {booking.nights === 1 ? 'night' : 'nights'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rebook button */}
                      <button
                        onClick={() => handleRebook(booking.id)}
                        className="w-[141px] h-[50px] rounded-lg bg-black text-white px-[18px] py-[12px] text-base font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
                      >
                        Rebook
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}