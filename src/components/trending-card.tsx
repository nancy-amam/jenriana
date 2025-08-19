import Image from "next/image"
import Link from "next/link"
import { StarIcon } from "lucide-react"
// import type { Apartment } from "@/lib/interface"

interface TrendingApartmentCardProps {
  apartment: Apartment
}

interface Apartment {
  id: string
  imageUrl: string
  name: string
  location: string
  price: string
  rating: number
  guests: number
  beds: number
  baths: number
  ratings: number
}


export function TrendingApartmentCard({ apartment }: TrendingApartmentCardProps) {
  // Default to 4.8 if rating is undefined or not a number
  const displayRating =
    typeof apartment.ratings === "number" && !isNaN(apartment.ratings)
      ? apartment.rating.toFixed(1)
      : "4.8"

  return (
    <Link href={`/apartment/${apartment.id}`}>
      <div className="w-[313px] h-[464px] flex-shrink-0 rounded-[20px] border border-white overflow-hidden bg-white cursor-pointer">
        <div className="w-full h-[332px] overflow-hidden rounded-t-[20px]">
          <Image
            src={apartment.imageUrl || "/placeholder.svg"}
            alt={apartment.name}
            width={313}
            height={332}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex flex-col gap-2 rounded-b-[20px]">
          <h3 className="text-base text-[#1e1e1e] font-normal">{apartment.name}</h3>
          <p className="text-sm text-[#4b5568]">{apartment.location}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-base text-[#1e1e1e] font-normal">{apartment.price}</span>
            <div className="flex items-center gap-1">
              <StarIcon className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium">{displayRating}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
