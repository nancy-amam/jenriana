// app/apartment/[id]/page.tsx
import { notFound } from "next/navigation";
import ApartmentDetails from "../component/apartment-details";
import { getApartmentById } from "@/services/api-services";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

type PageProps = {
  params: { id: string }; // ✅ plain object, not a Promise
};

export default async function ApartmentDetailPage({ params }: PageProps) {
  const { id } = params; // ✅ no await

  try {
    const res = await getApartmentById(id);
    const apartmentData = res?.data ?? res;

    if (!apartmentData) return notFound();

    const transformedApartment = {
      ...apartmentData,
      id: apartmentData._id,
      beds: apartmentData.rooms || 1,
      baths: apartmentData.bathrooms || 1,
      guests: apartmentData.maxGuests || 1,
      price: apartmentData.pricePerNight,
      rating:
        typeof apartmentData.averageRating === "number"
          ? apartmentData.averageRating
          : typeof apartmentData.ratings === "number"
          ? apartmentData.ratings
          : 4.8,
      galleryImages: (apartmentData.gallery ?? []).map((src: string, i: number) => ({
        id: `${apartmentData._id}-${i}`,
        src,
        alt: `${apartmentData.name} image ${i + 1}`,
      })),
      amenities: (apartmentData.features ?? []).map((feature: string, i: number) => ({
        id: `amenity-${i}`,
        name: feature,
        icon: getIconForFeature(feature),
      })),
      addons: (apartmentData.addons ?? []).map((addon: any, i: number) => ({
        id: addon._id ?? `${apartmentData._id}-addon-${i}`,
        name: addon.name,
        price: addon.price,
        pricingType: addon.pricingType,
        description: addon.description ?? "",
        active: addon.active ?? true,
      })),
      imageUrl: apartmentData.gallery?.[0] || "/placeholder.svg",
    };

    return <ApartmentDetails apartment={transformedApartment} />;
  } catch (e) {
    console.error("Failed to fetch apartment:", e);
    return notFound();
  }
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
  const key = feature?.toLowerCase?.() ?? "";
  return map[key] || "Info";
}
