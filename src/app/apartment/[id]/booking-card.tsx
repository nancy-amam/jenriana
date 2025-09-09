"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DateInput from "@/components/date-inputs";
import { getApartmentBookedDates, isDateRangeAvailable } from "@/services/api-services";
import { motion } from "framer-motion";

interface Props {
  apartmentId: string;
  maxGuests: number;
  pricePerNight: number;
  imageUrl?: string;
}

export default function BookingCard({ apartmentId, maxGuests, pricePerNight, imageUrl }: Props) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [loadingBookedDates, setLoadingBookedDates] = useState(true);
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    const run = async () => {
      if (!apartmentId) return;
      try {
        setLoadingBookedDates(true);
        const dates = await getApartmentBookedDates(apartmentId);
        setBookedDates(dates);
      } catch {
        setBookedDates([]);
      } finally {
        setLoadingBookedDates(false);
      }
    };
    run();
  }, [apartmentId]);

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
        if (bookedDates.includes(s)) arr.push(s);
        cur.setDate(cur.getDate() + 1);
      }
      return arr;
    })();
    if (conflict.length > 0) {
      setDateError("Your selected range includes booked dates.");
    } else {
      setDateError("");
    }
  }, [checkIn, checkOut, bookedDates]);

  const handleBooking = () => {
    if (!checkIn || !checkOut) return;
    const nights = Math.round((+checkOut - +checkIn) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return;
    if (guests <= 0 || guests > maxGuests) return;
    const toISO = (d: Date) =>
      new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().split("T")[0];
    if (bookedDates.length > 0 && !isDateRangeAvailable(toISO(checkIn), toISO(checkOut), bookedDates)) return;

    const img = encodeURIComponent(imageUrl || "/placeholder.svg");
    router.push(
      `/checkout?apartmentId=${apartmentId}&nights=${nights}&guests=${guests}&price=${pricePerNight}&checkIn=${toISO(
        checkIn
      )}&checkOut=${toISO(checkOut)}&image=${encodeURIComponent(img)}`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-md text-[#1e1e1e] rounded-2xl p-6 w-full border border-white/30 shadow-lg"
    >
      {loadingBookedDates && (
        <div className="mb-4 p-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-sm">
          Loading availability…
        </div>
      )}

      <div className="flex mb-3 justify-center items-center">
        <p className="text-[26px] md:text-[32px] text-[#111827] font-bold">
          ₦{pricePerNight.toLocaleString()} <span className="text-sm text-gray-500">/ night</span>
        </p>
      </div>

      <div className="flex gap-2 mb-2">
        <div className="w-1/2">
          <DateInput
            id="check-in"
            label="Check In"
            bookedDates={bookedDates.map((d) => new Date(d))}
            onDateChange={setCheckIn}
          />
        </div>
        <div className="w-1/2">
          <DateInput
            id="check-out"
            label="Check Out"
            bookedDates={bookedDates.map((d) => new Date(d))}
            onDateChange={setCheckOut}
          />
        </div>
      </div>

      {dateError && (
        <div className="mb-2 p-2 rounded-lg border border-red-200 bg-red-50 text-red-600 text-xs">{dateError}</div>
      )}

      <label className="mb-2 block text-base">Guests</label>
      <select
        className="border border-gray-200 px-4 py-3 rounded-xl bg-white w-full cursor-pointer mb-4"
        value={guests}
        onChange={(e) => setGuests(Number(e.target.value))}
      >
        {Array.from({ length: maxGuests }).map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1} Guest{i > 0 ? "s" : ""}
          </option>
        ))}
      </select>

      <button
        onClick={handleBooking}
        disabled={loadingBookedDates || !!dateError || !checkIn || !checkOut}
        className={`w-full rounded-xl py-3 font-medium transition ${
          loadingBookedDates || dateError || !checkIn || !checkOut
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-800"
        }`}
        type="button"
      >
        {loadingBookedDates ? "Loading..." : "Book Now"}
      </button>
      <p className="text-xs text-[#6b7280] mt-2 text-center">No stress. Cancel anytime.</p>
    </motion.div>
  );
}
