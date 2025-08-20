import { notFound } from "next/navigation";
import ApartmentDetails from "../component/apartment-details";
import { getApartmentById } from "@/services/api-services";
import { Apartment } from "@/lib/interface";

interface PageProps {
  params: { id: string };
}

// Force runtime so Vercel doesn’t try to pre-render at build
export const dynamic = "force-dynamic";

export default async function ApartmentDetailPage({ params }: PageProps) {
  const { id } = params;

  try {
    const response = await getApartmentById(id);
    const apartmentData = response.data;

    if (!apartmentData) {
      return notFound();
    }

    const transformedApartment: Apartment = {
      _id: apartmentData._id,
      name: apartmentData.name,
      location: apartmentData.location,
      address: apartmentData.address,
      pricePerNight: apartmentData.pricePerNight,
      rooms: apartmentData.rooms || 0,
      bathrooms: apartmentData.bathrooms || 0,
      maxGuests: apartmentData.maxGuests || 1,
      features: apartmentData.features || [],
      rules: apartmentData.rules || [],
      gallery: apartmentData.gallery || [],
      isTrending: apartmentData.isTrending || false,
      ratings: apartmentData.ratings || apartmentData.averageRating || 0,
      createdAt: apartmentData.createdAt,
      updatedAt: apartmentData.updatedAt,
      __v: apartmentData.__v,
      averageRating: apartmentData.averageRating || 0,
      feedbackCount: apartmentData.feedbackCount || 0,
      feedbacks: apartmentData.feedbacks || [],

      // extra fields
      id: apartmentData._id,
      imageUrl: apartmentData.gallery?.[0] || "/placeholder.svg",
      price: apartmentData.pricePerNight,
      guests: apartmentData.maxGuests || 1,
      beds: apartmentData.rooms || 1,
      baths: apartmentData.bathrooms || 1,
      rating: apartmentData.ratings || apartmentData.averageRating || 4.8,

      galleryImages: (apartmentData.gallery || []).map(
        (src: string, index: number) => ({
          id: `${apartmentData._id}-${index}`,
          src,
          alt: `${apartmentData.name} image ${index + 1}`,
        })
      ),

      amenities: (apartmentData.features || []).map(
        (feature: string, index: number) => ({
          id: `amenity-${index}`,
          name: feature,
          icon: getIconForFeature(feature),
        })
      ),
    };

    return <ApartmentDetails apartment={transformedApartment} />;
  } catch (error: any) {
    console.error(`Error fetching apartment ${id}:`, error);
    return notFound();
  }
}

function getIconForFeature(feature: string): string {
  const featureIconMap: { [key: string]: string } = {
    wifi: "Wifi",
    "air conditioning": "AirVent",
    kitchen: "Utensils",
    tv: "Tv",
    "laptop friendly": "Laptop",
    gym: "Dumbbell",
    parking: "ParkingSquare",
    security: "ShieldCheck",
  };

  const lowerFeature = feature.toLowerCase();
  return featureIconMap[lowerFeature] || "Info";
}
