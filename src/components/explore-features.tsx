"use client";

import { locationFeatures } from "@/lib/dummy-data";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

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
  return (
    <section className="py-4 lg:py-12 px-4 md:px-16 bg-black/5">
      <FadeInUp>
        <h2 className="lg:text-xl font-semibold mb-6 md:mb-5 text-[#1e1e1e] text-left">Explore by Location</h2>
      </FadeInUp>

      <div className="md:hidden flex gap-4 overflow-x-auto no-scrollbar overflow-hidden">
        {locationFeatures.map((feature, idx) => (
          <FadeInUp key={idx} delay={idx * 90} className="min-w-[200px] flex-shrink-0 rounded-[20px] overflow-hidden">
            <div className="relative w-full h-[160px]">
              <Image
                src={feature.src || "/placeholder.svg"}
                alt={feature.alt}
                fill
                className="object-cover rounded-[20px]"
                loading="lazy"
                aria-label={`Image of ${feature.locationName}`}
              />
            </div>
            <div className="p-3 text-left">
              <h3 className="text-sm font-normal text-[#1e1e1e]">{feature.locationName}</h3>
              <p className="text-xs text-[#4b5563]">{feature.apartmentCount} Apartments</p>
            </div>
          </FadeInUp>
        ))}
      </div>

      <div className="hidden md:grid grid-cols-4 gap-x-5 gap-y-6">
        <FadeInUp delay={0} className="col-span-1">
          <div className="relative w-full h-[200px] lg:h-[220px]">
            <Image
              src={locationFeatures[0].src || "/placeholder.svg"}
              alt={locationFeatures[0].alt}
              fill
              className="object-cover rounded-[20px]"
              loading="lazy"
              aria-label={`Image of ${locationFeatures[0].locationName}`}
            />
          </div>
          <div className="p-2 text-left">
            <h3 className="text-sm font-normal text-[#1e1e1e]">{locationFeatures[0].locationName}</h3>
            <p className="text-sm text-[#4b5563]">{locationFeatures[0].apartmentCount} Apartments</p>
          </div>
        </FadeInUp>

        <FadeInUp delay={90} className="col-span-1">
          <div className="relative w-full h-[200px] lg:h-[220px]">
            <Image
              src={locationFeatures[1].src || "/placeholder.svg"}
              alt={locationFeatures[1].alt}
              fill
              className="object-cover rounded-[20px]"
              loading="lazy"
              aria-label={`Image of ${locationFeatures[1].locationName}`}
            />
          </div>
          <div className="p-2 text-left">
            <h3 className="text-sm font-normal text-[#1e1e1e]">{locationFeatures[1].locationName}</h3>
            <p className="text-sm text-[#4b5563]">{locationFeatures[1].apartmentCount} Apartments</p>
          </div>
        </FadeInUp>

        <FadeInUp delay={180} className="col-span-2">
          <div className="relative w-full h-[220px] lg:h-[240px]">
            <Image
              src={locationFeatures[2].src || "/placeholder.svg"}
              alt={locationFeatures[2].alt}
              fill
              className="object-cover rounded-[20px]"
              loading="lazy"
              aria-label={`Image of ${locationFeatures[2].locationName}`}
            />
          </div>
          <div className="p-2 text-left">
            <h3 className="text-sm font-normal text-[#1e1e1e]">{locationFeatures[2].locationName}</h3>
            <p className="text-sm text-[#4b5563]">{locationFeatures[2].apartmentCount} Apartments</p>
          </div>
        </FadeInUp>

        <FadeInUp delay={270} className="col-span-2 mt-4">
          <div className="relative w-full h-[220px] lg:h-[240px]">
            <Image
              src={locationFeatures[3].src || "/placeholder.svg"}
              alt={locationFeatures[3].alt}
              fill
              className="object-cover rounded-[20px]"
              loading="lazy"
              aria-label={`Image of ${locationFeatures[3].locationName}`}
            />
          </div>
          <div className="p-2 text-left">
            <h3 className="text-sm font-normal text-[#1e1e1e]">{locationFeatures[3].locationName}</h3>
            <p className="text-sm text-[#4b5563]">{locationFeatures[3].apartmentCount} Apartments</p>
          </div>
        </FadeInUp>

        <FadeInUp delay={360} className="col-span-1">
          <div className="relative w-full h-[200px] lg:h-[220px]">
            <Image
              src={locationFeatures[4].src || "/placeholder.svg"}
              alt={locationFeatures[4].alt}
              fill
              className="object-cover rounded-[20px]"
              loading="lazy"
              aria-label={`Image of ${locationFeatures[4].locationName}`}
            />
          </div>
          <div className="p-2 text-left">
            <h3 className="text-sm font-normal text-[#1e1e1e]">{locationFeatures[4].locationName}</h3>
            <p className="text-sm text-[#4b5563]">{locationFeatures[4].apartmentCount} Apartments</p>
          </div>
        </FadeInUp>

        <FadeInUp delay={450} className="col-span-1">
          <div className="relative w-full h-[200px] lg:h-[220px]">
            <Image
              src={locationFeatures[5].src || "/placeholder.svg"}
              alt={locationFeatures[5].alt}
              fill
              className="object-cover rounded-[20px]"
              loading="lazy"
              aria-label={`Image of ${locationFeatures[5].locationName}`}
            />
          </div>
          <div className="p-2 text-left">
            <h3 className="text-sm font-normal text-[#1e1e1e]">{locationFeatures[5].locationName}</h3>
            <p className="text-sm text-[#4b5563]">{locationFeatures[5].apartmentCount} Apartments</p>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
