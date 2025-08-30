"use client";

import React, { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import "react-day-picker/dist/style.css";

interface DateInputProps {
  id: string;
  label: string;
  bookedDates?: Date[];
  onDateChange?: (date: Date | undefined) => void;
}

const DateInput: React.FC<DateInputProps> = ({ id, label, bookedDates = [], onDateChange }) => {
  const [selected, setSelected] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleSelect = (date: Date | undefined) => {
    setSelected(date);
    onDateChange?.(date);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label htmlFor={id} className="block text-base font-normal text-[#1e1e1e] mb-2 md:mb-1">
        {label}
      </label>

      <motion.button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.98 }}
        className="w-full px-3 py-4 rounded-xl md:rounded-none bg-white md:bg-transparent border border-gray-200 text-left"
      >
        {selected ? format(selected, "MMM d, yyyy") : "Add date"}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />
              <motion.div
                role="dialog"
                aria-modal="true"
                initial={{ y: 20, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.6 }}
                className="relative w-full max-w-sm rounded-2xl border bg-white shadow-2xl p-2"
              >
                <DayPicker
                  mode="single"
                  selected={selected}
                  onSelect={handleSelect}
                  modifiers={{ booked: bookedDates }}
                  modifiersStyles={{ booked: { backgroundColor: "#e5e7eb", borderRadius: "50%", color: "#9ca3af" } }}
                  disabled={bookedDates}
                />
              </motion.div>
            </motion.div>

            <motion.div
              key="calendar-desktop"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 380, damping: 26, mass: 0.6 }}
              className="hidden md:block absolute left-0 mt-2 z-50"
            >
              <div className="bg-white rounded-xl border shadow-lg p-2">
                <DayPicker
                  mode="single"
                  selected={selected}
                  onSelect={handleSelect}
                  modifiers={{ booked: bookedDates }}
                  modifiersStyles={{ booked: { backgroundColor: "#e5e7eb", borderRadius: "50%", color: "#9ca3af" } }}
                  disabled={bookedDates}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateInput;
