"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Menu, User, X } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const avatarRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    const role = localStorage.getItem("userRole");

    setIsLoggedIn(!!id);
    setIsAdmin(role === "admin");

    const handleClickOutside = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
    router.push("/login");
  };

  const handleProtectedLinkClick = (e: React.MouseEvent, href: string) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push("/login");
    }
  };

  return (
    <nav className="bg-white h-2 w-full z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-semibold text-[#1e1e1e]">
          <Image src="/images/logo.png" alt="Jenriana" width={100} height={30} />
        </Link>

        <div className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="text-[#1e1e1e] hover:text-black font-medium">
            Home
          </Link>
          <Link href="/apartment" className="text-[#1e1e1e] hover:text-black font-medium">
            Apartments
          </Link>
          <Link href="/contact-us" className="text-[#1e1e1e] hover:text-black font-medium">
            Contact
          </Link>

          {/* <Link
            href={isLoggedIn ? "/my-bookings" : "/login"}
            onClick={(e) => handleProtectedLinkClick(e, "/my-bookings")}
            className="text-[#1e1e1e] hover:text-black font-medium"
          >
            My Bookings
          </Link> */}

          {isAdmin && (
            <Link href="/admin" className="text-[#1e1e1e] hover:text-black font-medium">
              Admin
            </Link>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center">
          {!isLoggedIn ? (
            <Link
              href="/login"
              className="bg-black text-white px-5 py-2 rounded hover:bg-gray-900 transition text-sm font-medium"
            >
              Login
            </Link>
          ) : (
            <div className="relative" ref={avatarRef}>
              <div
                onClick={() => setShowDropdown((p) => !p)}
                className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer select-none"
              >
                {/* Dummy Avatar Emoji */}
                <span className="text-lg">
                  <User />
                </span>
              </div>

              {showDropdown && (
                <div className="absolute right-0 mt-3 w-44 bg-white border rounded-lg shadow-lg py-2 text-sm">
                  <Link
                    href="/my-bookings"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    My Bookings
                  </Link>

                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setShowDropdown(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU ICON */}
        <button className="md:hidden text-[#1e1e1e]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white z-50 px-4 py-3 space-y-3 shadow-md">
          <Link href="/" className="block text-[#1e1e1e]" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href="/apartment" className="block text-[#1e1e1e]" onClick={() => setIsOpen(false)}>
            Apartments
          </Link>
          <Link href="/contact-us" className="block text-[#1e1e1e]" onClick={() => setIsOpen(false)}>
            Contact
          </Link>

          <Link
            href={isLoggedIn ? "/my-bookings" : "/login"}
            onClick={(e) => {
              handleProtectedLinkClick(e, "/my-bookings");
              setIsOpen(false);
            }}
            className="block text-[#1e1e1e]"
          >
            My Bookings
          </Link>

          {isAdmin && (
            <Link href="/admin" className="block text-[#1e1e1e]" onClick={() => setIsOpen(false)}>
              Admin
            </Link>
          )}

          {!isLoggedIn ? (
            <Link
              href="/login"
              className="block bg-black text-white px-4 py-2 rounded-lg text-center"
              onClick={() => setIsOpen(false)}
            >
              Login
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
