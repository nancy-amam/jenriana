"use client";

import { FC, useRef } from "react";

interface DateInputProps {
  id: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateInput: FC<DateInputProps> = ({ id, label, value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    if (!inputRef.current) return;

    // For Chrome/Edge
    if (typeof (inputRef.current as any).showPicker === "function") {
      (inputRef.current as any).showPicker();
    } else {
      // Fallback for Safari/Firefox
      inputRef.current.focus();
    }
  };

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
          onChange={onChange}
          className="w-full  md:pr-10 px-1 py-1 cursor-pointer md:rounded-xl border border-[#ffffff] rounded-xl bg-white md:bg-white border-none md:border md:border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-left text-transparent caret-black [appearance:none] [-moz-appearance:textfield]"
          style={{
            colorScheme: "light", // Prevent dark mode autofill
          }}
        />

        {/* Custom Placeholder-like Text */}
        {!value && (
          <span
            className="pointer-events-none absolute left-5  top-[45%] -translate-y-1/2 text-black select-none text-base md:text-base"
            style={{ userSelect: "none" }}
          >
            mm/dd/yyyy
          </span>
        )}

        {/* Calendar Icon Button */}
        <button
          type="button"
          onClick={handleIconClick}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a6a6a6] cursor-pointer"
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
    </div>
  );
};

export default DateInput;
