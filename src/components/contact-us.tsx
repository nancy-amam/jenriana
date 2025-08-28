import Image from "next/image"
import Link from "next/link"


export default function Contact () {
    return (
         <section className="relative py-24 md:py-32 lg:py-40 flex items-center justify-center text-center text-white overflow-hidden">
        <Image src="/images/contact-bg.png" alt="Modern apartment interior" fill className="object-cover z-0" loading='lazy' />
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative z-20 max-w-3xl px-6">
          <h2 className="text-xl md:text-2xl md:text-[36px] font-normal mb-4">
            Can&apos;t Decide? Let&apos;s Help You Find the Perfect Apartment.
          </h2>
          <p className="text-sm md:text-base mb-8">
            Not sure where to start? Our team is ready to assist you in choosing an apartment that fits your needs — no stress, no pressure.
          </p>
          <Link href={'/contact-us'}>
          <button className="bg-[#212121] mt-5 text-white text-sm py-4 px-10 rounded-lg font-normal hover:bg-gray-800 transition cursor-pointer ">
            Contact Us
          </button>
          </Link>
        </div>
      </section>
    )
}