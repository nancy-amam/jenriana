'use client';

import { Pencil, Trash2, MapPin, BedDouble, DollarSign } from 'lucide-react';
import Image from 'next/image';

const apartments = [
  {
    id: 1,
    name: 'Ocean View Apartment',
    location: 'Lekki, Lagos',
    pricePerNight: 80000,
    rooms: 2,
    features: ['WiFi', 'AC', 'Pool'],
    image: '/images/image18.png',
    status: 'Active',
    date: '2 days ago'
  },
  {
    id: 2,
    name: 'Urban Nest',
    location: 'Ikeja, Lagos',
    pricePerNight: 65000,
    rooms: 1,
    features: ['WiFi', 'Parking'],
    image: '/images/image20.png',
    status: 'Inactive',
     date: '2 days ago'
  },
];

export default function ApartmentsManagementPage() {
  return (
    <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-screen ">
      {/* Search Card */}
      <div className="w-full h-[82px] bg-white shadow-md rounded-lg flex items-center px-4 gap-4 ">
        <input
          type="text"
          placeholder="Search by apartment name or location"
          className=" w-[90%] p-3 rounded-[8px] border border-[#d1d5db]/30  text-sm outline-none"
        />
      </div>

      {/* Table Card (Desktop) */}
      <div className="hidden md:block w-full bg-white shadow-md rounded-lg p-4 mt-10">
        <table className="w-full text-sm font-normal text-left">
          <thead className="text-xs text-[#4b5566] uppercase ">
            <tr >
              <th className="py-2">Apartment</th>
              <th>Location</th>
              <th>Price/Night</th>
              <th>Rooms</th>
              <th>Features</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className=' mt-4'>
            {apartments.map((apt) => (
                 

<tr key={apt.id} className="text-[#111827] text-sm font-normal mt-4">
  {/* Apartment image + details */}
  <td className="py-3 font-medium">
    <div className="flex items-center gap-3">
      {/* Apartment image */}
      <div className="relative w-12 h-12">
        <Image
          src={apt.image}
          alt={apt.name}
          fill
          className="rounded object-cover"
        />
      </div>

      {/* Name + date added */}
      <div>
        <div className="font-medium">{apt.name}</div>
        <div className="text-xs text-gray-500">
          Added {apt.date} days ago
        </div>
      </div>
    </div>
  </td>

  <td>{apt.location}</td>
  <td>₦{apt.pricePerNight.toLocaleString()}</td>
  <td>{apt.rooms}</td>
  <td>{apt.features.join(', ')}</td>
  <td>{apt.status}</td>

  {/* Actions */}
  <td className="flex gap-3 items-center py-6">
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

      {/* Apartment Cards (Mobile) */}
      <div className="md:hidden space-y-4">
        {apartments.map((apt) => (
          <div key={apt.id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
            <div className="relative w-full h-[150px] rounded-md overflow-hidden">
              <Image
                src={apt.image}
                alt={apt.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-sm text-[#374151] space-y-1">
              <p className="text-base font-semibold">{apt.name}</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {apt.location}</p>
              <p className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> ₦{apt.pricePerNight.toLocaleString()} / night</p>
              <p className="flex items-center gap-2"><BedDouble className="w-4 h-4" /> {apt.rooms} rooms</p>
              <p><span className="font-medium">Features:</span> {apt.features.join(', ')}</p>
              <p><span className="font-medium">Status:</span> {apt.status}</p>
            </div>
            <div className="flex gap-4 mt-2">
              <button className="flex-1 bg-blue-600 text-white  text-sm py-2 rounded-md flex items-center justify-center gap-1">
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button className="flex-1 bg-red-500 text-white text-sm py-2 rounded-md flex items-center justify-center gap-1">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full bottom-0   flex flex-col sm:flex-row items-center justify-between mt-6 text-sm text-gray-500">
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
