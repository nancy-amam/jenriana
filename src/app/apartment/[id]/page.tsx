import { notFound } from "next/navigation";
import ApartmentDetails from "../apartment-details";
import { detailedApartments } from "@/lib/dummy-data";
import { Apartment } from "@/lib/interface";

// Static params generation for SSG
export async function generateStaticParams() {
  return detailedApartments.map((apt) => ({ id: apt.id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ApartmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  const apartment = detailedApartments.find((apt) => apt.id === id);
  
  if (!apartment) return notFound();

  // Transform apartment to ensure compatibility with ApartmentDetails
  const transformedApartment: Apartment = {
    ...apartment,
    galleryImages: (apartment.galleryImages || []).map((img) => ({
      id: img.id,
      src: img.src,
      alt: img.alt,
    })), // Exclude isLarge
    amenities: apartment.amenities || [], // Ensure non-optional
  };

  return <ApartmentDetails apartment={transformedApartment} />;
}