import Image from "next/image";
import Link from "next/link";

const MAPS_QUERY =
  "https://www.google.com/maps/search/?api=1&query=Abuja%2C+Nigeria+FCT";

export default function LocationBookSplit() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 w-full">
      {/* Our location */}
      <div className="relative min-h-[420px] md:min-h-[520px] flex flex-col items-center justify-center text-center px-6 py-20 md:py-24 md:px-10">
        <Image
          src="/images/location/location-split-left.png"
          alt="Modern apartment interior"
          fill
          className="object-cover z-0"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/70 z-10" />
        <div className="relative z-20 max-w-md flex flex-col items-center gap-4 text-white">
          <p className="text-[11px] md:text-xs tracking-[0.25em] uppercase text-explore-accent">
            Our location
          </p>
          <h2 className="text-3xl md:text-[2.25rem] leading-tight font-normal text-white">
            Where We Are
          </h2>
          <div className="text-sm md:text-[15px] leading-relaxed text-white/95 space-y-3">
            <p>Jenriana — short-term apartment rentals across Nigeria.</p>
            <p>
              Serving guests in Abuja, Lagos, and more. Contact us for the property nearest you.
            </p>
            <p>
              Tel:{" "}
              <a href="tel:+2348012345678" className="underline-offset-2 hover:underline">
                +234 801 234 5678
              </a>
            </p>
            <p>
              Email:{" "}
              <a
                href="mailto:info@jenrianna.com"
                className="underline-offset-2 hover:underline break-all"
              >
                info@jenrianna.com
              </a>
            </p>
          </div>
          <Link
            href={MAPS_QUERY}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center justify-center border border-explore-accent text-white text-sm px-8 py-3 rounded-md hover:bg-white/10 transition-colors"
          >
            Get Directions
          </Link>
        </div>
      </div>

      {/* Book a stay */}
      <div className="relative min-h-[420px] md:min-h-[520px] flex flex-col items-center justify-center text-center px-6 py-20 md:py-24 md:px-10">
        <Image
          src="/images/location/location-split-right.png"
          alt="Living room and dining area"
          fill
          className="object-cover z-0"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/70 z-10" />
        <div className="relative z-20 max-w-md flex flex-col items-center gap-4 text-white">
          <p className="text-[11px] md:text-xs tracking-[0.25em] uppercase text-explore-accent">
            Book a stay
          </p>
          <h2 className="text-3xl md:text-[2.25rem] leading-tight font-normal text-white">
            Spend Your Time With Us
          </h2>
          <div className="text-sm md:text-[15px] leading-relaxed text-white/95 space-y-3">
            <p>
              Everything at Jenriana is designed to make your stay comfortable and memorable.
            </p>
            <p>
              Tel:{" "}
              <a href="tel:+2348012345678" className="underline-offset-2 hover:underline">
                +234 801 234 5678
              </a>
            </p>
            <p>
              Email:{" "}
              <a
                href="mailto:info@jenrianna.com"
                className="underline-offset-2 hover:underline break-all"
              >
                info@jenrianna.com
              </a>
            </p>
          </div>
          <Link
            href="/apartment"
            className="mt-2 inline-flex items-center justify-center border border-explore-accent text-white text-sm px-8 py-3 rounded-md hover:bg-white/10 transition-colors"
          >
            Reserve Your Stay
          </Link>
        </div>
      </div>
    </section>
  );
}
