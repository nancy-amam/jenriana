'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  BathIcon,
  BedIcon,
  MapPinIcon,
  UsersIcon,
  StarIcon,
  AirVent,
  Wifi,
  Utensils,
  Tv,
  Laptop,
  Dumbbell,
  ParkingSquare,
  ShieldCheck,
  Ban,
  Baby,
  Info,
  Battery,
} from 'lucide-react';
import { Apartment } from '@/lib/interface';
import DateInput from "@/components/date-inputs";

export default function ApartmentDetails({ apartment }: { apartment: Apartment }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      alert('Please select both check-in and check-out dates.');
      return;
    }
    const nights = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24);
    if (nights <= 0) {
      alert('Check-out date must be after check-in date.');
      return;
    }
    if (!guests || guests <= 0 || guests > apartment.maxGuests) {
      alert(`Please select a valid number of guests (max ${apartment.maxGuests}).`);
      return;
    }
    const price = apartment.pricePerNight;
    if (isNaN(price)) {
      alert('Invalid apartment price.');
      return;
    }

      const image = encodeURIComponent(apartment.imageUrl || '/placeholder.svg');

     const apartmentId = apartment.id 

if (!apartmentId) {
  console.error("Cannot navigate to checkout: apartment ID is missing", apartment);
} else {
  router.push(
    `/checkout?apartmentId=${apartmentId}&nights=${nights}&guests=${guests}&price=${price}&checkIn=${checkIn}&checkOut=${checkOut}&image=${encodeURIComponent(image)}`
  );
}

  };

  // Map API features to icons and names, aligned with AddEditApartmentModal
  const featureMapping = {
    wifi: { name: 'WiFi', icon: Wifi },
    parking: { name: 'Parking', icon: ParkingSquare },
    gym: { name: 'Gym', icon: Dumbbell },
    ac: { name: 'Air Conditioning', icon: AirVent },
    kitchen: { name: 'Kitchen', icon: Utensils },
    tv: { name: 'Smart TV', icon: Tv },
    washing: { name: 'Washing Machine', icon: Laptop },
    security: { name: '24/7 Security', icon: ShieldCheck },
    'air-conditioning': { name: 'Air Conditioning', icon: AirVent },
    'smart-tv': { name: 'Smart TV', icon: Tv },
    'washing-machine': { name: 'Washing Machine', icon: Laptop },
    '24-7-security': { name: '24/7 Security', icon: ShieldCheck },
    generator: { name: 'Backup Generator', icon: Battery },
  };

  // Map API rules to icons and names
  const ruleMapping = {
    'no-smoking': { name: 'No smoking', icon: Ban, color: 'text-red-500' },
    'no-parties': { name: 'No parties or events', icon: Ban, color: 'text-yellow-500' },
    'pets-allowed': { name: 'Pets allowed', icon: Baby, color: 'text-green-500' },
    'children-allowed': { name: 'Children allowed', icon: Baby, color: 'text-green-500' },
    'do-not-exceed-guest-count': { name: 'Do not exceed booked guests count', icon: UsersIcon, color: 'text-blue-500' },
    'max-guests-enforced': { name: 'Do not exceed booked guests count', icon: UsersIcon, color: 'text-blue-500' },
    'check-in-3pm-11pm': { name: 'Check-in time: 3:00PM – 11:00PM', icon: Info, color: 'text-purple-500' },
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Background Image Section */}
      <div className="relative w-full h-[841px] mb-6 md:mb-0">
        <Image
          src={apartment.imageUrl || '/placeholder.svg'}
          alt={apartment.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-10 left-0 right-0 text-white px-4 md:px-10">
          <div className="w-full md:max-w-[60%] mb-5">
            <h1 className="text-4xl md:text-[48px] mt-5 font-normal">{apartment.name}</h1>
            <p className="text-lg md:text-[20px] mt-2">{apartment.location}</p>
            <div className="flex mt-2 items-center gap-2 text-sm">
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-[#d1d5db]">{apartment.averageRating} (views)</span>
            </div>
            <div className="text-2xl md:text-[30px] mt-2 font-normal">
              ₦{apartment.pricePerNight.toLocaleString()}<span className="text-sm"> / night</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Card */}
     <div className="relative z-10 mx-auto px-4 md:px-0 w-full md:absolute md:top-[460px] md:right-10 md:max-w-[460px]">
  <div className="bg-[#f1f1f1] text-[#1e1e1e] md:rounded-xl p-6 w-full md:border md:border-gray-200 md:shadow-md">
    {/* Price */}
    <div className="flex mb-2 justify-center items-center mx-auto">
      <p className="text-[28px] md:text-[36px] text-[#111827] font-bold">
        ₦{apartment.pricePerNight.toLocaleString()}{" "}
        <span className="text-sm mb-5 text-gray-500">/ night</span>
      </p>
    </div>

    {/* Dates */}
    <div className="flex gap-1 mb-2 text-[#1e1e1e]">
      <div className="w-1/2 ">
        <DateInput
          id="check-in"
          label="Check In"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
         
        />
      </div>

      <div className="w-1/2 ">
        <DateInput
          id="check-out"
          label="Check Out"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>
    </div>

    {/* Guests */}
    <label className="mb-2 text-base text-[#1e1e1e]">Guests</label>
    <select
      className="border border-[#ffffff]  px-4 py-3 rounded-xl md:border-none bg-white w-full cursor-pointer"
      value={guests}
      onChange={(e) => setGuests(Number(e.target.value))}
    >
      <option value="">Select guests</option>
      {[...Array(apartment.maxGuests)].map((_, i) => (
        <option key={i + 1} value={i + 1}>
          {i + 1} Guest{i > 0 ? "s" : ""}
        </option>
      ))}
    </select>

    {/* Button */}
    <button
      onClick={handleBooking}
      className="mt-4 bg-black text-white w-full rounded-md py-2 hover:bg-gray-800 transition cursor-pointer "
    >
      Book Now
    </button>
    <p className="text-xs text-[#6b7280] mt-2 text-center">
      No stress. No pressure. Cancel anytime.
    </p>
  </div>
</div>


      <div className="relative z-0">
        {/* Small Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 mb-5 gap-8 p-6 text-[#111827] px-10 max-w-[1400px] mx-auto">
          <div className="border border-gray-200 rounded-[12px] p-4 flex flex-col items-center">
            <UsersIcon className="w-5 h-5 mb-1 text-[#111827]" />
            <span className="text-sm font-medium">{apartment.maxGuests} Guests</span>
          </div>
          <div className="border border-gray-200 rounded-[12px] p-4 flex flex-col items-center">
            <BedIcon className="w-5 h-5 mb-1 text-[#111827]" />
            <span className="text-sm font-medium">{apartment.beds} Beds</span>
          </div>
          <div className="border border-gray-200 rounded-[12px] p-4 flex flex-col items-center">
            <BathIcon className="w-5 h-5 mb-1 text-[#111827]" />
            <span className="text-sm font-medium">{apartment.baths} Baths</span>
          </div>
          <div className="border border-gray-200 rounded-[12px] p-4 flex flex-col items-center">
            <MapPinIcon className="w-5 h-5 mb-1 text-[#111827]" />
            <span className="text-sm font-medium">{apartment.location}</span>
          </div>
        </div>

        {/* Apartment Gallery */}
        <div className="px-6 max-w-[1400px] mx-auto mb-10">
          <h2 className="text-2xl md:text-[36px] font-normal text-[#111827] mb-4">Apartment Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {apartment.gallery && apartment.gallery.length > 0 ? (
              <>
                <div className="md:col-span-2">
                  <Image
                    src={apartment.gallery[0] || '/placeholder.svg'}
                    alt={`${apartment.name} main image`}
                    width={700}
                    height={500}
                    className="w-full h-full object-cover rounded-xl  "
                  />
                </div>
                <div className="flex flex-col gap-4">
                  {apartment.gallery.slice(1).map((img, index) => (
                    <Image
                      key={index}
                      src={img || '/placeholder.svg'}
                      alt={`${apartment.name} image ${index + 2}`}
                      width={250}
                      height={190}
                      className="w-full h-auto object-cover rounded-xl"
                    />
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500">No images available.</p>
            )}
          </div>
        </div>

        {/* What This Apartment Offers */}
        <div className="max-w-[1400] mx-auto px-4 mb-10">
          <h2 className="text-2xl md:text-[36px] font-normal text-[#111827] text-left mb-6">What This Apartment Offers</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(apartment.features || []).map((feature) => {
              const featureData = featureMapping[feature as keyof typeof featureMapping];
              if (!featureData) {
                console.warn(`Feature not mapped: ${feature}`);
                return null;
              }
              const { name, icon: IconComponent } = featureData;
              const getColor = (featureId: string) => {
                switch (featureId) {
                  case 'wifi':
                    return 'text-green-500';
                  case 'parking':
                    return 'text-teal-500';
                  case 'gym':
                    return 'text-green-500';
                  case 'ac':
                  case 'air-conditioning':
                    return 'text-blue-500';
                  case 'kitchen':
                    return 'text-orange-500';
                  case 'tv':
                  case 'smart-tv':
                    return 'text-red-500';
                  case 'washing':
                  case 'washing-machine':
                    return 'text-purple-500';
                  case 'security':
                  case '24-7-security':
                    return 'text-indigo-500';
                  case 'generator':
                    return 'text-yellow-500';
                  default:
                    return 'text-gray-500';
                }
              };
              const colorClass = getColor(feature);
              return (
                <div
                  key={feature}
                  className="w-full h-[108px] border border-gray-200 rounded-[12px] p-6 flex flex-col items-center justify-center gap-2 text-center"
                >
                  {IconComponent && <IconComponent size={28} className={colorClass} />}
                  <div className="text-sm text-gray-800">{name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Location Section */}
        <div className="max-w-[1400] mx-auto px-4 mb-10 gap-6">
          <h2 className="text-2xl md:text-[36px] font-normal text-[#111827] text-left mb-6">Location</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="w-full h-[500px] rounded-lg overflow-hidden">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(apartment.address)}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="rounded-lg"
              ></iframe>
            </div>
            <div className="flex flex-col gap-4 md:mt-20 ">
              <h3 className="text-lg font-semibold mb-2">Things to know before booking</h3>
              {(apartment.rules || []).length > 0 ? (
                (apartment.rules || []).map((rule) => {
                  const ruleData = ruleMapping[rule as keyof typeof ruleMapping];
                  if (!ruleData) {
                    console.warn(`Rule not mapped: ${rule}`);
                    return null;
                  }
                  const { name, icon: IconComponent, color } = ruleData;
                  return (
                    <div key={rule} className="flex items-start gap-2 text-gray-800">
                      <IconComponent className={`w-5 h-5 mt-1 ${color}`} />
                      <span>{name}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No rules specified.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}