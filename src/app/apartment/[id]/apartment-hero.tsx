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
}

export default function ApartmentHero({ name, location, imageUrl, pricePerNight, averageRating }: Props) {
  return (
    <section className="relative w-full h-[50vh] lg:h-[40vh]">
      <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute bottom-10 md:bottom-14 left-0 right-0 text-white px-4 md:px-10"
      >
        <div className="w-full md:max-w-[60%] mb-5">
          <h1 className="text-[32px] md:text-[48px] font-semibold tracking-tight">{name}</h1>
          <p className="text-base md:text-lg text-white/90">{location}</p>
          <div className="flex mt-2 items-center gap-2 text-sm text-white/80">
            <StarIcon className="w-4 h-4 text-yellow-400" />
            <span>{averageRating ?? 4.9}</span>
          </div>
          <div className="text-[22px] md:text-[30px] mt-3 font-semibold">
            ₦{pricePerNight.toLocaleString()} <span className="text-sm font-normal">/ night</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
