'use client';

import { usePathname } from 'next/navigation';
import { Menu, Plus } from 'lucide-react';
import AdminSidebar from './components/admin-sidebar';
import AdminNavbar from './components/admin-navbar';
import { useState } from 'react';
import AddApartmentModal from './components/add-apartment';

const getPageTitle = (path: string) => {
  if (path.includes('/apartments')) return 'Apartment Management';
  if (path.includes('/bookings')) return 'Booking Management';
  if (path.includes('/guests')) return 'User & Client Management';
  return 'Analytics';
};

const getPageCount = (path: string) => {
  if (path.includes('/bookings')) return '';
  if (path.includes('/guests')) return '';
  return '';
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const count = getPageCount(pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const isApartmentsPage = pathname.includes('/apartments');

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#f1f1f1]">
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

          {/* Page title & count/add button */}
          <div className="p-4 mt-5 bg-[#f1f1f1]">
            <div className="flex items-center gap-2 justify-between ">
              <h1 className="text-[24px] font-semibold mt-5 text-[#111827]">{title}</h1>
              {isApartmentsPage ? (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center mt-5 justify-center w-10 h-10 bg-black hover:bg-gray-800 text-white rounded-full transition-colors"
                  aria-label="Add apartment"
                >
                  <Plus className="h-5 w-5" />
                </button>
              ) : (
                count && <span className="text-sm text-[#4b5566]">{count}</span>
              )}
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
      
      <AddApartmentModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}