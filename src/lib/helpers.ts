// src/lib/helpers.ts

import { Apartment, Addon } from "@/lib/interface";

export function transformApartment(apartmentData: any): Apartment {
  return {
    id: apartmentData._id,
    name: apartmentData.name,
    location: apartmentData.location,
    address: apartmentData.address,
    price: apartmentData.pricePerNight,
    pricePerNight: apartmentData.pricePerNight,
    beds: apartmentData.rooms || 1,
    baths: apartmentData.bathrooms || 1,
    guests: apartmentData.maxGuests || 1,
     maxGuests: apartmentData.maxGuests || 1, 
    rating: typeof apartmentData.averageRating === "number"
      ? apartmentData.averageRating
      : 4.8,
    averageRating: apartmentData.averageRating,
    imageUrl: apartmentData.gallery?.[0] || "/placeholder.svg",
    gallery: apartmentData.gallery ?? [],
    addons: (apartmentData.addons || []).map((addon: any, i: number): Addon => ({
      id: addon._id || `${apartmentData._id}-addon-${i}`,
      name: addon.name,
      price: addon.price,
      pricingType: addon.pricingType,
      description: addon.description || "",
      active: addon.active ?? true,
    })),
    amenities: (apartmentData.features || []).map((feature: string, i: number) => ({
      id: `amenity-${i}`,
      name: feature,
      icon: getIconForFeature(feature),
    })),
    features: apartmentData.features,
    rules: apartmentData.rules,
    isTrending: apartmentData.isTrending,
  };
}

function getIconForFeature(feature: string): string {
  const map: Record<string, string> = {
    wifi: "Wifi",
    "air conditioning": "AirVent",
    "air-conditioning": "AirVent",
    kitchen: "Utensils",
    tv: "Tv",
    "laptop friendly": "Laptop",
    gym: "Dumbbell",
    parking: "ParkingSquare",
    security: "ShieldCheck",
    "washing-machine": "WashingMachine",
  };
  return map[feature.toLowerCase()] || "Info";
}
