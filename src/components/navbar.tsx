"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { getApartments } from "@/services/api-services";
import { Apartment } from "@/lib/interface";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check login and admin status
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("userRole");
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
        setApartments([]);
      }
    }
    fetchApartments();
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });

    // Reset state
    setIsLoggedIn(false);
    setIsAdmin(false);

    // Redirect to login
    window.location.href = "/login";
  };

  // Handle protected navigation
  const handleProtectedLinkClick = (
    e: React.MouseEvent,
    href: string
  ) => {
    if (!isLoggedIn) {
      e.preventDefault();
      window.location.href = "/login";
    }
  };

  return (
    <nav className="bg-[#f1f1f1] h-2 w-full z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-semibold text-[#1e1e1e]">
          Jenrianna
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="text-[#1e1e1e] hover:text-black font-medium">
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

          <Link
            href="/contact-us"
            className="text-[#1e1e1e] hover:text-black font-medium"
          >
            Contact
          </Link>

          <Link
            href={isLoggedIn ? "/my-bookings" : "/login"}
            className="text-[#1e1e1e] hover:text-black font-medium"
            onClick={(e) => handleProtectedLinkClick(e, "/my-bookings")}
          >
            My Bookings
          </Link>

          {/* Admin link only if logged in as admin */}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-[#1e1e1e] hover:text-black font-medium"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right Button */}
        {!isLoggedIn ? (
          <Link
            href="/login"
            className="hidden md:inline-block bg-black text-white px-5 py-2 rounded hover:bg-gray-900 transition text-sm font-medium"
          >
            Book Now
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="hidden md:inline-block bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition text-sm font-medium"
          >
            Logout
          </button>
        )}

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-[#1e1e1e]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white z-50 px-4 py-3 space-y-3">
          <Link href="/" className="block text-[#1e1e1e]" onClick={() => setIsOpen(false)}>
            Home
          </Link>

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

          <Link
            href="/contact-us"
            className="block text-[#1e1e1e]"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>

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

          {/* Show Admin if admin */}
          {isAdmin && (
            <Link
              href="/admin"
              className="block text-[#1e1e1e]"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          )}

          {!isLoggedIn ? (
            <Link
              href="/login"
              className="block bg-[#212121] text-white px-4 py-2 rounded-lg text-center"
              onClick={() => setIsOpen(false)}
            >
              Book Now
            </Link>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="block w-full bg-red-600 text-white px-4 py-2 rounded-lg text-center"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
