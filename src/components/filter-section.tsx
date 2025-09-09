"use client";

import React, { useState } from "react";
import DateInput from "@/components/date-inputs";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface SearchFilters {
  location: string;
  guests: number;
}

interface SearchBarProps {
  filters: SearchFilters;
  onFilterChange: (field: string, value: string | number) => void;
  onSearch?: () => void;
  buttonLabel?: string;
  showBlack?: boolean;
}

export default function SearchBar({
  filters,
  onFilterChange,
  onSearch,
  buttonLabel = "Find Apartments",
  showBlack,
}: SearchBarProps) {
  const [open, setOpen] = useState(false);

  const handleSearch = () => {
    onSearch?.();
    setOpen(false);
  };

  const summary =
    (filters.location ? filters.location.replaceAll("-", " ") : "Location") +
    " • " +
    (filters.guests ? `${filters.guests} guest${filters.guests > 1 ? "s" : ""}` : "Any guests") +
    " • Dates";

  return (
    <div className={`mt-10 md:-mt-[80px] py-2 px-4 md:px-16 z-20 relative ${showBlack && "bg-black/5"}`}>
      <div className="hidden md:grid bg-[#f1f1f1] md:bg-white text-[#1e1e1e] md:rounded-lg md:shadow-lg p-4 md:p-6 grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div>
          <label htmlFor="location" className="block text-base font-normal text-[#1e1e1e] mb-2 md:mb-1">
            Location
          </label>
          <select
            id="location"
            aria-label="Select Location"
            value={filters.location}
            onChange={(e) => onFilterChange("location", e.target.value)}
            className="w-full px-3 py-4 md:rounded-none bg-white md:bg-transparent cursor-pointer border border-black/10 rounded-lg"
          >
            <option value="">Select City</option>
            <option value="ikeja">Ikeja</option>
            <option value="lekki">Lekki</option>
            <option value="victoria-island">Victoria Island</option>
            <option value="magodo">Magodo</option>
            <option value="ikorodu">Ikorodu</option>
            <option value="badagry">Badagry</option>
          </select>
        </div>

        <div>
          <DateInput id="check-in" label="Check In" bookedDates={[new Date(2025, 7, 31), new Date(2025, 8, 2)]} />
        </div>
        <div>
          <DateInput id="check-out" label="Check Out" bookedDates={[new Date(2025, 7, 31), new Date(2025, 8, 2)]} />
        </div>

        <div>
          <label htmlFor="guests" className="block text-base font-normal text-[#1e1e1e] mb-2 md:mb-1">
            Guests
          </label>
          <select
            id="guests"
            aria-label="Select Guests"
            value={filters.guests}
            onChange={(e) => onFilterChange("guests", Number(e.target.value))}
            className="w-full px-3 py-4 md:rounded-none bg-white md:bg-transparent cursor-pointer border border-black/10 rounded-lg"
          >
            <option value={0}>Any</option>
            <option value={1}>1 Guest</option>
            <option value={2}>2 Guests</option>
            <option value={3}>3 Guests</option>
            <option value={4}>4+ Guests</option>
          </select>
        </div>

        <div className="md:pt-5 mx-auto w-full">
          <button
            onClick={handleSearch}
            className="w-full bg-black mt-2 md:mt-0 text-white py-3 md:px-6 px-16 rounded-xl hover:bg-gray-800 transition cursor-pointer"
          >
            {buttonLabel}
          </button>
        </div>
      </div>

      <div className="md:hidden">
        <motion.button
          onClick={() => setOpen(true)}
          type="button"
          whileTap={{ scale: 0.98 }}
          className="w-full bg-white/90 backdrop-blur border border-black/10 shadow-sm hover:shadow transition rounded-full px-4 py-3 flex items-center gap-3"
        >
          <span className="inline-flex items-center justify-center rounded-full bg-[#1e1e1e] text-white h-8 w-8">
            <Search className="h-4 w-4" />
          </span>
          <div className="text-left">
            <div className="text-sm font-medium text-[#1e1e1e]">Search apartments</div>
            <div className="text-xs text-[#6b7280]">{summary}</div>
          </div>
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: 32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 32, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.6 }}
              className="absolute inset-x-0 bottom-0"
            >
              <div className="mx-auto w-full max-w-md">
                <motion.div layout className="mx-4 rounded-t-3xl border border-white/20 bg-white shadow-2xl">
                  <div className="flex items-center justify-between p-4">
                    <span className="text-base font-semibold text-[#1e1e1e]">Search</span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setOpen(false)}
                      className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-black/5"
                      aria-label="Close"
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  </div>

                  <div className="px-4 pb-4 space-y-4">
                    <div>
                      <label htmlFor="m-location" className="block text-sm font-medium text-[#1e1e1e] mb-2">
                        Location
                      </label>
                      <select
                        id="m-location"
                        value={filters.location}
                        onChange={(e) => onFilterChange("location", e.target.value)}
                        className="w-full px-3 py-3 rounded-xl border border-black/10 bg-white"
                      >
                        <option value="">Select City</option>
                        <option value="ikeja">Ikeja</option>
                        <option value="lekki">Lekki</option>
                        <option value="victoria-island">Victoria Island</option>
                        <option value="magodo">Magodo</option>
                        <option value="ikorodu">Ikorodu</option>
                        <option value="badagry">Badagry</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <DateInput
                        id="m-check-in"
                        label="Check In"
                        bookedDates={[new Date(2025, 7, 31), new Date(2025, 8, 2)]}
                      />
                      <DateInput
                        id="m-check-out"
                        label="Check Out"
                        bookedDates={[new Date(2025, 7, 31), new Date(2025, 8, 2)]}
                      />
                    </div>

                    <div>
                      <label htmlFor="m-guests" className="block text-sm font-medium text-[#1e1e1e] mb-2">
                        Guests
                      </label>
                      <select
                        id="m-guests"
                        value={filters.guests}
                        onChange={(e) => onFilterChange("guests", Number(e.target.value))}
                        className="w-full px-3 py-3 rounded-xl border border-black/10 bg-white"
                      >
                        <option value={0}>Any</option>
                        <option value={1}>1 Guest</option>
                        <option value={2}>2 Guests</option>
                        <option value={3}>3 Guests</option>
                        <option value={4}>4+ Guests</option>
                      </select>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.99 }}
                      onClick={handleSearch}
                      className="w-full bg-[#111827] text-white py-3 rounded-xl font-medium shadow-md transition"
                      type="button"
                    >
                      {buttonLabel}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setOpen(false)}
                      className="w-full py-3 rounded-xl font-medium text-[#111827] bg-black/5"
                      type="button"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
                <div className="h-4" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
