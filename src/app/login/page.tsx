'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { signIn } from '@/services/api-services'
import { SignInData } from '@/lib/interface'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [formData, setFormData] = useState<SignInData>({
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await signIn(formData)
      console.log('Sign in success:', res)

      // ✅ No need to store token manually — cookie is set automatically
      // But you can keep minimal info for client-side logic
      if (res.user) {
        localStorage.setItem('userId', res.user.id)
        localStorage.setItem('userRole', res.user.role)
      }

      // Clear form
      setFormData({ email: '', password: '' })

      // Redirect based on user role
      if (res.user?.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }

    } catch (err: any) {
      console.error('Sign in failed:', err)
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col-reverse md:flex-row min-h-screen">
      {/* Left Section: Login Form */}
      <div className="flex flex-col items-center justify-center p-8 md:p-16 w-full md:w-4/10">
        <div className="w-full max-w-[448px] mx-auto">
          <h1 className="text-[30px] font-normal text-[#111827] mb-2 text-center">
            Welcome back to Jenriana
          </h1>
          <p className="text-base text-[#4b5563] mb-8 text-center">
            Log in to access your bookings and saved apartments.
          </p>

          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-normal text-[#374151] mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full h-[58px] rounded-lg border border-gray-300 px-4 py-2 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-normal text-[#374151] mb-1">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full h-[58px] rounded-lg border border-gray-300 px-4 py-2 pr-12 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[55px] -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[58px] bg-[#212121] text-white rounded-lg hover:bg-gray-800 transition-colors text-base font-normal mt-6"
            >
              {loading ? 'Signing in...' : 'Continue'}
            </button>
          </form>

          <p className="text-center text-[#4b5566] mt-4">
            <Link href="/forgot-password" className="text-[#4b5566] text-sm hover:underline font-medium">
              Forgot Password?
            </Link>
          </p>

          <p className="text-center text-[#4b5566]">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-[#111827] hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section: Image */}
      <div className="relative w-full md:w-7/10 h-[400px] md:h-screen overflow-hidden">
        <Image
          src="/images/image20.png"
          alt="Luxury apartment with lagoon view"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-8 left-8 right-8 text-white flex flex-col justify-end">
          <p className="text-lg font-normal">
            Ikoyi Heights — Luxury Balcony with Lagoon View
          </p>
          <div className="flex justify-end gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-gray-400'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
