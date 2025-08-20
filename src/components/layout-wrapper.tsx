'use client';

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import ApartmentLoadingPage from "@/components/loading";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  // Hide navbar and footer on some paths (your existing logic)
  const hideNavAndFooter =
    pathname.includes('/sign-up') || pathname.includes('/login') || pathname.includes('/admin');

  const hideFooter =
    hideNavAndFooter || pathname.includes('/booking-engine') || pathname.includes('/my-bookings') || pathname.includes('/contact-us');

  useEffect(() => {
    setLoading(true);

    // You can adjust the delay to fit your UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <ApartmentLoadingPage />
        </div>
      )}

      {!hideNavAndFooter && <Navbar />}
      <main className={!hideNavAndFooter ? "pt-16" : ""}>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}
