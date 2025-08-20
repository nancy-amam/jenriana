
import { notFound } from "next/navigation";
import ApartmentDetails from "../component/apartment-details";
import { getApartmentById } from "@/services/api-services";
import { Apartment } from "@/lib/interface";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function ApartmentDetailPage({ params }: PageProps) {
  const { id } = await params; // Await params to fix sync access error

  try {
    console.log('Server: Fetching apartment for ID:', id);
    const response = await getApartmentById(id);
    const apartmentData = response.data;

    if (!apartmentData) {
      console.error('Server: No apartment data received for ID:', id);
      return notFound();
    }

    const transformedApartment: Apartment = {
      _id: apartmentData._id,
      id: apartmentData._id,
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
      addons: (apartmentData.addons || []).map((addon: any, index: number) => ({
        id: addon._id || addon.id || `${apartmentData._id}-addon-${index}`,
        _id: addon._id,
        name: addon.name,
        price: addon.price,
        pricingType: addon.pricingType,
        description: addon.description || '',
        active: addon.active ?? true,
      })),

      // Extra fields for UI
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

    console.log('Server: Transformed apartment:', JSON.stringify(transformedApartment, null, 2));

    return <ApartmentDetails apartment={transformedApartment} />;
  } catch (error: any) {
    console.error(`Server: Error fetching apartment ${id}:`, error);
    return notFound();
  }
}

function getIconForFeature(feature: string): string {
  const featureIconMap: { [key: string]: string } = {
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

  const lowerFeature = feature.toLowerCase();
  return featureIconMap[lowerFeature] || "Info";
}

