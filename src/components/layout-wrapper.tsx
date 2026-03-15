"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import ApartmentLoadingPage from "@/components/loading";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [pathname]);

  const isAdmin = pathname.startsWith("/admin");
  const isPartner = pathname.startsWith("/partner");

  return (
    <QueryProvider>
      <Toaster richColors position="bottom-right" theme="dark" />
      {loading && !isAdmin && !isPartner && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <ApartmentLoadingPage />
        </div>
      )}

      {!hideNavAndFooter && <Navbar />}

      <main className={!hideNavAndFooter ? "pt-16" : ""}>
        <Suspense fallback={isAdmin || isPartner ? null : <ApartmentLoadingPage />}>{children}</Suspense>
      </main>

      {!hideFooter && <Footer />}
    </QueryProvider>
  );
}
