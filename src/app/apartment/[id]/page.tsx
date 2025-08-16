import { notFound } from "next/navigation";
import ApartmentDetails from "../component/apartment-details";
import { getApartmentById } from "@/services/api-services";
import { Apartment } from "@/lib/interface";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ApartmentDetailPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const response = await getApartmentById(id);
    const apartmentData = response.data;

    if (!apartmentData) {
      return notFound();
    }

    // Transform API response to match ApartmentDetails component expectations
    const transformedApartment: Apartment = {
      // Keep original fields for database operations
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
      
      // Add fields expected by ApartmentDetails component
      id: apartmentData._id, // Map _id to id
      imageUrl: apartmentData.gallery?.[0] || '/placeholder.svg', // Main image
      price: apartmentData.pricePerNight, // Map pricePerNight to price
      guests: apartmentData.maxGuests || 1, // Map maxGuests to guests
      beds: apartmentData.rooms || 1, // Map rooms to beds
      baths: apartmentData.bathrooms || 1, // Map bathrooms to baths
      rating: apartmentData.ratings || apartmentData.averageRating || 4.8,
      
      // Transform gallery for component
      galleryImages: (apartmentData.gallery || []).map((src: string, index: number) => ({
        id: `${apartmentData._id}-${index}`,
        src,
        alt: `${apartmentData.name} image ${index + 1}`,
      })),
      
      // Transform features to amenities format expected by component
      amenities: (apartmentData.features || []).map((feature: string, index: number) => ({
        id: `amenity-${index}`,
        name: feature,
        icon: getIconForFeature(feature), // Helper function to map features to icons
      })),
    };

    return <ApartmentDetails apartment={transformedApartment} />;
  } catch (error: any) {
    console.error(`Error fetching apartment ${id}:`, error);
    return notFound();
  }
}

// Helper function to map feature names to icon names
function getIconForFeature(feature: string): string {
  const featureIconMap: { [key: string]: string } = {
    'wifi': 'Wifi',
    'air conditioning': 'AirVent',
    'kitchen': 'Utensils',
    'tv': 'Tv',
    'laptop friendly': 'Laptop',
    'gym': 'Dumbbell',
    'parking': 'ParkingSquare',
    'security': 'ShieldCheck',
    // Add more mappings as needed
  };
  
  const lowerFeature = feature.toLowerCase();
  return featureIconMap[lowerFeature] || 'Info'; // Default to Info icon
}