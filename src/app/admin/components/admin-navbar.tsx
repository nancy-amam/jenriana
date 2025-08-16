'use client';

import { usePathname } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useApartmentModal } from '@/context/apartment-context';

const getPageTitle = (path: string) => {
  if (path.includes('/apartments')) return 'Apartment Management';
  if (path.includes('/bookings')) return 'Booking Management';
  if (path.includes('/guests')) return 'User & Client Management';
  return 'Analytics';
};

const getPageCount = (path: string) => {
  if (path.includes('/bookings')) return '47 total bookings';
  if (path.includes('/apartments')) return '32 total apartments';
  if (path.includes('/guests')) return '126 total users';
  return '';
};

export default function AdminNavbar() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const count = getPageCount(pathname);
  const isApartmentsPage = pathname.includes('/apartments');
  const { openAddModal } = useApartmentModal();

  return (
    <nav className="hidden md:block bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-gray-800 font-semibold text-lg">{title}</p>
          {count && <span className="text-gray-500 text-sm">{count}</span>}
        </div>

        {isApartmentsPage && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            <Plus size={16} />
            New Apartment
          </button>
        )}
      </div>
    </nav>
  );
}