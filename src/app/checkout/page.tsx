'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { BedIcon, BathIcon } from 'lucide-react';
import Link from 'next/link';
import { getApartmentById } from '@/services/api-services';
import ApartmentLoadingPage from '@/components/loading';

// Define Apartment interface based on API response
interface Addon {
  _id: string;
  name: string;
  price: number;
  pricingType: 'perNight' | 'oneTime';
  active: boolean;
}

interface Apartment {
  _id: string;
  name: string;
  location: string;
  pricePerNight: number;
  rooms: number;
  bathrooms: number;
  maxGuests: number;
  features: string[];
  gallery: string[];
  rules: string[];
  addons?: Addon[];
  address: string;
  averageRating: number | null;
  isTrending: boolean;
  ratings: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  imageUrl?: string;
  beds: number;
  baths: number;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const apartmentId = searchParams.get('apartmentId');
  const nights = Number(searchParams.get('nights'));
  const guests = Number(searchParams.get('guests'));
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const price = Number(searchParams.get('price')); // Get price from query params
  const passedImage = searchParams.get('image');

  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    specialRequest: '',
  });

  useEffect(() => {
    async function fetchApartment() {
      if (!apartmentId) {
        setError('No apartment selected.');
        setLoading(false);
        return;
      }
      try {
        const res = await getApartmentById(apartmentId);
        console.log('CheckoutPage: Apartment data:', res.data);
        setApartment({
          ...res.data,
          beds: res.data.rooms,
          baths: res.data.bathrooms,
          imageUrl: decodeURIComponent(passedImage || res.data.gallery?.[0] || '/images/placeholder.svg'),
        });
      } catch (err: any) {
        console.error('CheckoutPage: Failed to fetch apartment:', err);
        setError('Failed to load apartment details.');
      } finally {
        setLoading(false);
      }
    }
    fetchApartment();
  }, [apartmentId, passedImage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <ApartmentLoadingPage />
      </div>
    );
  }

  if (error || !apartment || isNaN(nights) || isNaN(guests) || !checkIn || !checkOut || isNaN(price)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold">
        Invalid booking information
      </div>
    );
  }

  const handleCheckboxChange = (addonId: string) => {
    setSelectedServices((prevSelected) =>
      prevSelected.includes(addonId)
        ? prevSelected.filter((id) => id !== addonId)
        : [...prevSelected, addonId]
    );
  };

  // Pricing logic
  const basePrice = price; // Use price from query params
  const totalCost = basePrice * nights;
  const serviceFee = 5000;
  const taxes = 0.075 * totalCost;

  const selectedServicesTotal = selectedServices.reduce((sum, addonId) => {
    const addon = apartment.addons?.find((a) => a._id === addonId);
    if (addon && addon.active) {
      return sum + (addon.pricingType === 'perNight' ? addon.price * nights : addon.price);
    }
    return sum;
  }, 0);

  const grandTotal = totalCost + serviceFee + taxes + selectedServicesTotal;

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const formattedCheckIn = format(checkInDate, 'MMM d, yyyy');
  const formattedCheckOut = format(checkOutDate, 'MMM d, yyyy');

  // Map API pricingType to display text
  const displayPricingType = (pricingType: string) => {
    switch (pricingType) {
      case 'perNight':
        return 'Per night';
      case 'oneTime':
        return 'One-time';
      default:
        return pricingType;
    }
  };

  // Construct booking engine URL with real apartmentId + selected add-ons
  const bookingEngineUrl = `/booking-engine?apartmentId=${apartment._id}&nights=${nights}&guests=${guests}&checkIn=${checkIn}&checkOut=${checkOut}&selectedServices=${selectedServices.join(',')}&image=${encodeURIComponent(apartment.imageUrl || '')}`;

  return (
    <div className="relative min-h-screen bg-black text-white px-4 py-12 md:px-16 overflow-hidden">
      <Image
        src={apartment.imageUrl}
        alt="Apartment background"
        fill
        className="object-cover z-0"
        unoptimized
      />
      <div className="absolute inset-0 bg-black/80 z-10"></div>
      <div className="relative z-20 max-w-7xl mx-auto">
        <h1 className="text-[36px] font-normal mb-2">Confirm Your Booking</h1>
        <p className="mb-10 text-base font-normal">
          Just a few more details to confirm your stay
        </p>
        <div className="flex flex-col md:flex-row gap-8 w-full items-start">
          {/* Guest Info */}
          <div className="bg-white text-black rounded-[12px] p-6 space-y-6 w-full md:flex-1 max-w-3xl">
            <h2 className="text-2xl font-medium mb-2" style={{ color: '#111827' }}>
              Guest Information
            </h2>
            <form className="space-y-5">
              <div className="space-y-1">
                <label className="block text-base font-medium">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={guestInfo.name}
                  onChange={(e) =>
                    setGuestInfo({ ...guestInfo, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded border text-black"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-base font-medium">Email Address</label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={guestInfo.email}
                  onChange={(e) =>
                    setGuestInfo({ ...guestInfo, email: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded border text-black"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-base font-medium">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={guestInfo.phone}
                  onChange={(e) =>
                    setGuestInfo({ ...guestInfo, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded border text-black"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-base font-medium">Residential Address</label>
                <input
                  type="text"
                  placeholder="Enter your complete address"
                  value={guestInfo.address}
                  onChange={(e) =>
                    setGuestInfo({ ...guestInfo, address: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded border text-black"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-base font-medium">
                  Special Request (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Any special requirements or requests for your stay"
                  value={guestInfo.specialRequest}
                  onChange={(e) =>
                    setGuestInfo({
                      ...guestInfo,
                      specialRequest: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 rounded border text-black"
                ></textarea>
              </div>
              <div className="px-4 mb-10">
                <h2 className="text-[20px] font-normal text-[#111827] text-left mb-2">
                  Enhance Your Stay
                </h2>
                <p className="text-base text-[#4b5563] text-left mb-6">
                  Select optional services to upgrade your experience
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {apartment.addons && apartment.addons.length > 0 ? (
                    apartment.addons
                      .filter((addon) => addon.active)
                      .map((addon) => (
                        <div
                          key={addon._id}
                          className="flex justify-between items-center border border-gray-200 rounded-[12px] p-6"
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              id={addon._id}
                              checked={selectedServices.includes(addon._id)}
                              onChange={() => handleCheckboxChange(addon._id)}
                              className="mt-1 w-5 h-5"
                            />
                            <div className="flex flex-col">
                              <label
                                htmlFor={addon._id}
                                className="font-normal text-base text-[#111827] cursor-pointer"
                              >
                                {addon.name}
                              </label>
                              <p className="text-sm text-[#4b5566]">
                                {displayPricingType(addon.pricingType)}
                              </p>
                            </div>
                          </div>
                          <div className="text-base font-normal text-[#111827] flex-shrink-0 ml-4">
                            ₦{(addon.pricingType === 'perNight' ? addon.price * nights : addon.price).toLocaleString()}
                            <span className="text-sm font-normal text-[#4b5566]">
                              {addon.pricingType === 'perNight' ? '/night' : ''}
                            </span>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-[#4b5563]">No add-ons available.</p>
                  )}
                </div>
              </div>
            </form>
          </div>
          {/* Booking Summary */}
          <div className="bg-white text-black rounded-[12px] p-6 space-y-6 w-full md:w-[424px] max-w-full">
            <div className="flex gap-4">
              {apartment.imageUrl && (
                <Image
                  src={apartment.imageUrl}
                  alt={apartment.name || 'Apartment'}
                  width={120}
                  height={80}
                  className="rounded-md object-cover"
                  unoptimized
                />
              )}
              <div className=' md:mt-5'>
                <h3 className="text-base text-[#111827] font-normal">
                  {apartment.name || 'Unknown Apartment'}
                </h3>
                <p className="text-base text-[#4b5563]">{apartment.location || 'Unknown Location'}</p>
                <div className="flex gap-3 mt-2 md:mt-2">
                  <div className="p-1 flex gap-1 items-center">
                    <BedIcon className="w-5 h-5 mb-1 text-[#6b7280]" />
                    <span className="text-sm text-[#6b7280]">
                      {apartment.beds || 0} Beds
                    </span>
                  </div>
                  <div className="p-1 flex gap-1 items-center">
                    <BathIcon className="w-5 h-5 mb-1 text-[#6b7280]" />
                    <span className="text-sm text-[#6b7280]">
                      {apartment.baths || 0} Baths
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-black font-normal text-sm pt-4">
              <div>
                <p className="text-[#6b7280] font-normal">Check-in</p>
                <p>{formattedCheckIn}</p>
              </div>
              <div>
                <p className="text-[#6b7280] font-normal">Check-out</p>
                <p>{formattedCheckOut}</p>
              </div>
            </div>
            <div className="text-sm text-[#6b7280] space-y-2 font-normal pt-4">
              <div className="flex justify-between">
                <span>Apartment Price (per night)</span>
                <span className="text-[#111827]">
                  ₦{basePrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>
                  ₦{basePrice.toLocaleString()} x {nights} night(s)
                </span>
                <span className="text-[#111827]">
                  ₦{totalCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span className="text-[#111827]">
                  ₦{serviceFee.toLocaleString()}
                </span>
              </div>
              {selectedServices.map((addonId) => {
                const addon = apartment.addons?.find((a) => a._id === addonId);
                return addon ? (
                  <div key={addon._id} className="flex justify-between">
                    <span>{addon.name} ({displayPricingType(addon.pricingType)})</span>
                    <span className="text-[#111827]">
                      ₦{(addon.pricingType === 'perNight' ? addon.price * nights : addon.price).toLocaleString()}
                    </span>
                  </div>
                ) : null;
              })}
              <div className="flex justify-between">
                <span>Taxes (7.5%)</span>
                <span className="text-[#111827]">
                  ₦{taxes.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-black border-t border-gray-300 pt-2">
                <span>Total</span>
                <span>
                  ₦{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
            <Link href={bookingEngineUrl}>
              <button className="w-full bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 transition">
                Confirm Booking
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-white">
          <ApartmentLoadingPage />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}