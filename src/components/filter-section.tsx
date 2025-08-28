// components/SearchBar.tsx
import React from 'react';
import DateInput from "@/components/date-inputs";

interface SearchFilters {
  location: string;
  guests: number;
}

interface SearchBarProps {
  filters: SearchFilters;
  onFilterChange: (field: string, value: string | number) => void;
  onSearch?: () => void;
  buttonLabel?: string; // NEW
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  filters, 
  onFilterChange, 
  onSearch,
  buttonLabel = "Find Apartments" // default
}) => {
  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <div className="mt-10 md:-mt-[170px] px-4 md:px-16 z-20 relative">
      <div className="bg-[#f1f1f1] md:bg-white text-[#1e1e1e] md:rounded-xl md:shadow-lg p-4 md:p-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        
        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="block text-base font-normal text-[#1e1e1e] mb-2 md:mb-1"
          >
            Location
          </label>
          <select
            id="location"
            aria-label="Select Location"
            value={filters.location}
            onChange={(e) => onFilterChange("location", e.target.value)}
            className="w-full px-3 py-4 rounded-xl md:rounded-none bg-white md:bg-transparent cursor-pointer"
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

        {/* Dates */}
        <div>
          <DateInput id="check-in" label="Check In" />
        </div>
        <div>
          <DateInput id="check-out" label="Check Out" />
        </div>

        {/* Guests */}
        <div>
          <label
            htmlFor="guests"
            className="block text-base font-normal text-[#1e1e1e] mb-2 md:mb-1"
          >
            Guests
          </label>
          <select
            id="guests"
            aria-label="Select Guests"
            value={filters.guests}
            onChange={(e) => onFilterChange("guests", Number(e.target.value))}
            className="w-full px-3 py-4 rounded-xl md:rounded-none bg-white md:bg-transparent cursor-pointer"
          >
            <option value={0}>Any</option>
            <option value={1}>1 Guest</option>
            <option value={2}>2 Guests</option>
            <option value={3}>3 Guests</option>
            <option value={4}>4+ Guests</option>
          </select>
        </div>

        {/* Button */}
        <div className="md:pt-5 mx-auto w-full">
          <button 
            onClick={handleSearch}
            className="w-full bg-black mt-2 md:mt-0 text-white py-3 md:px-6 px-16 rounded-xl hover:bg-gray-800 transition cursor-pointer"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
