"use client";

import { usePathname } from "next/navigation";

const getPageTitle = (path: string) => {
  if (path === "/partner" || path === "/partner/dashboard") return "Partner Dashboard";
  if (path.startsWith("/partner/apartments")) return "Apartments";
  if (path.startsWith("/partner/transactions")) return "Transactions";
  return "Partner";
};

export default function PartnerNavbar() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <nav className="hidden md:block bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-gray-800 font-semibold text-lg">{title}</p>
      </div>
    </nav>
  );
}
