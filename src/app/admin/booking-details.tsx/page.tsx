'use client';

import Image from 'next/image';
import { UsersIcon, MailIcon, PhoneIcon, MapPin, HomeIcon, Check, X } from 'lucide-react';

export default function BookingDetailsPage() {
  // Dummy data
  const booking = {
    guest: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+234 123 4567',
      address: '123 Lagos Street, Nigeria',
    },
    apartment: {
      name: 'Ocean View Apartment',
      location: 'Lekki, Lagos',
      image: '/apartment.jpg',
      guests: 3,
      totalPrice: 150000,
      pricePerNight: 50000,
    },
  };

  return (
    <div className="max-w-[1090px] mx-auto px-4 py-6 space-y-8">
      {/* Guest Info */}
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Guest Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#374151]">
          <p><span className="font-medium">Name:</span> {booking.guest.name}</p>
          <p className="flex items-center gap-2">
            <MailIcon className="w-4 h-4" />
            {booking.guest.email}
          </p>
          <p className="flex items-center gap-2">
            <PhoneIcon className="w-4 h-4" />
            {booking.guest.phone}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {booking.guest.address}
          </p>
        </div>
      </div>

      {/* Apartment Booking Info */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Apartment Booking Details</h2>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Image */}
          <div className="w-full lg:w-[250px] h-[200px] relative rounded-lg overflow-hidden">
            <Image
              src={booking.apartment.image}
              alt={booking.apartment.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-3 text-sm text-[#374151]">
            <p className="text-base font-medium text-black">{booking.apartment.name}</p>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {booking.apartment.location}</p>
            <p className="flex items-center gap-2"><UsersIcon className="w-4 h-4" /> {booking.apartment.guests} guests</p>
            <p className="flex items-center gap-2 font-medium">
              ₦{booking.apartment.totalPrice.toLocaleString()}
              <span className="text-sm font-normal text-gray-600 ml-2">(₦{booking.apartment.pricePerNight.toLocaleString()} per night)</span>
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                <Check className="w-4 h-4" /> Confirm
              </button>
              <button className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm">
                <X className="w-4 h-4" /> Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
