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
  const displayRating = typeof rating === "number" ? rating.toFixed(2) : "4.90";
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
    <Link href={`/apartment/${id}`} className="group block">
      <div
        ref={ref}
        className={`w-[250px] flex-shrink-0 rounded-lg border border-white overflow-hidden bg-white cursor-pointer transition-all duration-700 ease-out transform-gpu will-change-transform ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="relative w-full  h-[150px]  overflow-hidden rounded-2xl">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
            sizes="(min-width:1280px) 16vw, (min-width:1024px) 20vw, (min-width:768px) 30vw, 50vw"
            priority={false}
          />
          <button
            onClick={handleFavClick}
            aria-pressed={fav}
            aria-label={fav ? "Remove from favourites" : "Add to favourites"}
            disabled={disabled}
            className={`absolute top-2 right-2 rounded-full p-2 bg-white/90 shadow transition hover:scale-105 active:scale-95 ${
              fav ? "text-red-500" : "text-gray-800"
            } opacity-100 md:opacity-0 md:group-hover:opacity-100`}
          >
            <Heart className={`h-5 w-5 ${fav ? "fill-red-500" : "fill-transparent"}`} />
          </button>
        </div>

        <div className="mt-2 lg:p-2 flex flex-col gap-1 p-2">
          <h3 className="text-sm font-semibold text-[#1e1e1e] truncate">{name}</h3>
          <p className="text-xs text-[#4b5563] truncate">{location}</p>
          <div className="mt-1 flex items-center justify-between text-xs text-[#1e1e1e]">
            <span className="flex items-center gap-1">
              {price} / night <span className="text-[#9aa0a6]">•</span>
            </span>
            <span className="flex items-center gap-1">
              <StarIcon className="h-3 w-3 text-amber-400 fill-amber-400" />
              {displayRating}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-4 text-[#4b5568] text-[11px]">
            <div className="flex items-center gap-1">
              <UsersIcon className="h-3 w-3" />
              <span>{guests} Guests</span>
            </div>
            <div className="flex items-center gap-1">
              <BedIcon className="h-3 w-3" />
              <span>{beds} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <BathIcon className="h-3 w-3" />
              <span>{baths} Baths</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
