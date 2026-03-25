"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNavAndFooter =
    pathname.includes("/sign-up") ||
    pathname.includes("/login") ||
    pathname.includes("/admin") ||
    pathname.includes("/partner");

  const hideFooter =
    hideNavAndFooter ||
    pathname.includes("/booking-engine") ||
    pathname.includes("/my-bookings") ||
    pathname.includes("/contact-us");

  const isHome = pathname === "/";
  const isApartmentsIndex = pathname === "/apartment";
  /** Apartment detail `/apartment/[id]` — nav overlays hero like home */
  const isApartmentDetail = pathname.startsWith("/apartment/");
  const useOverlayNavShell = isHome || isApartmentsIndex || isApartmentDetail;

  const mainInner = <Suspense fallback={null}>{children}</Suspense>;

  return (
    <QueryProvider>
      <Toaster richColors position="bottom-right" theme="dark" />
      {hideNavAndFooter ? (
        <main>{mainInner}</main>
      ) : useOverlayNavShell ? (
        <div className="relative">
          <Navbar />
          <main>{mainInner}</main>
        </div>
      ) : (
        <>
          <Navbar />
          <main className="pt-16">{mainInner}</main>
        </>
      )}

      {!hideFooter && <Footer />}
    </QueryProvider>
  );
}
