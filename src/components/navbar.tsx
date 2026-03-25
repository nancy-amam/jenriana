"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Menu, User, X } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isHeroNav = pathname === "/" || pathname === "/apartment" || pathname.startsWith("/apartment/");
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

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

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

  const isLinkActive = (href: string) =>
    pathname === href || (href === "/apartment" && pathname.startsWith("/apartment/"));

  /** Left-to-right underline on hover; full width when active */
  const navLinkClass = (href: string) =>
    clsx(
      "relative inline-block pb-1.5 font-medium transition-colors",
      "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-explore-accent after:transition-transform after:duration-300 after:ease-out",
      "hover:after:scale-x-100",
      isLinkActive(href) && "after:scale-x-100",
      isHeroNav ? "text-white hover:text-white/90" : "text-[#1e1e1e] hover:text-black",
    );

  const mobileNavLinkClass = (href: string) =>
    clsx(
      "relative inline-block pb-1.5 text-lg font-medium text-zinc-100 transition-colors",
      "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-explore-accent after:transition-transform after:duration-300 after:ease-out",
      "hover:after:scale-x-100",
      isLinkActive(href) && "after:scale-x-100",
    );

  return (
    <nav
      className={clsx(
        "w-full z-[100] min-h-16",
        isHeroNav ? "absolute top-0 left-0 right-0 bg-transparent" : "relative bg-white border-b border-gray-100",
      )}
    >
      <div
        className={clsx(
          "relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8",
          isOpen && "z-[160]",
        )}
      >
        <Link href="/" className="text-2xl font-semibold shrink-0">
          <Image
            src="/images/logo.png"
            alt="Jenriana"
            width={100}
            height={30}
            className={clsx(isHeroNav && "brightness-0 invert")}
            priority
          />
        </Link>

        <div className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className={navLinkClass("/")}>
            Home
          </Link>
          <Link href="/apartment" className={navLinkClass("/apartment")}>
            Apartments
          </Link>
          <Link href="/contact-us" className={navLinkClass("/contact-us")}>
            Contact
          </Link>

          {/* <Link
            href={isLoggedIn ? "/my-bookings" : "/login"}
            onClick={(e) => handleProtectedLinkClick(e, "/my-bookings")}
            className={navLinkClass("/my-bookings")}
          >
            My Bookings
          </Link> */}

          {isAdmin && (
            <Link href="/admin" className={navLinkClass("/admin")}>
              Admin
            </Link>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center">
          {!isLoggedIn ? (
            <Link
              href="/login"
              className="rounded px-5 py-2 text-sm font-medium transition bg-explore-accent text-[#121212] hover:bg-explore-accent-hover"
            >
              Login
            </Link>
          ) : (
            <div className="relative" ref={avatarRef}>
              <div
                onClick={() => setShowDropdown((p) => !p)}
                className={clsx(
                  "h-10 w-10 rounded-full flex items-center justify-center cursor-pointer select-none",
                  isHeroNav ? "bg-white/20 text-white ring-1 ring-explore-accent" : "bg-gray-300 text-[#1e1e1e]",
                )}
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
        <button
          type="button"
          className={clsx("md:hidden p-1", isHeroNav ? "text-white" : "text-[#1e1e1e]")}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile: full-screen fade-in menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-explore-bg/97 backdrop-blur-md md:hidden [animation:mobile-nav-fade-in_0.35s_ease-out_forwards]"
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
        >
          <div className="flex flex-col items-center gap-8 px-6 text-center">
            <Link href="/" className={mobileNavLinkClass("/")} onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link href="/apartment" className={mobileNavLinkClass("/apartment")} onClick={() => setIsOpen(false)}>
              Apartments
            </Link>
            <Link href="/contact-us" className={mobileNavLinkClass("/contact-us")} onClick={() => setIsOpen(false)}>
              Contact
            </Link>

            <Link
              href={isLoggedIn ? "/my-bookings" : "/login"}
              className={mobileNavLinkClass("/my-bookings")}
              onClick={(e) => {
                handleProtectedLinkClick(e, "/my-bookings");
                setIsOpen(false);
              }}
            >
              My Bookings
            </Link>

            {isAdmin && (
              <Link href="/admin" className={mobileNavLinkClass("/admin")} onClick={() => setIsOpen(false)}>
                Admin
              </Link>
            )}

            {!isLoggedIn ? (
              <Link
                href="/login"
                className="mt-2 rounded-lg bg-explore-accent px-10 py-3 text-sm font-medium text-[#121212] transition hover:bg-explore-accent-hover"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="mt-2 rounded-lg border border-red-500/60 bg-red-600/90 px-10 py-3 text-sm font-medium text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
