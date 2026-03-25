"use client";

import Image from "next/image";
import { Heart, StarIcon } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface ApartmentGridCardProps {
  imageUrl?: string;
  name: string;
  location: string;
  priceLabel: string; // e.g. "₦120,000"
  rating?: number;
  maxGuests?: number;
  rooms?: number;
  isGuestFavorite?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (next: boolean) => void;
}

export function ApartmentGridCard({
  imageUrl,
  name,
  location,
  priceLabel,
  rating = 4.9,
  maxGuests,
  rooms,
  isGuestFavorite = false,
  isFavorite,
  onToggleFavorite,
}: ApartmentGridCardProps) {
  const [fav, setFav] = useState<boolean>(!!isFavorite);
  const displayRating = typeof rating === "number" ? rating.toFixed(2) : "4.90";
  const detailLine = [
    maxGuests != null && maxGuests > 0 ? `${maxGuests} guest${maxGuests === 1 ? "" : "s"}` : null,
    rooms != null && rooms > 0 ? `${rooms} bed${rooms === 1 ? "" : "s"}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !fav;
    setFav(next);
    onToggleFavorite?.(next);
  };

  return (
    <div
      className={clsx(
        "group w-full overflow-hidden rounded-xl border border-explore-accent/15",
        "bg-gradient-to-b from-zinc-900/95 to-explore-bg",
        "transition-all duration-500 ease-out will-change-transform",
        "hover:border-explore-accent/35 hover:shadow-[0_24px_48px_rgba(166,145,117,0.1)]",
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden sm:aspect-[4/3]">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
          sizes="(min-width:1280px) 16vw, (min-width:1024px) 20vw, (min-width:768px) 30vw, 50vw"
          priority={false}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-90"
          aria-hidden
        />

        {isGuestFavorite && (
          <span className="absolute left-2 top-2 z-[1] rounded-full border border-explore-accent/30 bg-black/55 px-2.5 py-1 font-luxury-body text-[10px] font-medium uppercase tracking-wider text-explore-accent backdrop-blur-sm md:left-2.5 md:top-2.5 md:px-3 md:text-[11px]">
            Guest favorite
          </span>
        )}

        <button
          type="button"
          onClick={toggle}
          aria-pressed={fav}
          aria-label={fav ? "Remove from favourites" : "Add to favourites"}
          className={clsx(
            "absolute right-2 top-2 z-[1] rounded-full border p-2 backdrop-blur-sm transition",
            "border-white/15 bg-black/50 hover:scale-105 active:scale-95",
            fav ? "text-red-400" : "text-zinc-200 hover:text-white",
          )}
        >
          <Heart className={clsx("h-4 w-4 md:h-5 md:w-5", fav ? "fill-red-400" : "fill-transparent")} />
        </button>

        <div className="absolute bottom-2 right-2 z-[1] md:bottom-2.5 md:right-2.5">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/50 px-2 py-0.5 backdrop-blur-sm md:gap-1 md:px-2.5">
            <StarIcon className="h-3 w-3 fill-explore-accent text-explore-accent md:h-3.5 md:w-3.5" />
            <span className="text-[10px] font-medium text-white md:text-xs">{displayRating}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-explore-accent/10 px-3 pb-3 pt-2.5 md:px-3.5 md:pb-4 md:pt-3">
        <h3 className="font-luxury-display line-clamp-1 text-sm font-normal capitalize leading-snug tracking-tight text-white md:text-base">
          {name}
        </h3>
        <p className="font-luxury-body mt-0.5 line-clamp-1 text-[11px] capitalize text-luxury-muted md:mt-1 md:text-xs">
          {location}
        </p>

        <div className="mt-2.5 flex items-end justify-between gap-2 border-t border-white/5 pt-2.5 md:mt-3 md:pt-3">
          <div>
            <p className="font-luxury-body text-[9px] uppercase tracking-[0.15em] text-luxury-muted md:text-[10px]">
              From
            </p>
            <p className="font-luxury-display text-base text-explore-accent md:text-lg">
              {priceLabel}
              <span className="font-luxury-body text-[10px] font-normal tracking-normal text-luxury-muted md:text-xs">
                {" "}
                / night
              </span>
            </p>
          </div>
          {detailLine ? (
            <p className="font-luxury-body max-w-[48%] text-right text-[9px] leading-tight text-luxury-muted md:text-[10px]">
              {detailLine}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
