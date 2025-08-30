"use client";

import { AirVent, Wifi, Utensils, Tv, Laptop, Dumbbell, ParkingSquare, ShieldCheck, Battery } from "lucide-react";
import { motion } from "framer-motion";

const featureMapping = {
  wifi: { name: "WiFi", icon: Wifi, color: "text-green-500" },
  parking: { name: "Parking", icon: ParkingSquare, color: "text-teal-500" },
  gym: { name: "Gym", icon: Dumbbell, color: "text-green-500" },
  ac: { name: "Air Conditioning", icon: AirVent, color: "text-blue-500" },
  kitchen: { name: "Kitchen", icon: Utensils, color: "text-orange-500" },
  tv: { name: "Smart TV", icon: Tv, color: "text-red-500" },
  washing: { name: "Washing Machine", icon: Laptop, color: "text-purple-500" },
  security: { name: "24/7 Security", icon: ShieldCheck, color: "text-indigo-500" },
  "air-conditioning": { name: "Air Conditioning", icon: AirVent, color: "text-blue-500" },
  "smart-tv": { name: "Smart TV", icon: Tv, color: "text-red-500" },
  "washing-machine": { name: "Washing Machine", icon: Laptop, color: "text-purple-500" },
  "24-7-security": { name: "24/7 Security", icon: ShieldCheck, color: "text-indigo-500" },
  generator: { name: "Backup Generator", icon: Battery, color: "text-yellow-500" },
};

interface Props {
  features?: string[] | null;
}

export default function OffersGrid({ features = [] }: Props) {
  const mapped = features
    ?.map((f) => ({ key: f, ...featureMapping[f as keyof typeof featureMapping] }))
    .filter((x) => x.name);
  return (
    <section className="max-w-[1400px] mx-auto px-4 mb-10">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
        className="text-2xl md:text-[36px] font-semibold text-[#111827] mb-6"
      >
        What This Apartment Offers
      </motion.h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {mapped!?.length > 0 ? (
          mapped?.map((f) => (
            <motion.div
              key={f.key}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full h-[108px] border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-center bg-white/70 backdrop-blur"
            >
              {f.icon && <f.icon size={28} className={f.color} />}
              <div className="text-sm text-gray-800">{f.name}</div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500">No features listed.</p>
        )}
      </div>
    </section>
  );
}
