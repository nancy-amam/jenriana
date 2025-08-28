"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check login and admin status
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("userRole");
      setIsLoggedIn(!!userId);
      setIsAdmin(role === "admin");
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.clear();
      setIsLoggedIn(false);
      setIsAdmin(false);
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleProtectedLinkClick = (
    e: React.MouseEvent,
    href: string
  ) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push("/login");
    }
  };

  return (
    <nav className="bg-[#ffffff] h-2 w-full z-50 relative">
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

          <Link
            href="/apartment"
            className="text-[#1e1e1e] hover:text-black font-medium"
          >
            Apartments
          </Link>

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

          {isAdmin && (
            <Link
              href="/admin"
              className="text-[#1e1e1e] hover:text-black font-medium"
            >
              Admin
            </Link>
          )}
        </div>

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
            className="hidden md:inline-block cursor-pointer bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition text-sm font-medium"
            type="button"
          >
            Log-out
          </button>
        )}

        <button
          className="md:hidden text-[#1e1e1e]"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white z-50 px-4 py-3 space-y-3">
          <Link
            href="/"
            className="block text-[#1e1e1e]"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          <Link
            href="/apartment"
            className="block text-[#1e1e1e]"
            onClick={() => setIsOpen(false)}
          >
            Apartments
          </Link>

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
              type="button"
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
