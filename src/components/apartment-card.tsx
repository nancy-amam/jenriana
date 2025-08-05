import Image from "next/image"
import Link from "next/link"
import { StarIcon, UsersIcon, BedIcon, BathIcon } from "lucide-react"

interface ApartmentCardProps {
  id: string
  imageUrl: string
  name: string
  location: string
  price: string
  rating: number
  guests: number
  beds: number
  baths: number
}

export function ApartmentCard({
  id,
  imageUrl,
  name,
  location,
  price,
  rating,
  guests,
  beds,
  baths,
}: ApartmentCardProps) {
  return (
    <Link href={`/apartment/${id}`}>
      <div className="w-[424px] flex-shrink-0 rounded-[20px] shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-200 cursor-pointer">
        <div className="w-full h-[384px] overflow-hidden">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            width={424}
            height={384}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex flex-col text-[#1e1e1e] gap-4">
          <h3 className="text-[18px] font-normal">{name}</h3>
          <p className="text-base text-[#4b5568]">{location}</p>
          <div className="flex items-center justify-between">
            <span className="text-[24px] text-[#1e1e1e] font-normal">{price}/night</span>
            <div className="flex items-center gap-1">
              <StarIcon className="h-5 w-5 text-amber-400 fill-amber-400" />
              <span className="text-base font-medium">{rating}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[#4b5568] text-sm">
            <div className="flex items-center gap-1">
              <UsersIcon className="h-4 w-4" />
              <span>{guests} Guests</span>
            </div>
            <div className="flex items-center gap-1">
              <BedIcon className="h-4 w-4" />
              <span>{beds} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <BathIcon className="h-4 w-4" />
              <span>{baths} Baths</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
