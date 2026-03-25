"use client";

import Image from "next/image";
import { StarIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  name: string;
  location: string;
  imageUrl?: string;
  pricePerNight: number;
  averageRating?: number | null;
  /** Hide price on hero when booking sidebar shows it (detail layout) */
  hidePrice?: boolean;
  /** When set, shows a top “Book now” control that smooth-scrolls to this element id */
  bookNowScrollToId?: string;
}

export default function ApartmentHero({
  name,
  location,
  imageUrl,
  pricePerNight,
  averageRating,
  hidePrice,
  bookNowScrollToId,
}: Props) {
  const scrollToBooking = () => {
    if (!bookNowScrollToId) return;
    document.getElementById(bookNowScrollToId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative w-full h-[40vh] min-h-[220px]">
      <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" priority />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/50" aria-hidden />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute bottom-8 left-0 right-0 z-10 px-4 md:bottom-10 md:px-10"
      >
        <div className="w-full md:max-w-[60%] mb-5 [text-shadow:0_1px_2px_rgba(0,0,0,0.5),0_2px_24px_rgba(0,0,0,0.35)]">
          <h1 className="text-[32px] md:text-[48px] font-semibold tracking-tight text-white">{name}</h1>
          <p className="text-base md:text-lg text-white">{location}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-white/95">
              <StarIcon className="h-4 w-4 text-yellow-400 drop-shadow-sm" aria-hidden />
              <span className="font-medium tabular-nums">{averageRating != null ? averageRating.toFixed(1) : "4.9"}</span>
            </div>
            {bookNowScrollToId && (
              <button
                type="button"
                onClick={scrollToBooking}
                className="rounded-full bg-[color:var(--color-explore-accent)] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[color:var(--color-explore-accent-hover)] [text-shadow:none]"
              >
                Book now
              </button>
            )}
          </div>
          {!hidePrice && (
            <div className="text-[22px] md:text-[30px] mt-3 font-semibold">
              ₦{pricePerNight.toLocaleString()} <span className="text-sm font-normal">/ night</span>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
