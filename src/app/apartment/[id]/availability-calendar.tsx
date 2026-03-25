"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface Props {
  range: DateRange | undefined;
  onRangeChange: (range: DateRange | undefined) => void;
  bookedDates: Date[];
}

export default function AvailabilityCalendar({ range, onRangeChange, bookedDates }: Props) {
  const [months, setMonths] = useState(2);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setMonths(mq.matches ? 2 : 1);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div className="apartment-availability-rdp w-full overflow-x-auto rounded-xl border border-white/10 bg-zinc-900/40 p-4 md:p-6">
      <DayPicker
        mode="range"
        numberOfMonths={months}
        selected={range}
        onSelect={onRangeChange}
        defaultMonth={range?.from ?? today}
        disabled={[{ before: today }, ...bookedDates]}
        modifiers={{ booked: bookedDates }}
        classNames={{
          root: "mx-auto text-zinc-100",
          months: "flex flex-col gap-8 sm:flex-row sm:gap-10",
          month: "space-y-3",
          month_caption: "flex justify-center pb-2",
          caption_label: "text-base font-normal tracking-wide text-zinc-100",
          nav: "flex items-center justify-between gap-2",
          chevron: "fill-[color:var(--color-explore-accent)] text-[color:var(--color-explore-accent)]",
          button_previous:
            "inline-flex h-8 w-8 items-center justify-center rounded-md border border-[color:var(--color-explore-accent)]/45 text-[color:var(--color-explore-accent)] hover:bg-[color:var(--color-explore-accent)]/12 hover:border-[color:var(--color-explore-accent)]/70",
          button_next:
            "inline-flex h-8 w-8 items-center justify-center rounded-md border border-[color:var(--color-explore-accent)]/45 text-[color:var(--color-explore-accent)] hover:bg-[color:var(--color-explore-accent)]/12 hover:border-[color:var(--color-explore-accent)]/70",
          weekdays: "flex",
          weekday: "w-9 text-center text-xs font-normal uppercase tracking-wide text-zinc-500",
          week: "mt-1 flex w-full",
          day: "relative h-9 w-9 p-0 text-center text-sm font-normal text-zinc-200",
          day_button:
            "m-0 h-9 w-9 rounded-md p-0 font-normal hover:bg-[color:var(--color-luxury-gold)]/25",
          selected:
            "!bg-[color:var(--color-luxury-gold)]/35 !text-white border border-[color:var(--color-luxury-gold)]/60",
          range_start: "!bg-[color:var(--color-luxury-gold)]/45 !text-white rounded-l-md",
          range_end: "!bg-[color:var(--color-luxury-gold)]/45 !text-white rounded-r-md",
          range_middle: "!bg-[color:var(--color-luxury-gold)]/20 !text-zinc-100",
          today: "font-semibold text-[color:var(--color-luxury-gold)]",
          disabled: "text-zinc-600 opacity-50",
          outside: "text-zinc-600 opacity-40",
        }}
        modifiersStyles={{
          booked: {
            backgroundColor: "rgba(63, 63, 70, 0.6)",
            color: "#71717a",
            textDecoration: "line-through",
          },
        }}
      />
    </div>
  );
}
