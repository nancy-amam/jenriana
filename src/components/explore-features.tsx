"use client";

import { locationFeatures } from "@/lib/dummy-data";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";

function FadeInUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transform-gpu will-change-transform transition-all duration-700 ease-out opacity-0 translate-y-8 ${
        inView ? "opacity-100 translate-y-0" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function Features() {
  const router = useRouter();

  const goToLocation = (location: string) => {
    const formatted = location.toLowerCase().replace(/\s+/g, "-");
    router.push(`/apartment?location=${formatted}`);
  };

  return (
    <section className="py-4 lg:py-12 px-4 md:px-16 bg-black/5">
      <FadeInUp>
        <h2 className="lg:text-xl font-semibold mb-6 md:mb-5 text-[#1e1e1e]">Explore by Location</h2>
      </FadeInUp>

      <div className="md:hidden flex gap-4 overflow-x-auto no-scrollbar">
        {locationFeatures.map((feature, idx) => (
          <FadeInUp key={idx} delay={idx * 90} className="min-w-[200px] flex-shrink-0">
            <div
              onClick={() => goToLocation(feature.locationName)}
              className="rounded-[20px] overflow-hidden cursor-pointer"
            >
              <div className="relative w-full h-[160px]">
                <Image
                  src={feature.src || "/placeholder.svg"}
                  alt={feature.alt}
                  fill
                  className="object-cover rounded-[20px]"
                  loading="lazy"
                />
              </div>
              <div className="p-3 text-left">
                <h3 className="text-sm font-normal text-[#1e1e1e]">{feature.locationName}</h3>
                <p className="text-xs text-[#4b5563]">{feature.apartmentCount} Apartments</p>
              </div>
            </div>
          </FadeInUp>
        ))}
      </div>

      <div className="hidden md:grid grid-cols-4 gap-x-5 gap-y-6">
        {locationFeatures.map((feature, idx) => (
          <FadeInUp
            key={idx}
            delay={idx * 90}
            className={`${idx === 2 || idx === 3 ? "col-span-2" : "col-span-1"} ${idx === 3 ? "mt-4" : ""}`}
          >
            <div
              onClick={() => goToLocation(feature.locationName)}
              className="cursor-pointer rounded-[20px] overflow-hidden"
            >
              <div
                className={`relative w-full ${
                  idx === 2 || idx === 3 ? "h-[240px] lg:h-[260px]" : "h-[200px] lg:h-[220px]"
                }`}
              >
                <Image
                  src={feature.src || "/placeholder.svg"}
                  alt={feature.alt}
                  fill
                  className="object-cover rounded-[20px]"
                  loading="lazy"
                />
              </div>

              <div className="p-2 text-left">
                <h3 className="text-sm font-normal text-[#1e1e1e]">{feature.locationName}</h3>
                <p className="text-sm text-[#4b5563]">{feature.apartmentCount} Apartments</p>
              </div>
            </div>
          </FadeInUp>
        ))}
      </div>
    </section>
  );
}
