'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, BookOpen, Users, Menu, ChartNoAxesColumn } from 'lucide-react';
import { useState } from 'react';

const links = [
  { href: '/admin/apartments', label: 'Apartments', icon: <Building2 className="w-4 h-4" /> },
  { href: '/admin/bookings', label: 'Bookings', icon: <BookOpen className="w-4 h-4" /> },
  { href: '/admin/guests', label: 'Guests', icon: <Users className="w-4 h-4" /> },
  { href: '/admin/analytics', label: 'Analytics', icon: <ChartNoAxesColumn /> }
];

interface AdminSidebarProps {
  isMobile?: boolean;
  onLinkClick?: () => void; // Optional callback for when a link is clicked
}

export default function AdminSidebar({ isMobile = false, onLinkClick }: AdminSidebarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // If this is being used in mobile mode from the layout, just render the nav links
  if (isMobile) {
    return (
      <div className="bg-white border-t">
        <ul className="flex flex-col">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <li key={link.href} className="border-b last:border-b-0">
                <Link
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-3 text-base
                    ${isActive ? 'bg-black text-white' : 'text-[#212121] hover:bg-gray-50'}`}
                  onClick={onLinkClick} // Close mobile menu when link is clicked
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white p-4">
        <h2 className="text-[24px] text-[#1e1e1e] font-bold mb-6">Jenrianna</h2>
        <ul className="space-y-4 mt-20">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-2 text-base px-3 py-2 rounded transition-colors
                    ${isActive ? 'bg-black text-white' : 'text-[#212121] hover:text-black hover:bg-gray-100'}`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Mobile Navbar - Only show when not in mobile prop mode */}
      <nav className="md:hidden bg-gray-100 px-4 py-3 flex items-center justify-between">
        <h2 className="text-[20px] text-[#1e1e1e] font-bold">Jenrianna</h2>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 text-[#212121] hover:text-black"
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-[60px] left-0 w-full bg-white border-t shadow-md z-50">
          <ul className="flex flex-col">
            {links.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <li key={link.href} className="border-b last:border-b-0">
                  <Link
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-3 text-base
                       ${isActive ? 'bg-black text-white' : 'text-[#212121] hover:bg-gray-50'}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}