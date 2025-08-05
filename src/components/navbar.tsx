'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Apartments', href: '/search' },
    { name: 'Contact', href: '/contact' },
    { name: 'My Bookings', href: '/bookings' },
  ];

  return (
    <nav className="bg-white h-1 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="text-2xl font-semibold text-[#1e1e1e]">
          Jenrianna
        </Link>

        {/* Center: Nav Links */}
        <div className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className=" text-[#1e1e1e] hover:text-black transition font-medium"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Book Now button */}
        <Link
          href="/book"
          className="hidden md:inline-block bg-black text-white px-5 py-2 rounded hover:bg-gray-900 transition text-sm font-medium"
        >
          Book Now
        </Link>

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
        <div className="md:hidden bg-white shadow-md px-4 py-3 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-[#1e1e1e] "
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/book"
            className="block bg-[#212121] text-white px-4 py-2 rounded-lg text-center"
            onClick={() => setIsOpen(false)}
          >
            Book Now
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
