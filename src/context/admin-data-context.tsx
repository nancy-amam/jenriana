"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Cache types – store the same shape each page uses so we can restore instantly
export type GuestsCache = {
  users: any[];
  totalPages: number;
  totalUsers: number;
  currentPage: number;
  search: string;
};

export type BookingsCache = {
  bookings: any[];
  totalPages: number;
  totalBookings: number;
  currentPage: number;
  search: string;
};

export type ApartmentsCache = {
  apartments: any[];
  totalPages: number;
  totalApartments: number;
  currentPage: number;
  location: string;
};

type AdminDataContextType = {
  // Guests
  guestsCache: GuestsCache | null;
  setGuestsCache: (cache: GuestsCache | null) => void;

  // Bookings
  bookingsCache: BookingsCache | null;
  setBookingsCache: (cache: BookingsCache | null) => void;

  // Apartments
  apartmentsCache: ApartmentsCache | null;
  setApartmentsCache: (cache: ApartmentsCache | null) => void;
};

const defaultCache: AdminDataContextType = {
  guestsCache: null,
  setGuestsCache: () => {},
  bookingsCache: null,
  setBookingsCache: () => {},
  apartmentsCache: null,
  setApartmentsCache: () => {},
};

const AdminDataContext = createContext<AdminDataContextType>(defaultCache);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [guestsCache, setGuestsCache] = useState<GuestsCache | null>(null);
  const [bookingsCache, setBookingsCache] = useState<BookingsCache | null>(null);
  const [apartmentsCache, setApartmentsCache] = useState<ApartmentsCache | null>(null);

  return (
    <AdminDataContext.Provider
      value={{
        guestsCache,
        setGuestsCache,
        bookingsCache,
        setBookingsCache,
        apartmentsCache,
        setApartmentsCache,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used inside AdminDataProvider");
  return ctx;
}
