'use client'

import Image from 'next/image'
import Link from 'next/link'


export default function SignupPage() {
  return (
    <div className="flex flex-col-reverse md:flex-row min-h-screen">
      {/* Left Section: Sign-up Form */}
      <div className="flex flex-col items-center justify-center p-8 md:p-16 w-full md:w-4/10 max-h-screen">
        <div className="w-full max-w-[448px] mx-auto">
          <h1 className="text-[30px] font-normal text-[#111827] mb-2 text-center  ">
            Create your Jenriana account
          </h1>
          <p className="text-base text-[#4b5563] mb-8 text-center ">
            Book premium apartments across Nigeria with ease.
          </p>

          <form className="flex flex-col space-y-3"> {/* Using space-y-4 for the 10px gap */}
            <input
              type="text"
              placeholder="Full Name"
              className="w-full h-[58px] rounded-lg border border-gray-300 px-4 py-2 text-base placeholder-[#adaebc] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full h-[58px] rounded-lg border border-gray-300 px-4 py-2 text-base placeholder-[#adaebc] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full h-[58px] rounded-lg border border-gray-300 px-4 py-2 text-base placeholder-[#adaebc] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full h-[58px] rounded-lg border border-gray-300 px-4 py-2 text-base placeholder-[#adaebc] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full h-[58px] rounded-lg border border-gray-300 px-4 py-2 text-base placeholder-[#adaebc] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />

            <button className="w-full h-[58px] bg-[#212121] text-white rounded-lg hover:bg-gray-800 transition-colors text-base font-normal mt-2">
              Create Account
            </button>
          </form>

          <p className="text-center text-[#4b5563] mt-1">
            Already have an account?{' '}
            <Link href="/login" className="text-black hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section: Image and Text */}
      <div className="relative w-full md:w-7/10 h-[400px] md:h-screen overflow-hidden">
        <Image
          src="/images/image19.png"
          alt="Luxury apartment with lagoon view"
          fill
          className="object-cover"
          priority
        />
        {/* <div className="absolute inset-0 bg-black/40" /> Dark overlay */}

        {/* Text at the bottom of the image */}
        <div className="absolute bottom-8 left-8 right-8 text-white flex flex-col justify-end">
          <p className="text-lg font-normal ">
            Ikoyi Heights — Luxury Balcony with Lagoon View
          </p>
          {/* 5 dots for pagination */}
          <div className="flex justify-end gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === 0 ? 'bg-white' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
