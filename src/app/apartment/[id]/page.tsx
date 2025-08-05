import { notFound } from "next/navigation"
import ApartmentDetails from "../aparment-details"
import { detailedApartments } from "@/lib/dummy-data"

interface ApartmentProps {
  params: { id: string }
}

export async function generateStaticParams() {
  return detailedApartments.map((apt) => ({ id: apt.id }))
}

export default function ApartmentDetailPage({ params }: ApartmentProps) {
  const apartment = detailedApartments.find((apt) => apt.id === params.id)

  if (!apartment) return notFound()

  return <ApartmentDetails apartment={apartment} />
}
