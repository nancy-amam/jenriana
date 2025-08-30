"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Props {
  name: string;
  gallery?: string[] | null;
}

export default function GalleryGrid({ name, gallery }: Props) {
  return (
    <section className="px-6 max-w-[1400px] mx-auto mb-10">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
        className="text-2xl md:text-[36px] font-semibold text-[#111827] mb-4"
      >
        Apartment Gallery
      </motion.h2>
      {gallery && gallery.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="md:col-span-2"
          >
            <Image
              src={gallery[0] || "/placeholder.svg"}
              alt={`${name} main image`}
              width={1200}
              height={800}
              className="w-full h-auto object-cover rounded-xl"
            />
          </motion.div>
          <div className="flex flex-col gap-4">
            {gallery.slice(1).map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`${name} image ${i + 2}`}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover rounded-xl"
                />
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No images available.</p>
      )}
    </section>
  );
}
