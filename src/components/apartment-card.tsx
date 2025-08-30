"use client";

import Image from "next/image";
import Link from "next/link";
import { StarIcon, UsersIcon, BedIcon, BathIcon, Heart } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

interface ApartmentCardProps {
  id: string;
  imageUrl?: string;
  name: string;
  location: string;
  price: string;
  rating?: number;
  guests?: number;
  beds?: number;
  baths?: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string, next: boolean) => void;
  disabled?: boolean;
}

export function ApartmentCard({
  id,
  imageUrl,
  name,
  location,
  price,
  rating = 4.8,
  guests = 1,
  beds = 1,
  baths = 1,
  isFavorite,
  onToggleFavorite,
  disabled = false,
}: ApartmentCardProps) {
  const displayRating = typeof rating === "number" ? rating.toFixed(1) : "4.8";
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [fav, setFav] = useState<boolean>(!!isFavorite);

  useEffect(() => {
    if (typeof isFavorite === "boolean") setFav(isFavorite);
  }, [isFavorite]);

  const handleFavClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    const next = !fav;
    setFav(next);
    onToggleFavorite?.(id, next);
  };

  return (
    <Link href={`/apartment/${id}`} className="group">
      <div
        ref={ref}
        className={`w-[250px] flex-shrink-0 rounded-lg overflow-hidden bg-white transition-all duration-700 ease-out transform-gpu will-change-transform cursor-pointer ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="relative w-full h-[150px] overflow-hidden">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            width={424}
            height={384}
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleFavClick}
            aria-pressed={fav}
            aria-label={fav ? "Remove from favourites" : "Add to favourites"}
            disabled={disabled}
            className={`absolute top-2 right-2 rounded-full p-2 shadow transition-all duration-200 ${
              fav ? "bg-white text-red-500" : "bg-white/90 text-gray-700"
            } opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:scale-105 active:scale-95`}
          >
            <Heart className={`h-5 w-5 ${fav ? "fill-red-500" : "fill-transparent"}`} />
          </button>
        </div>

        <div className="p-4 flex flex-col text-[#1e1e1e] gap-2">
          <h3 className="text-sm capitalize font-semibold">{name}</h3>
          <p className="text-xs capitalize text-[#4b5568]">{location}</p>
          <div className="flex items-center justify-between">
            <span className="text-base text-[#1e1e1e] font-semibold">{price}/night</span>
            <div className="flex items-center gap-1">
              <StarIcon className="h-2 w-2 text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium">{displayRating}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[#4b5568] text-xs">
            <div className="flex items-center gap-1">
              <UsersIcon className="h-2 w-2" />
              <span>{guests} Guests</span>
            </div>
            <div className="flex items-center gap-1">
              <BedIcon className="h-2 w-2" />
              <span>{beds} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <BathIcon className="h-2 w-2" />
              <span>{baths} Baths</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
