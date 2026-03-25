"use client";

import React, { useEffect, useState } from "react";
import DateInput from "@/components/date-inputs";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

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
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlLocation = searchParams.get("location") || "";

  useEffect(() => {
    handleSearch();
    if (urlLocation && urlLocation !== filters.location) {
      onFilterChange("location", urlLocation);
      if (pathname === "/") router.push("/apartment");
    }

    if (urlLocation !== "") {
      // alert(urlLocation);
    }
  }, [searchParams, urlLocation]);

  const handleSearch = () => {
    onSearch?.();
    setOpen(false);
  };

  const summary =
    (filters.location ? filters.location.replaceAll("-", " ") : "Location") +
    " • " +
    (filters.guests ? `${filters.guests} guest${filters.guests > 1 ? "s" : ""}` : "Any guests") +
    " • Dates";

  const labelClass = showBlack ? "text-[#E7C99E]" : "text-[#1e1e1e]";
  const selectClass = showBlack
    ? "w-full px-3 py-4 md:rounded-none cursor-pointer rounded-lg border border-white/20 bg-zinc-900/95 text-white [color-scheme:dark] focus:outline-none focus:ring-2 focus:ring-white/30 [&>option]:bg-zinc-900 [&>option]:text-white"
    : "w-full px-3 py-4 md:rounded-none bg-white md:bg-transparent cursor-pointer border border-black/10 rounded-lg text-[#1e1e1e]";

  return (
    <div className="md:-mt-[80px] py-2 px-4 md:px-16 z-20 relative bg-[#121212]">
      <div
        className={clsx(
          "hidden md:grid p-4 md:p-6 grid-cols-1 md:grid-cols-5 gap-4 items-end md:rounded-lg",
          showBlack
            ? "bg-zinc-950/95 text-white border border-white/10 shadow-2xl backdrop-blur-md"
            : "bg-[#f1f1f1] md:bg-white text-[#1e1e1e] md:shadow-lg",
        )}
      >
        <div>
          <label htmlFor="location" className={clsx("block text-base font-normal mb-2 md:mb-1", labelClass)}>
            Location
          </label>
          <select
            id="location"
            aria-label="Select Location"
            value={filters.location}
            onChange={(e) => onFilterChange("location", e.target.value)}
            className={selectClass}
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
          <DateInput
            id="check-in"
            label="Check In"
            bookedDates={[new Date(2025, 7, 31), new Date(2025, 8, 2)]}
            darkVariant={showBlack}
          />
        </div>
        <div>
          <DateInput
            id="check-out"
            label="Check Out"
            bookedDates={[new Date(2025, 7, 31), new Date(2025, 8, 2)]}
            darkVariant={showBlack}
          />
        </div>

        <div>
          <label htmlFor="guests" className={clsx("block text-base font-normal mb-2 md:mb-1", labelClass)}>
            Guests
          </label>
          <select
            id="guests"
            aria-label="Select Guests"
            value={filters.guests}
            onChange={(e) => onFilterChange("guests", Number(e.target.value))}
            className={selectClass}
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
            onClick={() => {
              if (pathname === "/") router.push("/apartment");
              handleSearch();
            }}
            className={clsx(
              "w-full mt-2 md:mt-0 py-3 md:px-6 px-16 rounded-xl transition cursor-pointer font-medium",
              showBlack ? "bg-white text-zinc-900 hover:bg-zinc-100" : "bg-black text-white hover:bg-gray-800",
            )}
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
          className={clsx(
            "w-full backdrop-blur border shadow-sm hover:shadow transition rounded-full px-4 py-3 flex items-center gap-3",
            showBlack ? "bg-zinc-950/90 border-white/15 text-white" : "bg-white/90 border-black/10",
          )}
        >
          <span
            className={clsx(
              "inline-flex items-center justify-center rounded-full h-8 w-8",
              showBlack ? "bg-white text-zinc-900" : "bg-[#1e1e1e] text-white",
            )}
          >
            <Search className="h-4 w-4" />
          </span>
          <div className="text-left">
            <div className={clsx("text-sm font-medium", showBlack ? "text-white" : "text-[#1e1e1e]")}>
              Search apartments
            </div>
            <div className={clsx("text-xs", showBlack ? "text-white/80" : "text-[#6b7280]")}>{summary}</div>
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
                <motion.div
                  layout
                  className={clsx(
                    "mx-4 rounded-t-3xl border shadow-2xl",
                    showBlack ? "border-white/15 bg-zinc-950 text-white" : "border-white/20 bg-white",
                  )}
                >
                  <div className="flex items-center justify-between p-4">
                    <span className={clsx("text-base font-semibold", showBlack ? "text-white" : "text-[#1e1e1e]")}>
                      Search
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setOpen(false)}
                      className={clsx(
                        "h-9 w-9 inline-flex items-center justify-center rounded-full",
                        showBlack ? "bg-white/10 text-white" : "bg-black/5",
                      )}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  </div>

                  <div className="px-4 pb-4 space-y-4">
                    <div>
                      <label
                        htmlFor="m-location"
                        className={clsx(
                          "block text-sm font-medium mb-2",
                          showBlack ? "text-[#E7C99E]" : "text-[#1e1e1e]",
                        )}
                      >
                        Location
                      </label>
                      <select
                        id="m-location"
                        value={filters.location}
                        onChange={(e) => onFilterChange("location", e.target.value)}
                        className={clsx(
                          "w-full px-3 py-3 rounded-xl border",
                          showBlack
                            ? "border-white/20 bg-zinc-900 text-white [color-scheme:dark] [&>option]:bg-zinc-900 [&>option]:text-white"
                            : "border-black/10 bg-white text-[#1e1e1e]",
                        )}
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
                        darkVariant={showBlack}
                      />
                      <DateInput
                        id="m-check-out"
                        label="Check Out"
                        bookedDates={[new Date(2025, 7, 31), new Date(2025, 8, 2)]}
                        darkVariant={showBlack}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="m-guests"
                        className={clsx(
                          "block text-sm font-medium mb-2",
                          showBlack ? "text-[#E7C99E]" : "text-[#1e1e1e]",
                        )}
                      >
                        Guests
                      </label>
                      <select
                        id="m-guests"
                        value={filters.guests}
                        onChange={(e) => onFilterChange("guests", Number(e.target.value))}
                        className={clsx(
                          "w-full px-3 py-3 rounded-xl border",
                          showBlack
                            ? "border-white/20 bg-zinc-900 text-white [color-scheme:dark] [&>option]:bg-zinc-900 [&>option]:text-white"
                            : "border-black/10 bg-white text-[#1e1e1e]",
                        )}
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
                      className={clsx(
                        "w-full py-3 rounded-xl font-medium shadow-md transition",
                        showBlack ? "bg-white text-zinc-900 hover:bg-zinc-100" : "bg-[#111827] text-white",
                      )}
                      type="button"
                    >
                      {buttonLabel}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setOpen(false)}
                      className={clsx(
                        "w-full py-3 rounded-xl font-medium",
                        showBlack ? "text-white bg-white/10" : "text-[#111827] bg-black/5",
                      )}
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
