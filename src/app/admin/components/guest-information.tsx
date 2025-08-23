"use client"

import { X, User, Mail, Phone, MapPin, MessageSquare } from "lucide-react"

interface Booking {
  _id: string
  userId: string
  apartmentId: string
  checkInDate: string
  checkOutDate: string
  guests: number
  status: string
  totalAmount: number
  paymentMethod: string
  residentialAddress: string
  addons: Array<{
    name: string
    price: number
    pricingType: string
    total: number
  }>
  serviceCharge: number
  tax: number
  customerName: string
  customerEmail: string
  customerPhone: string
  specialRequest?: string
  createdAt: string
  updatedAt: string
}

interface GuestInfoModalProps {
  booking: Booking | null
  isOpen: boolean
  onClose: () => void
}

const GuestInfoModal = ({ booking, isOpen, onClose }: GuestInfoModalProps) => {
  if (!isOpen || !booking) return null

  return (
    <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      {/* Header */}
      <div className="bg-white rounded-lg w-full max-w-sm sm:max-w-md lg:max-w-lg max-h-[500px] shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Guest Information</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 space-y-3">
          {/* Booking ID */}
          <div className="text-center bg-gray-50 p-2 rounded-lg">
            <span className="text-sm text-gray-600 block">Booking ID</span>
            <p className="font-mono font-medium text-gray-900 text-sm">#{booking._id.slice(-8)}</p>
          </div>

          {/* Guest Details */}
          <div className="space-y-2">
            {/* Name */}
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <label className="text-sm font-medium text-gray-700 block">Full Name</label>
                <p className="text-sm text-gray-900 mt-1 break-words">{booking.customerName}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <label className="text-sm font-medium text-gray-700 block">Email Address</label>
                <p className="text-sm text-gray-900 mt-1 break-all">{booking.customerEmail}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <label className="text-sm font-medium text-gray-700 block">Phone Number</label>
                <p className="text-sm text-gray-900 mt-1">{booking.customerPhone}</p>
              </div>
            </div>

            {/* Residential Address */}
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <label className="text-sm font-medium text-gray-700 block">Residential Address</label>
                <p className="text-sm text-gray-900 mt-1 break-words">{booking.residentialAddress || "Not provided"}</p>
              </div>
            </div>

            {/* Special Requests */}
            <div className="flex items-start gap-3">
              <MessageSquare className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <label className="text-sm font-medium text-gray-700 block">Special Requests</label>
                <p className="text-sm text-gray-900 mt-1 break-words">
                  {booking.specialRequest || "No special requests"}
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="pt-2 border-t space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Number of Guests:</span>
                <span className="text-sm font-medium text-gray-900">{booking.guests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Amount:</span>
                <span className="text-sm font-medium text-gray-900">₦{booking.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-3 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default GuestInfoModal
