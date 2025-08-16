"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { services } from "@/lib/dummy-data"; // keep your services list for add-ons
import Image from "next/image";
import { format, addDays } from "date-fns";
import { BedIcon, BathIcon } from "lucide-react";
import Link from "next/link";
import { Apartment } from "@/lib/interface";
import { getApartmentById } from "@/services/api-services";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const apartmentId = searchParams.get("apartmentId");
  const nights = Number(searchParams.get("nights"));
  const guests = Number(searchParams.get("guests"));

  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    specialRequest: "",
  });

  useEffect(() => {
    async function fetchApartment() {
      if (!apartmentId) {
        setError("No apartment selected.");
        setLoading(false);
        return;
      }
      try {
        const res = await getApartmentById(apartmentId);
        setApartment(res);
      } catch (err: any) {
        console.error("CheckoutPage: Failed to fetch apartment:", err);
        setError("Failed to load apartment details.");
      } finally {
        setLoading(false);
      }
    }
    fetchApartment();
  }, [apartmentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading apartment details...
      </div>
    );
  }

  if (error || !apartment || isNaN(nights) || isNaN(guests)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold">
        Invalid booking information
      </div>
    );
  }

  const handleCheckboxChange = (serviceId: string) => {
    setSelectedServices((prevSelected) =>
      prevSelected.includes(serviceId)
        ? prevSelected.filter((id) => id !== serviceId)
        : [...prevSelected, serviceId]
    );
  };

  // Pricing logic
  const basePrice = apartment.pricePerNight || 0;
  const totalCost = basePrice * nights;
  const serviceFee = 5000;
  const taxes = 0.075 * totalCost;

  const selectedServicesTotal = selectedServices.reduce((sum, serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    return sum + (service ? service.price : 0);
  }, 0);

  const grandTotal = totalCost + serviceFee + taxes + selectedServicesTotal;

  const checkInDate = new Date();
  const checkOutDate = addDays(checkInDate, nights);
  const formattedCheckIn = format(checkInDate, "MMM d, yyyy");
  const formattedCheckOut = format(checkOutDate, "MMM d, yyyy");

  // Construct booking engine URL with real apartmentId + selected services
  const bookingEngineUrl = `/booking-engine?apartmentId=${apartment.id}&nights=${nights}&guests=${guests}&selectedServices=${selectedServices.join(",")}`;

  return (
    <div className="relative min-h-screen bg-black text-white px-4 py-12 md:px-16 overflow-hidden">
      <Image
        src={apartment.imageUrl || "/placeholder.svg"}
        alt="Apartment background"
        fill
        className="object-cover z-0"
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
            <h2 className="text-2xl font-medium mb-2" style={{ color: "#111827" }}>
              Guest Information
            </h2>
            <form className="space-y-5">
              {/* Full Name */}
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
              {/* Email */}
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
              {/* Phone */}
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
              {/* Address */}
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
              {/* Special Request */}
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
              {/* Optional Services */}
              <div className="px-4 mb-10">
                <h2 className="text-[20px] font-normal text-[#111827] text-left mb-2">
                  Enhance Your Stay
                </h2>
                <p className="text-base text-[#4b5563] text-left mb-6">
                  Select optional services to upgrade your experience
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="flex justify-between items-center border border-gray-200 rounded-[12px] p-6"
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id={service.id}
                          checked={selectedServices.includes(service.id)}
                          onChange={() => handleCheckboxChange(service.id)}
                          className="mt-1 w-5 h-5"
                        />
                        <div className="flex flex-col">
                          <label
                            htmlFor={service.id}
                            className="font-normal text-base text-[#111827] cursor-pointer"
                          >
                            {service.name}
                          </label>
                          <p className="text-sm text-[#4b5566]">
                            {service.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-base font-normal text-[#111827] flex-shrink-0 ml-4">
                        ₦{service.price.toLocaleString()}
                        <span className="text-sm font-normal text-[#4b5566]">
                          {service.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>
          {/* Booking Summary */}
          <div className="bg-white text-black rounded-[12px] p-6 space-y-6 w-full md:w-[424px] max-w-full">
            {/* Apartment Info */}
            <div className="flex gap-4">
              {apartment.imageUrl && (
                <Image
                  src={apartment.imageUrl}
                  alt={apartment.name}
                  width={120}
                  height={80}
                  className="rounded-md object-cover"
                />
              )}
              <div>
                <h3 className="text-sm text-[#111827] font-normal">
                  {apartment.name}
                </h3>
                <p className="text-sm text-[#4b5563]">{apartment.location}</p>
                <div className="flex gap-3 mt-2">
                  <div className="p-1 flex gap-1 items-center">
                    <BedIcon className="w-5 h-5 mb-1 text-[#6b7280]" />
                    <span className="text-sm text-[#6b7280]">
                      {apartment.beds} Beds
                    </span>
                  </div>
                  <div className="p-1 flex gap-1 items-center">
                    <BathIcon className="w-5 h-5 mb-1 text-[#6b7280]" />
                    <span className="text-sm text-[#6b7280]">
                      {apartment.baths} Baths
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Check-in / Check-out */}
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
            {/* Pricing Breakdown */}
            <div className="text-sm text-[#6b7280] space-y-2 font-normal pt-4">
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
              {selectedServices.map((serviceId) => {
                const service = services.find((s) => s.id === serviceId);
                return service ? (
                  <div key={service.id} className="flex justify-between">
                    <span>{service.name}</span>
                    <span className="text-[#111827]">
                      ₦{service.price.toLocaleString()}
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
          Loading...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
