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

export function TrendingApartmentCard({ apartment }: TrendingApartmentCardProps) {
  const displayRating = typeof apartment.rating === "number" ? apartment.rating.toFixed(1) : "4.8";
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <Link href={`/apartment/${apartment.id}`} className="group block">
      <div
        ref={ref}
        className={`w-[240px] flex-shrink-0 overflow-hidden rounded-xl border border-explore-accent/15 bg-gradient-to-b from-zinc-900/90 to-explore-bg  transition-all duration-500 ease-out will-change-transform sm:w-[252px] md:w-[280px] ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        } group-hover:border-explore-accent/35 group-hover:shadow-[0_24px_48px_rgba(166,145,117,0.08)]`}
      >
        <div className="relative h-[148px] w-full overflow-hidden sm:h-[158px] md:h-[172px]">
          <Image
            src={apartment.imageUrl || "/placeholder.svg"}
            alt={apartment.name}
            width={400}
            height={380}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 opacity-90" aria-hidden />
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between md:bottom-2.5 md:left-2.5 md:right-2.5">
            <span className="rounded-full border border-explore-accent/25 bg-black/50 px-2 py-0.5 font-luxury-body text-[9px] uppercase tracking-wider text-explore-accent backdrop-blur-sm md:px-2.5 md:text-[10px]">
              Featured
            </span>
            <div className="flex items-center gap-0.5 rounded-full border border-white/10 bg-black/45 px-1.5 py-0.5 backdrop-blur-sm md:gap-1 md:px-2">
              <StarIcon className="h-2.5 w-2.5 fill-explore-accent text-explore-accent md:h-3 md:w-3" />
              <span className="text-[10px] font-medium text-white md:text-xs">{displayRating}</span>
            </div>
          </div>
        </div>
        <div className="border-t border-explore-accent/10 px-3 pb-3 pt-2.5 md:px-3.5 md:pb-4 md:pt-3">
          <h3 className="font-luxury-display text-sm font-normal line-clamp-1 capitalize leading-snug tracking-tight text-white md:text-base">
            {apartment.name}
          </h3>
          <p className="font-luxury-body mt-0.5 text-[11px] capitalize text-luxury-muted md:mt-1 md:text-xs">
            {apartment.location}
          </p>
          <div className="mt-2 flex items-end justify-between border-t border-white/5 pt-2 md:mt-2.5 md:pt-2.5">
            <div>
              <p className="font-luxury-body text-[9px] uppercase tracking-[0.15em] text-luxury-muted md:text-[10px]">
                From
              </p>
              <span className="font-luxury-display text-base text-explore-accent md:text-lg">
                {apartment.price}
                <span className="font-luxury-body text-[10px] font-normal tracking-normal text-luxury-muted md:text-xs">
                  {" "}
                  / night
                </span>
              </span>
            </div>
            <p className="font-luxury-body max-w-[48%] text-right text-[9px] leading-tight text-luxury-muted md:text-[10px]">
              {apartment.guests} guests · {apartment.beds} bed
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
