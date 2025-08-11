'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { signUp } from '@/services/api-services'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import Router, { useRouter } from 'next/router'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullname.trim()) newErrors.fullname = 'Full name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email address'

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters'

    if (!formData.confirmPassword)
      newErrors.confirmPassword = 'Please confirm your password'
    else if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = 'Passwords do not match'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  
const resetForm = () => {
  setFormData({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  setErrors({})
  setShowPassword(false)
  setShowConfirmPassword(false)
}


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!validate()) return

  setLoading(true)
  try {
    const res = await signUp(formData)
    console.log('Signup success:', res)
    
    
    resetForm()
    router.push('/login')
  } catch (err: any) {
    console.error('Signup failed:', err)
    setErrors({ general: err.message || 'Signup failed' })
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="flex flex-col-reverse md:flex-row min-h-screen">
      {/* Left Section: Sign-up Form */}
      <div className="flex flex-col items-center justify-center p-8 md:p-16 w-full md:w-4/10 max-h-screen">
        <div className="w-full max-w-[448px] mx-auto">
          <h1 className="text-[30px] font-normal text-[#111827] mb-2 text-center">
            Create your Jenriana account
          </h1>
          <p className="text-base text-[#4b5563] mb-8 text-center">
            Book premium apartments across Nigeria with ease.
          </p>

          <form
            className="flex flex-col space-y-3"
            onSubmit={handleSubmit}
            noValidate
          >
            <input
              name="fullname"
              type="text"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full h-[58px] rounded-lg border border-gray-300 px-4 py-2 text-base placeholder-[#adaebc] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm">{errors.fullname}</p>
            )}

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-[58px] rounded-lg border border-gray-300 px-4 py-2 text-base placeholder-[#adaebc] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full h-[58px] rounded-lg border border-gray-300 px-4 py-2 text-base placeholder-[#adaebc] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}

            {/* Password Field with Eye Icon */}
            <div className="relative w-full">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-[58px] rounded-lg border border-gray-300 px-4 py-2 pr-10 text-base placeholder-[#adaebc] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}

            {/* Confirm Password Field with Eye Icon */}
            <div className="relative w-full">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full h-[58px] rounded-lg border border-gray-300 px-4 py-2 pr-10 text-base placeholder-[#adaebc] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}

            {errors.general && (
              <p className="text-red-500 text-sm text-center">
                {errors.general}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[58px] bg-[#212121] text-white rounded-lg hover:bg-gray-800 transition-colors text-base font-normal mt-2 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-[#4b5563] mt-1">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-black hover:underline font-medium"
            >
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

        <div className="absolute bottom-8 left-8 right-8 text-white flex flex-col justify-end">
          <p className="text-lg font-normal">
            Ikoyi Heights — Luxury Balcony with Lagoon View
          </p>
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
