// app/admin/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import AdminSidebar from "./components/admin-sidebar";
import AdminNavbar from "./components/admin-navbar";
import MobileNavbar from "./components/mobile-navbar";
import { useState } from "react";
import Link from "next/link";
import { ApartmentModalProvider } from "@/context/apartment-context";
import { AdminDataProvider } from "@/context/admin-data-context";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isApartmentsPage = pathname.includes("/apartments");

  return (
    <AdminDataProvider>
      <ApartmentModalProvider>
        <div className="flex flex-col min-h-screen bg-[#f1f1f1]">
          {/* Mobile header + sidebar + content */}
          <div className="md:hidden flex flex-col flex-1 min-h-0">
            {/* Fixed top bar */}
            <header className="sticky top-0 z-50 flex-shrink-0 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
              <Link href="/" className="flex-shrink-0">
                <Image src={"/images/logo.png"} alt="Jenriana" width={100} height={30} />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
                className="p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-6 w-6 text-gray-800" />
              </button>
            </header>

            {/* Backdrop when menu open */}
            {mobileMenuOpen && (
              <button
                aria-label="Close menu"
                className="fixed inset-0 z-40 bg-black/40 md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
            )}

            {/* Slide-down mobile sidebar */}
            <div
              className={`fixed left-0 right-0 top-[52px] z-50 max-h-[calc(100vh-52px)] overflow-y-auto bg-slate-800 shadow-xl rounded-b-xl transition-all duration-200 md:hidden ${
                mobileMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 pointer-events-none invisible"
              }`}
            >
              <AdminSidebar isMobile={true} onLinkClick={() => setMobileMenuOpen(false)} />
            </div>

            {/* Page header + main content */}
            <div className="flex flex-col flex-1 min-h-0">
              <MobileNavbar isApartmentsPage={isApartmentsPage} />
              <main className="flex-1 overflow-auto px-4 py-4 pb-6 bg-[#f1f1f1]">{children}</main>
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden md:flex flex-grow">
            <AdminSidebar />
            <div className="flex flex-col flex-grow min-h-0">
              <AdminNavbar />
              <main className="flex-1 overflow-auto p-6 bg-[#f1f1f1]">{children}</main>
            </div>
          </div>
        </div>
      </ApartmentModalProvider>
    </AdminDataProvider>
  );
}
