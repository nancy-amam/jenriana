// components/MobileNavbar.tsx
'use client';

import { Plus } from 'lucide-react';
import { useApartmentModal } from '@/context/apartment-context'; // Adjust path
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

interface MobileNavbarProps {
  isApartmentsPage: boolean;
}

export default function MobileNavbar({ isApartmentsPage }: MobileNavbarProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const count = getPageCount(pathname);
  const { openAddModal } = useApartmentModal();

  return (
    <div className="p-4 mt-5 bg-[#f1f1f1]">
      <div className="flex items-center gap-2 justify-between">
        <h1 className="text-[24px] font-semibold mt-5 text-[#111827]">{title}</h1>
        {isApartmentsPage ? (
          <button
            onClick={openAddModal}
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
  );
}