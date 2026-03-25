"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  name: string;
  gallery?: string[] | null;
  /** Match apartment detail dark theme */
  variant?: "light" | "dark";
}

export default function GalleryGrid({ name, gallery, variant = "light" }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = gallery && gallery.length > 0 ? gallery : [];
  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  }, [images.length]);
  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i >= images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, goPrev, goNext]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const headingClass =
    variant === "dark"
      ? "text-2xl md:text-[34px] font-semibold text-white mb-4"
      : "text-2xl md:text-[36px] font-semibold text-[#111827] mb-4";

  return (
    <section
      className={`px-6 max-w-[1400px] mx-auto mb-10 ${variant === "dark" ? "bg-black pt-6" : ""}`}
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4 }}
        className={headingClass}
      >
        Apartment Gallery
      </motion.h2>
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="relative overflow-hidden rounded-xl aspect-[4/3] cursor-pointer"
              onClick={() => openLightbox(i)}
            >
              <Image
                src={img || "/placeholder.svg"}
                alt={`${name} image ${i + 1}`}
                fill
                sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <p className={variant === "dark" ? "text-zinc-500" : "text-gray-500"}>No images available.</p>
      )}

      <AnimatePresence>
        {lightboxOpen && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(false);
              }}
              className="absolute top-4 right-4 z-10 rounded-full p-2 bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Previous"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Next"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                const threshold = 50;
                if (info.offset.x < -threshold) goNext();
                if (info.offset.x > threshold) goPrev();
              }}
              className="relative max-w-4xl max-h-[85vh] w-full aspect-[4/3] cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[currentIndex] || "/placeholder.svg"}
                alt={`${name} image ${currentIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain select-none pointer-events-none"
                draggable={false}
              />
            </motion.div>

            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
              {currentIndex + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
