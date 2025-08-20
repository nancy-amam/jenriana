// app/apartment/[id]/page.tsx
import { notFound } from "next/navigation";
import ApartmentDetails from "../component/apartment-details";
import { getApartmentById } from "@/services/api-services";

// In Next.js 14, params is now a Promise that needs to be awaited
interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function ApartmentDetailPage({ params }: PageProps) {
  // Await the params promise as required by Next.js 14
  const { id } = await params;

  try {
    const response = await getApartmentById(id);
    const apartmentData = response.data;

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
          : 4.8,
      galleryImages: (apartmentData.gallery || []).map((src: string, i: number) => ({
        id: `${apartmentData._id}-${i}`,
        src,
        alt: `${apartmentData.name} image ${i + 1}`,
      })),
      amenities: (apartmentData.features || []).map((feature: string, i: number) => ({
        id: `amenity-${i}`,
        name: feature,
        icon: getIconForFeature(feature),
      })),
      addons: (apartmentData.addons || []).map((addon: any, i: number) => ({
        id: addon._id || `${apartmentData._id}-addon-${i}`,
        name: addon.name,
        price: addon.price,
        pricingType: addon.pricingType,
        description: addon.description || "",
        active: addon.active ?? true,
      })),
      imageUrl: apartmentData.gallery?.[0] || "/placeholder.svg",
    };

    return <ApartmentDetails apartment={transformedApartment} />;
  } catch (error) {
    console.error(error);
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
  return map[feature.toLowerCase()] || "Info";
}
