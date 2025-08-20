// src/app/apartment/[id]/page.tsx
import ApartmentDetails from "../component/apartment-details";
import { getApartmentById } from "@/services/api-services";
import { transformApartment } from "@/lib/helpers";
import { Apartment } from "@/lib/interface";

interface PageProps {
  params: { id: string };
}

export default async function ApartmentDetailPage({ params }: PageProps) {
  const { id } = params;

  try {
    console.log("🔎 Fetching apartment with ID:", id);

    const response = await getApartmentById(id);

    console.log("✅ Raw API response:", response);

    if (!response || !response.data) {
      console.error("❌ No apartment data found in response");
      return <div>No apartment data found for ID: {id}</div>;
    }

    const apartment: Apartment = transformApartment(response.data);

    console.log("✨ Transformed apartment object:", apartment);

    return <ApartmentDetails apartment={apartment} />;
  } catch (error: any) {
    console.error("🔥 Error fetching apartment:", error);

    return (
      <div className="p-6 text-red-600">
        <h1 className="text-xl font-bold">Error Loading Apartment</h1>
        <p>{String(error?.message || error)}</p>
        <p>Apartment ID: {id}</p>
      </div>
    );
  }
}
