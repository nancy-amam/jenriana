'use client';

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavAndFooter =
    pathname.includes('/sign-up') || pathname.includes('/login') || pathname.includes('/admin');

  const hideFooter =
    hideNavAndFooter || pathname.includes('/booking-engine') || pathname.includes('/my-bookings') || pathname.includes('/contact-us')

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      <main className={!hideNavAndFooter ? "pt-16" : ""}>{children}</main>
      {!hideFooter && <Footer />}
    </>
  );
}
