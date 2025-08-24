"use client";
import { FC, useRef, useEffect, useState } from "react";

interface DateInputProps {
  id: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  bookedDates?: string[];
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
}

const DateInput: FC<DateInputProps> = ({ 
  id, 
  label, 
  value, 
  onChange, 
  bookedDates = [],
  minDate,
  maxDate,
  disabled = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDateBooked, setIsDateBooked] = useState(false);

  // Check if selected date is booked
  useEffect(() => {
    if (value && bookedDates.length > 0) {
      setIsDateBooked(bookedDates.includes(value));
    } else {
      setIsDateBooked(false);
    }
  }, [value, bookedDates]);

  const handleIconClick = () => {
    if (!inputRef.current || disabled) return;

    // For Chrome/Edge
    if (typeof (inputRef.current as any).showPicker === "function") {
      (inputRef.current as any).showPicker();
    } else {
      // Fallback for Safari/Firefox
      inputRef.current.focus();
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    
    // Check if the selected date is booked
    if (selectedDate && bookedDates.includes(selectedDate)) {
      // Show warning but still allow the change (parent component can handle validation)
      console.warn(`Selected date ${selectedDate} is already booked`);
    }
    
    if (onChange) {
      onChange(e);
    }
  };

  // Set min date to today if not provided
  const defaultMinDate = minDate || new Date().toISOString().split('T')[0];

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-base font-normal text-[#1e1e1e] mb-2 md:mb-2"
      >
        {label}
      </label>

      <div className="relative w-full cursor-pointer">
        <input
          ref={inputRef}
          id={id}
          type="date"
          value={value}
          onChange={handleDateChange}
          min={defaultMinDate}
          max={maxDate}
          disabled={disabled}
          className={`w-full md:pr-10 px-1 py-1 md:px-3 md:py-3 cursor-pointer md:rounded-xl border border-[#ffffff] rounded-xl bg-white md:bg-white border-none md:border md:border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-left caret-black [appearance:none] [-moz-appearance:textfield] ${
            !value ? 'text-transparent' : 'text-black'
          } ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          } ${
            isDateBooked ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          style={{
            colorScheme: "light",
          }}
        />

        {/* Custom Placeholder-like Text */}
        {!value && (
          <span
            className="pointer-events-none absolute left-5 top-[45%] -translate-y-1/2 text-black select-none text-base md:text-base"
            style={{ userSelect: "none" }}
          >
            mm/dd/yyyy
          </span>
        )}

        {/* Calendar Icon Button */}
        <button
          type="button"
          onClick={handleIconClick}
          disabled={disabled}
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a6a6a6] ${
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="#a6a6a6"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>

      {/* Warning message for booked dates */}
      {isDateBooked && (
        <p className="text-red-500 text-xs mt-0.5">
          This date is already booked. Please select another date.
        </p>
      )}
    </div>
  );
};

export default DateInput;