"use client";

import { BathIcon, BedIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  maxGuests: number;
  beds?: number | null;
  baths?: number | null;
  location: string;
}

export default function StatBadges({ maxGuests, beds, baths, location }: Props) {
  const items = [
    { icon: UsersIcon, label: `${maxGuests} Guests` },
    { icon: BedIcon, label: `${beds ?? 1} Beds` },
    { icon: BathIcon, label: `${baths ?? 1} Baths` },
    { icon: MapPinIcon, label: location },
  ];
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
      className="grid grid-cols-2 sm:grid-cols-4 mb-6 gap-4 md:gap-6 px-6 md:px-10 max-w-[1400px] mx-auto"
    >
      {items.map((it, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="border border-gray-200 rounded-xl p-4 flex flex-col items-center bg-white/70 backdrop-blur"
        >
          <it.icon className="w-5 h-5 mb-1 text-[#111827]" />
          <span className="text-sm font-medium text-[#111827]">{it.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
