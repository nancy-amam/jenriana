"use client";

import { Plus } from "lucide-react";
import { useApartmentModal } from "@/context/apartment-context";
import Link from "next/link";
import { usePathname } from "next/navigation";

const getPageTitle = (path: string) => {
  if (path === "/admin" || path === "/admin/") return "Dashboard";
  if (path.includes("/apartments")) return "Apartment Management";
  if (path.includes("/bookings")) return "Booking Management";
  if (path.includes("/guests")) return "User & Client Management";
  if (path.includes("/analytics")) return "Analytics";
  if (path.includes("/coupons")) return "Coupons";
  if (path.includes("/feedback")) return "Feedback";
  return "Dashboard";
};

const getPageCount = (path: string) => {
  if (path.includes("/bookings")) return "";
  if (path.includes("/guests")) return "";
  return "";
};

interface MobileNavbarProps {
  isApartmentsPage: boolean;
  // Optional props for edit mode
  editMode?: boolean;
  apartmentData?: any; // Use your Apartment interface type
}

export default function MobileNavbar({ isApartmentsPage, editMode = false, apartmentData }: MobileNavbarProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const count = getPageCount(pathname);
  const { openAddModal, openEditModal } = useApartmentModal();

  const handleAddEditClick = () => {
    if (editMode && apartmentData) {
      openEditModal(apartmentData);
    } else {
      openAddModal();
    }
  };

  return (
    <div className="px-4 py-4 bg-[#f1f1f1] border-b border-gray-200/60">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-[#111827] truncate">{title}</h1>
        {isApartmentsPage ? (
          <button
            onClick={handleAddEditClick}
            className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-black hover:bg-gray-800 text-white rounded-full transition-colors"
            aria-label={editMode ? "Edit apartment" : "Add apartment"}
          >
            <Plus className="h-5 w-5" />
          </button>
        ) : (
          count ? <span className="text-sm text-[#6b7280] truncate">{count}</span> : null
        )}
      </div>
    </div>
  );
}
