'use client'

import Image from 'next/image'
import Link from 'next/link'


export default function LoginPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Section: Login Form */}
      <div className="flex flex-col-reverse items-center justify-center p-8 md:p-16 w-full md:w-4/10 min-h-screen">
        <div className="w-full max-w-[448px] mx-auto">
          <h1 className="text-[30px] font-normal text-[#111827] mb-2 text-center ">
            Welcome back to Jenriana
          </h1>
          <p className="text-base text-[#4b5563] mb-8 text-center ">
            Log in to access your bookings and saved apartments.
          </p>

          <form className="flex flex-col space-y-4"> {/* Using space-y-4 for the 10px gap */}
            <div>
              <label htmlFor="email" className="block text-sm font-normal text-[#374151] mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full h-[58px] rounded-lg border border-gray-300 px-4 py-2 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-normal text-[#374151]  mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full h-[58px] rounded-lg border border-gray-300 px-4 py-2 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <button className="w-full h-[58px] bg-[#212121] text-white rounded-lg hover:bg-gray-800 transition-colors text-base font-normal mt-6">
              Continue
            </button>
          </form>

          <p className="text-center text-[#4b5566] mt-4">
            <Link href="/forgot-password" className="text-[#4b5566] text-sm hover:underline font-medium">
              Forgot Password?
            </Link>
          </p>

          <p className="text-center text-[#4b5566] ">
            Don&#39;t have an account?{' '}
            <Link href="/sign-up" className="text-[#111827] hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section: Image and Text (identical to signup page) */}
      <div className="relative w-full md:w-7/10 h-[400px] md:h-screen overflow-hidden">
        <Image
          src="/images/image20.png"
          alt="Luxury apartment with lagoon view"
          fill
          className="object-cover"
          priority
        />
        {/* <div className="absolute inset-0 bg-black/10" /> Dark overlay */}

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
