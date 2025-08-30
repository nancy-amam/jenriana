"use client";

import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface DateInputProps {
  id: string;
  label: string;
  bookedDates?: Date[]; // NEW
  onDateChange?: (date: Date | undefined) => void;
}

const DateInput: React.FC<DateInputProps> = ({ id, label, bookedDates = [], onDateChange }) => {
  const [selected, setSelected] = useState<Date | undefined>();

  const handleSelect = (date: Date | undefined) => {
    setSelected(date);
    if (onDateChange) onDateChange(date);
  };

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-base font-normal text-[#1e1e1e] mb-2 md:mb-1">
        {label}
      </label>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={handleSelect}
        modifiers={{
          booked: bookedDates,
        }}
        modifiersStyles={{
          booked: { backgroundColor: "#e5e7eb", borderRadius: "50%", color: "#9ca3af" },
        }}
        className="rounded-xl border bg-white shadow-sm p-2"
      />
    </div>
  );
};

export default DateInput;
