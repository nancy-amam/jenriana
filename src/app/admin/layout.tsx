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
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isApartmentsPage = pathname.includes("/apartments");

  return (
    <ApartmentModalProvider>
      <div className="flex flex-col min-h-screen bg-[#f1f1f1]">
        {/* Mobile Navbar */}
        <div className="md:hidden">
          <nav className="flex items-center justify-between px-4 py-3 bg-white">
            <Link href="/" className="text-2xl font-semibold text-[#1e1e1e]">
              <Image src={"/images/logo.png"} alt="Jenriana" width={100} height={30} />
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
              <Menu className="h-6 w-6 text-gray-800" />
            </button>
          </nav>

          {mobileMenuOpen && (
            <div>
              <AdminSidebar isMobile={true} onLinkClick={() => setMobileMenuOpen(false)} />
            </div>
          )}

          <MobileNavbar isApartmentsPage={isApartmentsPage} />
        </div>

        <div className="hidden md:flex flex-grow">
          <AdminSidebar />
          <div className="flex flex-col flex-grow">
            <AdminNavbar />
            <main className="p-6 bg-[#f1f1f1]">{children}</main>
          </div>
        </div>

        <div className="md:hidden flex-grow">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ApartmentModalProvider>
  );
}
