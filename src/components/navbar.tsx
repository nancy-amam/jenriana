"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { getApartments } from "@/services/api-services";
import { Apartment } from "@/lib/interface";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [showDropdown, setShowDropdown] = useState(false); // Apartments dropdown toggle
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check login and admin status
  useEffect(() => {
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    setIsLoggedIn(!!userId);
    setIsAdmin(role === "admin");
  }, []);

  // Fetch apartments for dropdown
  useEffect(() => {
    async function fetchApartments() {
      try {
        const res = await getApartments();
        if (res.success) setApartments(res.data || []);
      } catch (error) {
        setApartments([]); // Fallback to empty array on error
      }
    }
    fetchApartments();
  }, []);

  // Handle navigation for protected routes
  const handleProtectedLinkClick = (e: React.MouseEvent, href: string) => {
    if (!isLoggedIn) {
      e.preventDefault();
      window.location.href = "/login"; // Redirect to login if not logged in
    }
  };

  return (
    <nav className="bg-[#f1f1f1] h-2 w-full z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
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

          {/* Apartments Dropdown */}
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
            href={isLoggedIn ? "/my-bookings" : "/login"}
            className="text-[#1e1e1e] hover:text-black transition font-medium"
            onClick={(e) => handleProtectedLinkClick(e, "/my-bookings")}
          >
            My Bookings
          </Link>

          {/* Admin (only for admin users) */}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-[#1e1e1e] hover:text-black transition font-medium"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right: Book Now button */}
        {!isLoggedIn && (
          <Link
            href="/login"
            className="hidden md:inline-block bg-black text-white px-5 py-2 rounded hover:bg-gray-900 transition text-sm font-medium"
            onClick={(e) => handleProtectedLinkClick(e, "/sign-up")}
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
        <div className="md:hidden absolute top-16 left-0 w-full bg-white z-50 px-4 py-3 space-y-3">
          {/* Home */}
          <Link
            href="/"
            className="block text-[#1e1e1e]"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          {/* Apartments toggle */}
          <div>
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center w-full text-left text-[#1e1e1e] font-medium"
            >
              Apartments <ChevronDown size={16} className="ml-1" />
            </button>
            {showDropdown && (
              <div className="mt-2 space-y-1">
                {apartments.length > 0 ? (
                  apartments.map((apt) => (
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
                  ))
                ) : (
                  <p className="px-2 py-1 text-sm text-gray-500">
                    No apartments available
                  </p>
                )}
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
            href={isLoggedIn ? "/my-bookings" : "/login"}
            className="block text-[#1e1e1e]"
            onClick={(e) => {
              handleProtectedLinkClick(e, "/my-bookings");
              setIsOpen(false);
            }}
          >
            My Bookings
          </Link>

          {/* Admin (only for admin users) */}
          {isAdmin && (
            <Link
              href="/admin"
              className="block text-[#1e1e1e]"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          )}

          {!isLoggedIn && (
            <Link
              href="/login"
              className="block bg-[#212121] text-white px-4 py-2 rounded-lg text-center"
              onClick={(e) => {
                handleProtectedLinkClick(e, "/sign-up");
                setIsOpen(false);
              }}
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