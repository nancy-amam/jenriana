"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Home,
  Users,
  Bath,
  Bed,
  Wifi,
  Car,
  Shield,
  Zap,
  Tv,
  Wind,
  CheckCircle2,
  XCircle,
  Wrench,
  FileText,
  UtensilsCrossed,
  Shirt,
  Dumbbell,
  Video,
} from "lucide-react";
import { formatMoney, type ApartmentStatus, type PartnerApartment } from "../data";
import { usePartnerApartment } from "@/hooks/use-partner-api";
import { PulseLoader } from "@/components/ui/pulse-loader";

// Map feature names to icons for "What this place offers" style layout
const FEATURE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  parking: Car,
  pool: Zap,
  security: Shield,
  generator: Zap,
  gym: Dumbbell,
  cctv: Video,
  kitchen: UtensilsCrossed,
  tv: Tv,
  "airconditioning": Wind,
  washer: Shirt,
};

// Colorful icon styles per feature (bg + icon color)
const FEATURE_COLORS: Record<string, { bg: string; icon: string }> = {
  wifi: { bg: "bg-indigo-100", icon: "text-indigo-600" },
  parking: { bg: "bg-slate-100", icon: "text-slate-600" },
  pool: { bg: "bg-cyan-100", icon: "text-cyan-600" },
  security: { bg: "bg-emerald-100", icon: "text-emerald-600" },
  generator: { bg: "bg-amber-100", icon: "text-amber-600" },
  gym: { bg: "bg-rose-100", icon: "text-rose-600" },
  cctv: { bg: "bg-violet-100", icon: "text-violet-600" },
  kitchen: { bg: "bg-orange-100", icon: "text-orange-600" },
  tv: { bg: "bg-sky-100", icon: "text-sky-600" },
  airconditioning: { bg: "bg-blue-100", icon: "text-blue-600" },
  washer: { bg: "bg-teal-100", icon: "text-teal-600" },
};

const DEFAULT_FEATURE_COLOR = { bg: "bg-gray-100", icon: "text-gray-600" };

function getFeatureIcon(name: string) {
  const key = name.toLowerCase().replace(/\s+/g, "");
  return FEATURE_ICONS[key] ?? Wifi;
}

function getFeatureColor(name: string) {
  const key = name.toLowerCase().replace(/\s+/g, "");
  return FEATURE_COLORS[key] ?? DEFAULT_FEATURE_COLOR;
}

const STATUS_OPTIONS: { value: ApartmentStatus; label: string; icon: typeof CheckCircle2 }[] = [
  { value: "active", label: "Enable listing", icon: CheckCircle2 },
  { value: "inactive", label: "Disable listing", icon: XCircle },
  { value: "maintenance", label: "Under maintenance", icon: Wrench },
];

function StatusControl({
  value,
  onChange,
}: {
  value: ApartmentStatus;
  onChange: (v: ApartmentStatus) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? opt.value === "active"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : opt.value === "maintenance"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-gray-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Icon className="w-4 h-4" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function PartnerApartmentDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : null;
  const { data: apiApartment, isLoading, isError } = usePartnerApartment(id);

  const apartment: PartnerApartment | null = apiApartment
    ? {
        _id: apiApartment._id,
        name: apiApartment.name,
        location: apiApartment.location ?? "",
        address: apiApartment.address,
        pricePerNight: apiApartment.pricePerNight ?? 0,
        rooms: apiApartment.rooms ?? 0,
        bathrooms: apiApartment.bathrooms ?? 0,
        maxGuests: apiApartment.maxGuests ?? 0,
        gallery: apiApartment.gallery ?? [],
        status: (apiApartment.status as ApartmentStatus) ?? "active",
        occupied: false,
        features: apiApartment.features ?? [],
        rules: apiApartment.rules ?? [],
        description: apiApartment.description,
      }
    : null;

  const [listingStatus, setListingStatus] = useState<ApartmentStatus>("active");

  useEffect(() => {
    if (apartment?.status) setListingStatus(apartment.status);
  }, [apartment?.status]);

  if (!id) {
    return (
      <div className="space-y-6">
        <Link href="/partner/apartments" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-100 hover:bg-gray-50">
          <ArrowLeft className="w-4 h-4" />
          Back to apartments
        </Link>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-12 text-center">
          <p className="text-gray-500">Apartment not found.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-32 rounded bg-slate-200 animate-pulse" />
        <div className="aspect-[21/9] rounded-2xl bg-slate-200 animate-pulse" />
        <PulseLoader className="min-h-[180px]" />
      </div>
    );
  }

  if (isError || !apartment) {
    return (
      <div className="space-y-6">
        <Link href="/partner/apartments" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-100 hover:bg-gray-50">
          <ArrowLeft className="w-4 h-4" />
          Back to apartments
        </Link>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-12 text-center">
          <p className="text-gray-500">Apartment not found.</p>
          <Link href="/partner/apartments" className="mt-4 inline-block rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600">
            View all apartments
          </Link>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus: ApartmentStatus) => {
    setListingStatus(newStatus);
  };

  const features = apartment.features ?? [];

  return (
    <div className="space-y-6">
      <Link
        href="/partner/apartments"
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm border border-gray-100 hover:bg-gray-50 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to apartments
      </Link>

      {/* Hero image with pills */}
      <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-gray-50 shadow-sm border border-gray-100/80">
        {apartment.gallery?.length > 0 ? (
          <Image
            src={apartment.gallery[0]}
            alt={apartment.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <Home className="w-20 h-20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-medium shadow-sm ${
              apartment.occupied ? "bg-amber-500/90 text-white" : "bg-emerald-500/90 text-white"
            }`}
          >
            {apartment.occupied ? "Occupied" : "Available"}
          </span>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-medium shadow-sm ${
              listingStatus === "active"
                ? "bg-emerald-500/90 text-white"
                : listingStatus === "maintenance"
                  ? "bg-amber-500/90 text-white"
                  : "bg-gray-500/90 text-white"
            }`}
          >
            {listingStatus === "maintenance" ? "Maintenance" : listingStatus === "active" ? "Live" : "Paused"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main: card-based sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & location card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-6">
            <h1 className="text-2xl font-bold text-gray-900">{apartment.name}</h1>
            {apartment.location && (
              <p className="mt-2 text-gray-600 flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
                {apartment.location}
              </p>
            )}
            {apartment.address && (
              <p className="mt-1 text-sm text-gray-500">{apartment.address}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
                <Bed className="w-4 h-4 text-gray-500" />
                {apartment.rooms} bed{apartment.rooms !== 1 ? "s" : ""}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
                <Bath className="w-4 h-4 text-gray-500" />
                {apartment.bathrooms} bath{apartment.bathrooms !== 1 ? "s" : ""}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
                <Users className="w-4 h-4 text-gray-500" />
                {apartment.maxGuests} guest{apartment.maxGuests !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Description card */}
          {apartment.description && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About this place</h2>
              <p className="text-gray-600 leading-relaxed">{apartment.description}</p>
            </div>
          )}

          {/* What this place offers – two columns with icons */}
          {features.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">What this place offers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {features.map((f) => {
                  const Icon = getFeatureIcon(f);
                  const colors = getFeatureColor(f);
                  return (
                    <div key={f} className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors.bg} ${colors.icon}`}>
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="text-gray-700 font-medium">{f}</span>
                    </div>
                  );
                })}
              </div>
              {features.length > 6 && (
                <button
                  type="button"
                  className="mt-4 w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Show all {features.length} amenities
                </button>
              )}
            </div>
          )}

          {/* House rules card */}
          {apartment.rules && apartment.rules.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                House rules
              </h2>
              <ul className="space-y-2">
                {apartment.rules.map((r) => (
                  <li key={r} className="flex items-center gap-2 text-gray-600">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar: booking-style card with price + status pills */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100/80 p-6 sticky top-6 overflow-hidden">
            <div className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 w-fit mb-4">
              Prices include all fees
            </div>
            <p className="text-sm font-medium text-gray-500">Price per night</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatMoney(apartment.pricePerNight)}
            </p>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Listing status</h3>
              <p className="text-xs text-gray-500 mb-4">
                Control whether this property accepts bookings or is hidden for maintenance.
              </p>
              <StatusControl value={listingStatus} onChange={handleStatusChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
