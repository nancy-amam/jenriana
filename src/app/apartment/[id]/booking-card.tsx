"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DateInput from "@/components/date-inputs";
import { isDateRangeAvailable } from "@/services/api-services";
import type { Addon } from "@/lib/interface";
import { Info } from "lucide-react";

interface Props {
  apartmentId: string;
  maxGuests: number;
  pricePerNight: number;
  imageUrl?: string;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  onCheckInChange: (d: Date | undefined) => void;
  onCheckOutChange: (d: Date | undefined) => void;
  guests: number;
  onGuestsChange: (n: number) => void;
  roomCount: number;
  onRoomCountChange: (n: number) => void;
  bookedDateStrings: string[];
  loadingBookedDates: boolean;
  addons?: Addon[];
}

export default function BookingCard({
  apartmentId,
  maxGuests,
  pricePerNight,
  imageUrl,
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  guests,
  onGuestsChange,
  roomCount,
  onRoomCountChange,
  bookedDateStrings,
  loadingBookedDates,
  addons = [],
}: Props) {
  const router = useRouter();
  const [dateError, setDateError] = useState("");
  const activeAddons = addons.filter((a) => a.active !== false);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!checkIn || !checkOut) {
      setDateError("");
      return;
    }
    if (checkOut <= checkIn) {
      setDateError("Check-out must be after check-in.");
      return;
    }
    const toISO = (d: Date) =>
      new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().split("T")[0];
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const conflict = (() => {
      const arr: string[] = [];
      const cur = new Date(start);
      while (cur < end) {
        const s = toISO(cur);
        if (bookedDateStrings.includes(s)) arr.push(s);
        cur.setDate(cur.getDate() + 1);
      }
      return arr;
    })();
    if (conflict.length > 0) {
      setDateError("Your selected range includes booked dates.");
    } else {
      setDateError("");
    }
  }, [checkIn, checkOut, bookedDateStrings]);

  const nights =
    checkIn && checkOut && checkOut > checkIn
      ? Math.round((+checkOut - +checkIn) / (1000 * 60 * 60 * 24))
      : 0;

  const bookedDatesForPicker = bookedDateStrings.map((d) => new Date(d));

  const baseTotal = nights * pricePerNight * roomCount;
  const addonPerNightTotal = activeAddons.reduce((sum, a) => {
    if (!selectedAddons[a.id] || a.pricingType !== "perNight") return sum;
    return sum + a.price * nights * roomCount;
  }, 0);
  const addonOneTimeTotal = activeAddons.reduce((sum, a) => {
    if (!selectedAddons[a.id] || a.pricingType !== "oneTime") return sum;
    return sum + a.price;
  }, 0);
  const grandTotal = baseTotal + addonPerNightTotal + addonOneTimeTotal;

  const handleBooking = () => {
    if (!checkIn || !checkOut) return;
    if (nights <= 0) return;
    if (guests <= 0 || guests > maxGuests) return;
    const toISO = (d: Date) =>
      new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().split("T")[0];
    if (bookedDateStrings.length > 0 && !isDateRangeAvailable(toISO(checkIn), toISO(checkOut), bookedDateStrings)) return;

    const img = encodeURIComponent(imageUrl || "/placeholder.svg");
    router.push(
      `/checkout?apartmentId=${apartmentId}&nights=${nights}&guests=${guests}&price=${pricePerNight}&checkIn=${toISO(
        checkIn
      )}&checkOut=${toISO(checkOut)}&image=${encodeURIComponent(img)}`
    );
  };

  const fieldClass =
    "w-full appearance-none rounded-lg border border-[color:var(--color-luxury-gold)]/45 bg-zinc-900/90 px-3 py-3 text-sm text-white outline-none focus:border-[color:var(--color-luxury-gold)]/80";

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-zinc-900/95 p-5 shadow-2xl md:p-6">
      {loadingBookedDates && (
        <div className="mb-4 rounded-lg border border-white/10 bg-zinc-800/80 px-3 py-2 text-center text-xs text-zinc-400 animate-pulse">
          Loading availability…
        </div>
      )}

      <div className="mb-5 flex items-baseline justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-luxury-gold)]">
          Reserve:
        </span>
        <span className="text-sm text-zinc-300">
          From{" "}
          <span className="font-semibold text-white">₦{pricePerNight.toLocaleString()}</span>
          <span className="text-zinc-500">/night</span>
        </span>
      </div>

      <div className="space-y-3">
        <DateInput
          id="check-in-sidebar"
          label="Check In"
          bookedDates={bookedDatesForPicker}
          onDateChange={onCheckInChange}
          darkVariant
          isoDateLabel
          value={checkIn}
        />
        <DateInput
          id="check-out-sidebar"
          label="Check Out"
          bookedDates={bookedDatesForPicker}
          onDateChange={onCheckOutChange}
          darkVariant
          isoDateLabel
          value={checkOut}
        />

        <div>
          <label htmlFor="rooms-select" className="mb-1.5 block text-sm text-[#E7C99E]">
            Rooms
          </label>
          <select
            id="rooms-select"
            className={fieldClass}
            value={roomCount}
            onChange={(e) => onRoomCountChange(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n} className="bg-zinc-900">
                {n} Room{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="adults-select" className="mb-1.5 block text-sm text-[#E7C99E]">
            Adults
          </label>
          <select
            id="adults-select"
            className={fieldClass}
            value={guests}
            onChange={(e) => onGuestsChange(Number(e.target.value))}
          >
            {Array.from({ length: maxGuests }).map((_, i) => (
              <option key={i + 1} value={i + 1} className="bg-zinc-900">
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {dateError && (
        <div className="mt-3 rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-xs text-red-300">
          {dateError}
        </div>
      )}

      {activeAddons.length > 0 && (
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="mb-3 text-sm font-medium text-zinc-200">Extra Services</p>
          <ul className="space-y-3">
            {activeAddons.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-zinc-300">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[color:var(--color-luxury-gold)]/50 bg-zinc-900 text-[color:var(--color-luxury-gold)] focus:ring-[color:var(--color-luxury-gold)]/40"
                    checked={!!selectedAddons[a.id]}
                    onChange={(e) =>
                      setSelectedAddons((s) => ({
                        ...s,
                        [a.id]: e.target.checked,
                      }))
                    }
                  />
                  <span>{a.name}</span>
                </label>
                <span className="shrink-0 text-zinc-400">
                  ₦{a.price.toLocaleString()}
                  {a.pricingType === "perNight" ? " / Night" : " (once)"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-lg text-zinc-200">Total Cost</span>
          <span className="text-xl font-semibold text-white">₦{grandTotal.toLocaleString()}</span>
        </div>
        <div className="h-px bg-white/10" />
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <span className="inline-flex items-center gap-1">
            Total Base Price
            <Info className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
          </span>
          <span className="text-zinc-200">₦{baseTotal.toLocaleString()}</span>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-base font-semibold text-white">Total</span>
          <div className="text-right">
            <span className="text-lg font-semibold text-white">₦{grandTotal.toLocaleString()}</span>
            <p className="text-xs text-zinc-500">(Total before VAT ₦{grandTotal.toLocaleString()})</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleBooking}
        disabled={loadingBookedDates || !!dateError || !checkIn || !checkOut || nights <= 0}
        className={`mt-6 w-full rounded-lg py-3.5 text-sm font-semibold tracking-wide transition ${
          loadingBookedDates || dateError || !checkIn || !checkOut || nights <= 0
            ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
            : "bg-black text-white hover:bg-zinc-800"
        }`}
        type="button"
      >
        {loadingBookedDates ? "Loading..." : "Book Your Stay Now"}
      </button>
    </div>
  );
}
