import { notFound } from "next/navigation"
import ApartmentDetails from "../aparment-details"
import { detailedApartments } from "@/lib/dummy-data"

// Static params generation for SSG
export async function generateStaticParams() {
  return detailedApartments.map((apt) => ({ id: apt.id }))
}

// Updated interface for Next.js 15
interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ApartmentDetailPage({ params }: PageProps) {
  // Await the params since they're now a Promise in Next.js 15
  const { id } = await params
  
  const apartment = detailedApartments.find((apt) => apt.id === id)

  if (!apartment) return notFound()

  return <ApartmentDetails apartment={apartment} />
}