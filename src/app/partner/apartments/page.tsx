"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Home, Users, Bath, Bed, ChevronRight, LayoutGrid } from "lucide-react";
import { MOCK_APARTMENTS, formatMoney } from "./data";

export default function PartnerApartmentsPage() {
  const apartments = MOCK_APARTMENTS;

  return (
    <div className="space-y-6">
      {/* Header card: title + count pill */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">My Apartments</h1>
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
            <LayoutGrid className="w-4 h-4 text-gray-500" />
            {apartments.length} {apartments.length === 1 ? "property" : "properties"}
          </span>
        </div>
      </div>

      {/* Property cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apartments.map((apt) => (
          <Link
            key={apt._id}
            href={`/partner/apartments/${apt._id}`}
            className="group bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden hover:shadow-md hover:border-gray-200/80 transition-all block"
          >
            <div className="relative aspect-[4/3] bg-gray-50">
              {apt.gallery?.length > 0 ? (
                <Image
                  src={apt.gallery[0]}
                  alt={apt.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                  <Home className="w-14 h-14" />
                </div>
              )}
              <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-medium shadow-sm ${
                    apt.occupied
                      ? "bg-amber-500/90 text-white"
                      : "bg-emerald-500/90 text-white"
                  }`}
                >
                  {apt.occupied ? "Occupied" : "Available"}
                </span>
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-medium shadow-sm ${
                    apt.status === "active"
                      ? "bg-emerald-500/90 text-white"
                      : apt.status === "maintenance"
                        ? "bg-amber-500/90 text-white"
                        : "bg-gray-500/90 text-white"
                  }`}
                >
                  {apt.status === "maintenance" ? "Maintenance" : apt.status === "active" ? "Live" : "Paused"}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white">
                Show details
                <ChevronRight className="inline-block w-3.5 h-3.5 ml-0.5 -mr-0.5" />
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold text-gray-900 truncate">{apt.name}</h2>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0 mt-0.5 group-hover:text-indigo-500 transition-colors" />
              </div>
              {apt.location && (
                <p className="mt-1.5 text-sm text-gray-500 flex items-center gap-1.5 truncate">
                  <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
                  {apt.location}
                </p>
              )}
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-gray-400" />
                  {apt.rooms}
                </span>
                <span className="flex items-center gap-1.5">
                  <Bath className="w-4 h-4 text-gray-400" />
                  {apt.bathrooms}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gray-400" />
                  {apt.maxGuests}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-lg font-semibold text-gray-900">
                  {formatMoney(apt.pricePerNight)}
                  <span className="text-sm font-normal text-gray-500"> / night</span>
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
