// app/apartments/page.tsx
'use client';

import { ApartmentModalProvider } from '@/context/apartment-context';
import ApartmentList from './component/apartment-list';

export default function ApartmentsPage() {
  return (
    <ApartmentModalProvider>
      <main className="min-h-screen bg-[#f1f1f1] py-12 md:py-24 lg:py-32 px-4 md:px-16">
        <h2 className="text-[28px] md:text-[36px] font-medium mb-6 md:mb-8 text-[#1e1e1e] text-left">
          All Apartments
        </h2>
        <ApartmentList />
      </main>
    </ApartmentModalProvider>
  );
}

