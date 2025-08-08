'use client';

import { usePathname } from 'next/navigation';

const getPageTitle = (path: string) => {
  if (path.includes('/apartments')) return 'Apartment Management';
  if (path.includes('/bookings')) return 'Booking Management';
  if (path.includes('/guests')) return 'User & Client Management';
  return 'Analytics';
};

// Temporary dummy counts — you can replace with real data
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

  return (
    <nav className="hidden md:block bg-white  p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <p className="text-gray-800 font-semibold text-lg">{title}</p>
        {count && (
          <span className="text-gray-500 text-sm">{count}</span>
        )}
      </div>
    </nav>
  );
}
