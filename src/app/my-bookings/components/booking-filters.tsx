import React from 'react';

interface BookingFilterTabsProps {
  activeFilter: "active" | "history";
  onFilterChange: (filter: "active" | "history") => void;
}

const BookingFilterTabs: React.FC<BookingFilterTabsProps> = ({
  activeFilter,
  onFilterChange
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <button
        onClick={() => onFilterChange("active")}
        className={`rounded-lg border px-4 py-4 text-base font-normal transition-colors ${
          activeFilter === "active"
            ? "bg-black text-white border-black"
            : "bg-white text-[#4b5563] border-gray-300 hover:bg-gray-50"
        }`}
      >
        Active Bookings
      </button>
      <button
        onClick={() => onFilterChange("history")}
        className={`rounded-lg border px-4 py-4 text-base font-normal transition-colors ${
          activeFilter === "history"
            ? "bg-black text-white border-black"
            : "bg-white text-[#4b5563] border-gray-300 hover:bg-gray-50"
        }`}
      >
        Booking History
      </button>
    </div>
  );
};

export default BookingFilterTabs;