import Image from "next/image"
import { StarIcon } from "lucide-react"
import type { Apartment } from "@/lib/interface"

interface TrendingApartmentCardProps {
  apartment: Apartment
}

export function TrendingApartmentCard({ apartment }: TrendingApartmentCardProps) {
  return (
    <div className="w-[313px] h-[464px] flex-shrink-0 rounded-[20px] shadow-lg overflow-hidden bg-white">
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
            <span className="text-sm font-medium">{apartment.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
