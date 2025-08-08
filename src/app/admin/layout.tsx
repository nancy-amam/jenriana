'use client';

import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import AdminSidebar from './components/admin-sidebar';
import AdminNavbar from './components/admin-navbar';
import { useState } from 'react';

const getPageTitle = (path: string) => {
  if (path.includes('/apartments')) return 'Apartment Management';
  if (path.includes('/bookings')) return 'Booking Management';
  if (path.includes('/guests')) return 'User & Client Management';
  return 'Analytics';
};

const getPageCount = (path: string) => {
  if (path.includes('/bookings')) return '47 total bookings';
  if (path.includes('/apartments')) return '32 total apartments';
  if (path.includes('/guests')) return '126 total users';
  return '';
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const count = getPageCount(pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen ">
      {/* Mobile Navbar */}
      <div className="md:hidden bg-white">
        <nav className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="text-lg font-bold text-gray-800">Jenrianna</div>
          
          {/* Menu button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
            <Menu className="h-6 w-6 text-gray-800" />
          </button>
        </nav>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="">
            <AdminSidebar 
              isMobile={true} 
              onLinkClick={() => setMobileMenuOpen(false)} 
            />
          </div>
        )}

        {/* Page title & count */}
        <div className="p-4 mt-10">
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-semibold text-[#111827]">{title}</h1>
            {count && <span className="text-sm text-[#4b5566]">{count}</span>}
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex flex-grow">
        <AdminSidebar />
        <div className="flex flex-col flex-grow">
          <AdminNavbar />
          <main className="p-6 bg-[#f1f1f1]">{children}</main>
        </div>
      </div>

      {/* Mobile main content */}
      <div className="md:hidden flex-grow">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}