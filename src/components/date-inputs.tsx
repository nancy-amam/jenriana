"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import "react-day-picker/style.css";

interface DateInputProps {
  id: string;
  label: string;
  bookedDates?: Date[];
  onDateChange?: (date: Date | undefined) => void;
  /** Dark panel (e.g. hero search) */
  darkVariant?: boolean;
  /** Controlled selected date (syncs calendar / sidebar) */
  value?: Date;
  /** Show ISO date in dark variant to match compact booking UIs */
  isoDateLabel?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({
  id,
  label,
  bookedDates = [],
  onDateChange,
  darkVariant,
  value,
  isoDateLabel,
}) => {
  const [selected, setSelected] = useState<Date | undefined>(value);
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

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    setSelected(date);
    onDateChange?.(date);
    setOpen(false);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const disabledDays = [{ before: today }, ...bookedDates];

  const labelClass = darkVariant ? "text-[#E7C99E]" : "text-[#1e1e1e]";
  const triggerClass = darkVariant
    ? "border-[color:var(--color-luxury-gold)]/45 bg-zinc-900/90 text-white [color-scheme:dark] rounded-lg"
    : "border-gray-200 bg-white md:bg-transparent text-[#1e1e1e]";

  const defaultClassNames = useMemo(() => getDefaultClassNames(), []);

  const dayPickerClassNames = useMemo(() => {
    if (!darkVariant) return undefined;
    const d = defaultClassNames;
    return {
      ...d,
      root: clsx(d.root, "!bg-zinc-950 text-zinc-100"),
      months: clsx(d.months, "bg-zinc-950"),
      month: clsx(d.month, "bg-zinc-950 text-zinc-100"),
      month_grid: clsx(d.month_grid, "bg-zinc-950"),
      month_caption: clsx(d.month_caption, "text-zinc-100"),
      caption_label: clsx(d.caption_label, "text-zinc-100"),
      nav: clsx(d.nav, "text-zinc-100"),
      button_previous: clsx(d.button_previous, "text-zinc-200 hover:bg-white/10"),
      button_next: clsx(d.button_next, "text-zinc-200 hover:bg-white/10"),
      chevron: clsx(d.chevron, "fill-zinc-300"),
      weekdays: clsx(d.weekdays, "text-zinc-400"),
      weekday: clsx(d.weekday, "text-zinc-500"),
      week: clsx(d.week, "text-zinc-200"),
      day: clsx(d.day, "text-zinc-200"),
      day_button: clsx(d.day_button, "text-zinc-200 hover:bg-white/10"),
      selected: clsx(d.selected, "!bg-explore-accent !text-white hover:!bg-explore-accent-hover"),
      today: clsx(d.today, "text-explore-accent font-medium"),
      outside: clsx(d.outside, "text-zinc-600 opacity-70"),
      disabled: clsx(d.disabled, "text-zinc-600 opacity-35"),
    };
  }, [darkVariant, defaultClassNames]);

  const darkPickerCssVars = useMemo(
    () =>
      darkVariant
        ? ({
            "--rdp-accent-color": "#a69175",
            "--rdp-accent-background-color": "rgba(166, 145, 117, 0.35)",
            "--rdp-outside-opacity": "0.5",
          } as React.CSSProperties)
        : undefined,
    [darkVariant],
  );

  const bookedModifierStyles = darkVariant
    ? { backgroundColor: "rgba(255, 255, 255, 0.08)", borderRadius: "50%", color: "#71717a" }
    : { backgroundColor: "#e5e7eb", borderRadius: "50%", color: "#9ca3af" };

  return (
    <div ref={wrapperRef} className="relative">
      <label htmlFor={id} className={`block text-base font-normal mb-2 md:mb-1 ${labelClass}`}>
        {label}
      </label>

      <motion.button
        id={id}
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.98 }}
        className={`w-full px-3 py-3 md:py-3.5 rounded-xl md:rounded-none border text-left ${triggerClass}`}
      >
        <span className={darkVariant ? (selected ? "text-white" : "text-white/75") : ""}>
          {selected
            ? isoDateLabel && darkVariant
              ? format(selected, "yyyy-MM-dd")
              : format(selected, "MMM d, yyyy")
            : "Add date"}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:hidden"
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
                className={clsx(
                  "relative w-full max-w-sm rounded-2xl border shadow-2xl p-2",
                  darkVariant ? "border-white/15 bg-zinc-950" : "border-zinc-200 bg-white",
                )}
                style={darkPickerCssVars}
              >
                <DayPicker
                  mode="single"
                  selected={selected}
                  onSelect={handleSelect}
                  modifiers={{ booked: bookedDates }}
                  modifiersStyles={{ booked: bookedModifierStyles }}
                  disabled={disabledDays}
                  classNames={dayPickerClassNames}
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
              <div
                className={clsx(
                  "rounded-xl border shadow-lg p-2",
                  darkVariant ? "border-white/15 bg-zinc-950" : "border-zinc-200 bg-white",
                )}
                style={darkPickerCssVars}
              >
                <DayPicker
                  mode="single"
                  selected={selected}
                  onSelect={handleSelect}
                  modifiers={{ booked: bookedDates }}
                  modifiersStyles={{ booked: bookedModifierStyles }}
                  disabled={disabledDays}
                  classNames={dayPickerClassNames}
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
