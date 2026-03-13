"use client";

import { useState, useEffect, useMemo } from "react";
import { getAllBookings } from "@/services/api-services";
import AdminContentLoader from "../components/admin-content-loader";
import GuestInfoModal from "../components/guest-information";
import { useAdminData } from "@/context/admin-data-context";

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    console.log("Debouncing value:", value);
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface Booking {
  _id: string;
  userId: string;
  apartmentId: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  residentialAddress: string;
  addons: Array<{
    name: string;
    price: number;
    pricingType: string;
    total: number;
  }>;
  serviceCharge: number;
  tax: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequest?: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingsResponse {
  message: string;
  total: number;
  page: number;
  pages: number;
  bookings: Booking[];
  success: boolean;
}

export default function AdminBookingPage() {
  const { bookingsCache, setBookingsCache } = useAdminData();
  const [search, setSearch] = useState(bookingsCache?.search ?? "");
  const [bookings, setBookings] = useState<Booking[]>(bookingsCache?.bookings ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(bookingsCache?.currentPage ?? 1);
  const [totalPages, setTotalPages] = useState(bookingsCache?.totalPages ?? 1);
  const [totalBookings, setTotalBookings] = useState(bookingsCache?.totalBookings ?? 0);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const limit = 10;
  const debouncedSearch = useDebounce(search, 500);

  const fetchBookings = async (page: number = 1, searchQuery?: string) => {
    try {
      setLoading(bookings.length === 0);
      setError(null);

      const response: BookingsResponse = await getAllBookings(page, limit, searchQuery?.trim());

      if (!response.bookings || !Array.isArray(response.bookings)) {
        throw new Error("Invalid response: bookings array is missing or not an array");
      }
      if (
        typeof response.total !== "number" ||
        typeof response.page !== "number" ||
        typeof response.pages !== "number"
      ) {
        console.warn("Invalid pagination data, using defaults");
      }

      const nextBookings = response.bookings;
      const nextPages = response.pages || 1;
      const nextTotal = response.total || 0;
      const nextPage = response.page || page;
      const nextSearch = searchQuery?.trim() ?? search;

      setBookings(nextBookings);
      setTotalPages(nextPages);
      setTotalBookings(nextTotal);
      setCurrentPage(nextPage);
      setBookingsCache({
        bookings: nextBookings,
        totalPages: nextPages,
        totalBookings: nextTotal,
        currentPage: nextPage,
        search: nextSearch,
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch bookings";
      setError(errorMessage);
      console.error("Error fetching bookings:", err);
      setBookings([]);
      setBookingsCache(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Search input changed:", value);
    setSearch(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  useEffect(() => {
    fetchBookings(currentPage, debouncedSearch);
  }, [debouncedSearch, currentPage]);

  const memoizedBookings = useMemo(() => bookings, [bookings]);

  if (error && bookings.length === 0) {
    return (
      <div className="p-4 sm:p-6 bg-white min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      {/* Search Card */}
      <div className="w-full min-h-[60px] bg-white rounded-lg border border-black/10 px-4 py-4 flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by booking name or ID"
          className="w-[90%] outline-none p-3 rounded-[8px] text-sm text-gray-700 placeholder:text-gray-400 border border-[#d1d5db]/30"
          value={search}
          onChange={handleSearch}
        />
        {loading && <div className="text-gray-500 text-sm">Searching...</div>}
      </div>

      {loading && bookings.length === 0 ? (
        <AdminContentLoader />
      ) : (
        <>
      {/* Desktop Table */}
      <div className="hidden lg:block w-full overflow-hidden rounded-xl border border-black/10 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-gray-200">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Booking ID
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Name
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Email
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Amount Paid
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Arrival – Departure
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Booking Date
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Status
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {memoizedBookings.map((booking) => (
                <tr key={booking._id} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-5 py-4 text-sm font-mono text-slate-600">{booking._id.slice(-8)}</td>
                  <td className="px-5 py-4 text-sm font-medium text-slate-900">{booking.customerName}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{booking.customerEmail}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                    ₦{booking.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {formatDate(booking.checkInDate)} – {formatDate(booking.checkOutDate)}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{formatDate(booking.createdAt)}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {formatStatus(booking.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleViewBooking(booking)}
                      className="text-sm font-medium text-slate-900 hover:text-slate-600 underline-offset-2 hover:underline transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {memoizedBookings.map((booking) => (
          <div key={booking._id} className="bg-white rounded-lg border border-black/10 p-4 relative">
            <div className="flex justify-between text-xs font-medium mb-2">
              <span className="text-gray-600">{booking._id.slice(-8)}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                {formatStatus(booking.status)}
              </span>
            </div>
            <p className="text-base font-semibold text-[#111827]">{booking.customerName}</p>
            <p className="text-sm text-[#4b5566]">{booking.customerEmail}</p>
            <p className="text-sm text-[#111827] mt-2">
              ₦{booking.totalAmount.toLocaleString()} for {calculateNights(booking.checkInDate, booking.checkOutDate)}{" "}
              nights
            </p>
            <p className="text-sm text-[#4b5566] mt-2">
              {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
            </p>

            {/* Action Buttons Row */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleViewBooking(booking)}
                className="w-full text-center bg-[#212121] hover:bg-gray-800 text-white py-2 rounded-lg text-sm font-medium"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
        </>
      )}

      {/* Empty State */}
      {memoizedBookings.length === 0 && !loading && (
        <div className="w-full overflow-hidden rounded-xl border border-black/10 bg-white p-12 text-center">
          <p className="text-slate-500 text-sm">No bookings found.</p>
        </div>
      )}

      {/* Pagination */}
      {totalBookings > 0 && (
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-1">
          <p className="text-sm text-slate-600">
            Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{" "}
            <span className="font-medium">{Math.min(currentPage * limit, totalBookings)}</span> of{" "}
            <span className="font-medium">{totalBookings}</span> bookings
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-gray-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, currentPage - 2);
                const pageNumber = Math.min(start + i, totalPages);
                if (pageNumber < 1) return null;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`min-w-[36px] px-3 py-2 text-sm font-medium rounded-lg transition ${
                      pageNumber === currentPage
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 bg-white border border-gray-200 hover:bg-slate-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-gray-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <GuestInfoModal booking={selectedBooking} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
