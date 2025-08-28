import { locationFeatures } from '@/lib/dummy-data';
import Image from 'next/image';

export default function Features () {
    return (
        
        <section  className="py-12 md:py-24 lg:py-32 px-4 md:px-16 mt-5" >
          <h2 className="text-2xl md:text-[36px] font-medium mb-6 md:mb-8 text-[#1e1e1e] text-left">
            Explore by Location
          </h2>
        
          {/* Mobile horizontal scroll (unchanged) */}
          <div className="md:hidden flex gap-4 overflow-x-auto no-scrollbar">
            {locationFeatures.map((feature, idx) => (
              <div key={idx} className="min-w-[260px] flex-shrink-0 rounded-[20px] overflow-hidden">
                <div className="relative w-full h-[220px]">
                  <Image
                    src={feature.src || "/placeholder.svg"}
                    alt={feature.alt}
                    fill
                    className="object-cover rounded-[20px]"
                     loading="lazy"
                   aria-label={`Image of ${feature.alt}`}
                  />
                </div>
                <div className="p-4 text-left">
                  <h3 className="text-base font-normal text-[#1e1e1e]">{feature.locationName}</h3>
                  <p className="text-sm text-[#4b5563]">{feature.apartmentCount} Apartments</p>
                </div>
              </div>
            ))}
          </div>
        
          {/* Desktop custom grid */}
          <div className="hidden md:grid grid-cols-4 gap-x-6  ">
            {/* Top Row */}
            <div className="col-span-1 row-span-1">
              <div className="relative w-full h-[323px]">
                <Image
                  src={locationFeatures[0].src || "/placeholder.svg"}
                  alt={locationFeatures[0].alt}
                  fill
                  className="object-cover rounded-[20px]"
                   loading="lazy"
          aria-label={`Image of ${locationFeatures}`}
                />
              </div>
              <div className="p-2 text-left">
                <h3 className="text-base font-normal text-[#1e1e1e]">{locationFeatures[0].locationName}</h3>
                <p className="text-base text-[#4b5563]">{locationFeatures[0].apartmentCount} Apartments</p>
              </div>
            </div>
            <div className="col-span-1 row-span-1">
              <div className="relative w-full h-[323px]">
                <Image
                  src={locationFeatures[1].src || "/placeholder.svg"}
                  alt={locationFeatures[1].alt}
                  fill
                  className="object-cover rounded-[20px]"
                   loading="lazy"
          aria-label={`Image of ${locationFeatures}`}
                />
              </div>
              <div className="p-2 text-left">
                <h3 className="text-base font-normal text-[#1e1e1e]">{locationFeatures[1].locationName}</h3>
                <p className="text-base text-[#4b5563]">{locationFeatures[1].apartmentCount} Apartments</p>
              </div>
            </div>
            <div className="col-span-2 row-span-2">
              <div className="relative w-full h-[323px] ">
                <Image
                  src={locationFeatures[2].src || "/placeholder.svg"}
                  alt={locationFeatures[2].alt}
                  fill
                  className="object-cover rounded-[20px]"
                   loading="lazy"
          aria-label={`Image of ${locationFeatures}`}
                />
              </div>
              <div className="p-2 text-left">
                <h3 className="text-base font-normal text-[#1e1e1e]">{locationFeatures[2].locationName}</h3>
                <p className="text-base text-[#4b5563]">{locationFeatures[2].apartmentCount} Apartments</p>
              </div>
            </div>
        
            {/* Bottom Row */}
            <div className="col-span-2 row-span-2 mt-5">
              <div className="relative w-full h-[323px] ">
                <Image
                  src={locationFeatures[3].src || "/placeholder.svg"}
                  alt={locationFeatures[3].alt}
                  fill
                  className="object-cover rounded-[20px]"
                   loading="lazy"
          aria-label={`Image of ${locationFeatures}`}
                />
              </div>
              <div className="p-2 text-left">
                <h3 className="text-base font-normal text-[#1e1e1e]">{locationFeatures[3].locationName}</h3>
                <p className="text-base text-[#4b5563]">{locationFeatures[3].apartmentCount} Apartments</p>
              </div>
            </div>
            <div className="col-span-1 row-span-1">
              <div className="relative w-full h-[323px]">
                <Image
                  src={locationFeatures[4].src || "/placeholder.svg"}
                  alt={locationFeatures[4].alt}
                  fill
                  className="object-cover rounded-[20px]"
                   loading="lazy"
          aria-label={`Image of ${locationFeatures}`}
                />
              </div>
              <div className="p-2 text-left">
                <h3 className="text-base font-normal text-[#1e1e1e]">{locationFeatures[4].locationName}</h3>
                <p className="text-base text-[#4b5563]">{locationFeatures[4].apartmentCount} Apartments</p>
              </div>
            </div>
            <div className="col-span-1 row-span-1">
              <div className="relative w-full h-[323px]">
                <Image
                  src={locationFeatures[5].src || "/placeholder.svg"}
                  alt={locationFeatures[5].alt}
                  fill
                  className="object-cover rounded-[20px]"
                   loading="lazy"
          aria-label={`Image of ${locationFeatures}`}
                />
              </div>
              <div className="p-2 text-left">
                <h3 className="text-base font-normal text-[#1e1e1e]">{locationFeatures[5].locationName}</h3>
                <p className="text-base text-[#4b5563]">{locationFeatures[5].apartmentCount} Apartments</p>
              </div>
            </div>
          </div>
        </section>
        
        
    )
}