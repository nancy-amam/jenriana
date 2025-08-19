"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { getApartments } from "@/services/api-services";

interface Apartment {
  _id: string;
  name: string;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // mobile menu toggle
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [showDropdown, setShowDropdown] = useState(false); // apartments dropdown toggle

  const isLoggedIn =
    typeof window !== "undefined" && !!localStorage.getItem("userId");

  // Fetch apartments for dropdown
  useEffect(() => {
    async function fetchApartments() {
      try {
        const res = await getApartments();
        if (res.success) setApartments(res.data || []);
      } catch (error) {
        console.error("Failed to fetch apartments:", error);
      }
    }
    fetchApartments();
  }, []);

  return (
    <nav className="bg-[#f1f1f1] h-1 left-0 w-full z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="text-2xl font-semibold text-[#1e1e1e]">
          Jenrianna
        </Link>

        {/* Center: Nav Links */}
        <div className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
          {/* Home */}
          <Link
            href="/"
            className="text-[#1e1e1e] hover:text-black transition font-medium"
          >
            Home
          </Link>

          {/* Apartments Dropdown (click to toggle) */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center text-[#1e1e1e] hover:text-black font-medium"
            >
              Apartments <ChevronDown size={16} className="ml-1" />
            </button>
            {showDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-56 z-50">
                {apartments.length > 0 ? (
                  apartments.map((apt) => (
                    <Link
                      key={apt._id}
                      href={`/apartment/${apt._id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      {apt.name}
                    </Link>
                  ))
                ) : (
                  <p className="px-4 py-2 text-sm text-gray-500">
                    No apartments available
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Contact */}
          <Link
            href="/contact-us"
            className="text-[#1e1e1e] hover:text-black transition font-medium"
          >
            Contact
          </Link>

          {/* My Bookings */}
          <Link
            href="/my-bookings"
            className="text-[#1e1e1e] hover:text-black transition font-medium"
          >
            My Bookings
          </Link>

          {/* Admin */}
          <Link
            href="/admin"
            className="text-[#1e1e1e] hover:text-black transition font-medium"
          >
            Admin
          </Link>
        </div>

        {/* Right: Book Now button */}
        {!isLoggedIn && (
          <Link
            href="/sign-up"
            className="hidden md:inline-block bg-black text-white px-5 py-2 rounded hover:bg-gray-900 transition text-sm font-medium"
          >
            Book Now
          </Link>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#1e1e1e]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-8 left-0 w-full bg-white z-50 px-4 py-3 space-y-3">
          {/* Home */}
          <Link
            href="/"
            className="block text-[#1e1e1e]"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          {/* Apartments toggle inside mobile */}
          <div>
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center w-full text-left text-[#1e1e1e] font-medium"
            >
              Apartments <ChevronDown size={16} className="ml-1" />
            </button>
            {showDropdown && (
              <div className="mt-2 space-y-1">
                {apartments.map((apt) => (
                  <Link
                    key={apt._id}
                    href={`/apartment/${apt._id}`}
                    className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => {
                      setShowDropdown(false);
                      setIsOpen(false);
                    }}
                  >
                    {apt.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Contact */}
          <Link
            href="/contact-us"
            className="block text-[#1e1e1e]"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>

          {/* My Bookings */}
          <Link
            href="/my-bookings"
            className="block text-[#1e1e1e]"
            onClick={() => setIsOpen(false)}
          >
            My Bookings
          </Link>

          {/* Admin */}
          <Link
            href="/admin"
            className="block text-[#1e1e1e]"
            onClick={() => setIsOpen(false)}
          >
            Admin
          </Link>

          {!isLoggedIn && (
            <Link
              href="/sign-up"
              className="block bg-[#212121] text-white px-4 py-2 rounded-lg text-center"
              onClick={() => setIsOpen(false)}
            >
              Book Now
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
