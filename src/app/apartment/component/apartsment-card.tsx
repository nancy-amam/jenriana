// components/FeaturedApartmentCard.tsx
"use client";

import Image from "next/image";
import { Heart, Star, UsersIcon, BedIcon, BathIcon } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

interface FeaturedApartmentCardProps {
  id: string;
  imageUrl: string;
  name: string;
  location: string;
  price: string;
  rating: number;
  reviews: number;
  guests: number;
  beds: number;
  baths: number;
  isGuestFavourite?: boolean; 
  className?: string;
}

export function FeaturedApartmentCard({
  id,
  imageUrl,
  name,
  location,
  price,
  rating,
  reviews,
  guests,
  beds,
  baths,
  isGuestFavourite,
  className,
}: FeaturedApartmentCardProps) {
  const formattedRating = Number(rating || 0).toFixed(1);
  const [liked, setLiked] = useState(false);

  return (
    <div
      className={clsx(
        "relative bg-white rounded-2xl shadow-md overflow-hidden",
        "w-[345px] h-[385px] md:w-[313px] md:h-[385px]",
        className
      )}
    >
      <div className="relative h-[200px] w-full">
        <Image src={imageUrl} alt={name} fill className="object-cover" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md"
        >
          <Heart
            className={clsx(
              "w-5 h-5 transition-colors",
              liked ? "text-red-500 fill-red-500" : "text-gray-600"
            )}
          />
        </button>

        {/* Guest Favourite Badge (desktop) */}
        {isGuestFavourite && (
          <div className="hidden md:block absolute top-6 left-4 bg-black text-white text-xs font-normal rounded-lg px-2 py-1">
            Guest Favourite
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4  flex flex-col gap-1 h-[185px]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-normal text-base text-[#111827]">{name}</h3>
            {/* <p className="text-sm text-gray-500">{location}</p> */}
          </div>
          {isGuestFavourite && (
            <div className="md:hidden bg-orange-100 text-[#c2410c] text-xs font-medium rounded-full px-3 py-1">
              Guest Favourite
            </div>
          )}
        </div>

        {/* Rating + Reviews */}
        <div className="flex items-center gap-1 ">
          <Star className="w-4 h-4 text-yellow-500" fill={"#FFD700"} />
          <Star className="w-4 h-4 text-yellow-500" fill={"#FFD700"} />
          <Star className="w-4 h-4 text-yellow-500" fill={"#FFD700"} />
          <Star className="w-4 h-4 text-yellow-500" fill={"#FFD700"} />
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium">{formattedRating}</span>
          <span className="text-sm text-gray-500">{reviews} reviews</span>
        </div>

        <p className=" font-normal text-base md:text-lg">
          {price}
          <span className=" text-xs md:text-sm text-[#4b5563] ">
            / night
          </span>{" "}
        </p>

        <div className="flex items-center gap-4 text-[#4b5568] text-sm ">
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
  );
}
