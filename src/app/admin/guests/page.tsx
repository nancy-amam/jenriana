'use client';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const dummyGuests = [
  {
    id: 'GST001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+234 801 234 5678',
    totalBookings: 5,
  },
  {
    id: 'GST002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+234 802 345 6789',
    totalBookings: 3,
  },
];

export default function AdminGuestsPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-screen">
      {/* Search */}
      <div className="  w-full max-w-[1200px] h-[82px] bg-white rounded-lg shadow-md px-4 py-4 flex items-center gap-4 md:mb-6 mt-[-20px]">
        <input
          type="text"
          placeholder="Search by guest name or email"
          className="w-[90%] outline-none p-3 rounded-[8px] text-sm text-gray-700 placeholder:text-gray-400 border border-[#d1d5db]/30"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block w-full max-w-[1200px] bg-white rounded-lg shadow-md p-4 ">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[#4b5566] uppercase">
            <tr>
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Total Bookings</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyGuests.map((guest) => (
              <tr key={guest.id} className="text-[#111827] text-sm font-normal">
                <td className="py-3 font-medium">{guest.name}</td>
                <td>{guest.email}</td>
                <td>{guest.phone}</td>
                <td>{guest.totalBookings}</td>
                <td className="flex gap-3 items-center py-2">
                  <button className="text-blue-600 hover:underline flex items-center gap-1">
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button className="text-red-600 hover:underline flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 mt-6">
        {dummyGuests.map((guest) => (
          <div
            key={guest.id}
            className="bg-white rounded-lg shadow-md p-4 relative"
          >
            <p className="text-sm font-semibold text-gray-800">{guest.name}</p>
            <p className="text-sm text-gray-600">{guest.email}</p>
            <p className="text-sm text-gray-600">{guest.phone}</p>
            <p className="text-sm text-gray-700 mt-1">
              Total Bookings: {guest.totalBookings}
            </p>
            <div className="flex gap-4 mt-4">
              <button className="flex-1 bg-[#f3f4f6] text-[#374151]  py-2 rounded-md text-sm font-medium flex items-center justify-center gap-1">
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button className="flex-1 bg-[#fef2f2] text-[#dc2626]  py-2 rounded-md text-sm font-medium flex items-center justify-center gap-1">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
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
