"use client";

import { UsersIcon, Ban, Baby, Info } from "lucide-react";
import { motion } from "framer-motion";

const ruleMapping = {
  "no-smoking": { name: "No smoking", icon: Ban, color: "text-red-500" },
  "no-parties": { name: "No parties or events", icon: Ban, color: "text-yellow-500" },
  "pets-allowed": { name: "Pets allowed", icon: Baby, color: "text-green-500" },
  "children-allowed": { name: "Children allowed", icon: Baby, color: "text-green-500" },
  "do-not-exceed-guest-count": { name: "Do not exceed booked guests count", icon: UsersIcon, color: "text-blue-500" },
  "max-guests-enforced": { name: "Do not exceed booked guests count", icon: UsersIcon, color: "text-blue-500" },
  "check-in-3pm-11pm": { name: "Check-in time: 3:00PM – 11:00PM", icon: Info, color: "text-purple-500" },
};

interface Props {
  address: string;
  rules?: string[] | null;
}

export default function LocationBlock({ address, rules = [] }: Props) {
  return (
    <section className="max-w-[1400px] mx-auto px-4 mb-12">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
        className="text-2xl md:text-[36px] font-semibold text-[#111827] mb-6"
      >
        Location
      </motion.h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full h-[420px] md:h-[500px] rounded-xl overflow-hidden border"
        >
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="rounded-xl"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex flex-col gap-4 md:mt-10"
        >
          <h3 className="text-lg font-semibold">Things to know before booking</h3>
          {rules!?.length > 0 ? (
            rules?.map((rule) => {
              const r = ruleMapping[rule as keyof typeof ruleMapping];
              if (!r) return null;
              const Icon = r.icon;
              return (
                <div key={rule} className="flex items-start gap-2 text-gray-800">
                  <Icon className={`w-5 h-5 mt-1 ${r.color}`} />
                  <span>{r.name}</span>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No rules specified.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
