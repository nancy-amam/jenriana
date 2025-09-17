"use client";

import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "lucide-react";
import { useInView } from "react-intersection-observer";

interface Apartment {
  id: string;
  imageUrl?: string;
  name: string;
  location: string;
  price: string;
  rating?: number;
  guests?: number;
  beds?: number;
  baths?: number;
}

interface TrendingApartmentCardProps {
  apartment: Apartment;
}

export function TrendingApartmentCard({
  apartment,
}: TrendingApartmentCardProps) {
  const displayRating =
    typeof apartment.rating === "number" ? apartment.rating.toFixed(1) : "4.8";
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <Link href={`/apartment/${apartment.id}`}>
      <div
        ref={ref}
        className={`w-[250px] flex-shrink-0 rounded-lg border border-white overflow-hidden bg-white cursor-pointer transition-all duration-700 ease-out transform-gpu will-change-transform ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="w-full h-[150px] overflow-hidden rounded-t-lg">
          <Image
            src={apartment.imageUrl || "/placeholder.svg"}
            alt={apartment.name}
            width={313}
            height={332}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex flex-col rounded-b-[20px]">
          <h3 className="text-sm capitalize text-[#1e1e1e] font-semibold">
            {apartment.name}
          </h3>
          <p className="text-xs text-[#4b5568] capitalize">
            {apartment.location}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-base text-[#1e1e1e] font-semibold">
              {apartment.price}/night
            </span>
            <div className="flex items-center gap-1">
              <StarIcon className="h-2 w-2 text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium">{displayRating}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
