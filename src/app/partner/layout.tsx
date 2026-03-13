"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import PartnerSidebar from "./components/partner-sidebar";
import PartnerNavbar from "./components/partner-navbar";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthPage = pathname.startsWith("/partner/auth");

  // Login / set-password: no sidebar, just the content
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      {/* Mobile header + sidebar + content */}
      <div className="md:hidden flex flex-col flex-1 min-h-0">
        <header className="sticky top-0 z-50 flex-shrink-0 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <Link href="/" className="flex-shrink-0">
            <Image src="/images/logo.png" alt="Jenriana" width={100} height={30} />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-800" />
          </button>
        </header>

        {mobileMenuOpen && (
          <button
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div
          className={`fixed left-0 right-0 top-[52px] z-50 max-h-[calc(100vh-52px)] overflow-y-auto bg-slate-800 shadow-xl rounded-b-xl transition-all duration-200 md:hidden ${
            mobileMenuOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-2 pointer-events-none invisible"
          }`}
        >
          <PartnerSidebar isMobile onLinkClick={() => setMobileMenuOpen(false)} />
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          <main className="flex-1 overflow-auto px-4 py-4 pb-6 bg-[#fafafa]">{children}</main>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex flex-grow">
        <PartnerSidebar />
        <div className="flex flex-col flex-grow min-h-0">
          <PartnerNavbar />
          <main className="flex-1 overflow-auto p-6 bg-[#fafafa]">{children}</main>
        </div>
      </div>
    </div>
  );
}
