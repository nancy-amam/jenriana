// app/apartment/[id]/page.tsx
import { notFound } from "next/navigation";
import ApartmentDetails from "../component/apartment-details";
import { getApartmentById } from "@/services/api-services";
import { ApartmentResponse, Apartment } from "@/lib/interface";
import { transformApartment } from "@/lib/helpers";

export default async function ApartmentDetailPage({ params }: { params: { id: string } }) {
  try {
    const response = await getApartmentById(params.id);
    const raw: ApartmentResponse | null = response?.data || null;

    if (!raw) return notFound();

    const apartment: Apartment = transformApartment(raw);

    return <ApartmentDetails apartment={apartment} />;
  } catch (error) {
    console.error("Error fetching apartment:", error);
    return notFound();
  }
}
