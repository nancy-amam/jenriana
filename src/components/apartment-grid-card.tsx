"use client";

import Image from "next/image";
import { Heart, StarIcon } from "lucide-react";
import { useState } from "react";

interface ApartmentGridCardProps {
  imageUrl?: string;
  name: string;
  location: string;
  priceLabel: string; // e.g. "₦120,000"
  nights?: number; // e.g. 2 -> "for 2 nights"
  rating?: number; // e.g. 4.91
  isGuestFavorite?: boolean; // shows the "Guest favorite" pill
  isFavorite?: boolean; // initial heart state
  onToggleFavorite?: (next: boolean) => void;
}

export function ApartmentGridCard({
  imageUrl,
  name,
  location,
  priceLabel,
  nights = 1,
  rating = 4.9,
  isGuestFavorite = false,
  isFavorite,
  onToggleFavorite,
}: ApartmentGridCardProps) {
  const [fav, setFav] = useState<boolean>(!!isFavorite);
  const displayRating = typeof rating === "number" ? rating.toFixed(2) : "4.90";

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !fav;
    setFav(next);
    onToggleFavorite?.(next);
  };

  return (
    <div className="w-full bg-white rounded-2xl">
      <div className="relative w-full aspect-square sm:aspect-[4/3] overflow-hidden rounded-2xl">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover"
          sizes="(min-width:1280px) 16vw, (min-width:1024px) 20vw, (min-width:768px) 30vw, 50vw"
          priority={false}
        />

        {isGuestFavorite && (
          <span className="absolute top-2 left-2 px-3 py-1 rounded-full bg-white text-[#1e1e1e] text-xs font-medium shadow">
            Guest favorite
          </span>
        )}

        <button
          onClick={toggle}
          aria-pressed={fav}
          aria-label={fav ? "Remove from favourites" : "Add to favourites"}
          className={`absolute top-2 right-2 rounded-full p-2 bg-white/90 shadow transition hover:scale-105 active:scale-95 ${
            fav ? "text-red-500" : "text-gray-800"
          }`}
        >
          <Heart className={`h-5 w-5 ${fav ? "fill-red-500" : "fill-transparent"}`} />
        </button>
      </div>

      <div className="mt-2 lg:p-2">
        <h3 className="text-sm font-medium text-[#1e1e1e] truncate">{name}</h3>
        <p className="text-xs text-[#4b5563] truncate">{location}</p>
        <p className="text-xs text-[#1e1e1e] mt-1 flex items-center justify-between gap-1">
          {priceLabel} / night <span className="text-[#9aa0a6]">•</span>
          <div className="wrap flex items-center gap-1">
            <StarIcon className="h-3 w-3 text-amber-400 fill-amber-400" />
            {displayRating}
          </div>
        </p>
      </div>
    </div>
  );
}
