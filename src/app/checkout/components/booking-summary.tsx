'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import { BedIcon, BathIcon } from 'lucide-react';

interface Addon {
  _id: string;
  name: string;
  price: number;
  pricingType: 'perNight' | 'oneTime';
  active: boolean;
}

interface Apartment {
  name: string;
  location: string;
  beds: number;
  baths: number;
  imageUrl?: string;
  addons?: Addon[];
}

interface BookingSummaryProps {
  apartment: Apartment;
  basePrice: number;
  nights: number;
  selectedServices: string[];
  checkIn: string;
  checkOut: string;
}

export default function BookingSummary({
  apartment,
  basePrice,
  nights,
  selectedServices,
  checkIn,
  checkOut,
}: BookingSummaryProps) {
  const totalCost = basePrice * nights;
  const serviceFee = 0.05 * totalCost;
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

  return (
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
        <div className="md:mt-5">
          <h3 className="text-base text-[#111827] font-normal">
            {apartment.name || 'Unknown Apartment'}
          </h3>
          <p className="text-base text-[#4b5563]">{apartment.location || 'Unknown Location'}</p>
          <div className="flex gap-3 mt-2 md:mt-2">
            <div className="p-1 flex gap-1 items-center">
              <BedIcon className="w-5 h-5 mb-1 text-[#6b7280]" />
              <span className="text-sm text-[#6b7280]">{apartment.beds || 0} Beds</span>
            </div>
            <div className="p-1 flex gap-1 items-center">
              <BathIcon className="w-5 h-5 mb-1 text-[#6b7280]" />
              <span className="text-sm text-[#6b7280]">{apartment.baths || 0} Baths</span>
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
    </div>
  );
}