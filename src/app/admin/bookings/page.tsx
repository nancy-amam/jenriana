'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';

const dummyBookings = [
  {
    id: 'BKG123456',
    name: 'John Doe',
    apartment: 'Eko Atlantic Suites',
    amountPaid: 340000,
    nights: 3,
    arrival: '2025-09-01',
    departure: '2025-09-04',
    bookingDate: '2025-08-01',
    status: 'Confirmed',
  },
  {
    id: 'BKG123457',
    name: 'Jane Smith',
    apartment: 'Lekki Pearl Apartment',
    amountPaid: 250000,
    nights: 2,
    arrival: '2025-09-10',
    departure: '2025-09-12',
    bookingDate: '2025-08-02',
    status: 'Pending',
  },
  // Add more dummy data as needed
];

export default function AdminBookingPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-screen">
      {/* Search Card */}
      <div className="w-full max-w-[1200px] h-[82px] bg-white rounded-lg shadow-md px-4 py-4 flex items-center gap-4 mb-6 mt-[-20px]">
        <input
          type="text"
          placeholder="Search by booking name or ID"
          className="w-[90%] outline-none p-3 rounded-[8px] text-sm text-gray-700 placeholder:text-gray-400 border border-[#d1d5db]/30"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Desktop Table */}
      <div className=" hidden lg:block w-full max-w-[1200px] bg-white rounded-lg shadow-md p-4">
        <table className="w-full text-sm text-left ">
          <thead className="text-xs text-[#4b5566] uppercase ">
            <tr>
              <th className="py-2">Booking ID</th>
              <th>Name</th>
              <th>Apartment</th>
              <th>Amount Paid</th>
              <th>Arrival - Departure</th>
              <th>Booking Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className=' mt-4'>
            {dummyBookings.map((booking) => (
              <tr key={booking.id} className=" text-[#111827] text-sm font-normal mt-4">
                <td className="py-3">{booking.id}</td>
                <td>{booking.name}</td>
                <td>{booking.apartment}</td>
                <td>₦{booking.amountPaid.toLocaleString()}</td>
                <td>
                  {new Date(booking.arrival).toLocaleDateString()} -{' '}
                  {new Date(booking.departure).toLocaleDateString()}
                </td>
                <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      booking.status === 'Confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td>
                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="text-black hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
     
      <div className="lg:hidden space-y-4">
        {dummyBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-lg shadow-md p-4 relative"
          >
            <div className="flex justify-between text-xs font-medium mb-2">
              <span className="text-gray-600">{booking.id}</span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  booking.status === 'Confirmed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {booking.status}
              </span>
            </div>
            <p className="text-base font-semibold text-[#111827]">{booking.name}</p>
            <p className="text-sm text-[#4b5566]">{booking.apartment}</p>
            <p className="text-sm text-[#111827] mt-2">
              ₦{booking.amountPaid.toLocaleString()} for {booking.nights} nights
            </p>
            <p className="text-sm text-[#4b5566] mt-2">
              {new Date(booking.arrival).toLocaleDateString()} -{' '}
              {new Date(booking.departure).toLocaleDateString()}
            </p>
            
            {/* Action Buttons Row */}
            <div className="mt-4 flex gap-2">
              {booking.status === 'Pending' ? (
                <>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium">
                    Confirm
                  </button>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium">
                    Decline
                  </button>
                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="flex-1 text-center bg-[#212121] hover:bg-gray-800 text-white py-2 rounded-lg text-sm font-medium"
                  >
                    View
                  </Link>
                </>
              ) : (
                <Link
                  href={`/admin/bookings/${booking.id}`}
                  className="w-full text-center bg-[#212121] hover:bg-gray-800 text-white py-2 rounded-lg text-sm font-medium"
                >
                  View
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="w-full max-w-[1200px] bottom-0   flex flex-col sm:flex-row items-center justify-between mt-6 text-sm text-gray-500">
        <span className="mb-2 sm:mb-0">Showing 1 to 10 of 20 bookings</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded">Prev</button>
          <button className="px-3 py-1 border rounded bg-black text-white">
            1
          </button>
          <button className="px-3 py-1 border rounded">2</button>
          <button className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  );
}
